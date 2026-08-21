"use client";

import React, { useEffect, useState } from 'react';
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
  // Added state setter for persistence hooks
  setProjectStatus: React.Dispatch<React.SetStateAction<ProjectStatus>>; 
}

const ShellLayout: React.FC<ShellLayoutProps> = ({ projectName, activeStage, onStageSelect, projectStatus, setProjectStatus }) => {

  // Use state to manage the local storage key
  const storageKey = `wss_project_manifest_${projectName.toLowerCase().replace(/\s/g, '-')}`;

  // --- Persistance Hook: Load Status on Mount ---
  useEffect(() => {
    // Attempt to load state from local storage when the component mounts
    try {
      const savedStatus = localStorage.getItem(storageKey);
      if (savedStatus) {
        // We assume the saved data structure is correctly cast to ProjectStatus
        const loadedProjectStatus: ProjectStatus = JSON.parse(savedStatus);
        console.log(`[Persistence] Successfully loaded project status from local storage.`);
        // Use Functional Update to safely set the state derived from local storage
        setProjectStatus(loadedProjectStatus);
      } else {
        console.log(`[Persistence] No existing manifest found for ${projectName}. Starting fresh.`);
      }
    } catch (error) {
      console.error("[Persistence] Could not load project status:", error);
    }
  }, [storageKey, setProjectStatus, projectName]);


  // --- Persistance Hook: Save Status on Change ---
  useEffect(() => {
    // This effect runs every time the projectStatus changes (due to commands, etc.)
    try {
      const statusToSave = JSON.stringify(projectStatus);
      localStorage.setItem(storageKey, statusToSave);
      console.log(`[Persistence] Project status saved successfully to local storage.`);
    } catch (error) {
      console.error("[Persistence] Failed to save project status:", error);
    }
  }, [projectStatus, storageKey]);


  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      {/* Main Content Area (Left + Center + Right) */}
      <div className="flex flex-grow overflow-hidden">
        
        {/* Left Rail: Pipeline Stages */}
        {/* The props must now be passed down to handle status updates */}
        <div className="w-1/5 xl:w-1/6 flex-shrink-0 border-r border-gray-200 bg-white">
          <PipelineStages onStageSelect={onStageSelect} />
        </div>

        {/* Center Area: Active Tool Workspace */}
        <div className="flex-grow p-0 overflow-y-auto bg-white">
          {/* Use the new dynamically rendered StageWorkspace component */}
          {activeStage ? (
            <StageWorkspace stage={activeStage} /> 
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
      <DirectorAgent setProjectStatus={setProjectStatus} />
    </div>
  );
};

export default ShellLayout;