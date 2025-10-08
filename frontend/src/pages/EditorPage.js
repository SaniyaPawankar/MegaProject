import React, { useState, useEffect, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import useVoiceCommands from "../voiceCommands";

export default function EditorPage() {
  const editorRef = useRef(null);

  // Initialize with one safe file
  const initialFile = { id: 1, name: "file1.js", code: "// Start coding here...\n", language: "javascript" };
  const [files, setFiles] = useState([initialFile]);
  const [activeFileId, setActiveFileId] = useState(initialFile.id);
  const [filename, setFilename] = useState(initialFile.name);
  const [language, setLanguage] = useState(initialFile.language);
  const [code, setCode] = useState(initialFile.code);

  const onCommand = (text) => {
    if (text && text.trim() !== "") {
      setCode((prev) => prev + text + " ");
    }
  };

  const { transcript, listening, startListening, stopListening } = useVoiceCommands(onCommand);

  useEffect(() => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === activeFileId ? { ...file, code } : file
      )
    );
  }, [code, activeFileId]);

  const selectFile = (id) => {
    const f = files.find((f) => f.id === id);
    if (!f) return;
    setActiveFileId(f.id);
    setFilename(f.name || "untitled.js");
    setLanguage(f.language || "javascript");
    setCode(f.code || "// Start coding here...");
  };

  const addNewFile = () => {
    const newFile = {
      id: Date.now(),
      name: `file${files.length + 1}.js`,
      code: "// New file\n",
      language: "javascript",
    };
    setFiles([...files, newFile]);
    selectFile(newFile.id);
  };

  const saveFile = () => {
    if (!activeFileId) return;
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.id === activeFileId ? { ...f, name: filename, language, code } : f
      )
    );
    alert("✅ File saved!");
  };

  const updateFile = () => saveFile();

  const deleteFile = (id) => {
    const remaining = files.filter((f) => f.id !== id);
    setFiles(remaining);

    if (id === activeFileId) {
      if (remaining.length > 0) {
        selectFile(remaining[0].id);
      } else {
        // fallback if no files left
        const fallback = { id: Date.now(), name: "untitled.js", code: "// Start coding here...\n", language: "javascript" };
        setFiles([fallback]);
        selectFile(fallback.id);
      }
    }
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
            onClick={addNewFile}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-md transition"
          >
            + New File
          </button>
        </div>

        <div className="flex-1 overflow-auto px-2 pb-4">
          <ul className="space-y-2">
            {files.map((f) => (
              <li
                key={f.id}
                className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer ${
                  activeFileId === f.id ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
                onClick={() => selectFile(f.id)}
              >
                <span>{f.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete ${f.name}?`)) {
                      deleteFile(f.id);
                    }
                  }}
                  className="ml-3 text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </li>
            ))}
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
              🎤 {listening ? "Listening..." : "Start"}
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
            Transcript: {transcript || "..."}
          </div>
        </div>
      </aside>

      {/* Main editor */}
      <main className="flex-1 flex flex-col">
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

          <div className="ml-auto flex gap-2">
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
          </div>
        </div>

        <div className="flex-1">
          <MonacoEditor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            editorDidMount={(editor) => (editorRef.current = editor)}
            options={{ automaticLayout: true, fontSize: 14 }}
          />
        </div>
      </main>
    </div>
  );
}
