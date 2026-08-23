"use client";

import React, { useState } from 'react';
import { Stage } from '../types/stages';
import { ProjectStatus, StageKey } from '../types/types';
import { Play, CheckCircle2, Box, Film, Sliders, Volume2, Camera, Sparkles, FileText, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface StageWorkspaceProps {
  stage: Stage;
  projectStatus: ProjectStatus;
  onExecuteStage?: (stageId: string) => void;
}

const StageWorkspace: React.FC<StageWorkspaceProps> = ({
  stage,
  projectStatus,
  onExecuteStage,
}) => {
  const [selectedShot, setSelectedShot] = useState<number>(1);
  const [cameraFov, setCameraFov] = useState<number>(35);
  const [lightPreset, setLightPreset] = useState<string>('Golden Hour');

  const stageKey = stage.id as StageKey;
  const currentShot = projectStatus.shots?.find((s) => s.shotNumber === selectedShot) || projectStatus.shots?.[0];
  const shotStageStatus = currentShot?.status?.[stageKey]?.statusChar || '?';

  const handleRunStage = () => {
    if (onExecuteStage) {
      toast.loading(`Dispatching job for ${stage.name} (Shot ${selectedShot})...`, { duration: 1500 });
      onExecuteStage(stage.id);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-6 select-none font-sans">
      {/* Top Stage Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/20">
              STAGE {stage.number} / 10
            </span>
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              {stage.name}
            </h2>
            <span className="text-xl">{shotStageStatus}</span>
          </div>
          <p className="text-sm text-slate-400 max-w-2xl">{stage.description}</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Shot Selector */}
          <select
            value={selectedShot}
            onChange={(e) => setSelectedShot(Number(e.target.value))}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
          >
            {projectStatus.shots?.map((s) => (
              <option key={s.shotNumber} value={s.shotNumber}>
                Shot {s.shotNumber}: {s.title}
              </option>
            ))}
          </select>

          {/* Execute Stage Button */}
          <button
            onClick={handleRunStage}
            className="flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition shadow-md shadow-amber-500/10 text-xs uppercase tracking-wider"
          >
            <Play size={14} fill="currentColor" />
            <span>Dispatch to Worker</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Stage Body */}
      {stage.id === 'previs' ? (
        /* --- 3D BLOCKOUT STAGE VIEWPORT --- */
        <div className="grid grid-cols-12 gap-6 flex-grow">
          {/* 3D Canvas Viewport */}
          <div className="col-span-12 lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
            {/* Viewport Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <div className="flex items-center space-x-3">
                <Box size={14} className="text-amber-400" />
                <span className="text-slate-200 font-bold">BLOCKOUT 3D PREVIS VIEWPORT</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  REAL-TIME 60 FPS
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span>FOV: {cameraFov}mm</span>
                <span>CAM: OrbitActive</span>
              </div>
            </div>

            {/* Simulated 3D Spatial Canvas */}
            <div className="relative flex-grow min-h-[420px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8 overflow-hidden select-none">
              {/* Perspective Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

              {/* Arise Productions Proof-of-Ownership Watermark Badge */}
              <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 shadow-lg select-none">
                <div className="w-5 h-5 rounded overflow-hidden bg-black border border-amber-500/40 flex-shrink-0">
                  <img
                    src="/arise_productions_logo.jpg"
                    alt="Arise Productions"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] font-extrabold text-amber-300 font-serif tracking-wider">
                    ARISE PRODUCTIONS
                  </span>
                  <span className="text-[8px] text-slate-400 font-mono">
                    © 2026 THE AI CONTENT FOUNDRY, LLC
                  </span>
                </div>
              </div>

              {/* 3D Wireframe Scene Elements */}
              <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
                <div className="w-48 h-48 rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-2 shadow-2xl shadow-amber-500/10">
                  <Camera size={36} className="text-amber-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-200">CAMERA SOLVER</span>
                  <span className="text-[10px] font-mono text-slate-400">Position: [12.4, 4.2, -8.1]</span>
                  <span className="text-[10px] font-mono text-emerald-400">Choreography: LOCKED</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Shot {selectedShot}: {currentShot?.title}
                </p>
              </div>

              {/* Viewport Overlay Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">Timeline:</span>
                  <span className="text-amber-400 font-bold">00:00:04:18</span>
                  <span className="text-slate-500">/ 00:00:12:00 (120f)</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                  <span>Light: {lightPreset}</span>
                  <span>Shading: StudioPBR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Parameters Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders size={14} className="text-amber-400" />
                <span>Camera & Lighting Parameters</span>
              </h4>

              {/* Focal Length Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Lens Focal Length</span>
                  <span className="font-mono text-amber-400 font-bold">{cameraFov} mm</span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={85}
                  value={cameraFov}
                  onChange={(e) => setCameraFov(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Lighting Presets */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Studio Lighting Environment</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Golden Hour', 'High-Key Studio', 'Midnight Blue', 'Dramatic Noir'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setLightPreset(preset)}
                      className={`p-2 rounded-lg border text-left font-medium transition ${
                        lightPreset === preset
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Box */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <span className="text-slate-400 block font-semibold">Worker Node Status:</span>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Worker:</span>
                  <span className="text-slate-300">BlockoutWorker (/mcp/previs)</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Solve State:</span>
                  <span className="text-emerald-400">Online & Ready</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px] pt-1 border-t border-slate-800">
                  <span className="text-slate-500">Licensing:</span>
                  <span className="text-amber-400">© 2026 Arise Production</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- GENERAL STAGE WORKSPACE VIEW --- */
        <div className="grid grid-cols-12 gap-6 flex-grow">
          <div className="col-span-12 lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 relative">
            {/* Corner Watermark */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <img src="/arise_productions_logo.jpg" alt="Logo" className="w-4 h-4 object-contain rounded" />
              <span className="text-[9px] font-mono text-amber-300 font-bold">ARISE PRODUCTIONS</span>
            </div>

            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Sparkles size={16} />
              <span>{stage.name} Control Panel</span>
            </div>
            <p className="text-xs text-slate-400">
              This specialized workspace connects directly to the <code className="text-amber-400 font-mono">/mcp/{stage.id}</code> microservice worker. All state transitions, parameters, and asset generation jobs are orchestrated via the Central API Bridge.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <span className="text-slate-500 uppercase block text-[10px] tracking-wider font-bold">Active Manifest Status:</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Shot {selectedShot} Status:</span>
                <span className="text-amber-400 font-bold">{shotStageStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Microservice:</span>
                <span className="text-slate-300">/mcp/{stage.id}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Production Studio:</span>
                <span className="text-amber-400">Arise Production • AI Content Foundry, LLC</span>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider block">Stage Actions</span>
            <button
              onClick={handleRunStage}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-lg border border-slate-700 transition"
            >
              Trigger {stage.name} Job
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageWorkspace;