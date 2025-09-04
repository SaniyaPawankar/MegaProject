// backend/routes/listings.js
const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// CREATE listing
router.post('/', async (req, res) => {
  try {
    const { title, description, language, code } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const listing = new Listing({ title, description, language, code });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    console.error('Create listing error:', err);
    res.status(500).json({ error: err.message });
  }
});

// READ all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error('Get listings error:', err);
    res.status(500).json({ error: err.message });
  }
});

// READ single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    console.error('Get listing error:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE listing
router.put('/:id', async (req, res) => {
  try {
    const { title, description, language, code } = req.body;
    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { title, description, language, code },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Listing not found' });
    res.json(updated);
  } catch (err) {
    console.error('Update listing error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE listing
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Listing not found' });
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error('Delete listing error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
