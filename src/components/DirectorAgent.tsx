"use client";

import React, { useState } from 'react';
import { Send, Terminal, Sparkles, RefreshCw, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { WorkerTelemetry } from '../hooks/useStudioSocket';

interface DirectorAgentProps {
  activeStage: string | null;
  onSendCommand: (command: string, activeStage?: string | null, shotNumber?: number) => Promise<void>;
  telemetry: WorkerTelemetry | null;
}

const DirectorAgent: React.FC<DirectorAgentProps> = ({
  activeStage,
  onSendCommand,
  telemetry,
}) => {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = command.trim();
    if (!trimmed) return;

    if (trimmed.length < 3) {
      toast.error("ERROR: Command too short. Required command patterns include 'board scene X' or 'compile prompts'.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading(`🟡 Arise AI Director: Dispatching "${trimmed}" through Central API Bridge...`);

    try {
      await onSendCommand(trimmed, activeStage, 1);
      toast.success(`🎬 SUCCESS: Arise Production workflow executed across worker services.`, { id: toastId });
      setCommand("");
    } catch (err: any) {
      toast.error(`ERROR: ${err.message || 'Workflow execution failure'}`, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickCommand = (cmd: string) => {
    setCommand(cmd);
  };

  return (
    <div className="flex flex-col p-3 space-y-2">
      {/* Quick Action Suggestion Pills */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center space-x-2 text-slate-400">
          <Terminal size={14} className="text-amber-400" />
          <span className="font-mono font-semibold uppercase text-slate-300">
            ARISE DIRECTOR AGENT PROMPT:
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          <span className="text-[11px] text-slate-500 hidden sm:inline font-mono">Workflows:</span>
          <button
            type="button"
            onClick={() => handleQuickCommand("board scene 1")}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] transition"
          >
            <Layers size={11} />
            <span>board scene 1</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickCommand("compile prompts")}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] transition"
          >
            <Sparkles size={11} />
            <span>compile prompts</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickCommand("review reshoots")}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-[11px] transition"
          >
            <RefreshCw size={11} />
            <span>review reshoots</span>
          </button>
        </div>
      </div>

      {/* Main Command Input Box */}
      <form onSubmit={handleCommandSubmit} className="flex items-center max-w-full">
        <div className="relative flex-grow">
          <input
            id="command-input"
            type="text"
            placeholder="e.g., board scene 1 | compile prompts | review reshoots | run script"
            className="w-full pl-3 pr-24 py-2.5 bg-slate-950 border border-slate-700 rounded-l-lg text-slate-100 placeholder-slate-500 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-mono"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={isProcessing}
          />
          {telemetry?.progress !== undefined && isProcessing && (
            <div className="absolute right-3 top-2.5 text-xs text-amber-400 font-mono flex items-center gap-1.5">
              <span className="animate-spin">⚙️</span>
              <span>{telemetry.progress}%</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-r-lg font-semibold text-sm transition shadow-md ${
            isProcessing
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/10'
          }`}
          title="Run Agent Command"
        >
          <Send size={15} />
          <span>Execute</span>
        </button>
      </form>
    </div>
  );
};

export default DirectorAgent;