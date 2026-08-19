"use client";

import React, { useState, useCallback } from 'react';
import { Send } from 'lucide-react';

interface AgentCommand {
    command: string;
}

const DirectorAgent: React.FC = () => {
  const [command, setCommand] = useState("");
  const [statusMessage, setStatusMessage] = useState<string>("Awaiting command...");

  // Simulate running a command through the MCP servers
  const handleCommandSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    // 1. Simulate processing time
    setStatusMessage("📡 Connecting to MCP Servers...");
    
    // 2. Simple command parsing and response generation (Simulation)
    let response = "";
    if (trimmedCommand.toLowerCase().includes("board")) {
        const match = trimmedCommand.match(/board scene (\d+)/i);
        if (match) {
            const sceneNumber = match[1];
            response = `✅ Successfully triggered Blockout (MCP) for Scene ${sceneNumber}. Assets are now being compiled into the /04-previs stage.`;
        } else {
            response = `⚠️ Error: Found 'board' command, but no scene number. Usage: board scene X`;
        }
    } else if (trimmedCommand.toLowerCase().includes("compile prompts")) {
        response = `✅ Calling Slate (MCP) to compile all necessary media prompts for the entire project. Prompt pack generated and saved to /06-prompts.`;
    } else if (trimmedCommand.toLowerCase().includes("circle winners")) {
        response = `✅ Triggering Circle Take (MCP) agent. All outstanding shots are analyzed for 'winners' and automatically marked for follow-up in the Director Log.`;
    } else {
        response = `✅ Command understood: "${trimmedCommand}". The Agent is passing your request to the appropriate multi-stage sequence handlers.`;
    }

    // 3. Update status after a simulated delay
    setTimeout(() => {
        setStatusMessage(response);
        setCommand("");
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col border-t border-gray-200 bg-white p-3 shadow-lg flex-shrink-0">
      
      {/* Status/Log Message Area */}
      <div className="text-sm text-blue-600 mb-2 p-1 bg-blue-50 rounded-md">{statusMessage}</div>

      {/* Command Input Form */}
      <form onSubmit={handleCommandSubmit} className="flex items-center max-w-full mx-auto">
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
    </div>
  );
};

export default DirectorAgent;