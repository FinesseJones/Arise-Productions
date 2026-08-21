"use client";

import React, { useEffect, useState, useCallback } from 'react';
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
  setProjectStatus: React.Dispatch<React.SetStateAction<ProjectStatus>>; 
}

const ShellLayout: React.FC<ShellLayoutProps> = ({ projectName, activeStage, onStageSelect, projectStatus, setProjectStatus }) => {

  // Use state to manage the local storage key
  const storageKey = `wss_project_manifest_${projectName.toLowerCase().replace(/\s/g, '-')}`;

  // --- 1. Persistence Hooks (Load/Save) ---
  useEffect(() => {
    const saveStatus = () => {
        try {
          const statusToSave = JSON.stringify(projectStatus);
          localStorage.setItem(storageKey, statusToSave);
          console.log(`[Persistence] Project status saved successfully.`);
        } catch (error) {
          console.error("[Persistence] Failed to save project status:", error);
        }
    };
    // Dependency array includes projectStatus and projectName to save on key changes
    saveStatus(); 
    // Optional: Add an interval save for true data loss prevention
    const saveInterval = setInterval(saveStatus, 10000); // Save every 10 seconds

    return () => clearInterval(saveInterval);
  }, [projectStatus, storageKey]);


  // --- 2. File System Watcher Simulation Hook ---
  useEffect(() => {
    // Set up an interval to simulate polling a file system directory (the 'Project Manifest')
    const intervalId = setInterval(() => {
        console.log("[System Monitor] Running File System Watcher Check...");
        // *** SIMULATION LOGIC: Here is where the actual file system access simulation would happen ***

        // For demonstration, we simulate a random status update for Shot 2 (index 1)
        // simulating that an automated process (e.g., Audio processing) just completed.
        setProjectStatus(prevStatus => {
            const updatedShots = [...prevStatus.shots];
            const updatedShot = { ...updatedShots[1] };

            // Assume some random change happened to the Sound status (Stage 8)
            // We simulate an update that shifts the status from Yellow (🟡) to Green (🟢)
            const newAudioStatus = { statusChar: '🟢' };
            updatedShot.status = {
                ...updatedShot.status,
                'sound': newAudioStatus
            };
            updatedShots[1] = updatedShot;
            
            console.log("[System Monitor] Simulated automatic update: Shot 2 sound assets found and locked.");
            return { ...prevStatus, shots: updatedShots };
        });

    }, 15000); // Check every 15 seconds

    // Cleanup function
    return () => clearInterval(intervalId);
  }, [setProjectStatus]);


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
    </div >
  );
};

export default ShellLayout;