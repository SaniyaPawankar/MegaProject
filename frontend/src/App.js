import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import useVoiceCommands from "./voiceCommands";
import axios from "axios";

export default function App() {
  const editorRef = useRef(null);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");

  // Provide the callback that the voice hook will call when a command is detected
  const onVoiceCommand = (payload) => {
    // payload is the string the hook sends (see voiceCommands.js)
    // - "" = clear editor
    // - "// Running code..." = run code (placeholder sent by your hook)
    // - "// Voice Input\n<text>" = voice text to insert
    if (payload === "") {
      editorRef.current?.setValue("");
      setStatus("Editor cleared by voice");
      return;
    }

    if (typeof payload === "string" && payload.toLowerCase().includes("running code")) {
      // run the current editor code
      runCode();
      return;
    }

    // Default: append payload text to the editor (keeps it simple & robust)
    const editor = editorRef.current;
    if (!editor) return;
    const current = editor.getValue();
    const next = current ? current + "\n" + payload : payload;
    editor.setValue(next);
    setStatus("Inserted text from voice");
  };

  // Hook from frontend/src/voiceCommands.js
  const { transcript, listening, resetTranscript, startListening, stopListening } =
    useVoiceCommands(onVoiceCommand);

  // Keep reference to Monaco editor
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Run code by calling backend. Expects a backend /run route that executes JS (or change URL to your endpoint).
  async function runCode() {
    setStatus("Running code...");
    const source = editorRef.current ? editorRef.current.getValue() : "";
    try {
      // Try /run first; if you only have /execute replace the URL accordingly.
      const res = await axios.post("http://localhost:5000/run", { code: source }, { timeout: 20000 });
      // The backend should return { output: "..." }.
      setOutput(res.data.output ?? JSON.stringify(res.data));
      setStatus("Run complete");
    } catch (err) {
      // fallback to /execute if /run not present
      try {
        const res2 = await axios.post("http://localhost:5000/execute", { code: source });
        setOutput(JSON.stringify(res2.data, null, 2));
        setStatus("Run (via /execute) complete");
      } catch (err2) {
        console.error(err, err2);
        setOutput(err.response?.data?.error || err.message || "Unknown error");
        setStatus("Run failed — check backend");
      }
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Voice Controlled Code Editor</h1>

      <div style={{ marginBottom: 8 }}>
        <button onClick={() => startListening()} style={{ marginRight: 8 }}>
          Start Listening
        </button>
        <button onClick={() => stopListening()} style={{ marginRight: 8 }}>
          Stop Listening
        </button>
        <button
          onClick={() => {
            // Manual insert of transcript if you want (optional)
            if (editorRef.current && transcript) {
              const c = editorRef.current.getValue();
              editorRef.current.setValue(c + "\n" + `// (manual) ${transcript}`);
              resetTranscript();
            }
          }}
          style={{ marginRight: 8 }}
        >
          Insert Current Transcript (manual)
        </button>

        <button onClick={runCode} style={{ marginLeft: 16 }}>
          Run Code (manual)
        </button>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Editor
            height="60vh"
            defaultLanguage="javascript"
            defaultValue="// Start typing or say 'write hello' etc..."
            onMount={handleEditorDidMount}
            options={{ automaticLayout: true }}
          />
        </div>

        <div style={{ width: 360 }}>
          <div style={{ marginBottom: 12, padding: 8, border: "1px solid #ddd", borderRadius: 6 }}>
            <strong>Voice</strong>
            <p>Listening: {listening ? "Yes 🎙" : "No ❌"}</p>
            <p style={{ whiteSpace: "pre-wrap" }}><strong>Transcript:</strong> {transcript}</p>
            <p style={{ color: "#666" }}>Status: {status}</p>
          </div>

          <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}>
            <strong>Output</strong>
            <pre style={{ maxHeight: 260, overflow: "auto", background: "#111", color: "#fff", padding: 8 }}>
              {output || "(no output yet)"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
