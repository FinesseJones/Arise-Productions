"use client";

import React, { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import { ProjectStatus, updateShotStatus } from '../types/types';
import toast from 'react-hot-toast';

interface DirectorAgentProps {
    setProjectStatus: React.Dispatch<React.SetStateAction<ProjectStatus>>;
}

const DIRECTOR_AGENT_MCP_SERVERS = [
    { name: 'ScriptBreak', type: 'api', endpoint: '/mcp/script' },
    { name: 'Cork Board', type: 'api', endpoint: '/mcp/structure' },
    { name: 'Master Canvas', type: 'api', endpoint: '/mcp/plan' },
    { name: 'Blockout', type: 'api', endpoint: '/mcp/previs' },
    { name: 'Motion Previs Studio', type: 'api', endpoint: '/mcp/motion' },
    { name: 'Storyboard Reference Studio', type: 'api', endpoint: '/mcp/boards' },
    { name: 'Slate', type: 'api', endpoint: '/mcp/prompt' },
    { name: 'Circle Take', type: 'api', endpoint: '/mcp/dailies' },
    { name: 'Stem Studio', type: 'api', endpoint: '/mcp/sound' },
    { name: 'DaVinci MCP', type: 'api', endpoint: '/mcp/edit' },
];

const DirectorAgent: React.FC<DirectorAgentProps> = ({ setProjectStatus }) => {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Utility function to simulate sequential status updates after a multi-stage process
  const simulateProcessSuccess = useCallback((shotIndex: number, stageIndex: number, stageName: string) => {
      setProjectStatus(prevStatus => {
          const updatedShots = [...prevStatus.shots];
          const updatedShot = { ...updatedShots[shotIndex] };
          
          // Find the correct status key based on the stageName
          let statusKey: keyof typeof updatedShot.status;
          if (stageName.includes('Script')) statusKey = 'script';
          else if (stageName.includes('Structure')) statusKey = 'structure';
          else if (stageName.includes('Plan')) statusKey = 'plan';
          else if (stageName.includes('Blockout')) statusKey = 'previs';
          else if (stageName.includes('Circle')) statusKey = 'dailies';
          else if (stageName.includes('Prompt')) statusKey = 'prompt';
          else statusKey = 'script'; // Default fallback

          // Update status at the specific stage index to Success (Green)
          updatedShot.status = {
              ...updatedShot.status,
              [statusKey]: { statusChar: '🟢' }
          };
          updatedShots[shotIndex] = updatedShot;
          return { ...prevStatus, shots: updatedShots };
      });
  }, [setProjectStatus]);

  // The core processing function (The Brain)
  const handleCommandSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCommand = command.trim();
    if (!trimmedCommand) {
        return;
    }

    setIsProcessing(true);
    toast.loading("🟡 Director Agent Engaged. Checking all 10 MCP servers...");
    
    // 1. Initial Connectivity Check Simulation
    if (!DIRECTOR_AGENT_MCP_SERVERS.every(server => server.type === 'api' && server.endpoint)) {
      toast.error("Critical Failure: Cannot connect to all 10 required MCP servers. Check system stability.");
      setIsProcessing(false);
      return;
    }

    let executionSuccess = false;
    let finalMessage = "";

    try {
        // --- COMPLEX WORKFLOW SIMULATION ---
        if (trimmedCommand.toLowerCase().includes("board scene")) {
            // Workflow: Script -> Cork Board -> Master Canvas -> Blockout (Multi-stage handoff)
            const match = trimmedCommand.match(/board scene (\d+)/i);
            if (!match) {
                throw new Error("Invalid scene reference.");
            }
            
            // Simulate running the handoff pipeline
            finalMessage = `Initiating Pipeline Run for Scene ${match[1]}...`;
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate Stage 1: Script -> Done
            toast.success("✅ ScriptBreak (Scene Bible) completed. Handing data to Cork Board...").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate Stage 2: Cork Board -> Done
            toast.success("✅ Cork Board (Scene Outline) generated. Exporting index cards...").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate Stage 3: Master Canvas -> Done
            toast.success("✅ Master Canvas (Handoff Package) compiled. Preparing assets...").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate Stage 4: Blockout (Final Target)
            finalMessage = `🎬 Blockout (MCP) successfully run for Scene ${match[1]}. Camera path solved, motion-reference exported, and project status updated.`;
            await new Promise(resolve => setTimeout(resolve, 1000));
            executionSuccess = true;
            
        } else if (trimmedCommand.toLowerCase().includes("compile prompts")) {
            // Workflow: Blockout/Boards -> Slate -> Prompt
            finalMessage = `Compiling all necessary prompts for the entire project (${DIRECTOR_AGENT_MCP_SERVERS[5].name} and ${DIRECTOR_AGENT_MCP_SERVERS[6].name} reports used).`;
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate Stage 5: Storyboard Boards -> Done
            toast.success("💾 Storyboard assets cataloged. Generating seed prompt descriptors...").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate Stage 6: Slate -> Done
            finalMessage = `✨ Slate (MCP) Agent finished running. All continuity-locked prompts confirmed and saved to /06-prompts.`;
            await new Promise(resolve => setTimeout(resolve, 1000));
            executionSuccess = true;

        } else if (trimmedCommand.toLowerCase().includes("circle winners")) {
            // Workflow: Dailies -> Prompt (Selection/Review)
            finalMessage = `🔬 Circle Take (MCP) agent activated. Reviewing shot-by-shot dailies, confirming 'best takes' are flagged, and updating reshoot lists back in Slate.`;
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate Stage 7: Dailies -> Done
            toast.success("🔎 Circle Take (MCP) completed. Dailies reviewed. Reshoot list compiled!").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate looping back to prompt status update
            finalMessage = `✅ Workflow complete. The director's vision has been captured and passed back to the prompt system`;
            executionSuccess = true;

        } else {
            // General unhandled command
            finalMessage = `Agent received command. Passing "${trimmedCommand}" to the general queue. Awaiting response from a dedicated MCP server handshake.`;
            executionSuccess = true;
        }

        // Final Status Update (Always run this on success)
        if (executionSuccess) {
            simulateProcessSuccess(0, 0, 'script'); // Update the first shot status
            setTimeout(() => {
                toast.success(finalMessage, { duration: 6000 });
            }, 100);
        } else {
            throw new Error("Unknown or unsupported workflow sequence.");
        }

    } catch (error) {
        console.error("Agent Error:", error);
        toast.error(`❌ Command Error: ${error instanceof Error ? error.message : "Unknown error during API communication."}`, { duration: 6000 });
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
          placeholder="e.g., board scene 3 or compile prompts"
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