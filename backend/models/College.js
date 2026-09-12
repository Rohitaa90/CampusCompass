// models/College.js — Represents a college/course entry in the database
// Seeded via seed.js using seedData.json. Queried and filtered via GET /api/colleges.

import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    // Full name of the college (e.g. "IIT Bombay")
    name: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
    },

    // Academic stream offered (e.g. "Engineering", "Medical", "Commerce", "Arts")
    stream: {
      type: String,
      required: [true, "Stream is required"],
      trim: true,
    },

    // City / region where the college is located (e.g. "Mumbai", "Delhi NCR")
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    // Annual fees in INR (e.g. 150000 means ₹1.5 Lakh per year)
    fees: {
      type: Number,
      required: [true, "Fees are required"],
      min: 0,
    },

    // Rating out of 5 (e.g. 4.5)
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const College = mongoose.model("College", collegeSchema);

export default College;
