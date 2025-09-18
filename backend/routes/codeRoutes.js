// backend/routes/codeRoutes.js
const express = require('express');
const router = express.Router();
const Code = require('../models/Code');

// POST /api/code/save
// Creates a new file or updates existing file with same filename
router.post('/save', async (req, res) => {
  try {
    const { filename, language, code } = req.body;
    if (!filename || !language || typeof code === 'undefined') {
      return res.status(400).json({ message: 'filename, language and code are required' });
    }

    // Try update by filename first
    let existing = await Code.findOne({ filename });
    if (existing) {
      existing.language = language;
      existing.code = code;
      await existing.save();
      return res.json({ message: 'updated', file: existing });
    }

    // Otherwise create new
    const newFile = new Code({ filename, language, code });
    await newFile.save();
    res.status(201).json({ message: 'created', file: newFile });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/code/         -> list all files
router.get('/', async (req, res) => {
  try {
    const files = await Code.find().sort({ updatedAt: -1 });
    res.json(files);
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/code/:id      -> get single file
router.get('/:id', async (req, res) => {
  try {
    const file = await Code.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json(file);
  } catch (err) {
    console.error('Get file error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/code/:id   -> delete by id
router.delete('/:id', async (req, res) => {
  try {
    const file = await Code.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json({ message: 'deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
