// voiceCommandsClient.js
// This file connects the frontend to the backend voiceCommands.js

const socket = new WebSocket("ws://localhost:3001"); 
// Change port if your backend is running on a different port

/**
 * Sends a voice command to the backend.
 * @param {string} command - The voice command text (transcribed speech)
 */
export function sendVoiceCommand(command) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ command }));
    } else {
        console.error("WebSocket not connected. Command not sent:", command);
    }
}

/**
 * Registers a callback to handle responses from the backend.
 * @param {function} callback - Called when backend sends message and code.
 */
export function onVoiceCommandResponse(callback) {
    socket.addEventListener("message", (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.message && data.code) {
                callback(data); 
                // data = { message: "...", code: "..." }
            } else {
                console.warn("Unexpected data format from backend:", data);
            }
        } catch (error) {
            console.error("Error parsing backend response:", error);
        }
    });
}

// Debugging: Connection status
socket.addEventListener("open", () => {
    console.log("Connected to voice command server");
});

socket.addEventListener("close", () => {
    console.log("Disconnected from voice command server");
});

socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
});
