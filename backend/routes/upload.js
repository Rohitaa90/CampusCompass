// routes/upload.js — S3 presigned URL generation for direct client-side file uploads
// POST /api/upload/presign — Returns a presigned PUT URL and fileKey for uploading to S3

import express from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import verifyToken from "../middleware/auth.js";

const router = express.Router();

// ─── Lazy S3 client ──────────────────────────────────────────────────────────
// Created on first use, not at import time, for the same reason as the Groq client:
// ES modules are evaluated before server.js calls dotenv.config(), so
// process.env.AWS_* would be undefined if we instantiated at the top level.
let s3Client = null;
const getS3Client = () => {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
};

// ─── POST /api/upload/presign ─────────────────────────────────────────────────
// Flow:
//   1. Client calls this endpoint with { filename, filetype }
//   2. Server generates a presigned PUT URL valid for 5 minutes
//   3. Client uploads the file DIRECTLY to S3 using the presigned URL (no server involved)
//   4. Client saves the returned fileKey to the profile via PATCH /api/profile/file
//
// Why presigned URLs?
// This avoids routing large files through the Node.js server, saving bandwidth and memory.
router.post("/presign", verifyToken, async (req, res) => {
  try {
    const { filename, filetype } = req.body;

    if (!filename || !filetype) {
      return res.status(400).json({ message: "filename and filetype are required." });
    }

    // Build a unique S3 key to avoid filename collisions between users
    // Format: uploads/{userId}-{timestamp}-{originalFilename}
    const timestamp = Date.now();
    const fileKey = `uploads/${req.user.userId}-${timestamp}-${filename}`;

    // Create the S3 PutObject command — this describes the intended upload
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      ContentType: filetype, // Important: S3 validates Content-Type on upload
    });

    // Generate the presigned URL — valid for 5 minutes (300 seconds)
    const uploadUrl = await getSignedUrl(getS3Client(), command, { expiresIn: 300 });

    // Return both the URL (for the PUT request) and the key (to save to profile)
    res.status(200).json({
      uploadUrl, // Client uses this to PUT the file directly to S3
      fileKey,   // Client saves this to the user's profile after a successful upload
    });
  } catch (err) {
    console.error("Presign URL generation error:", err);

    // Distinguish AWS config errors from generic errors for easier debugging
    if (err.name === "CredentialsProviderError" || err.name === "InvalidAccessKeyId") {
      return res.status(500).json({
        message: "AWS credentials are not configured correctly. Contact support.",
      });
    }

    res.status(500).json({ message: "Server error while generating upload URL." });
  }
});

export default router;
