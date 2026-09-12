// models/User.js — Mongoose model for authentication
// Stores basic credentials. The actual academic profile lives in StudentProfile.

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,       // Enforces no duplicate accounts
      lowercase: true,    // Normalize to lowercase before storing
      trim: true,
    },

    // bcrypt hash of the password — we NEVER store plain text
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
