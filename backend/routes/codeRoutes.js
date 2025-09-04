// backend/routes/codeRoutes.js
const express = require("express");
const router = express.Router();
const Code = require("../models/Code");

// ✅ Save new code
router.post("/save", async (req, res) => {
  try {
    const { code, language, filename } = req.body;
    const newCode = new Code({ code, language, filename });
    await newCode.save();
    res.status(201).json(newCode);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: "Error saving code" });
  }
});

// ✅ Get the latest saved code
router.get("/latest", async (req, res) => {
  try {
    const latest = await Code.findOne().sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ message: "No code found" });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: "Error fetching latest code" });
  }
});

// ✅ Get list of recent saves
router.get("/list", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const list = await Code.find().sort({ createdAt: -1 }).limit(limit);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching list" });
  }
});

// ✅ Get code by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Code.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error fetching code" });
  }
});

module.exports = router;
