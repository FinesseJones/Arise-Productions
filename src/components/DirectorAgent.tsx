"use client";

import React, { useState } from 'react';
import { Smartphone, Send } from 'lucide-react';

const DirectorAgent: React.FC = () => {
  const [command, setCommand] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      // In a real application, this calls the API/local agent
      console.log(`Director Agent Command Sent: "${command}"`);
      alert(`Agent received command: "${command}"`);
      setCommand("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center max-w-full mx-auto">
      <label htmlFor="command-input" className="mr-2 cursor-pointer hidden sm:inline text-gray-500">
        CMD:
      </label>
      <input
        id="command-input"
        type="text"
        placeholder="e.g., board scene 3 or compile prompts"
        className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 outline-none"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
      />
      <button 
        type="submit" 
        className="flex items-center bg-blue-600 hover:bg-blue-700 rounded-r-md p-2 text-white transition"
        title="Run Agent Command"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default DirectorAgent;