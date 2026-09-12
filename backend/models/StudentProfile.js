// models/StudentProfile.js — Extended academic & preference profile for a user
// One-to-one relationship with User. Created/updated via POST /api/profile.

import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    // Reference back to the User who owns this profile
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user can have only one profile
    },

    // Topics or subjects the student is interested in (e.g. ["AI", "Design", "Finance"])
    interests: {
      type: [String],
      default: [],
    },

    // The academic stream the student wants to pursue (e.g. "Engineering", "Medical")
    preferredStream: {
      type: String,
      trim: true,
    },

    // Maximum annual fee the student/family can afford (stored in INR)
    budget: {
      type: Number,
      min: 0,
    },

    // City or state preference for college location (e.g. "Delhi NCR", "Bangalore")
    locationPreference: {
      type: String,
      trim: true,
    },

    // S3 key (or public URL) of the student's profile photo
    // The frontend uploads directly to S3, then saves the key here via PATCH /api/profile/file
    photoUrl: {
      type: String,
      default: "",
    },

    // S3 key (or public URL) of an uploaded document (e.g. marksheet, certificate)
    documentUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

export default StudentProfile;
