// backend/routes/codeRoutes.js
const express = require("express");
const router = express.Router();
const Code = require("../models/Code");

// Save code
router.post("/save", async (req, res) => {
  try {
    const { code, language, filename } = req.body;

    if (!code || !language || !filename) {
      return res.status(400).json({ message: "Missing fields!" });
    }

    const newCode = new Code({ code, language, filename });
    await newCode.save();
    res.json({ message: "Code saved successfully", file: newCode });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all saved code files
router.get("/", async (req, res) => {
  try {
    const files = await Code.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
