import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-black bg-opacity-80 shadow-md">
        <h1 className="text-2xl font-bold text-blue-400">SpeakToCode</h1>
        <button
          onClick={() => navigate("/editor")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
        >
          Open Editor
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-5xl font-extrabold mb-6">
          Code Smarter with <span className="text-blue-400">Your Voice</span>
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mb-8">
          SpeakToCode lets you create, edit, and manage code files effortlessly
          with voice commands and a modern editor interface. Save, update, and
          delete your work with ease.
        </p>
        <button
          onClick={() => navigate("/editor")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg text-lg shadow-lg"
        >
          🚀 Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;