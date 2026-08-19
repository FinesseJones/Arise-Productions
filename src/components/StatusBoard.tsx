"use client";

import React from 'react';
import { ProjectStatus } from '../types/types';
import { stages } from '../types/stages';

interface StatusBoardProps {
    projectStatus: ProjectStatus;
}

const StatusBoard: React.FC<StatusBoardProps> = ({ projectStatus }) => {
  // Helper to determine the background/text color based on status
  const getStatusClasses = (statusChar: '🟢' | '🟡' | '🔴' | '⚫' | '?' | undefined) => {
      if (!statusChar) return 'bg-gray-200 text-gray-700';
      switch (statusChar) {
          case '🟢': return 'bg-green-600 text-white';
          case '🟡': return 'bg-yellow-500 text-white';
          case '🔴': return 'bg-red-600 text-white';
          case '⚫': return 'bg-gray-200 text-gray-700';
          default: return 'bg-red-400 text-white'; // Fallback fail state
      }
  }

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-700">{projectStatus.title}</h2>
      <h3 className="text-sm font-semibold uppercase text-gray-500 mb-4">Shot Progression</h3>
      
      <div className="space-y-4">
        {projectStatus.shots.map((shot, index) => (
          <div key={index} className="border-b pb-2 last:border-b-0">
            <h4 className="font-semibold text-md flex justify-between items-center">
                <span>Shot {index + 1}: {shot.title}</span>
                {shot.reshoot && <span className="text-red-600 bg-red-100 px-2 py-0.5 rounded-full text-xs flex-shrink-0">⚠️ RESHOOT NEEDED</span>}
            </h4>
            
            <div className="flex flex-wrap gap-2 mt-1 text-sm">
                {stages.map((stage) => {
                    const statusChar = shot.status[stages.findIndex(s => s.id === stage.id)]?.statusChar;
                    return (
                        <span key={stage.id} className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full flex-shrink-0 ${getStatusClasses(statusChar)}`}>
                            {statusChar || '⚫'}
                        </span>
                    );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusBoard;