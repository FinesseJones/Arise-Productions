"use client";

import React from 'react';
import PipelineStages from './PipelineStages';
import StatusBoard from './StatusBoard';
import DirectorAgent from './DirectorAgent';
import StageWorkspace from './StageWorkspace';
import { ProjectStatus } from '../types/types';

interface ShellLayoutProps {
  projectName: string;
  activeStage: string | null; 
  onStageSelect: (stageId: string) => void;
  projectStatus: ProjectStatus;
}

const ShellLayout: React.FC<ShellLayoutProps> = ({ projectName, activeStage, onStageSelect, projectStatus }) => {
  
  // Find the full stage object based on the active stage ID
  const activeStageDetails = React.useMemo(() => {
    // In a real app, we would cache this, but for now, we map it here.
    // Note: Need to assume 'stages' is available or pass it down, let's assume the name match is enough for now.
    const stageId = activeStage ? activeStage.toLowerCase().includes('script') ? 'script' : activeStage.toLowerCase().includes('structure') ? 'structure' : activeStage.toLowerCase().includes('plan') ? 'plan' : 'previs';
    return { 
        id: stageId, 
        name: activeStage ? activeStage.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') : 'Shell',
        description: 'The unified studio shell architecture.'
    };
  }, [activeStage]);


  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      {/* Main Content Area (Left + Center + Right) */}
      <div className="flex flex-grow overflow-hidden">
        
        {/* Left Rail: Pipeline Stages */}
        <div className="w-1/5 xl:w-1/6 flex-shrink-0 border-r border-gray-200 bg-white">
          <PipelineStages onStageSelect={onStageSelect} />
        </div>

        {/* Center Area: Active Tool Workspace */}
        <div className="flex-grow p-0 overflow-y-auto bg-white">
          {/* Use the new component */}
          {activeStage ? (
            <StageWorkspace stage={activeStage}> 
            </StageWorkspace>
          ) : (
            <div className="p-8 text-center text-yellow-700">
                <h3 className="text-xl font-semibold">💡 Welcome to the Studio Shell</h3>
                <p className="mt-2">Please select a pipeline stage on the left to activate its workspace view and begin development. </p>
            </div>
          )}
        </div>

        {/* Right Rail: Shot Board Status */}
        <div className="w-1/5 xl:w-1/6 flex-shrink-0 border-l border-gray-200 bg-gray-50 overflow-y-auto">
          <StatusBoard projectStatus={projectStatus} />
        </div>
      </div>

      {/* Bottom Director Agent Bar */}
      <DirectorAgent setProjectStatus={/* No change needed, passed dynamically */} />
    </div>
  );
};

export default ShellLayout;