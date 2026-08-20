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
        let content = null;
        const isBlockout = stage.name === 'Blockout';

        if (stage.name === 'Blockout') {
            content = (
                <div className="grid grid-cols-12 gap-6 h-[600px]">
                    {/* Column 1 & 2: Main Viewport (W/2) */}
                    <div className="col-span-12 lg:col-span-8 bg-gray-100 border border-gray-300 flex flex-col rounded-lg overflow-hidden">
                        <div className="h-3/4 flex items-center justify-center text-gray-400 relative">
                            {/* Simulated Camera View */}
                            <div className="absolute inset-0 bg-repeat opacity-5 pointer-events-none" style="background-image: radial-gradient(#ccc 1px, transparent 1px), radial-gradient(#ccc 1px, transparent 1px); background-size: 20px 20px; background-position: 0 0, 10px 10px;"></div>
                            <div className="p-6 text-center bg-white/80 border-b border-gray-300 z-10">
                                <p className='text-2xl font-bold text-blue-700'>Shot 3/Take 2 - Protagonist Corner</p>
                                <p className='text-sm text-gray-600 mt-1'>Camera: Dolly Zoom / Angle: Eye Level / Focus: Character</p>
                            </div>
                        </div>

                        {/* Simulated Camera Controls */}
                        <div className="h-1/4 p-4 border-t bg-white flex flex-col space-y-3">
                            <h5 className="text-lg font-semibold text-gray-700">Camera Controls & Markers</h5>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className=''>
                                    <label className="block text-gray-500 text-xs uppercase">Lens</label>
                                    <select className="border p-1 rounded block w-full focus:ring-blue-500">
                                        <option selected>35mm Standard</option>
                                    </select>
                                </div>
                                <div className=''>
                                    <label className="block text-gray-500 text-xs uppercase">Stabilization</label>
                                    <select className="border p-1 rounded block w-full focus:ring-blue-500 text-green-600">
                                        <option selected>ACTIVE (Digital Gyros)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button className="flex-grow py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition">Re-solve Camera Path</button>
                                <button className="flex-grow py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">Lock Shot & Mark</button>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Assets/File Browser (W/12) */}
                    <div className="col-span-12 lg:col-span-4 bg-white p-5 border rounded-lg shadow-lg flex flex-col">
                        <h5 className="text-xl font-bold mb-4 text-gray-700 flex items-center">
                            <span className="mr-2 text-blue-600">📁</span> Project Asset Manifest
                        </h5>
                        <div className="flex-grow overflow-y-auto space-y-2 text-sm">
                            {['Shot 3_Take_1_RAW.mov', 'Lens_data.json', 'Character_A_Moodboard.pdf'].map((file, index) => (
                                <div key={index} className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer">
                                    <span className={`mr-3 text-lg ${file.endsWith('.mov') ? 'text-red-600' : 'text-blue-600'}`}>
                                        {file.endsWith('.mov') ? '🎥' : '📄'}
                                    </span>
                                    <span className='flex-grow font-medium text-gray-700'>{file}</span>
                                    <span className='text-xs text-gray-400'>3K / 12fps</span>
                                </div>
                            ))}
                        </div>
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
            <div className="min-h-[500px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default StageWorkspace;