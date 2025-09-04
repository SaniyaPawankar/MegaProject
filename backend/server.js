import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const FILES_DIR = path.join(process.cwd(), "saved_files");

// Ensure saved_files folder exists
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR);
}

// Save file API
app.post("/save", (req, res) => {
  const { filename, content } = req.body;

  if (!filename || !content) {
    return res.status(400).json({ success: false, message: "Filename and content required" });
  }

  const filePath = path.join(FILES_DIR, filename);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error saving file" });
    }
    res.json({ success: true, message: "File saved successfully" });
  });
});

// Get all saved files
app.get("/files", (req, res) => {
  fs.readdir(FILES_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error reading files" });
    }
    res.json({ success: true, files });
  });
});

// Get file content by name
app.get("/files/:name", (req, res) => {
  const filePath = path.join(FILES_DIR, req.params.name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error reading file" });
    }
    res.json({ success: true, content: data });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
