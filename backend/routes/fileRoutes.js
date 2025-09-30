import express from "express";
import File from "../models/File.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Save File
router.post("/save", protect, async (req, res) => {
  const { filename, language, code } = req.body;
  try {
    const file = await File.create({ user: req.user, filename, language, code });
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Files
router.get("/getAll", protect, async (req, res) => {
  try {
    const files = await File.find({ user: req.user });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update File
router.put("/update/:id", protect, async (req, res) => {
  const { filename, language, code } = req.body;
  try {
    const file = await File.findByIdAndUpdate(req.params.id, { filename, language, code }, { new: true });
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete File
router.delete("/delete/:id", protect, async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
