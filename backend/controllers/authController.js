// backend/controllers/authController.js
import * as bcrypt from "bcryptjs";
import User from "../models/User.js";
import { SignJWT } from "jose";
import { createSecretKey } from "crypto";

/**
 * Helper: build a KeyLike secret from JWT_SECRET env var
 */
const getSecretKey = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment");
  }
  return createSecretKey(Buffer.from(process.env.JWT_SECRET));
};

/**
 * Generate JWT (signed using jose)
 * returns a Promise<string>
 */
const generateToken = async (id) => {
  const secret = getSecretKey();
  const jwt = await new SignJWT({ id })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
  return jwt;
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email and password" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // If your model hashes password in pre('save'), create will trigger it.
    const user = await User.create({ username, email, password });

    const token = await generateToken(user._id.toString());

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Provide email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // matchPassword should exist in your User model (bcrypt)
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = await generateToken(user._id.toString());

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get profile (protected)
export const getProfile = async (req, res) => {
  try {
    // authMiddleware sets req.user to the user document (without password)
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    res.json(req.user);
  } catch (error) {
    console.error("getProfile error:", error);
    res.status(500).json({ message: error.message });
  }
};
