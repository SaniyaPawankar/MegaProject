// voiceCommands.js
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

/**
 * This hook sets up speech recognition and handles voice commands.
 * @param {Function} onCommand - Callback function to execute when a command is detected.
 */
export default function useVoiceCommands(onCommand) {
  const commands = [
    {
      command: "write *",
      callback: (text) => {
        onCommand(`// Voice Input\n${text}`);
      },
    },
    {
      command: "clear editor",
      callback: () => {
        onCommand("");
      },
    },
    {
      command: "run code",
      callback: () => {
        onCommand("// Running code...");
      },
    },
  ];

  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition({ commands });

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) {
    console.warn("Your browser does not support speech recognition.");
  }

  return {
    transcript,
    resetTranscript,
    listening,
    startListening,
    stopListening,
  };
}
