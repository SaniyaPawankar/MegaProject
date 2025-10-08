import React from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const VoiceControl = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support Speech Recognition.</p>;
  }

  return (
    <div style={{ padding: "20px", border: "1px solid gray", borderRadius: "8px" }}>
      <h2>🎙 Voice Control Test</h2>
      <p>Listening: {listening ? "✅ Yes" : "❌ No"}</p>
      <p>Transcript: {transcript}</p>

      <button onClick={SpeechRecognition.startListening}>
        Start Listening
      </button>
      <button onClick={SpeechRecognition.stopListening}>
        Stop Listening
      </button>
      <button onClick={resetTranscript}>
        Reset
      </button>
    </div>
  );
};

export default VoiceControl;