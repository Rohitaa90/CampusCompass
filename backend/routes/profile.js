// routes/profile.js — Manages the logged-in student's academic profile
// POST   /api/profile           — Create or update (upsert) the profile
// GET    /api/profile           — Retrieve the current user's profile
// PATCH  /api/profile/file      — Update photoUrl or documentUrl after S3 upload

import express from "express";
import verifyToken from "../middleware/auth.js";
import StudentProfile from "../models/StudentProfile.js";
import { getPresignedGetUrl } from "../utils/s3.js";

const router = express.Router();

// All profile routes are protected — verifyToken runs first on every request here
router.use(verifyToken);

// ─── POST /api/profile ────────────────────────────────────────────────────────
// Creates the profile if it doesn't exist, or updates it if it does (upsert).
// This keeps the client simple — it always calls the same endpoint.
router.post("/", async (req, res) => {
  try {
    const { interests, preferredStream, budget, locationPreference } = req.body;

    // findOneAndUpdate with upsert:true creates the doc if it doesn't exist,
    // otherwise updates the existing one. new:true returns the updated document.
    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.userId },       // Filter: find by logged-in user
      {
        $set: {
          interests,
          preferredStream,
          budget,
          locationPreference,
        },
      },
      {
        new: true,      // Return the document after update
        upsert: true,   // Create it if it doesn't already exist
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Profile saved successfully.",
      profile,
    });
  } catch (err) {
    console.error("Profile save error:", err);
    res.status(500).json({ message: "Server error while saving profile." });
  }
});

// ─── GET /api/profile ─────────────────────────────────────────────────────────
// Returns the current user's full profile.
router.get("/", async (req, res) => {
  try {
    // Populate user so the response also includes name + email for convenience
    const profile = await StudentProfile.findOne({ user: req.user.userId }).populate(
      "user",
      "name email" // Only include these fields from User — not the password hash
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found. Please create one first." });
    }

    // Generate temporary presigned URLs for private files
    const profileObj = profile.toObject();
    
    if (profileObj.photoUrl) {
      profileObj.photoUrl = await getPresignedGetUrl(profileObj.photoUrl);
    }
    if (profileObj.documentUrl) {
      profileObj.documentUrl = await getPresignedGetUrl(profileObj.documentUrl);
    }

    res.status(200).json({ profile: profileObj });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error while fetching profile." });
  }
});

// ─── PATCH /api/profile/file ──────────────────────────────────────────────────
// Called by the frontend AFTER a successful S3 direct upload.
// The client sends the S3 fileKey and whether it's a "photo" or "document".
router.patch("/file", async (req, res) => {
  try {
    const { fileKey, type } = req.body;

    // Validate that type is one of the two allowed values
    if (!fileKey || !["photo", "document"].includes(type)) {
      return res.status(400).json({
        message: "fileKey and type ('photo' or 'document') are required.",
      });
    }

    // Dynamically decide which field to update based on type
    const fieldToUpdate = type === "photo" ? "photoUrl" : "documentUrl";

    // Update the database with just the raw fileKey (keeps it private/portable)
    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.userId },
      { $set: { [fieldToUpdate]: fileKey } }, 
      { new: true, upsert: true }
    );
    
    // Generate a fresh presigned URL for the frontend to render immediately
    const profileObj = profile.toObject();
    profileObj[fieldToUpdate] = await getPresignedGetUrl(fileKey);

    res.status(200).json({
      message: `${type === "photo" ? "Photo" : "Document"} uploaded and secured.`,
      profile: profileObj,
    });
  } catch (err) {
    console.error("File URL update error:", err);
    res.status(500).json({ message: "Server error while updating file URL." });
  }
});

export default router;
