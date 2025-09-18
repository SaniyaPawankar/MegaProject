// backend/models/Code.js
const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, index: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Code', codeSchema);
