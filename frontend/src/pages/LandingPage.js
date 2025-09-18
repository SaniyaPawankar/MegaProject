import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-black via-blue-900 to-black shadow-lg">
        <h1 className="text-2xl font-bold text-blue-400">CodeCollab</h1>
        <nav>
          <ul className="flex gap-6 text-gray-300">
            <li className="hover:text-blue-400 cursor-pointer">Home</li>
            <li className="hover:text-blue-400 cursor-pointer">About</li>
            <li className="hover:text-blue-400 cursor-pointer">Contact</li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-blue-400 mb-6">
          Real-Time Code Collaboration
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
          Write, edit and share code seamlessly with your team — all inside a
          modern editor that feels just like VS Code.
        </p>
        <Link
          to="/editor"
          className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition-all"
        >
          Start Coding
        </Link>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 bg-black border-t border-blue-900 text-gray-500">
        © {new Date().getFullYear()} CodeCollab. All rights reserved.
      </footer>
    </div>
  );
}
