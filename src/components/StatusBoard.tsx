"use client";

import React from 'react';
import { ProjectStatus } from '../types/types';

const StatusBoard: React.FC = () => {
  // Simulated status data for demonstration
  const projectStatus: ProjectStatus = {
    title: "Project Status: The Great Adventure",
    shots: [
      { shotId: "S-001", title: "Opening Shot (City)", status: ['🟡', '🟢', '🟢', '⚫', '🔴', '🟢', '🟡'], reshoot: false },
      { shotId: "S-002", title: "Protagonist Intro", status: ['🟢', '🟢', '🟢', '🟢', '🟢', '🟢'], reshoot: false },
      { shotId: "S-003", title: "Conflict Setup (Mountain)", status: ['🟢', '🟡', '🔴', '⚫', '🟡', '🟡'], reshoot: true },
      { shotId: "S-004", title: "Climax (Chase)", status: ['🟡', '⚫', '🟢', '🟡', '🟢', '⚫'], reshoot: false },
    ],
  };

  // Helper to translate status char to color/text
  const getStatusText = (statusChar: string) => {
      switch (statusChar) {
          case '🟢': return 'Complete';
          case '🟡': return 'Needs Review';
          case '🔴': return 'Failed / Reshoot';
          case '⚫': return 'Pending';
          default: return '';
      }
  }

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-700">{projectStatus.title}</h2>
      <h3 className="text-sm font-semibold uppercase text-gray-500 mb-4">Shot Progression</h3>
      
      {/* Status Table Simulation */}
      <div className="space-y-4">
        {projectStatus.shots.map((shot, index) => (
          <div key={index} className="border-b py-3">
            <h4 className="font-semibold text-md flex justify-between items-center">
                <span>Shot {index + 1}: {shot.title}</span>
                {shot.reshoot && <span className="text-red-600 bg-red-100 px-2 py-0.5 rounded-full text-xs">⚠️ RESHOOT NEEDED</span>}
            </h4>
            
            <div className="flex flex-wrap gap-2 mt-1 text-sm">
                {/* Mapping to the 10 stages must happen here */}
                {/* Simulating: 1 Script, 2 Structure, 3 Plan, 4 Previs, 5 Motion, 6 Boards, 7 Prompt, 8 Dailies, 9 Sound, 10 Edit */}
                {['SCRIPT', 'STRUCTURE', 'PLAN', 'PREVIS', 'MOTION', 'BOARDS', 'PROMPT', 'DAILIES', 'SOUND', 'EDIT'].map((stageKey, i) => (
                    <span key={`${index}-${i}`} className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full transition-transform transform ${
                        'bg-gray-200 text-gray-700' // Default pending color
                    } ${
                        shot.status[i] === '🟢' ? 'bg-green-500 text-white' : 
                        shot.status[i] === '🟡' ? 'bg-yellow-500 text-white' : 
                        shot.status[i] === '🔴' ? 'bg-red-500 text-white' : 'bg-gray-200'
                    }`}>
                        {shot.status[i] || '⚫'}
                    </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusBoard;