// routes/colleges.js — College listing with optional filtering
// GET /api/colleges — Returns all colleges; supports ?stream=&location=&maxBudget= query params

import express from "express";
import College from "../models/College.js";

const router = express.Router();

// ─── GET /api/colleges ────────────────────────────────────────────────────────
// Supports any combination of the three query parameters.
// Missing params are simply ignored — no filter applied for that field.
router.get("/", async (req, res) => {
  try {
    const { stream, location, maxBudget } = req.query;

    // Build the filter object dynamically — only add a condition if the param exists
    const filter = {};

    if (stream) {
      // Case-insensitive regex match so "engineering" matches "Engineering"
      filter.stream = { $regex: stream, $options: "i" };
    }

    if (location) {
      // Partial match: "Delhi" will match "Delhi NCR", "New Delhi", etc.
      filter.location = { $regex: location, $options: "i" };
    }

    if (maxBudget) {
      const budgetNum = Number(maxBudget);
      if (isNaN(budgetNum)) {
        return res.status(400).json({ message: "maxBudget must be a number." });
      }
      // Only include colleges whose fees are within the student's budget
      filter.fees = { $lte: budgetNum };
    }

    // Sort by rating descending so the best colleges appear first
    const colleges = await College.find(filter).sort({ rating: -1 });

    res.status(200).json({
      count: colleges.length,
      colleges,
    });
  } catch (err) {
    console.error("College fetch error:", err);
    res.status(500).json({ message: "Server error while fetching colleges." });
  }
});

export default router;
