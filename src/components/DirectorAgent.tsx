"use client";

import React, { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import { ProjectStatus, updateShotStatus } from '../types/types';
import { stages } from '../types/stages';

interface DirectorAgentProps {
    setProjectStatus: React.Dispatch<React.SetStateAction<ProjectStatus>>;
}

const DirectorAgent: React.FC<DirectorAgentProps> = ({ setProjectStatus }) => {
  const [command, setCommand] = useState("");
  const [statusMessage, setStatusMessage] = useState<string>("Awaiting command...");

  // Action to simulate a successful status update (e.g., a shot goes from 'Pending' to 'Complete')
  const simulateStatusSuccess = useCallback((shotIndex: number, stageIndex: number) => {
      setProjectStatus(prevStatus => {
          const updatedShots = [...prevStatus.shots];
          const updatedShot = { ...updatedShots[shotIndex] };
          
          // Change status at the specific stage index to Success (Green)
          updatedShot.status = [...updatedShot.status];
          if (updatedShot.status[stageIndex]) {
               updatedShot.status[stageIndex] = { statusChar: '🟢' };
          }
          
          updatedShots[shotIndex] = updatedShot;
          return { ...prevStatus, shots: updatedShots };
      });
  }, [setProjectStatus]);


  const handleCommandSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    setStatusMessage("📡 Connecting to MCP Servers...");
    
    // --- PHASE 2 LOGIC: Command Processing ---
    let response = "";
    let success = false;
    
    if (trimmedCommand.toLowerCase().includes("board scene 3")) {
        const match = trimmedCommand.match(/board scene (\d+)/i);
        if (match) {
            const sceneNumber = match[1];
            response = `✅ Successfully triggered Blockout (MCP) for Scene ${sceneNumber}. Assets are now being compiled into the /04-previs stage.`;
            success = true;
            // Simulate status update: S-003 (index 2) in the PREVIS stage (index 3)
            setTimeout(() => simulateStatusSuccess(2, 3), 500); 
        } else {
            response = `⚠️ Error: Found 'board' command, but no scene number. Usage: board scene X`;
        }
    } else if (trimmedCommand.toLowerCase().includes("compile prompts")) {
        response = `✅ Calling Slate (MCP) to compile all necessary media prompts for the entire project. Prompt pack generated and saved to /06-prompts.`;
        success = true;
        // Simulate status update: S-001 (index 0) in the BOARD (index 5)
        setTimeout(() => simulateStatusSuccess(0, 5), 500);
    } else if (trimmedCommand.toLowerCase().includes("circle winners")) {
        response = `✅ Triggering Circle Take (MCP) agent. Reviewing takes for 'winners'. The status board updates automatically as passes are confirmed.`;
        success = true;
        // Simulate status update: S-004 (index 3) in the DAILIES (index 7)
        setTimeout(() => simulateStatusSuccess(3, 7), 500);
    } else {
        response = `✅ Command understood: "${trimmedCommand}". The Agent is passing your request to the appropriate multi-stage sequence handlers.`;
        success = true;
    }
    
    // Set the visible status message immediately
    setStatusMessage(success ? response : response);
    
    // Clear input field
    setCommand("");
  }, [command, setProjectStatus]);

  return (
    <div className="flex flex-col border-t border-gray-200 bg-white p-3 shadow-lg flex-shrink-0">
      
      {/* Status/Log Message Area */}
      <div className={`text-sm mb-2 p-1 rounded-md ${statusMessage.startsWith('✅') ? 'bg-green-50 text-green-700' : statusMessage.startsWith('⚠️') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
         {statusMessage}
      </div>

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