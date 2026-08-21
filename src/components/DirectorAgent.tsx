"use client";

import React, { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import { ProjectStatus } from '../types/types';
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
          
          // Determine the correct status key based on the stageName
          let statusKey: keyof typeof updatedShot.status;
          if (stageName.includes('Script')) statusKey = 'script';
          else if (stageName.includes('Structure')) statusKey = 'structure';
          else if (stageName.includes('Plan')) statusKey = 'plan';
          else if (stageName.includes('Blockout')) statusKey = 'previs';
          else if (stageName.includes('Motion')) statusKey = 'motion';
          else if (stageName.includes('Board')) statusKey = 'boards';
          else if (stageName.includes('Prompt')) statusKey = 'prompt';
          else if (stageName.includes('Circle')) statusKey = 'dailies';
          else if (stageName.includes('Stem')) statusKey = 'sound';
          else statusKey = 'edit';

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
    toast.loading("🟡 Director Agent Engaged. Analyzing required workflow...");
    
    let finalMessage = "";

    try {
        // --- 1. WORKFLOW: PIPELINE START (Script -> Blockout) ---
        if (trimmedCommand.toLowerCase().includes("board scene")) {
            const match = trimmedCommand.match(/board scene (\d+)/i);
            if (!match) {
                throw new Error("Invalid scene reference.");
            }
            
            finalMessage = `Initiating Full Pipeline Run for Scene ${match[1]}. (Script $\rightarrow$ Cork $\rightarrow$ Master $\rightarrow$ Blockout)`;
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Stage 1: Script
            toast.success("✅ ScriptBreak (Scene Bible) completed. Exporting character/shot bibles...").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Stage 2: Cork Board
            toast.success("✅ Cork Board (Scene Outline) generated. Index-card wall compiled...").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Stage 3: Master Canvas
            toast.success("✅ Master Canvas (Total Handoff Package) compiled. Ensuring continuity...").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Stage 4: Blockout (Final Target)
            finalMessage = `🎬 SUCCESS: Blockout (MCP) run for Scene ${match[1]}. All required camera paths and choreography are solved and exported.`;
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update status after the full chain completes
            simulateProcessSuccess(0, 0, 'Blockout'); 
            
        } 
        
        // --- 2. WORKFLOW: PROMPT GENERATION (Boards -> Slate) ---
        else if (trimmedCommand.toLowerCase().includes("compile prompts")) {
            finalMessage = `Compiling all necessary text and media prompts for the entire project. (Focus: Storyboards $\rightarrow$ Slate).`;
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Stage 5: Storyboard Boards
            toast.success("💾 Storyboard Boards analyzed. Generating core concept descriptors...").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Stage 6: Slate 
            finalMessage = `✨ SUCCESS: Slate (MCP) Agent finished running. All continuity-locked prompts confirmed and saved to /06-prompts.`;
            await new Promise(resolve => setTimeout(resolve, 1000));
            simulateProcessSuccess(0, 0, 'Slate');

        } 
        
        // --- 3. WORKFLOW: RESHOOT LOOP (Dailies -> Prompting) ---
        else if (trimmedCommand.toLowerCase().includes("review reshoots")) {
            finalMessage = `🔄 Initiating Reshoot Loop! Checking for failures from Circle Take and automatically flagging required prompt updates.`;
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Stage 7: Dailies
            toast.success("🔎 Circle Take (MCP) completed. Dailies reviewed. Reshoot list compiled: shot 2 failed on lighting.").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Critical handoff simulation
            toast.warn("⚠️ Critical Flag Detected: Missing lighting data for Shot 2. Auto-triggering Slate/Blockout correction.").pause();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate failure feeding back into prompt/previs
            simulateProcessSuccess(1, 0, 'Blockout'); 
            simulateProcessSuccess(1, 0, 'Slate'); 

            finalMessage = `✅ Reshoot Loop complete. Failures were identified (Shot 2) and the system auto-updated the Blockout and Prompt requirements.`;

        }
        
        // --- 4. GENERIC / FALLBACK COMMANDS ---
        else {
            finalMessage = `Agent accepted command: "${trimmedCommand}". Passing request to the appropriate queue.`;
        }

        // Final Status Update
        if (finalMessage) {
            toast.success(finalMessage, { duration: 6000 });
        }
        
    } catch (error) {
        console.error("Agent Error:", error);
        toast.error(`❌ Command Failure: ${error instanceof Error ? error.message : "An unknown error occurred during the workflow."}`, { duration: 6000 });
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