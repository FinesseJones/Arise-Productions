"use client";

import React, { useState } from 'react';
import { Stage } from '../types/stages';
import { ProjectStatus, StageKey } from '../types/types';
import { Play, Sparkles, Sliders, ShieldCheck, Columns, Maximize2, Minimize2, PanelLeftClose, PanelRightClose } from 'lucide-react';
import toast from 'react-hot-toast';
import Interactive3DRoom from './3d/Interactive3DRoom';
import RoomAIChat from './RoomAIChat';

interface StageWorkspaceProps {
  stage: Stage;
  projectStatus: ProjectStatus;
  onExecuteStage?: (stageId: string) => void;
  selectedShot?: number;
  onSelectShot?: (shotNumber: number) => void;
}

const StageWorkspace: React.FC<StageWorkspaceProps> = ({
  stage,
  projectStatus,
  onExecuteStage,
  selectedShot,
  onSelectShot,
}) => {
  const [internalShot, setInternalShot] = useState<number>(1);
  const activeShot = selectedShot !== undefined ? selectedShot : internalShot;
  const [layoutMode, setLayoutMode] = useState<'split' | 'canvas-focus' | 'chat-focus'>('split');

  const stageKey = stage.id as StageKey;
  const currentShot = projectStatus.shots?.find((s) => s.shotNumber === activeShot) || projectStatus.shots?.[0];
  const shotStageStatus = currentShot?.status?.[stageKey]?.statusChar || '?';

  const handleShotChange = (shotNum: number) => {
    if (onSelectShot) onSelectShot(shotNum);
    else setInternalShot(shotNum);
  };

  const handleRunStage = () => {
    if (onExecuteStage) {
      toast.loading(`Dispatching job for ${stage.name} (Shot ${selectedShot})...`, { duration: 1500 });
      onExecuteStage(stage.id);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 lg:p-6 space-y-4 select-none font-sans bg-[#080512]">
      {/* Top Stage & Format Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-purple-900/50 flex-shrink-0">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-rose-300 font-mono text-[10px] font-extrabold border border-purple-800/60 shadow-sm">
              STAGE {stage.number} OF 10
            </span>
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-rose-200 to-amber-100 tracking-tight uppercase font-serif">
              {stage.name}
            </h2>
            <span className="text-base select-none">{shotStageStatus}</span>
          </div>
          <p className="text-xs text-purple-300/70 max-w-xl truncate">{stage.description}</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Layout Mode Switcher */}
          <div className="hidden sm:flex bg-[#140e2e] p-1 rounded-xl border border-purple-900/60 text-xs font-mono">
            <button
              onClick={() => setLayoutMode('canvas-focus')}
              title="Focus Script / 3D Canvas"
              className={`p-1.5 rounded-lg transition ${layoutMode === 'canvas-focus' ? 'bg-purple-700 text-white' : 'text-purple-400 hover:text-white'}`}
            >
              <PanelRightClose size={14} />
            </button>
            <button
              onClick={() => setLayoutMode('split')}
              title="Balanced Split (50/50)"
              className={`p-1.5 rounded-lg transition ${layoutMode === 'split' ? 'bg-purple-700 text-white' : 'text-purple-400 hover:text-white'}`}
            >
              <Columns size={14} />
            </button>
            <button
              onClick={() => setLayoutMode('chat-focus')}
              title="Focus AI Co-Pilot Chat"
              className={`p-1.5 rounded-lg transition ${layoutMode === 'chat-focus' ? 'bg-purple-700 text-white' : 'text-purple-400 hover:text-white'}`}
            >
              <PanelLeftClose size={14} />
            </button>
          </div>

          {/* Shot Selector */}
          <select
            value={activeShot}
            onChange={(e) => handleShotChange(Number(e.target.value))}
            className="px-3 py-2 bg-[#140e2e] border border-purple-800/60 rounded-xl text-purple-100 text-xs font-mono focus:outline-none focus:border-rose-500 shadow-sm"
          >
            {projectStatus.shots?.map((s) => (
              <option key={s.shotNumber} value={s.shotNumber}>
                Shot {s.shotNumber}: {s.title}
              </option>
            ))}
          </select>

          {/* Dispatch to MCP Worker Button */}
          <button
            onClick={handleRunStage}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-extrabold rounded-xl transition shadow-lg shadow-rose-600/25 text-xs uppercase tracking-wider flex-shrink-0"
          >
            <Play size={13} fill="currentColor" />
            <span>Dispatch Worker</span>
          </button>
        </div>
      </div>

      {/* Main Futuristic 3D Studio Split: 3D Spatial Canvas (Left) + Specialized Room AI Co-Pilot (Right) */}
      <div className="grid grid-cols-12 gap-4 flex-grow overflow-hidden min-h-0">
        {/* Left/Center: Interactive 3D Spatial Soundstage / Screenplay Studio */}
        <div
          className={`flex flex-col min-h-0 transition-all duration-200 ${
            layoutMode === 'canvas-focus'
              ? 'col-span-12 lg:col-span-9 xl:col-span-9'
              : layoutMode === 'chat-focus'
              ? 'col-span-12 lg:col-span-4 xl:col-span-4'
              : 'col-span-12 lg:col-span-7 xl:col-span-7'
          }`}
        >
          <Interactive3DRoom
            stageId={stageKey}
            roomName={stage.name}
            projectName={projectStatus.projectName}
            shotNumber={activeShot}
            shotTitle={currentShot?.title}
            shotDescription={currentShot?.description}
            onSelectShot={handleShotChange}
          />
        </div>

        {/* Right: Specialized Room AI Co-Pilot Chat */}
        <div
          className={`flex flex-col min-h-0 transition-all duration-200 ${
            layoutMode === 'canvas-focus'
              ? 'col-span-12 lg:col-span-3 xl:col-span-3'
              : layoutMode === 'chat-focus'
              ? 'col-span-12 lg:col-span-8 xl:col-span-8'
              : 'col-span-12 lg:col-span-5 xl:col-span-5'
          }`}
        >
          <RoomAIChat
            stageId={stageKey}
            roomName={stage.name}
            projectName={projectStatus.projectName}
            shotNumber={activeShot}
          />
        </div>
      </div>
    </div>
  );
};

export default StageWorkspace;