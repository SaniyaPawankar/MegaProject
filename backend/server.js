// voiceCommands.js

// Import necessary modules
const express = require("express");
const router = express.Router();

// Example command mappings
// You can add or remove commands as needed
const commandActions = {
    "open google": () => {
        return { action: "redirect", url: "https://www.google.com" };
    },
    "open youtube": () => {
        return { action: "redirect", url: "https://www.youtube.com" };
    },
    "hello": () => {
        return { action: "speak", text: "Hello! How can I help you today?" };
    },
    "time": () => {
        const now = new Date();
        return { action: "speak", text: `The current time is ${now.toLocaleTimeString()}` };
    },
    "date": () => {
        const today = new Date();
        return { action: "speak", text: `Today is ${today.toLocaleDateString()}` };
    }
};

// API endpoint to handle voice commands
router.post("/", (req, res) => {
    try {
        const { command } = req.body;

        if (!command) {
            return res.status(400).json({ error: "No command provided" });
        }

        const lowerCommand = command.trim().toLowerCase();

        if (commandActions[lowerCommand]) {
            const result = commandActions[lowerCommand]();
            return res.json({ success: true, result });
        } else {
            return res.json({
                success: false,
                message: `Sorry, I don't understand the command: "${command}"`
            });
        }

    } catch (error) {
        console.error("Error handling voice command:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
