// seed.js — Database seeding script
// Run with: npm run seed
// This script:
//   1. Connects to MongoDB using the MONGO_URI from .env
//   2. Deletes all existing college records (clean slate)
//   3. Inserts the 25 colleges from seedData.json
//   4. Disconnects and exits

import mongoose from "mongoose";
import dotenv from "dotenv";
import { createRequire } from "module"; // Needed to import JSON in ES module context

import College from "./models/College.js";

// Load environment variables (so MONGO_URI is available)
dotenv.config();

// In ES modules, we can't use `require()` directly.
// createRequire lets us import JSON files the same way require() would.
const require = createRequire(import.meta.url);
const seedData = require("./seedData.json");

const seedDatabase = async () => {
  try {
    // ── Connect to MongoDB ───────────────────────────────────────────────────
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ── Clear existing college data ──────────────────────────────────────────
    // We wipe the collection first so running the script multiple times
    // doesn't create duplicate entries.
    const deletedCount = await College.deleteMany({});
    console.log(`🗑️  Cleared ${deletedCount.deletedCount} existing college records.`);

    // ── Insert fresh seed data ───────────────────────────────────────────────
    // insertMany is more efficient than calling .save() in a loop —
    // it sends a single batch write to MongoDB.
    const inserted = await College.insertMany(seedData);
    console.log(`🌱 Successfully seeded ${inserted.length} colleges into the database.`);

    // Print a summary of what was inserted
    inserted.forEach((college) => {
      console.log(`   ✔ ${college.name} | ${college.stream} | ${college.location}`);
    });

  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  } finally {
    // Always disconnect from the DB, whether the script succeeded or failed
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB. Seeding complete!");
    process.exit(0);
  }
};

// Run the seeder
seedDatabase();
