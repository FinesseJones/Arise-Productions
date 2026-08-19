"use client";

import React from 'react';
import { Stage, stages } from '../types/stages';

const PipelineStages: React.FC = () => {
  return (
    <div className="flex flex-col text-sm">
      <div className="p-3 text-xs font-semibold uppercase bg-gray-100 text-gray-600 border-b">
        Pipeline Stages
      </div>
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {stages.map((stage) => (
          <div 
            key={stage.id} 
            className={`p-3 cursor-pointer hover:bg-blue-100 transition duration-150 border-b border-gray-100 ${stage.id === 'script' ? 'bg-blue-50/50' : ''}`}
            onClick={() => console.log(`Selecting stage: ${stage.name}`)}
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