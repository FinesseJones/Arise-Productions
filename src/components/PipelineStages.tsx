"use client";

import React from 'react';
import { ProjectStatus } from '../types/types';

interface PipelineStagesProps {
    projectStatus: ProjectStatus;
    onStageSelect: (stageId: string) => void;
}

// Map of Stage IDs to display names
const STAGE_MAP = [
    { key: 'ScriptBreak', label: '1. Script' },
    { key: 'Cork Board', label: '2. Structure' },
    { key: 'Master Canvas', label: '3. Plan' },
    { key: 'Blockout', label: '4. Previs' },
    { key: 'Storybook Reference Studio', label: '5. Boards' },
    { key: 'Slate', label: '6. Prompt' },
    { key: 'Circle Take', label: '7. Dailies' },
    { key: 'Stem Studio', label: '8. Sound' },
    { key: 'DaVinci MCP', label: '9. Edit' },
    { key: 'Shell', label: '10. Edit/Finish' },
];

const PipelineStages: React.FC<PipelineStagesProps> = ({ projectStatus, onStageSelect }) => {

    // Determine the overall status color/state for a given stage ID
    const getStageState = (stageId: keyof ProjectStatus) => {
        const firstShotStatus = projectStatus.shots[0]?.status[stageId];
        if (!firstShotStatus) {
            return 'gray'; // Never started
        }

        // Check all shots to determine overall stage health
        let hasSuccess = false;
        let hasFailure = false;
        
        projectStatus.shots.forEach(shot => {
            const status = shot.status[stageId];
            if (status?.statusChar === '🟢') {
                hasSuccess = true;
            }
            if (status?.statusChar === '🔴') {
                hasFailure = true;
            }
        });

        if (hasFailure) return 'fail';
        if (hasSuccess) return 'success';
        return 'progress'; // At least started (🟡)
    };

    const getStageClasses = (stageId: keyof ProjectStatus) => {
        const state = getStageState(stageId);
        let ring = 'ring-gray-200';
        let titleColor = 'text-gray-600';

        switch (state) {
            case 'success':
                ring = 'ring-green-500';
                titleColor = 'text-green-600';
                break;
            case 'fail':
                ring = 'ring-red-500';
                titleColor = 'text-red-600';
                break;
            case 'progress':
                ring = 'ring-yellow-500';
                titleColor = 'text-yellow-600';
                break;
            case 'gray':
            default:
                ring = 'ring-gray-300';
                titleColor = 'text-gray-500';
                break;
        }
        return `${ring} ${titleColor}`;
    }

    return (
        <div className="flex flex-col space-y-2 p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Pipeline Stages</h2>
            {STAGE_MAP.map(stage => {
                const stageId = stage.key as keyof ProjectStatus;
                const stateClass = getStageClasses(stageId);
                
                return (
                    <button 
                        key={stage.key} 
                        onClick={() => onStageSelect(stage.key)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-150 border-l-4 ${stateClass} hover:bg-blue-50/50`}
                        style={{ 
                            backgroundColor: 'white', 
                            borderColor: 
                                stateId === 'Blockout' ? 
                                    '#3b82f6' : // Blue-500 border for the current blue background simulation
                                    'transparent'
                        }}
                    >
                         <span className="mr-2">{stage.label}</span>
                         {/* Optional: Add a small status indicator dot here if needed */}
                    </button>
                );
            })}
        </div>
    );
};

export default PipelineStages;