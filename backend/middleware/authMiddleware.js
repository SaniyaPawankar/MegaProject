// backend/middleware/authMiddleware.js
import { jwtVerify } from "jose";
import { createSecretKey } from "crypto";
import User from "../models/User.js";

/**
 * Build the secret KeyLike from env var
 */
const getSecretKey = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment");
  }
  return createSecretKey(Buffer.from(process.env.JWT_SECRET));
};

/**
 * protect middleware
 * Expects Authorization: Bearer <token>
 * On success: sets req.user to the user document (without password)
 */
export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || req.headers.Authorization || "";
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = auth.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized, token missing" });

    const secret = getSecretKey();

    // verify token and get payload
    const { payload } = await jwtVerify(token, secret);

    // payload.id should contain the user id (as we set in SignJWT)
    if (!payload || !payload.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Attach user (exclude password)
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("authMiddleware error:", error?.message || error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
