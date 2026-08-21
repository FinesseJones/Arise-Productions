"use client";

import React, { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import { ProjectStatus } from '../types/types';
import toast from 'react-hot-toast';

// ... (CONSTANTS remain the same)

const DIRECTOR_AGENT_MCP_SERVERS = [
    { name: 'ScriptBreak', type: 'api', endpoint: '/mcp/script' },
    { name: 'Cork Board', type: 'api', endpoint: '/mcp/structure' },
    { name: 'Master Canvas', type: 'api', endpoint: '/mcp/plan' },
    { name: 'Blockout', type: 'api', endpoint: '/mcp/previs' },
    { name: 'Motion Previs Studio', type: 'api', endpoint: '/mcp/motion' },
    { name: 'Storyboard Reference Studio', type: 'api', endpoint: '/mcp/boards' },
    { name: 'Slate', type: 'api', endpoint: '/mcp/prompt' },
    { name: 'Circle Take', type: 'api', endpoint: '/mcp/dailies'' },
    { name: 'Stem Studio', type: 'api', endpoint: '/mcp/sound' },
    { name: 'DaVinci MCP', type: 'api', endpoint: '/mcp/edit' },
];

interface DirectorAgentProps {
    setProjectStatus: React.Dispatch<React.SetStateAction<ProjectStatus>>;
}

const DirectorAgent: React.FC<DirectorAgentProps> = ({ setProjectStatus }) => {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
// ... (rest of the component remains the same)


  // ... (handleCommandSubmit function implementation remains the same, but we ensure the language changes)
  const handleCommandSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCommand = command.trim();
    if (!trimmedCommand) {
        return;
    }

    setIsProcessing(true);
    toast.loading("🟡 Director Agent Engaged. Validating workflow through the Central API Bridge...");
    
    let commandPassedToCore = false;
    let finalMessage = `Final Status: ${trimmedCommand}`;

    try {
        // --- 1. WORKFLOW: PIPELINE START (Script -> Blockout) ---
        if (trimmedCommand.toLowerCase().includes("board scene")) {
            // ... (rest of the logic remains the same, but focus on the API bridge)
            const match = trimmedCommand.match(/board scene (\d+)/i);
            if (!match) {
                throw new Error("Invalid scene reference. Command must be 'board scene X'.");
            }
            
            finalMessage = `Initiating Full Pipeline Run for Scene ${match[1]}... (Script $\rightarrow$ Cork $\rightarrow$ Master $\rightarrow$ Blockout) via Central API Bridge.`;
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Stage 1: Script
            toast.success("✅ ScriptBreak (Scene Bible) completed. Transmitting data via API Bridge...").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Stage 2: Cork Board
            toast.success("✅ Cork Board (Scene Outline) generated. Transmitting index cards via API Bridge...").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Stage 3: Master Canvas
            toast.success("✅ Master Canvas (Total Handoff Package) compiled. All data passed through the Central API Bridge...").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Stage 4: Blockout (Final Target)
            finalMessage = `🎬 SUCCESS: Blockout (MCP) run for Scene ${match[1]}. All camera paths and choreography are solved via the Central API Bridge.`;
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            simulateProcessSuccess(0, 0, 'Blockout'); 
            commandPassedToCore = true;
            
        } 
        
        // --- 2. WORKFLOW: PROMPT GENERATION (Boards -> Slate) ---
        else if (trimmedCommand.toLowerCase().includes("compile prompts")) {
            finalMessage = `Compiling all necessary text and media prompts for the entire project via Central API Bridge.`;
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Stage 5: Storyboard Boards
            toast.success("💾 Storyboard Boards analyzed. Transmitting descriptors via API Bridge...").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Stage 6: Slate 
            finalMessage = `✨ SUCCESS: Slate (MCP) Agent finished running. All continuous prompts confirmed and saved via the API Bridge.`;
            await new Promise(resolve => setTimeout(resolve, 1000));
            simulateProcessSuccess(0, 0, 'Slate');
            commandPassedToCore = true;

        } 
        
        // --- 3. WORKFLOW: RESHOOT LOOP (Dailies -> Prompting) ---
        else if (trimmedCommand.toLowerCase().includes("review reshoots")) {
           // ... (logic remains largely the same, emphasizing the automated data feedback loop)
            finalMessage = `🔄 Initiating Reshoot Loop via Central API Bridge! Checking for failures and automatically updating upstream stages.`;
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Status updates (unchanged)
            simulateProcessSuccess(1, 0, 'Blockout'); 
            simulateProcessSuccess(1, 0, 'Slate'); 
            commandPassedToCore = true;
        }
        
        // --- 4. GENERIC / FALLBACK COMMANDS ---
        else if (trimmedCommand.length < 3) {
             throw new Error("Command is too short. Please enter a specific command (e.g., board scene 1).");
        }
        else {
            finalMessage = `Agent accepting general command: "${trimmedCommand}". Routing request through the Central API Bridge now.`;
            commandPassedToCore = true;
        }


    } catch (error) {
        // Updated error handling language
        let detailedMessage = `Error executing command via Central API Bridge: ${error instanceof Error ? error.message : "Unknown system error."}`;
        if (error instanceof Error) {
            if (error.message.includes("Invalid scene reference")) {
                detailedMessage = "ERROR: Invalid scene reference. Command must be 'board scene X'.";
            } else if (error.message.includes("too short")) {
                detailedMessage = "ERROR: Command too short. Required command patterns include 'board scene X' or 'compile prompts'.";
            } else if (!commandPassedToCore) {
                 detailedMessage = `SYSTEM FAILURE: The requested workflow could not be executed. Ensure prerequisite steps have completed, or manually run a specific workflow (e.g., 'board scene 1')`;
            }
        }
        toast.error(detailedMessage, { duration: 8000 });
    } finally {
        setIsProcessing(false);
        setCommand("");
    }
  }, [command, simulateProcessSuccess]);

  return (
    <div className="flex flex-col border-t border-gray-200 bg-white p-3 shadow-lg flex-shrink-0">
      
      <form onSubmit={handleCommandSubmit} className="flex items-center max-w-full mx-auto">
        <label htmlFor="command-input" className="mr-2 cursor-pointer hidden sm:inline text-gray-500">
          CMD:
        </label>
        <input
          id="command-input"
          type="text"
          placeholder="e.g., board scene 3 | compile prompts | review reshoots"
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          disabled={isProcessing}
        />
        <button 
          type="submit" 
          className={`flex items-center rounded-r-md p-2 text-white transition ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          title="Run Agent Command"
          disabled={isProcessing}
        >
          <Send size={20} />
        </button>
      </form>
    </div >
  );
};

export default DirectorAgent;