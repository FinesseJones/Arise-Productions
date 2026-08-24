"use client";

import React from 'react';
import { ProjectStatus, StageKey } from '../types/types';
import { stages } from '../types/stages';

interface PipelineStagesProps {
  projectStatus: ProjectStatus;
  activeStageId: string | null;
  onStageSelect: (stageId: string) => void;
}

const PipelineStages: React.FC<PipelineStagesProps> = ({
  projectStatus,
  activeStageId,
  onStageSelect,
}) => {
  // Determine overall health for a stage across all shots
  const getStageHealth = (stageId: StageKey) => {
    if (!projectStatus.shots || projectStatus.shots.length === 0) {
      return { statusChar: '?', color: 'text-slate-500', bg: 'bg-slate-800', border: 'border-slate-800' };
    }

    let hasSuccess = false;
    let hasProgress = false;
    let hasFailure = false;

    projectStatus.shots.forEach((shot) => {
      const record = shot.status[stageId];
      if (record?.statusChar === '🟢') hasSuccess = true;
      if (record?.statusChar === '🟡') hasProgress = true;
      if (record?.statusChar === '🔴') hasFailure = true;
    });

    if (hasFailure) {
      return { statusChar: '🔴', color: 'text-rose-400', bg: 'bg-rose-950/30', border: 'border-rose-500/40' };
    }
    if (hasSuccess && !hasProgress) {
      return { statusChar: '🟢', color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-500/40' };
    }
    if (hasProgress || hasSuccess) {
      return { statusChar: '🟡', color: 'text-amber-400', bg: 'bg-amber-950/30', border: 'border-amber-500/40' };
    }
    return { statusChar: '⚪', color: 'text-slate-500', bg: 'bg-slate-900', border: 'border-slate-800' };
  };

  return (
    <div className="flex flex-col p-3 space-y-1.5">
      <div className="px-2 py-2 mb-1">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Production Pipeline
        </h2>
        <p className="text-[11px] text-slate-500">10 MCP Core Stages</p>
      </div>

      {stages.map((stg) => {
        const stageKey = stg.id as StageKey;
        const health = getStageHealth(stageKey);
        const isActive = activeStageId === stg.id;

        return (
          <button
            key={stg.id}
            onClick={() => onStageSelect(stg.id)}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 flex items-center justify-between border ${
              isActive
                ? 'bg-gradient-to-r from-purple-900/50 via-[#1e1245] to-rose-950/40 border-purple-500 text-purple-100 shadow-md shadow-purple-500/15'
                : 'hover:bg-purple-950/30 border-transparent text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <span className="font-mono text-[10px] text-rose-400 font-extrabold w-4 flex-shrink-0">
                {stg.number}
              </span>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold truncate leading-tight">
                  {stg.name}
                </span>
                <span className="text-[10px] text-purple-300/60 truncate">
                  {stg.endpoint}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
              <span className="text-xs select-none">{health.statusChar}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PipelineStages;