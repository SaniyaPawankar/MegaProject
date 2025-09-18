// frontend/src/pages/EditorPage.js
import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

export default function EditorPage() {
  const API_BASE = "http://localhost:5000/api/code";

  const [files, setFiles] = useState([]); // list from backend
  const [selectedId, setSelectedId] = useState(null); // selected file _id
  const [filename, setFilename] = useState(""); // filename input
  const [language, setLanguage] = useState("javascript"); // language select
  const [code, setCode] = useState("// Start coding here..."); // editor content

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchFiles error:", err);
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles();

    // cleanup on unmount: stop recognition if running
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.stop();
        } catch (e) {
          /* ignore */
        }
        recognitionRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load a file by id
  const loadFile = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) {
        console.error("Failed to load file", await res.text());
        return;
      }
      const data = await res.json();
      setSelectedId(data._id || id);
      setFilename(data.filename || "");
      setLanguage(data.language || "javascript");
      setCode(data.code || "");
    } catch (err) {
      console.error("loadFile error:", err);
    }
  };

  // Create a new untitled file locally (not yet saved)
  const createNewFile = () => {
    const ts = Date.now();
    const newName = `untitled_${ts}.js`;
    setSelectedId(null);
    setFilename(newName);
    setLanguage("javascript");
    setCode("// New file");
  };

  // Save (create or update) via backend
  const saveFile = async () => {
    if (!filename || !filename.trim()) {
      alert("Please enter a filename before saving.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: filename.trim(),
          language,
          code,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // backend returns file in data.file (if implemented)
        if (data.file && data.file._id) {
          setSelectedId(data.file._id);
        }
        await fetchFiles();
        alert("✅ Saved successfully");
      } else {
        console.error("saveFile failed:", data);
        alert("❌ Save failed: " + (data.message || "server error"));
      }
    } catch (err) {
      console.error("saveFile error:", err);
      alert("❌ Save failed (see console)");
    }
  };

  // Update is same as save because backend merges by filename, but keep a separate button for UX
  const updateFile = async () => {
    if (!filename || !filename.trim()) {
      alert("Please enter a filename before updating.");
      return;
    }
    await saveFile();
  };

  // Delete file by id
  const deleteFile = async (id) => {
    if (!id) {
      alert("Select a saved file to delete.");
      return;
    }
    const ok = window.confirm("Delete this file permanently?");
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (res.ok) {
        // clear editor if that file was open
        if (selectedId === id) {
          setSelectedId(null);
          setFilename("");
          setLanguage("javascript");
          setCode("// Start coding here...");
        }
        await fetchFiles();
        alert("🗑️ Deleted");
      } else {
        const d = await res.json();
        console.error("deleteFile failed:", d);
        alert("❌ Delete failed");
      }
    } catch (err) {
      console.error("deleteFile error:", err);
      alert("❌ Delete failed (see console)");
    }
  };

  // Voice recognition: start
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    // if already created, just start it
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setListening(true);
        return;
      } catch (e) {
        // fallback to re-create
      }
    }

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = false;
    recog.lang = "en-US";

    recog.onresult = (event) => {
      // get the most recent transcript
      const last = event.results[event.results.length - 1][0].transcript.trim();
      const transcript = last.toLowerCase();
      console.log("Voice:", transcript);

      // voice commands (simple, demo-friendly)
      if (transcript.includes("save file") || transcript === "save") {
        saveFile();
        return;
      }
      if (transcript.startsWith("open file")) {
        // command: "open file filename"
        const name = last.replace(/open file/i, "").trim();
        if (name) {
          // try exact match or case-insensitive
          const found = files.find(
            (f) => f.filename.toLowerCase() === name.toLowerCase() || f.filename.toLowerCase().includes(name.toLowerCase())
          );
          if (found) {
            loadFile(found._id);
            return;
          } else {
            alert(`No file matching "${name}" found.`);
            return;
          }
        }
      }
      if (transcript.includes("delete file") || transcript === "delete") {
        // delete currently selected file
        if (selectedId) {
          deleteFile(selectedId);
        } else {
          alert("No saved file selected to delete.");
        }
        return;
      }

      // Otherwise append transcript to the editor content
      setCode((prev) => (prev ? prev + "\n" + last : last));
    };

    recog.onerror = (e) => {
      console.error("Speech error", e);
    };

    recog.onend = () => {
      setListening(false);
      // keep recognitionRef so user can restart, but we null it to free resources
      // recognitionRef.current = null;
    };

    recognitionRef.current = recog;
    try {
      recog.start();
      setListening(true);
    } catch (err) {
      console.error("startListening error", err);
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        /* ignore */
      }
      setListening(false);
    }
  };

  // UI helpers
  const renderFileItem = (f) => {
    const active = selectedId === f._id || (!selectedId && filename && filename === f.filename);
    return (
      <li
        key={f._id}
        className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer ${
          active ? "bg-blue-700" : "hover:bg-gray-700"
        }`}
      >
        <div
          onClick={() => loadFile(f._id)}
          className="flex-1 truncate"
          title={f.filename}
          style={{ wordBreak: "break-all" }}
        >
          {f.filename}
          <div className="text-xs text-gray-300"> {f.language} </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteFile(f._id);
          }}
          className="ml-3 text-red-400 hover:text-red-600"
          title="Delete file"
        >
          ✕
        </button>
      </li>
    );
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f1724] border-r border-blue-900 flex flex-col">
        <div className="px-4 py-4 border-b border-blue-900">
          <h2 className="text-lg font-semibold text-blue-300">📂 Files</h2>
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={createNewFile}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-md transition"
          >
            + New File
          </button>

          <div className="text-sm text-gray-300">Saved files</div>
        </div>

        <div className="flex-1 overflow-auto px-2 pb-4">
          <ul className="space-y-2">
            {files.length === 0 ? (
              <li className="text-gray-400 px-3">No saved files</li>
            ) : (
              files.map((f) => renderFileItem(f))
            )}
          </ul>
        </div>

        <div className="p-4 border-t border-blue-900">
          <div className="text-xs text-gray-400 mb-2">Voice Controls</div>
          <div className="flex gap-2">
            <button
              onClick={startListening}
              disabled={listening}
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded text-sm"
            >
              🎤 Start
            </button>
            <button
              onClick={stopListening}
              disabled={!listening}
              className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded text-sm"
            >
              ⏹ Stop
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Try: "save file", "open file &lt;name&gt;", "delete file", or dictate code.
          </div>
        </div>
      </aside>

      {/* Main editor */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-black via-blue-900 to-black border-b border-blue-900">
          <input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="filename (e.g. main.js)"
            className="bg-[#071226] text-white px-3 py-2 rounded border border-blue-800 w-80 focus:outline-none"
          />

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#071226] text-white px-3 py-2 rounded border border-blue-800"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={saveFile}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm"
            >
              💾 Save
            </button>
            <button
              onClick={updateFile}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-sm text-black"
            >
              🔄 Update
            </button>
            <button
              onClick={() => deleteFile(selectedId)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
            >
              ✕ Delete
            </button>
          </div>
        </div>

        {/* Editor component */}
        <div className="flex-1">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              automaticLayout: true,
              minimap: { enabled: true },
              fontSize: 14,
            }}
          />
        </div>
      </main>
    </div>
  );
}