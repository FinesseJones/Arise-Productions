"use client";

import React from 'react';
import { Stage } from '../types/stages';
import 3DArchitecturalEditor from './3DArchitecturalEditor'; // Import the new 3D editor

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
                <div className="col-span-12 lg:col-span-12">
                    {/* We are replacing the massive simulation grid with the dedicated 3D editor component */}
                    <div className='h-[600px]'>
                        <3DArchitecturalEditor shotTitle="Shot 3/Take 2 - Protagonist Corner" />
                    </div>
                </div>
            );
        } else {
             // General default content
            content = (
                <div className='p-4 bg-gray-50 rounded-lg text-center text-gray-500'>
                    <p>This area contains the specialized dashboard for the {stage.name} stage ({getStageDescription(stage.name)}). The workflow for this tool is managed by the Director Agent.</p>
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
                {content}
            </div>
        </div>
    );
};

export default StageWorkspace;