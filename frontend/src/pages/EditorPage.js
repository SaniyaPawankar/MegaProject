// frontend/src/pages/EditorPage.js
import React, { useState, useEffect } from "react";

const EditorPage = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [filename, setFilename] = useState("example.js");
  const [files, setFiles] = useState([]);

  // Save file to backend
  const saveFile = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/code/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, filename }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ File saved: " + filename);
        fetchFiles(); // reload sidebar
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // Fetch saved files
  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/code/files");
      const data = await response.json();
      setFiles(data);
    } catch (err) {
      console.error("Fetch files error:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "25%", background: "#f5f5f5", padding: "10px" }}>
        <h3>📂 Saved Files</h3>
        {files.length === 0 ? (
          <p>No files saved yet</p>
        ) : (
          <ul>
            {files.map((file) => (
              <li key={file._id}>
                {file.filename} ({file.language})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Editor */}
      <div style={{ flex: 1, padding: "10px" }}>
        <h3>✍️ Code Editor</h3>
        <input
          type="text"
          placeholder="Enter filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
        <br />
        <textarea
          rows="20"
          cols="80"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
        />
        <br />
        <button onClick={saveFile}>💾 Save</button>
      </div>
    </div>
  );
};

export default EditorPage;
