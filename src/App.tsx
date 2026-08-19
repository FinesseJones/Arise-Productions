"use client";

import React, { useState } from 'react';
import ShellLayout from './components/ShellLayout';
import { useState } from 'react';

const App: React.FC = () => {
  const [projectName, setProjectName] = useState<string | null>(null);
  const [isProjectSelected, setIsProjectSelected] = useState<boolean>(false);

  const handleProjectSelect = (name: string) => {
    setProjectName(name);
    setIsProjectSelected(true);
  };
  
  return (
    <div className="min-h-screen">
      {/* Initial Project Selection View */}
      {!isProjectSelected && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-6 bg-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-800">
            🎬 Wasserman Studio Shell
          </h1>
          <p className="text-xl text-gray-600 max-w-xl text-center">
            Select an existing project to begin unifying your film pipeline.
          </p>

          <div className="bg-white p-8 shadow-xl rounded-xl max-w-3xl w-full space-y-4">
            <h2 className="text-2xl font-bold text-gray-700 border-b pb-2">
                Select/Create Project
            </h2>
            
            <select
                onChange={(e) => handleProjectSelect(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg appearance-none cursor-pointer"
                defaultValue=""
            >
                <option value="" disabled>Choose a project path...</option>
                <option value="/Projects/Titanic/Foundry">Titanic - Found Footage</option>
                <option value="/Projects/Alien/Foundry">Alien - Hive Mind</option>
                <option value="/Projects/SpaceTrip/Foundry">Deep Space Journey</option>
            </select>
            
            <button 
                onClick={() => setProjectName('New Project:Untitled')} 
                className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-md"
            >
                + Create New Project
            </button>
          </div>
        </div>
      )}
      
      {/* Main Shell View */}
      {isProjectSelected && (
        <ShellLayout 
            projectName={projectName} 
            onProjectSelect={handleProjectSelect} 
        />
      )}
    </div>
  );
};

export default App;

// --- End of file ---