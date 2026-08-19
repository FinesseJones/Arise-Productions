"use client";

import React from 'react';
import PipelineStages from './PipelineStages';
import StatusBoard from './StatusBoard';
import DirectorAgent from './DirectorAgent';
// Assume we receive the active stage details via props
interface ShellLayoutProps {
  projectName: string;
  activeStage: string | null; // Passed from App.tsx
}

const ShellLayout: React.FC<ShellLayoutProps> = ({ projectName, activeStage }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      {/* Main Content Area (Left + Center + Right) */}
      <div className="flex flex-grow overflow-hidden">
        
        {/* Left Rail: Pipeline Stages */}
        <div className="w-1/5 xl:w-1/6 flex-shrink-0 border-r border-gray-200 bg-white">
          <PipelineStages />
        </div>

        {/* Center Area: Active Tool Workspace */}
        <div className="flex-grow p-8 relative overflow-y-auto bg-white">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Project: {projectName}</h2>
          
          {activeStage ? (
            <div className="p-8 border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl shadow-inner">
                <h3 className="text-3xl font-bold text-blue-800 mb-3">{activeStage.replace(' ', '')} Workspace</h3>
                <p className="text-lg text-gray-600">
                    [Viewing active MCP interface for {activeStage}. Files for this stage are in the /0{stageIndex}-stage/ folder.]
                </p>
                <button className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
                    🚀 Open {activeStage} Tool
                </button>
            </div>
          ) : (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">💡 Welcome to the Studio Shell</h3>
                <p className="text-yellow-700/80">Please select a pipeline stage on the left to activate its workspace view and begin development.</p>
            </div>
          )}
        </div>

        {/* Right Rail: Shot Board Status */}
        <div className="w-1/5 xl:w-1/6 flex-shrink-0 border-l border-gray-200 bg-gray-50 overflow-y-auto">
          <StatusBoard />
        </div>
      </div>

      {/* Bottom Director Agent Bar */}
      <DirectorAgent />
    </div>
  );
};

export default ShellLayout;