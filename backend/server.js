// server.js — Entry point for CampusCompass backend
// Connects to MongoDB, registers middleware, mounts all API routes, and starts the server.

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Route imports
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import collegeRoutes from "./routes/colleges.js";
import bookmarkRoutes from "./routes/bookmarks.js";
import aiRoutes from "./routes/ai.js";
import uploadRoutes from "./routes/upload.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ────────────────────────────────────────────────────────

// Enable CORS for all origins (supports both web and mobile clients)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);       // Signup / Login
app.use("/api/profile", profileRoutes); // Student profile CRUD
app.use("/api/colleges", collegeRoutes); // College listing + filtering
app.use("/api/bookmarks", bookmarkRoutes); // Bookmark management
app.use("/api/ai", aiRoutes);           // AI counselor (Gemini)
app.use("/api/upload", uploadRoutes);   // S3 presigned URL generation

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({ message: "CampusCompass API is running 🎓" });
});

// ─── MongoDB Connection + Server Start ───────────────────────────────────────

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit if DB connection fails — no point running without DB
  });
