"use client";

import React, { useState } from 'react';
import { Stage } from '../types/stages';
import { ProjectStatus, StageKey } from '../types/types';
import { Play, Sparkles, Sliders, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Interactive3DRoom from './3d/Interactive3DRoom';
import RoomAIChat from './RoomAIChat';

interface StageWorkspaceProps {
  stage: Stage;
  projectStatus: ProjectStatus;
  onExecuteStage?: (stageId: string) => void;
}

const StageWorkspace: React.FC<StageWorkspaceProps> = ({
  stage,
  projectStatus,
  onExecuteStage,
}) => {
  const [selectedShot, setSelectedShot] = useState<number>(1);

  const stageKey = stage.id as StageKey;
  const currentShot = projectStatus.shots?.find((s) => s.shotNumber === selectedShot) || projectStatus.shots?.[0];
  const shotStageStatus = currentShot?.status?.[stageKey]?.statusChar || '?';

  const handleRunStage = () => {
    if (onExecuteStage) {
      toast.loading(`Dispatching job for ${stage.name} (Shot ${selectedShot})...`, { duration: 1500 });
      onExecuteStage(stage.id);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-5 space-y-4 select-none font-sans bg-slate-950">
      {/* Top Stage & Format Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800 flex-shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2.5">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">
              STAGE {stage.number} / 10
            </span>
            <h2 className="text-xl font-black text-slate-100 tracking-tight uppercase font-serif">
              {stage.name}
            </h2>
            <span className="text-base">{shotStageStatus}</span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl truncate">{stage.description}</p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Shot Selector */}
          <select
            value={selectedShot}
            onChange={(e) => setSelectedShot(Number(e.target.value))}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
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
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-lg transition shadow-md shadow-amber-500/10 text-xs uppercase tracking-wider"
          >
            <Play size={13} fill="currentColor" />
            <span>Dispatch Worker</span>
          </button>
        </div>
      </div>

      {/* Main Futuristic 3D Studio Split: 3D Spatial Canvas (Left) + Specialized Room AI Co-Pilot (Right) */}
      <div className="grid grid-cols-12 gap-4 flex-grow overflow-hidden min-h-0">
        {/* Left/Center: Interactive 3D Spatial Soundstage / Lab */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col min-h-0">
          <Interactive3DRoom
            stageId={stageKey}
            roomName={stage.name}
            projectName={projectStatus.projectName}
            shotNumber={selectedShot}
          />
        </div>

        {/* Right: Specialized Room AI Co-Pilot Chat */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4 flex flex-col min-h-0">
          <RoomAIChat
            stageId={stageKey}
            roomName={stage.name}
            projectName={projectStatus.projectName}
            shotNumber={selectedShot}
          />
        </div>
      </div>
    </div>
  );
};

export default StageWorkspace;