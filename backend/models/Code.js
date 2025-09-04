// backend/models/Code.js
const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    language: { type: String, required: true },
    filename: { type: String, required: true },
  },
  { timestamps: true } // adds createdAt / updatedAt
);

module.exports = mongoose.model("Code", codeSchema);
