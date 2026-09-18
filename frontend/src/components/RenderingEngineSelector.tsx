"use client";

import React, { useState, useEffect } from 'react';
import { Video, Film, Cpu, Zap, RefreshCw } from 'lucide-react';
import { getAPIBaseURL } from '../lib/api';
import toast from 'react-hot-toast';

interface EngineStatus {
  remotion: {
    available: boolean;
    path: string | null;
    source: string;
    initialized: boolean;
    projectPath: string | null;
  };
  ffmpeg: {
    available: boolean;
    path: string | null;
    version: string;
  };
  currentMode: 'remotion' | 'ffmpeg-only';
}

export const RenderingEngineSelector: React.FC = () => {
  const [engineStatus, setEngineStatus] = useState<EngineStatus | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<'remotion' | 'ffmpeg'>('remotion');
  const [loading, setLoading] = useState(false);

  const fetchEngineStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getAPIBaseURL()}/api/remotion/status`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setEngineStatus(data);
      
      // Auto-select based on availability
      if (data.currentMode === 'remotion' && data.remotion.initialized) {
        setSelectedEngine('remotion');
      } else {
        setSelectedEngine('ffmpeg');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch engine status';
      // Check if it's a connection error (backend not running)
      if (errorMsg.includes('fetch') || errorMsg.includes('ECONNREFUSED') || errorMsg.includes('Failed to fetch')) {
        console.error('Backend server not running - rendering engine status unavailable');
        // Don't show toast for connection errors, it's expected if backend isn't running
      } else {
        toast.error('Failed to fetch rendering engine status');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineStatus();
  }, []);

  const handleEngineChange = async (engine: 'remotion' | 'ffmpeg') => {
    if (engine === 'remotion' && engineStatus?.remotion?.available && !engineStatus.remotion.initialized) {
      try {
        const response = await fetch(`${getAPIBaseURL()}/api/remotion/init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectPath: engineStatus.remotion.projectPath || '/Users/finessejones1/Documents/arise-remotion-projects',
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to initialize Remotion');
        }
        const result = await response.json();
        if (result.success) {
          toast.success('Remotion initialized successfully');
          setSelectedEngine('remotion');
          fetchEngineStatus();
        } else {
          throw new Error(result.reason || 'Initialization failed');
        }
      } catch (err) {
        toast.error(`Failed to initialize Remotion: ${err instanceof Error ? err.message : 'Unknown error'}`);
        return;
      }
    }
    setSelectedEngine(engine);
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3 text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading rendering engines...</span>
        </div>
      </div>
    );
  }

  if (!engineStatus) {
    return (
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="text-gray-500 text-sm">Unable to load rendering engine status</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Rendering Engine</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Remotion Engine */}
          <button
            onClick={() => handleEngineChange('remotion')}
            disabled={!engineStatus.remotion.available}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedEngine === 'remotion'
                ? 'border-purple-500 bg-purple-900/20'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            } ${!engineStatus.remotion.available ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Video className={`w-6 h-6 ${selectedEngine === 'remotion' ? 'text-purple-400' : 'text-gray-400'}`} />
              <span className={`font-semibold ${selectedEngine === 'remotion' ? 'text-white' : 'text-gray-400'}`}>
                Remotion
              </span>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                {engineStatus.remotion.available ? (
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                )}
                <span className="text-gray-400">
                  {engineStatus.remotion.available ? 'Available' : 'Not Available'}
                </span>
              </div>
              {engineStatus.remotion.available && (
                <div className="text-gray-500 text-xs truncate">
                  {engineStatus.remotion.source}
                </div>
              )}
              {engineStatus.remotion.initialized && (
                <div className="text-purple-300 text-xs">
                  ✓ Initialized
                </div>
              )}
            </div>
          </button>

          {/* FFmpeg Engine */}
          <button
            onClick={() => handleEngineChange('ffmpeg')}
            disabled={!engineStatus.ffmpeg.available}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedEngine === 'ffmpeg'
                ? 'border-blue-500 bg-blue-900/20'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            } ${!engineStatus.ffmpeg.available ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Film className={`w-6 h-6 ${selectedEngine === 'ffmpeg' ? 'text-blue-400' : 'text-gray-400'}`} />
              <span className={`font-semibold ${selectedEngine === 'ffmpeg' ? 'text-white' : 'text-gray-400'}`}>
                FFmpeg
              </span>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                {engineStatus.ffmpeg.available ? (
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                )}
                <span className="text-gray-400">
                  {engineStatus.ffmpeg.available ? 'Available' : 'Not Available'}
                </span>
              </div>
              {engineStatus.ffmpeg.available && (
                <div className="text-gray-500 text-xs truncate">
                  {engineStatus.ffmpeg.version}
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Engine Capabilities */}
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Engine Capabilities</h4>
        <div className="space-y-2 text-sm">
          {selectedEngine === 'remotion' ? (
            <>
              <div className="flex items-center gap-2 text-gray-300">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>React-based video compositions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Programmatic animations & effects</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Video className="w-4 h-4 text-purple-400" />
                <span>Complex compositions with code</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-gray-300">
                <Film className="w-4 h-4 text-blue-400" />
                <span>Fast video processing & encoding</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Image sequence stitching</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>Cinematic title card generation</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Current Mode Indicator */}
      <div className={`p-3 rounded-lg border ${
        selectedEngine === 'remotion'
          ? 'bg-purple-900/30 border-purple-700'
          : 'bg-blue-900/30 border-blue-700'
      }`}>
        <div className="flex items-center gap-2">
          {selectedEngine === 'remotion' ? (
            <Video className="w-5 h-5 text-purple-400" />
          ) : (
            <Film className="w-5 h-5 text-blue-400" />
          )}
          <span className="text-white font-medium">
            Current Mode: {selectedEngine === 'remotion' ? 'Remotion' : 'FFmpeg Native'}
          </span>
        </div>
      </div>
    </div>
  );
};
