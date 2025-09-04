// backend/models/Listing.js
const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  language: { type: String, default: "javascript" },
  code: { type: String, default: "" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);
