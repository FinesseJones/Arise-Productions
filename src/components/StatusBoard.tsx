"use client";

import React from 'react';
import { ProjectStatus } from '../types/types';
import { ShotStatus } from '../types/types';

interface StatusBoardProps {
    projectStatus: ProjectStatus;
}

const StatusBoard: React.FC<StatusBoardProps> = ({ projectStatus }) => {
    // Destructure the status map for cleaner component usage
    const statusMap: { [key: string]: keyof ProjectStatus } = {
        script: 'script',
        structure: 'structure',
        plan: 'plan',
        previs: 'previs',
        motion: 'motion',
        boards: 'boards',
        prompt: 'prompt',
        dailies: 'dailies',
        sound: 'sound',
        edit: 'edit',
    }

    // Helper function to render the status indicator (green, yellow, red, gray)
    const getStatusIndicator = (status: { statusChar: "🟢" | "🟡" | "🔴" | "?" }) => {
        if (!status || !status.statusChar) return <span className="text-gray-300">?</span>;
        // We use the character directly since it contains the color/meaning
        return <span className="font-bold text-xl">{status.statusChar}</span>;
    };

    // Render a sequence of indicators for all 10 stages
    const renderStatusIndicators = (shotStatus: { status: { [key: string]: { statusChar: "🟢" | "🟡" | "🔴" | "?" } } }) => {
        return (
            <div className="flex flex-col space-y-2">
                {Object.keys(statusMap).map((key) => {
                    const stageKey = key as keyof typeof statusMap;
                    const stageComponentKey = Object.keys(statusMap).find(k => statusMap[k] === 'script') || 'script'; // Simple hack to ensure we iterate all 10
                    
                    // Safe lookup for the status object for this stage
                    const status = shotStatus.status[stageComponentKey];
                    if (!status) {
                         return <div key={stageComponentKey} className='text-sm text-gray-400'>Missing {stageComponentKey}</div>
                    }

                    return (
                        <div key={stageComponentKey} className="flex items-center justify-between py-1">
                            <span className="text-xs text-gray-600 capitalize">{stageComponentKey}</span>
                            {getStatusIndicator(status)}
                        </div>
                    );
                })}
            </div>
        );
    };


    return (
        <div className="p-4 pt-2 sticky top-0 bg-gray-50/80 backdrop-blur-sm border-t border-gray-200">
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Project Status: {projectStatus.projectName}</h3>
                <p className='text-sm text-gray-500'>Manifest Manifest & Completion Tracker</p>
            </div>

            <div className="space-y-6">
                {projectStatus.shots.map((shot, index) => (
                    <div key={shot.shotNumber} className="border p-3 rounded-lg bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-lg text-blue-700">Shot {shot.shotNumber}</h4>
                            <span className="text-sm text-gray-500">{shot.title}</span>
                        </div>
                        
                        {/* The main status grid */}
                        <div className="grid grid-cols-3 gap-2 text-xs flex flex-wrap">
                            {/* Render the status indicators for all stages for this shot */}
                            <div className="col-span-full">{renderStatusIndicators(shot)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusBoard;