"use client";

import React from 'react';
import { ProjectStatus, StageKey } from '../types/types';
import { stages } from '../types/stages';
import { Sparkles, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

interface StatusBoardProps {
  projectStatus: ProjectStatus;
  activeStageId?: string | null;
  activeShotNumber?: number;
  onSelectShotStage?: (shotNumber: number, stageId: string) => void;
}

const StatusBoard: React.FC<StatusBoardProps> = ({
  projectStatus,
  activeStageId,
  activeShotNumber,
  onSelectShotStage,
}) => {
  const handleCellClick = (shotNumber: number, stageId: string, stageName: string) => {
    if (onSelectShotStage) {
      toast(`🎥 Flying CineCamera to Shot ${shotNumber} → ${stageName}...`, {
        icon: '🎬',
        duration: 2000,
      });
      onSelectShotStage(shotNumber, stageId);
    }
  };

  return (
    <div className="flex flex-col p-4 space-y-4 select-none font-sans">
      {/* Header */}
      <div className="border-b border-purple-900/50 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase tracking-wider font-serif">
            Shot Status Manifest
          </h3>
          <p className="text-[11px] text-purple-300/70 mt-0.5 font-mono">
            Interactive real-time 10-stage matrix
          </p>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded bg-purple-950 text-amber-300 border border-amber-500/40 font-mono font-bold">
          LIVE LINK
        </span>
      </div>

      {/* Shot Cards */}
      <div className="space-y-3">
        {projectStatus.shots && projectStatus.shots.length > 0 ? (
          projectStatus.shots.map((shot) => {
            const isCurrentShot = activeShotNumber === shot.shotNumber;
            return (
              <div
                key={shot.shotNumber}
                className={`p-3.5 rounded-xl border transition-all duration-200 shadow-md space-y-2.5 ${
                  isCurrentShot
                    ? 'bg-[#171038] border-amber-500/60 shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'bg-[#0e0922]/90 border-purple-900/60 hover:border-purple-700/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 truncate">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${
                        isCurrentShot
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-purple-950 text-amber-300 border-purple-800/60'
                      }`}
                    >
                      Shot {shot.shotNumber}
                    </span>
                    <span className="text-xs font-semibold text-purple-100 truncate">
                      {shot.title}
                    </span>
                  </div>
                </div>

                {/* 10-Stage Interactive Micro Matrix */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1.5 border-t border-purple-900/50">
                  {stages.map((stg) => {
                    const stageKey = stg.id as StageKey;
                    const stageStatus = shot.status[stageKey];
                    const statusChar = stageStatus?.statusChar || '?';
                    const isCellActive =
                      isCurrentShot && activeStageId === stg.id;

                    return (
                      <button
                        key={stg.id}
                        type="button"
                        onClick={() =>
                          handleCellClick(shot.shotNumber, stg.id, stg.name)
                        }
                        className={`flex items-center justify-between py-1 px-2 rounded-lg text-[11px] transition text-left group ${
                          isCellActive
                            ? 'bg-gradient-to-r from-amber-500/30 via-purple-900/40 to-rose-900/30 text-white font-bold border border-amber-500/60 shadow-sm'
                            : 'hover:bg-purple-950/60 text-purple-300 hover:text-white border border-transparent'
                        }`}
                        title={`Fly camera to Shot ${shot.shotNumber} → Stage ${stg.number}: ${stg.name}`}
                      >
                        <span className="truncate pr-1 font-mono text-[10px]">
                          {stg.number}. {stg.name.split(' ')[0]}
                        </span>
                        <span className="font-mono text-xs select-none flex-shrink-0 group-hover:scale-110 transition-transform">
                          {statusChar}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-purple-400 text-xs font-mono">
            No shots registered in active project manifest.
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="p-3 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 text-[10px] text-purple-300 space-y-1.5">
        <span className="font-bold text-amber-300 uppercase tracking-wider block">
          Manifest Legend (Click any cell to navigate 3D space):
        </span>
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