"use client";

import React from 'react';
import { Stage } from '../types/stages';

interface StageWorkspaceProps {
    stage: Stage;
}

const StageWorkspace: React.FC<StageWorkspaceProps> = ({ stage }) => {
    
    const getStageDescription = (stageName: string) => {
        switch(stageName) {
            case 'ScriptBreak':
                return "The centralized scene bible, shot list manifest, and character profiles. Your prompts and story structure begin here.";
            case 'Cork Board':
                return "The visual outline of the entire story, showing act breaks, character arcs, and sequence flow. This drives the project's emotional landscape.";
            case 'Master Canvas':
                return "The ultimate handoff bundle. All key assets, mood boards, and continuity prompts are aggregated here for the creative team.";
            case 'Blockout':
                return "Detailed visual blocking: camera movement, character choreography, and rough scene layouts. This stage validates the feasibility of the shot before shooting.";
            case 'Storybook Reference Studio':
                return "The visual bible for the look and feel. This stage contains approved boards, animatics, and generative prompt examples.";
            case 'Slate':
                return "The core prompt generator. Ensuring continuity-locked prompts for every video, image, and music element across the shoot.";
            case 'Circle Take':
                return "The daily review hub. Footage review, quality assurance, picking the best takes, and flagging required reshoots.";
            case 'Stem Studio':
                return "Separating the sonic elements. Dialogue, music, and SFX are processed and delivered as clean audio stems.";
            case 'DaVinci MCP':
                return "The final assembly point. Agent-driven cutting, color grading, and mastering within the NLE system.";
            case 'Shell':
                return "The orchestrator. Manages the timeline, project state, and inter-tool handoffs.";
            default:
                return "General pipeline functions and raw data linking.";
        }
    }

    const renderContent = () => {
        const stageName = stage.name;
        
        if (stageName === 'Blockout') {
            return (
                <div className="grid grid-cols-3 gap-6 h-64">
                    {/* Camera/Shot Placeholder */}
                    <div className="col-span-2 bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400 relative overflow-hidden rounded-lg">
                        <div className="absolute inset-0 bg-repeat opacity-5 pointer-events-none" style="background-image: radial-gradient(#ccc 1px, transparent 1px), radial-gradient(#ccc 1px, transparent 1px); background-size: 20px 20px; background-position: 0 0, 10px 10px;"></div>
                        <div className="p-4 text-center bg-white/80">
                            <p className='text-xl font-bold text-blue-700'>Scene 3: Protagonist Conflict</p>
                            <p className='text-sm text-gray-600 mt-1'>Primary Viewport (Camera Angle: Wide, Action)</p>
                        </div>
                    </div>
                    {/* Camera Controls Panel */}
                    <div className="bg-white p-4 border rounded-lg shadow-sm flex flex-col space-y-3">
                        <h5 className="text-lg font-semibold text-gray-700">Camera Controls</h5>
                        <label className="text-sm block">Angle:</label>
                        <select className="border p-1 rounded block text-sm w-full focus:ring-blue-500">
                            <option>Low Angle / Ground</option>
                            <option selected>Eye Level / Cinematic</option>
                            <option>High Angle / God's Eye</option>
                        </select>
                        <label className="text-sm block pt-2">Lens Type:</label>
                        <select className="border p-1 rounded block text-sm w-full focus:ring-blue-500">
                            <option selected>35mm Standard</option>
                            <option>24mm Wide</option>
                            <option>85mm Telephoto</option>
                        </select>
                        <button className="mt-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition">Re-solve Camera Path</button>
                    </div>
                </div>
            );
        }
        
        // General default content
        return (
            <div className='p-4 bg-gray-50 rounded-lg text-center text-gray-500'>
                <p>This area contains the visual assets, reference footage, and interactive tools specific to the {stageName} stage. Please select a stage to see its specialized dashboard.</p>
            </div>
        );
    }


    return (
        <div className="p-4">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div onClick={() => console.log('Simulation click')}>
                    <h3 className="text-3xl font-extrabold text-gray-800">{stage.name} Workspace</h3>
                    <p className="text-gray-500 mt-1">{getStageDescription(stage.name)}</p>
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
                    ⚙️ Access Tool Backend
                </button>
            </div>

            {/* Specific Content Renderer */}
            <div className="min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default StageWorkspace;