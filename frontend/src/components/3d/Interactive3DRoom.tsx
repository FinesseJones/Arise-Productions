"use client";

import React, { useState } from 'react';
import { StageKey } from '../../types/types';
import {
  Camera,
  Sparkles,
  Layers,
  Sliders,
  Film,
  FileText,
  Sun,
  Eye,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../../constants/branding';
import Room3D from './Room3D';
import { generateDynamicScript } from '../../lib/projectData';

// 10 Bespoke 3D Stage Rooms
import { ScriptRoomHolo } from './rooms/ScriptRoom3D';
import { StructureRoomHolo } from './rooms/StructureRoom3D';
import { PlanRoomHolo } from './rooms/PlanRoom3D';
import { PrevisRoomHolo } from './rooms/PrevisRoom3D';
import { MotionRoomHolo } from './rooms/MotionRoom3D';
import { BoardsRoomHolo } from './rooms/BoardsRoom3D';
import { PromptRoomHolo } from './rooms/PromptRoom3D';
import { DailiesRoomHolo } from './rooms/DailiesRoom3D';
import { SoundRoomHolo } from './rooms/SoundRoom3D';
import { EditRoomHolo } from './rooms/EditRoom3D';

export interface Interactive3DRoomProps {
  stageId: StageKey;
  roomName: string;
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
  shotDescription?: string;
  onSelectShot?: (shotNumber: number) => void;
}

export const Interactive3DRoom: React.FC<Interactive3DRoomProps> = ({
  stageId,
  roomName,
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
  shotDescription,
  onSelectShot,
}) => {
  const [allowOrbit, setAllowOrbit] = useState<boolean>(false);
  const [quality, setQuality] = useState<'high' | 'performance'>('performance');
  const [activeCenterTab, setActiveCenterTab] = useState<'viewport3d' | 'storyboard' | 'screenplay' | 'lighting'>('viewport3d');
  const [focalLength, setFocalLength] = useState<string>('35mm Prime');
  const [isoSetting, setIsoSetting] = useState<number>(800);
  const [aspectRatio, setAspectRatio] = useState<'2.39:1' | '1.85:1' | '16:9' | '9:16'>('2.39:1');
  const [keyLightKelvin, setKeyLightKelvin] = useState<number>(5600);
  const [fillLightKelvin, setFillLightKelvin] = useState<number>(4300);
  const [rimLightKelvin, setRimLightKelvin] = useState<number>(6500);

  // Scene Shot Filmstrip Data
  const sceneShots = [
    { num: 1, title: 'Opening Wide Master', beat: 'Hook', lens: '18mm Ultra-Wide', duration: '4.5s', tc: '00:00:00:00' },
    { num: 2, title: 'Medium Over-the-Shoulder', beat: 'Inciting', lens: '35mm Prime', duration: '3.2s', tc: '00:00:04:12' },
    { num: 3, title: 'Close-Up Eye Tension', beat: 'Escalation', lens: '85mm Bokeh', duration: '2.8s', tc: '00:00:07:20' },
    { num: 4, title: 'Dynamic Tracking Dolly', beat: 'Midpoint', lens: '24mm Wide', duration: '6.0s', tc: '00:00:10:18' },
    { num: 5, title: 'Anamorphic Low Angle', beat: 'Climax', lens: '35mm Prime', duration: '5.5s', tc: '00:00:16:18' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#060312] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl relative select-none font-sans specular-border">
      {/* Top 4K Cinema Virtual DP Header Bar */}
      <div className="px-4 py-2.5 bg-[#0d0724]/95 backdrop-blur-2xl border-b border-amber-500/30 text-xs font-mono text-amber-200 flex items-center justify-between flex-wrap gap-2 flex-shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-black font-black text-sm shadow-md shadow-amber-500/20">
            🎬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-100 font-bold uppercase font-serif tracking-wide text-xs">
                3D {(roomName || "STUDIO").toUpperCase()} SOUNDSTAGE
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                BMPCC 4K GEN 5
              </span>
            </div>
            <p className="text-[10px] text-amber-400/70 font-mono">
              Shot {shotNumber}: <strong className="text-amber-200">{shotTitle}</strong> • {focalLength} • ISO {isoSetting}
            </p>
          </div>
        </div>

        {/* Center Workspace Mode Tabs */}
        <div className="flex items-center space-x-1 bg-[#150a30] p-1 rounded-xl border border-amber-500/30 text-[11px] font-mono">
          <button
            onClick={() => setActiveCenterTab('viewport3d')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeCenterTab === 'viewport3d'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <Camera size={12} />
            <span>3D Soundstage</span>
          </button>
          <button
            onClick={() => setActiveCenterTab('storyboard')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeCenterTab === 'storyboard'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <Film size={12} />
            <span>Storyboard Slate</span>
          </button>
          <button
            onClick={() => setActiveCenterTab('screenplay')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeCenterTab === 'screenplay'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <FileText size={12} />
            <span>Screenplay</span>
          </button>
          <button
            onClick={() => setActiveCenterTab('lighting')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeCenterTab === 'lighting'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <Sun size={12} />
            <span>Lighting Rig</span>
          </button>
        </div>

        {/* Camera Rig Controls */}
        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <select
            value={focalLength}
            onChange={(e) => setFocalLength(e.target.value)}
            className="px-2 py-1 bg-[#160b33] border border-amber-500/40 rounded-lg text-amber-200 focus:outline-none"
          >
            <option value="18mm Ultra-Wide">18mm Ultra-Wide</option>
            <option value="24mm Wide">24mm Wide</option>
            <option value="35mm Prime">35mm Hollywood Prime</option>
            <option value="50mm Standard">50mm Standard</option>
            <option value="85mm Portrait Bokeh">85mm Portrait Bokeh</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setQuality((q) => (q === 'high' ? 'performance' : 'high'));
              toast.success(
                quality === 'high'
                  ? '⚡ 3D Graphics: Performance Mode Active'
                  : '✨ 3D Graphics: Ultra High Fidelity Mode Active'
              );
            }}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono border border-purple-800/40 text-purple-300 hover:text-white bg-[#160b33] transition"
          >
            {quality === 'high' ? 'Quality: High' : 'Quality: Performance'}
          </button>

          <button
            type="button"
            onClick={() => {
              setAllowOrbit((prev) => !prev);
              toast(
                allowOrbit
                  ? '🎥 CineCamera: Auto Fly-To Mode Locked'
                  : '🌐 CineCamera: Free 3D Orbit Enabled',
                { icon: allowOrbit ? '🎥' : '🌐' }
              );
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-mono border transition ${
              allowOrbit
                ? 'bg-amber-500 text-black border-amber-400 font-bold shadow'
                : 'bg-[#160b33] text-amber-300 border-amber-500/40 hover:text-white'
            }`}
          >
            <Camera size={12} />
            <span>{allowOrbit ? 'Orbit Active' : 'CineFly Locked'}</span>
          </button>
        </div>
      </div>

      {/* Main Soundstage Center Canvas Area */}
      <div className="relative flex-grow flex flex-col items-center justify-start overflow-hidden min-h-0">
        {/* VIEW 1: FULL 3D SPATIAL SOUNDSTAGE VIEWPORT */}
        {activeCenterTab === 'viewport3d' && (
          <div className="absolute inset-0 z-0 pointer-events-auto">
            <Room3D
              stageId={stageId}
              roomName={roomName}
              projectName={projectName}
              shotNumber={shotNumber}
              allowOrbit={allowOrbit}
              quality={quality}
            />

            {/* Proof-of-Ownership Arise Productions Watermark */}
            <div className="absolute top-3 right-3 z-20 flex items-center space-x-2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/50 shadow-xl shadow-amber-500/15 pointer-events-none">
              <div className="w-6 h-6 rounded-lg overflow-hidden bg-black border border-amber-500/60 flex-shrink-0">
                <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif tracking-wider">
                  ARISE PRODUCTIONS
                </span>
                <span className="text-[8px] text-[#E2BA86] font-mono font-medium">
                  © 2026 THE AI CONTENT FOUNDRY, LLC
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: VISUAL STORYBOARD & PROMPT SLATE (CreateSagas Inspired) */}
        {activeCenterTab === 'storyboard' && (
          <div className="w-full h-full p-6 overflow-y-auto custom-scrollbar space-y-4 bg-[#0a051a]">
            <div className="glass-card-4k specular-border rounded-3xl p-6 border border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <Film size={18} className="text-amber-400" />
                  <h3 className="text-sm font-black text-amber-200 uppercase font-mono">
                    Storyboard Slate • Shot {shotNumber}: {shotTitle}
                  </h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  {aspectRatio} Anamorphic • {focalLength}
                </span>
              </div>

              {/* 2.39:1 Anamorphic Cinematic Framing Box */}
              <div className="relative aspect-[2.39/1] max-h-[300px] w-full rounded-2xl bg-gradient-to-b from-[#140b2e] to-[#080417] border border-amber-500/50 overflow-hidden shadow-2xl flex items-center justify-center">
                <div className="text-center space-y-2 p-6">
                  <span className="text-2xl">🎬</span>
                  <p className="text-xs text-amber-200 font-sans italic max-w-lg mx-auto">
                    "{shotDescription || `Master optical framing for ${projectName}. Cinematic camera tracking capturing key character beats with ${focalLength} shallow depth of field.`}"
                  </p>
                  <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-amber-400/80">
                    <span>TC: 01:00:04:12</span>
                    <span>•</span>
                    <span>FPS: 24.000</span>
                    <span>•</span>
                    <span>Blackmagic Gen 5 Color</span>
                  </div>
                </div>

                <div className="absolute bottom-2 right-3 text-[9px] font-mono text-amber-300/60">
                  ComfyUI FLUX.1 [dev] Tensor Locked
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#140b33] border border-amber-500/30 text-xs font-mono text-slate-200 space-y-1">
                <strong className="text-amber-300">Generative Negative Token Shield:</strong>
                <p className="text-purple-300/80 text-[11px]">
                  (low quality:1.4), (cgi smooth skin:1.3), plastic texture, digital video look, modern artifacts, oversaturated colors
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SCREENPLAY & SUBTEXT EDITOR */}
        {activeCenterTab === 'screenplay' && (
          <div className="w-full h-full p-6 overflow-y-auto custom-scrollbar space-y-4 bg-[#0a051a]">
            <div className="glass-card-4k specular-border rounded-3xl p-6 border border-amber-500/40 space-y-4 max-w-2xl mx-auto">
              <div className="border-b border-amber-500/30 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-200 uppercase font-mono">
                  Screenplay Draft • {projectName} • Shot {shotNumber}
                </h3>
                <span className="text-xs text-purple-300 font-mono">Fountain Standard</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#060310] border border-amber-500/30 font-mono text-xs text-amber-100 space-y-3 leading-relaxed whitespace-pre-wrap">
                {generateDynamicScript(projectName, shotNumber, shotTitle)}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: VIRTUAL LIGHTING & DP CONTROLS */}
        {activeCenterTab === 'lighting' && (
          <div className="w-full h-full p-6 overflow-y-auto custom-scrollbar space-y-4 bg-[#0a051a]">
            <div className="glass-card-4k specular-border rounded-3xl p-6 border border-amber-500/40 space-y-4">
              <div className="flex items-center gap-2 border-b border-amber-500/30 pb-3">
                <Sun size={18} className="text-amber-400" />
                <h3 className="text-sm font-black text-amber-200 uppercase font-mono">
                  3-Point Hollywood Virtual Lighting Rig
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                {/* Key Light */}
                <div className="p-4 rounded-2xl bg-[#140b33] border border-amber-500/30 space-y-2">
                  <div className="flex justify-between items-center text-amber-300 font-bold">
                    <span>Key Light</span>
                    <span>{keyLightKelvin}K</span>
                  </div>
                  <input
                    type="range"
                    min={2800}
                    max={6500}
                    value={keyLightKelvin}
                    onChange={(e) => setKeyLightKelvin(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <p className="text-[10px] text-slate-400">Primary character illumination with soft diffusion box.</p>
                </div>

                {/* Fill Light */}
                <div className="p-4 rounded-2xl bg-[#140b33] border border-amber-500/30 space-y-2">
                  <div className="flex justify-between items-center text-amber-300 font-bold">
                    <span>Fill Light</span>
                    <span>{fillLightKelvin}K</span>
                  </div>
                  <input
                    type="range"
                    min={2800}
                    max={6500}
                    value={fillLightKelvin}
                    onChange={(e) => setFillLightKelvin(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <p className="text-[10px] text-slate-400">Controls contrast ratio and shadow density.</p>
                </div>

                {/* Rim Light */}
                <div className="p-4 rounded-2xl bg-[#140b33] border border-amber-500/30 space-y-2">
                  <div className="flex justify-between items-center text-amber-300 font-bold">
                    <span>Rim / Hair Light</span>
                    <span>{rimLightKelvin}K</span>
                  </div>
                  <input
                    type="range"
                    min={2800}
                    max={7500}
                    value={rimLightKelvin}
                    onChange={(e) => setRimLightKelvin(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <p className="text-[10px] text-slate-400">Separates subject from dark obsidian background.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Scene & Shot Filmstrip Navigator */}
      <div className="p-2.5 bg-[#09041a] border-t border-amber-500/30 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0 z-20">
        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold pl-2 flex-shrink-0">
          Shots:
        </span>
        {sceneShots.map((shot) => {
          const isCurrent = shot.num === shotNumber;
          return (
            <button
              key={shot.num}
              onClick={() => onSelectShot?.(shot.num)}
              className={`px-3 py-1.5 rounded-xl border text-left transition flex-shrink-0 flex items-center gap-2.5 text-xs font-mono ${
                isCurrent
                  ? 'bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-purple-900/30 border-amber-400 text-amber-200 shadow-md shadow-amber-500/15 font-bold'
                  : 'bg-[#12082b] border-amber-500/20 text-slate-400 hover:text-amber-200 hover:border-amber-500/40'
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">#{shot.num}</span>
                  <span className="truncate max-w-[120px]">{shot.title}</span>
                </div>
                <span className="text-[9px] text-purple-300/70">{shot.beat} • {shot.lens}</span>
              </div>
              {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Interactive3DRoom;
