// routes/auth.js — Handles user registration and login
// POST /api/auth/signup — Creates a new user account, returns a JWT
// POST /api/auth/login  — Validates credentials, returns a JWT

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const router = express.Router();

// ─── Helper: Generate a JWT for a given user ──────────────────────────────────
// The payload embeds the user's ID and email so downstream routes
// can identify the caller without hitting the DB on every request.
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Token expires in 7 days
  );
};

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    // Check if an account already exists with this email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Hash the password before storing (saltRounds=10 is a good balance of security/speed)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate and return a JWT — client stores this and sends it on every protected request
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup." });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Look up the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Use a generic message — don't reveal whether the email exists
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare the provided password against the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Credentials are valid — issue a new JWT
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});

export default router;
