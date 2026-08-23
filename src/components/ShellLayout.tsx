"use client";

import React, { useState } from 'react';
import PipelineStages from './PipelineStages';
import StatusBoard from './StatusBoard';
import DirectorAgent from './DirectorAgent';
import StageWorkspace from './StageWorkspace';
import StudioArchitecturalView from './StudioArchitecturalView';
import { useStudioSocket } from '../hooks/useStudioSocket';
import { stages } from '../types/stages';
import { Building2, LayoutGrid, ShieldCheck } from 'lucide-react';

interface ShellLayoutProps {
  projectName: string;
  activeStage: string | null;
  onStageSelect: (stageId: string) => void;
  onChangeProject?: () => void;
}

const ShellLayout: React.FC<ShellLayoutProps> = ({
  projectName,
  activeStage,
  onStageSelect,
  onChangeProject,
}) => {
  const [mainView, setMainView] = useState<'stage' | 'architecture'>('stage');

  // Map project slug
  const projectSlug = projectName.toLowerCase().includes('alien')
    ? 'proj-alien'
    : projectName.toLowerCase().includes('space')
    ? 'proj-space'
    : 'proj-titanic';

  // Live WebSocket Connection to Central API Bridge
  const { projectStatus, isConnected, telemetry, sendCommand } = useStudioSocket({
    projectId: projectSlug,
  });

  // Find active stage metadata
  const currentStageObj = stages.find((s) => s.id === activeStage) || stages[3]; // Default to Blockout

  const handleSelectFromArchitect = (stageId: string) => {
    onStageSelect(stageId);
    setMainView('stage');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Studio Header & Telemetry Bar */}
      <header className="flex items-center justify-between px-5 py-2.5 bg-slate-900 border-b border-slate-800/80 select-none flex-shrink-0">
        <div className="flex items-center space-x-3.5">
          {/* Official Arise Productions Logo Badge */}
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-amber-500/40 bg-black flex-shrink-0 shadow-md shadow-amber-500/10">
            <img
              src="/arise_productions_logo.jpg"
              alt="Arise Productions"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-widest text-slate-100 uppercase font-serif">
                ARISE PRODUCTION
              </h1>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono font-bold">
                STUDIO v1.0
              </span>
            </div>
            <p className="text-[10px] text-amber-400/80 font-mono tracking-wider uppercase">
              A PRODUCT OF THE AI CONTENT FOUNDRY, LLC
            </p>
          </div>
        </div>

        {/* Center Mode Switcher (Stage Workspace vs 3D Architectural Campus) */}
        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setMainView('stage')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded transition ${
                mainView === 'stage'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid size={13} />
              <span>Active Stage Workspace</span>
            </button>

            <button
              onClick={() => setMainView('architecture')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded transition ${
                mainView === 'architecture'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 size={13} />
              <span>3D Studio Architecture</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-400 border-l border-slate-800 pl-3">
            <span className="text-slate-500">Project:</span>
            <span className="text-slate-200 font-semibold truncate max-w-[140px]">{projectStatus.projectName}</span>
            {onChangeProject && (
              <button
                onClick={onChangeProject}
                className="text-amber-400 hover:text-amber-300 text-[11px] underline ml-1"
              >
                Switch
              </button>
            )}
          </div>
        </div>

        {/* Live Bridge Connection Indicator & Telemetry */}
        <div className="flex items-center space-x-4 text-xs">
          {telemetry && (
            <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              <span className="animate-pulse text-amber-400">⚡</span>
              <span className="text-slate-300 font-mono text-[11px]">{telemetry.message}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-md border border-slate-700">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="font-mono text-slate-300 text-[11px]">
              {isConnected ? 'BRIDGE ONLINE' : 'RECONNECTING...'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Studio Tri-Pane Body */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Rail: 10 Pipeline Stages */}
        <aside className="w-64 xl:w-72 flex-shrink-0 border-r border-slate-800 bg-slate-900/60 overflow-y-auto">
          <PipelineStages
            activeStageId={activeStage}
            projectStatus={projectStatus}
            onStageSelect={(id) => {
              onStageSelect(id);
              setMainView('stage');
            }}
          />
        </aside>

        {/* Center Workspace: Stage Workspace OR 3D Architectural Department Campus */}
        <main className="flex-grow p-0 overflow-y-auto bg-slate-950 flex flex-col">
          {mainView === 'stage' ? (
            <StageWorkspace
              stage={currentStageObj}
              projectStatus={projectStatus}
              onExecuteStage={(stageId) => sendCommand(`run stage ${stageId}`, stageId)}
            />
          ) : (
            <StudioArchitecturalView
              projectStatus={projectStatus}
              activeStageId={activeStage}
              onSelectStage={handleSelectFromArchitect}
            />
          )}
        </main>

        {/* Right Rail: Shot Manifest & Live Status Board */}
        <aside className="w-80 xl:w-96 flex-shrink-0 border-l border-slate-800 bg-slate-900/60 overflow-y-auto">
          <StatusBoard projectStatus={projectStatus} />
        </aside>
      </div>

      {/* Bottom Director Agent Bar & Legal Copyright Footer */}
      <footer className="flex-shrink-0 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md flex flex-col">
        <DirectorAgent
          activeStage={activeStage}
          onSendCommand={sendCommand}
          telemetry={telemetry}
        />
        
        {/* Bottom Attribution & Copyright Bar */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono select-none">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={12} className="text-amber-400/80" />
            <span className="text-slate-400">
              © 2026 Arise Production. A product of THE AI CONTENT FOUNDRY, LLC. All rights reserved.
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-slate-500">
            <span>Watermark Locked: ARISE PRODUCTIONS</span>
            <span>NVIDIA NIM AI: Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShellLayout;