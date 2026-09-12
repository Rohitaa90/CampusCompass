// middleware/auth.js — JWT verification middleware
// Extracts the token from the Authorization header, verifies it,
// and attaches the decoded user payload to req.user for downstream route handlers.

import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  // Expect header format: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Extract the token part after "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    // jwt.verify throws if the token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded payload (contains userId and email) to req.user
    // so that protected routes can identify the current user
    req.user = decoded;

    next(); // Pass control to the next middleware / route handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default verifyToken;
