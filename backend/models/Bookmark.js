// models/Bookmark.js — Stores a user's saved/bookmarked colleges
// Each bookmark is a unique (user, college) pair.

import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    // The user who created the bookmark
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The college that was bookmarked
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: prevents a user from bookmarking the same college twice
bookmarkSchema.index({ user: 1, college: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
