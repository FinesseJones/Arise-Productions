"use client";

import React from 'react';
import { Stage, stages } from '../types/stages';

interface PipelineStagesProps {
    onStageSelect: (stageId: string) => void;
}

const PipelineStages: React.FC<PipelineStagesProps> = ({ onStageSelect }) => {
  return (
    <div className="flex flex-col text-sm h-full">
      <div className="p-3 text-xs font-semibold uppercase bg-gray-100 text-gray-600 border-b sticky top-0 z-10">
        Pipeline Stages
      </div >
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {stages.map((stage) => (
          <div 
            key={stage.id} 
            className="p-3 cursor-pointer hover:bg-blue-50 transition duration-150 border-b border-gray-100"
            onClick={() => onStageSelect(stage.id)} // --- HANDLER USED HERE ---
          >
            <div className="flex items-center">
                <span className="text-lg font-bold mr-2 text-blue-600">{stage.number}</span>
                <span className="font-medium text-gray-700">{stage.name}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{stage.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineStages;