import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  language: { type: String, default: "javascript" },
  code: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("File", fileSchema);
