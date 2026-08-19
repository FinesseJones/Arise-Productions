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
                return "Detailed visual blocking: camera movement, character choreography, and rough scene layouts. The storyboard foundation.";
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


    return (
        <div className="p-4">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div>
                    <h3 className="text-3xl font-extrabold text-gray-800">{stage.name} Workspace</h3>
                    <p className="text-gray-500 mt-1">{stage.description}</p>
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                    📖 View Manifest
                </button>
            </div>

            {/* Simulated Content Area */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-6">
                <div className="p-4 bg-gray-50 border-l-4 border-blue-500">
                    <h4 className='font-semibold text-xl mb-2'>Core Functionality:</h4>
                    <p className={ 'text-gray-700'}>{getStageDescription(stage.name)}</p>
                </div>
                
                {/* Specific UI implementation based on stage */}
                {stage.id === 'script' && (
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='p-4 bg-red-50 border border-red-200 rounded'>Character Bible Mockup</div>
                        <div className='p-4 bg-lime-50 border border-lime-200 rounded'>Location Index Map</div>
                    </div>
                )}
                 {stage.id === 'prompt' && (
                    <div className='text-center py-10'>
                        <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 0l4 4-4 4"/>
                        </svg>
                        <p className='mt-2 text-sm font-medium text-gray-700'>Prompt Generation Area: Select media type (Video/Image/Music) and generate continuity-locked prompts.</p>
                    </div>
                 )}
                 {stage.id === 'edit' && (
                    <div className='text-center py-10'>
                        <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.853.554L15 10zM5 18v-4m0 0l3 3m-3-3l3-3"/></svg>
                        <p className='mt-2 text-sm font-medium text-gray-700'>Non-Linear Editor Interface: DaVinci Resolve API integration for color, cuts, and master QC checks.</p>
                    </div>
                 )}
                
                <div className='pt-4 border-t text-right'>
                    <button className='text-blue-600 hover:text-blue-800 text-sm'>
                        <span className='flex items-center'><0xF0><0x9F><0x97><0x82>️ Download Tool Output</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StageWorkspace;