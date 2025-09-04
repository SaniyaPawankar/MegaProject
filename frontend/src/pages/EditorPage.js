import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditorPage() {
  const [code, setCode] = useState("// Start coding...");
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("");
  const [language, setLanguage] = useState("javascript"); // default language

  // Fetch saved files on load
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/files");
      if (res.data.success) {
        setFiles(res.data.files);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const saveFile = async () => {
    if (!filename) {
      const userFilename = prompt("Enter a filename (e.g., test.js):");
      if (!userFilename) return;
      setFilename(userFilename);
    }

    try {
      await axios.post("http://localhost:5000/save", {
        filename: filename || "untitled.js",
        content: code,
        language, // send language too ✅
      });
      alert("File saved successfully!");
      fetchFiles();
    } catch (err) {
      console.error("Error saving file:", err);
      alert("❌ Failed to save file");
    }
  };

  const loadFile = async (name) => {
    try {
      const res = await axios.get(`http://localhost:5000/files/${name}`);
      if (res.data.success) {
        setCode(res.data.content);
        setFilename(name);
        setLanguage(res.data.language || "javascript"); // set saved language
      }
    } catch (err) {
      console.error("Error loading file:", err);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", borderRight: "1px solid #ddd", padding: "10px" }}>
        <h3>📂 Saved Files</h3>
        {files.length === 0 ? (
          <p>No files saved yet</p>
        ) : (
          <ul>
            {files.map((file, i) => (
              <li
                key={i}
                onClick={() => loadFile(file)}
                style={{ cursor: "pointer", marginBottom: "5px" }}
              >
                {file}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Editor */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>📝 Code Editor</h2>

        {/* Language Selector */}
        <label>
          Select Language:{" "}
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </label>

        {/* Code Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ width: "100%", height: "300px", marginTop: "10px" }}
        />

        {/* Buttons */}
        <br />
        <button onClick={saveFile} style={{ marginTop: "10px" }}>💾 Save File</button>
      </div>
    </div>
  );
}
