"use client";

import React from 'react';
import { ProjectStatus, StageKey } from '../types/types';
import { stages } from '../types/stages';

interface StatusBoardProps {
  projectStatus: ProjectStatus;
}

const StatusBoard: React.FC<StatusBoardProps> = ({ projectStatus }) => {
  return (
    <div className="flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Shot Status Manifest
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time completion tracking across all shots
        </p>
      </div>

      {/* Shot Cards */}
      <div className="space-y-3">
        {projectStatus.shots && projectStatus.shots.length > 0 ? (
          projectStatus.shots.map((shot) => (
            <div
              key={shot.shotNumber}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 truncate">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-[11px] font-bold border border-slate-700">
                    Shot {shot.shotNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {shot.title}
                  </span>
                </div>
              </div>

              {/* 10-Stage Micro Matrix */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1.5 border-t border-slate-800/80">
                {stages.map((stg) => {
                  const stageKey = stg.id as StageKey;
                  const stageStatus = shot.status[stageKey];
                  const statusChar = stageStatus?.statusChar || '?';

                  return (
                    <div
                      key={stg.id}
                      className="flex items-center justify-between py-0.5 px-1.5 rounded hover:bg-slate-800/50 text-[11px]"
                    >
                      <span className="text-slate-400 truncate pr-1">
                        {stg.number}. {stg.name.split(' ')[0]}
                      </span>
                      <span className="font-mono text-xs select-none">{statusChar}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-slate-500 text-xs">
            No shots registered in active project manifest.
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 space-y-1.5">
        <span className="font-bold text-slate-300 uppercase tracking-wider block">Legend:</span>
        <div className="grid grid-cols-2 gap-1 font-mono">
          <span className="flex items-center gap-1">🟢 Complete</span>
          <span className="flex items-center gap-1">🟡 In Progress</span>
          <span className="flex items-center gap-1">🔴 Blocked / Error</span>
          <span className="flex items-center gap-1">⚪ Unstarted</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBoard;