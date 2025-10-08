import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function useVoiceCommands(onCommand) {
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });

  const stopListening = () => SpeechRecognition.stopListening();

  const commands = [
    {
      command: "*",
      callback: (text) => {
        if (text) onCommand(text);
      },
    },
    {
      command: "create for loop",
      callback: () =>
        onCommand("for (let i = 0; i < 10; i++) {\n  console.log(i);\n}\n"),
    },
    {
      command: "create if condition",
      callback: () =>
        onCommand("if (condition) {\n  // your code\n}\n"),
    },
    { command: "clear editor", callback: () => onCommand("") },
    { command: "go to next line", callback: () => onCommand("\n") },
    { command: "run code", callback: () => onCommand("// Running code...\n") },
  ];

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition({ commands });

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser does not support speech recognition.");
  }

  return { transcript, listening, startListening, stopListening };
}