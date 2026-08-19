"use client";

import React from 'react';
import PipelineStages from './PipelineStages';
import StatusBoard from './StatusBoard';
import DirectorAgent from './DirectorAgent';

interface ShellLayoutProps {
  projectName: string;
  onProjectSelect: (projectName: string) => void;
}

const ShellLayout: React.FC<ShellLayoutProps> = ({ projectName, onProjectSelect }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      {/* Main Content Area (Left + Center + Right) */}
      <div className="flex flex-grow overflow-hidden">
        
        {/* Left Rail: Pipeline Stages */}
        <div className="w-1/5 xl:w-1/6 flex-shrink-0 border-r border-gray-200 bg-white">
          <PipelineStages />
        </div>

        {/* Center Area: Active Tool Workspace */}
        <div className="flex-grow p-8 overflow-y-auto bg-white">
          <h2 className="text-2xl font-bold text-gray-700">Project: {projectName || 'Select Project'}</h2>
          <div className="mt-4 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">🎬 Active Stage Workspace</h3>
            <p className="text-sm text-blue-600/80">
              (Click a stage on the left to view its workspace, MCP view, or launch button here.)
            </p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
                Initialize & Open Tool
            </button>
          </div>
        </div>

        {/* Right Rail: Shot Board Status */}
        <div className="w-1/5 xl:w-1/6 flex-shrink-0 border-l border-gray-200 bg-gray-50 overflow-y-auto">
          <StatusBoard />
        </div>
      </div>

      {/* Bottom Director Agent Bar */}
      <div className="border-t border-gray-200 bg-white p-3 shadow-lg flex-shrink-0">
        {/* The director agent will be implemented here */}
        <DirectorAgent />
      </div>
    </div>
  );
};

export default ShellLayout;