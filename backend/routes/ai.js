// routes/ai.js — AI Counselor powered by Groq
// POST /api/ai/ask — Takes { question } from the user, builds a personalized prompt
// using their profile + relevant colleges, and returns Groq's recommendation.

import express from "express";
import Groq from "groq-sdk";

import verifyToken from "../middleware/auth.js";
import StudentProfile from "../models/StudentProfile.js";
import College from "../models/College.js";

const router = express.Router();

// ─── Lazy Groq client ────────────────────────────────────────────────────────
// We initialize the client on first use (not at import time) because ES modules
// are evaluated before server.js calls dotenv.config(), which means
// process.env.GROQ_API_KEY would be undefined at module load time.
let groq = null;
const getGroqClient = () => {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

// ─── POST /api/ai/ask ─────────────────────────────────────────────────────────
router.post("/ask", verifyToken, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ message: "A question is required." });
    }

    // ── Step 1: Fetch the student's profile ───────────────────────────────────
    // The profile contains stream/budget/location preferences that shape the context.
    const profile = await StudentProfile.findOne({ user: req.user.userId });

    if (!profile) {
      return res.status(404).json({
        message:
          "Profile not found. Please complete your student profile first so the AI can give personalized advice.",
      });
    }

    // ── Step 2: Find colleges relevant to this student's profile ──────────────
    // We use the same filtering logic as GET /api/colleges to give Groq
    // real, relevant data rather than hallucinated college names.
    const collegeFilter = {};

    if (profile.preferredStream) {
      collegeFilter.stream = { $regex: profile.preferredStream, $options: "i" };
    }

    if (profile.budget) {
      collegeFilter.fees = { $lte: profile.budget };
    }

    if (profile.locationPreference) {
      collegeFilter.location = { $regex: profile.locationPreference, $options: "i" };
    }

    // Limit to top 10 most relevant colleges to keep the prompt concise
    const relevantColleges = await College.find(collegeFilter)
      .sort({ rating: -1 })
      .limit(10);

    // Format the college list as a readable string for the user message
    const collegeListText =
      relevantColleges.length > 0
        ? relevantColleges
          .map(
            (c, i) =>
              `${i + 1}. ${c.name} | Stream: ${c.stream} | Location: ${c.location} | Annual Fees: ₹${(c.fees / 100000).toFixed(1)}L | Rating: ${c.rating}/5`
          )
          .join("\n")
        : "No colleges found matching the student's filters. Provide general advice.";

    // ── Step 3: Build the user message ────────────────────────────────────────
    // We inject student context + real college data so the model gives grounded advice.
    // The system message (role/persona) is passed separately in the messages array.
    const userMessage = `
=== STUDENT PROFILE ===
- Preferred Stream: ${profile.preferredStream || "Not specified"}
- Budget (Annual Fees): ₹${profile.budget ? (profile.budget / 100000).toFixed(1) + "L" : "Not specified"}
- Location Preference: ${profile.locationPreference || "No preference"}
- Interests: ${profile.interests && profile.interests.length > 0 ? profile.interests.join(", ") : "Not specified"}

=== RELEVANT COLLEGES (from our database) ===
${collegeListText}

=== STUDENT'S QUESTION ===
${question.trim()}

=== YOUR TASK ===
Based on the student's profile and the list of relevant colleges above, provide a helpful, well-structured answer.
- If the question is about college selection, refer to the specific colleges from the list above.
- Keep your response concise (3-5 paragraphs max) and easy to understand.
- Use plain language — avoid jargon.
- End with a clear, actionable next step.
`;

    // ── Step 4: Call the Groq API ─────────────────────────────────────────────
    // Groq uses OpenAI-compatible chat completions format with a messages array.
    // The "system" role sets the AI's persona; the "user" role carries the actual prompt.
    const chatCompletion = await getGroqClient().chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You are an AI college and career counselor for CampusCompass. Give personalized, reasoned recommendations based on the student's profile and the available colleges provided. Be specific and explain your reasoning.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    // Extract the text response from the first completion choice
    const answer = chatCompletion.choices[0]?.message?.content;

    res.status(200).json({ answer });
  } catch (err) {
    console.error("AI counselor error:", err);

    // Check if this is a Groq API key / auth error specifically
    if (err.status === 401 || (err.message && err.message.toLowerCase().includes("api_key"))) {
      return res.status(500).json({
        message: "AI service configuration error. Please contact support.",
      });
    }

    res.status(500).json({
      message: "The AI counselor is temporarily unavailable. Please try again later.",
    });
  }
});

export default router;
