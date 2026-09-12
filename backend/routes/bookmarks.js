// routes/bookmarks.js — Bookmark management for the logged-in user
// POST   /api/bookmarks      — Bookmark a college
// GET    /api/bookmarks      — List all bookmarked colleges (with full college details)
// DELETE /api/bookmarks/:id  — Remove a bookmark by its ID

import express from "express";
import verifyToken from "../middleware/auth.js";
import Bookmark from "../models/Bookmark.js";

const router = express.Router();

// All bookmark routes are protected
router.use(verifyToken);

// ─── POST /api/bookmarks ──────────────────────────────────────────────────────
// Expects { collegeId } in the request body.
// Returns 409 if the user has already bookmarked this college.
router.post("/", async (req, res) => {
  try {
    const { collegeId } = req.body;

    if (!collegeId) {
      return res.status(400).json({ message: "collegeId is required." });
    }

    // Check for an existing bookmark to avoid duplicates
    // (the DB also has a unique index, but checking here gives a nicer error)
    const existing = await Bookmark.findOne({
      user: req.user.userId,
      college: collegeId,
    });

    if (existing) {
      return res.status(409).json({ message: "College already bookmarked." });
    }

    const bookmark = await Bookmark.create({
      user: req.user.userId,
      college: collegeId,
    });

    res.status(201).json({
      message: "College bookmarked successfully.",
      bookmark,
    });
  } catch (err) {
    console.error("Bookmark create error:", err);
    // Handle MongoDB duplicate key error (code 11000) as a fallback
    if (err.code === 11000) {
      return res.status(409).json({ message: "College already bookmarked." });
    }
    res.status(500).json({ message: "Server error while bookmarking college." });
  }
});

// ─── GET /api/bookmarks ───────────────────────────────────────────────────────
// Returns the user's bookmarks, with the full college object populated
// (not just the college's ObjectId).
router.get("/", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.userId })
      .populate("college") // Replace college ObjectId with full College document
      .sort({ createdAt: -1 }); // Newest bookmark first

    res.status(200).json({
      count: bookmarks.length,
      bookmarks,
    });
  } catch (err) {
    console.error("Bookmark fetch error:", err);
    res.status(500).json({ message: "Server error while fetching bookmarks." });
  }
});

// ─── DELETE /api/bookmarks/:id ────────────────────────────────────────────────
// :id is the Bookmark document's own _id (not the college ID).
// Ensures the bookmark belongs to the requesting user before deleting.
router.delete("/:id", async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId, // Security check: only the owner can delete their bookmark
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found or not yours to delete." });
    }

    res.status(200).json({ message: "Bookmark removed successfully." });
  } catch (err) {
    console.error("Bookmark delete error:", err);
    res.status(500).json({ message: "Server error while deleting bookmark." });
  }
});

export default router;
