"use client";

import React, { useState } from 'react';
import { StageKey } from '../../types/types';
import {
  Camera,
  FileText,
  Layers,
  Boxes,
  Activity,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Volume2,
  Scissors,
  Sliders,
  Play,
  RotateCcw,
  Eye,
  Maximize2,
} from 'lucide-react';

interface Interactive3DRoomProps {
  stageId: StageKey;
  roomName: string;
  projectName: string;
  shotNumber: number;
}

export const Interactive3DRoom: React.FC<Interactive3DRoomProps> = ({
  stageId,
  roomName,
  projectName,
  shotNumber,
}) => {
  const [activeParam, setActiveParam] = useState<number>(35);
  const [roomPreset, setRoomPreset] = useState<string>('Cinematic Neon');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative select-none">
      {/* Top 3D Room Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-slate-100 font-bold tracking-wide uppercase">
            3D {roomName.toUpperCase()}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
            60 FPS SPATIAL
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span>Shot {shotNumber}</span>
          <span>Preset: <strong className="text-amber-300">{roomPreset}</strong></span>
        </div>
      </div>

      {/* Main 3D Spatial Canvas */}
      <div className="relative flex-grow min-h-[380px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6 overflow-hidden">
        {/* Holographic 3D Spatial Perspective Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

        {/* Floating Glowing Neon Studio Ring */}
        <div className="absolute w-96 h-96 rounded-full border border-amber-500/10 bg-amber-500/5 animate-pulse [animation-duration:4s]" />

        {/* Proof-of-Ownership Arise Productions Watermark */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 shadow-lg">
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

        {/* ---------------- ROOM-SPECIFIC 3D SPATIAL INTERFACES ---------------- */}

        {/* 1. WRITERS ROOM 3D VIEW */}
        {stageId === 'script' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 text-center max-w-md w-full">
            <div className="w-full p-6 rounded-2xl bg-slate-950/90 border border-amber-500/30 backdrop-blur-md shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold">
                  <FileText size={16} />
                  <span>3D FOUNTAIN SCREENPLAY VAULT</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">STATUS: SYNCED</span>
              </div>

              <div className="text-left font-mono text-xs text-slate-300 space-y-1.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <p className="text-amber-400 font-bold">EXT. DEEP SPACE REEF - DAWN</p>
                <p className="text-slate-400 text-[11px]">The expedition vessel drifts through golden stellar dust clouds.</p>
                <p className="text-cyan-300 pt-1 text-[11px]">SARAH: "Telemetry is locked. We are entering the coordinates now."</p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Scene 1 / Shot {shotNumber}</span>
                <span className="text-amber-300">Format: Standard Fountain</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. CORK BOARD 3D NARRATIVE VIEW */}
        {stageId === 'structure' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-lg">
            <div className="w-full p-5 rounded-2xl bg-slate-950/90 border border-orange-500/30 backdrop-blur-md shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono">
                <div className="flex items-center space-x-2 text-orange-400 font-bold">
                  <Layers size={16} />
                  <span>3D NARRATIVE ARC & INDEX WALL</span>
                </div>
                <span className="text-amber-300 text-[10px]">3-ACT TENSION ARC: 94%</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 font-mono text-[10px]">
                <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-500/40 text-orange-200 space-y-1">
                  <span className="font-bold block text-orange-400">ACT I: BEAT 1</span>
                  <p>Inciting distress signal detected at orbital perimeter.</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 space-y-1">
                  <span className="font-bold block text-amber-400">ACT II: MIDPOINT</span>
                  <p>Threshold crossed; power core overload emergency.</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 text-purple-200 space-y-1">
                  <span className="font-bold block text-purple-400">ACT III: CLIMAX</span>
                  <p>Manual manual override saves the crew at dawn.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. MASTER CANVAS 3D ART LAB */}
        {stageId === 'plan' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-md">
            <div className="w-full p-5 rounded-2xl bg-slate-950/90 border border-yellow-500/30 backdrop-blur-md shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-yellow-400 font-bold">
                <div className="flex items-center space-x-2">
                  <Boxes size={16} />
                  <span>3D ART MOODBOARD & COLOR PALETTES</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 py-2">
                {['#020617', '#d97706', '#3b82f6', '#8b5cf6', '#10b981'].map((hex, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 font-mono text-[9px] text-slate-400">
                    <div className="w-10 h-10 rounded-xl shadow-lg border border-slate-700 hover:scale-110 transition" style={{ backgroundColor: hex }} />
                    <span>{hex}</span>
                  </div>
                ))}
              </div>

              <p className="text-center font-mono text-xs text-slate-300">
                PBR Material Continuity Locked: <span className="text-amber-400 font-bold">Titanium & Amber Glow</span>
              </p>
            </div>
          </div>
        )}

        {/* 4. BLOCKOUT 3D SOUNDSTAGE PREVIS */}
        {stageId === 'previs' && (
          <div className="relative z-10 flex flex-col items-center space-y-3 text-center">
            <div className="w-48 h-48 rounded-2xl border-2 border-cyan-500/40 bg-cyan-500/5 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-2 shadow-2xl shadow-cyan-500/10">
              <Camera size={36} className="text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-200">VIRTUAL DP SOLVER</span>
              <span className="text-[10px] font-mono text-slate-400">Camera Track: [12.4, 4.2, -8.1]</span>
              <span className="text-[10px] font-mono text-emerald-400">Focal Length: {activeParam}mm</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Shot {shotNumber}: {projectName} (Spatial 3D Soundstage A)
            </p>
          </div>
        )}

        {/* 5. MOCAP & TRACKING VOLUME */}
        {stageId === 'motion' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md w-full">
            <div className="w-full p-5 rounded-2xl bg-slate-950/90 border border-blue-500/30 backdrop-blur-md shadow-2xl space-y-3 text-center">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-blue-400 font-bold">
                <div className="flex items-center space-x-2">
                  <Activity size={16} />
                  <span>52-POINT SKELETAL KINEMATICS SOLVER</span>
                </div>
                <span className="text-emerald-400">60 FPS REAL-TIME</span>
              </div>

              <div className="flex justify-center py-3">
                <div className="w-28 h-28 rounded-full border-2 border-dashed border-blue-400/60 flex items-center justify-center animate-spin [animation-duration:8s]">
                  <Activity size={40} className="text-blue-400" />
                </div>
              </div>

              <p className="font-mono text-xs text-slate-300">
                Optical Motion Vectors: <strong className="text-blue-400">52 Nodes Synced</strong>
              </p>
            </div>
          </div>
        )}

        {/* 6. STORYBOARD LAB */}
        {stageId === 'boards' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md w-full">
            <div className="w-full p-5 rounded-2xl bg-slate-950/90 border border-indigo-500/30 backdrop-blur-md shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-indigo-400 font-bold">
                <div className="flex items-center space-x-2">
                  <ImageIcon size={16} />
                  <span>3D ANIMATIC & STORYBOARD COMPOSER</span>
                </div>
                <span className="text-amber-300">RATIO: 2.39:1</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono text-[10px]">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-indigo-400 font-bold">PANEL 1: WIDE</span>
                  <p className="text-slate-400">Establishing shot over horizon.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-indigo-400 font-bold">PANEL 2: CLOSE-UP</span>
                  <p className="text-slate-400">Sarah looks toward beacon.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. SLATE PROMPT LAB */}
        {stageId === 'prompt' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md w-full">
            <div className="w-full p-5 rounded-2xl bg-slate-950/90 border border-purple-500/30 backdrop-blur-md shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-purple-400 font-bold">
                <div className="flex items-center space-x-2">
                  <Sparkles size={16} />
                  <span>CONTINUITY SLATE GENERATOR</span>
                </div>
                <span className="text-emerald-400">SEED: #94821</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 text-left">
                <span className="text-purple-400 font-bold block">Locked Prompt Matrix:</span>
                <p className="text-slate-400">"Cinematic 35mm anamorphic, golden hour lighting, 8k resolution, photorealistic studio PBR."</p>
              </div>
            </div>
          </div>
        )}

        {/* 8. DAILIES SCREENING THEATER */}
        {stageId === 'dailies' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md w-full">
            <div className="w-full p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 backdrop-blur-md shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-emerald-400 font-bold">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={16} />
                  <span>4K HDR DAILIES SCREENING THEATER</span>
                </div>
                <span className="text-amber-300">SCORE: 9.6 / 10</span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs text-center">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
                  <span className="font-bold block">TAKE 1 🟢</span>
                  <span className="text-[10px]">Circle Take Winner</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                  <span className="font-bold block">TAKE 2 ⚪</span>
                  <span className="text-[10px]">Safety Alternate</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. AUDIO STEM STUDIO */}
        {stageId === 'sound' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md w-full">
            <div className="w-full p-5 rounded-2xl bg-slate-950/90 border border-teal-500/30 backdrop-blur-md shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-teal-400 font-bold">
                <div className="flex items-center space-x-2">
                  <Volume2 size={16} />
                  <span>4-TRACK STEM MIXER (-24 LKFS)</span>
                </div>
                <span className="text-emerald-400">DOLBY ATMOS</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center font-mono text-[10px]">
                {['Dialogue', 'Foley', 'Score', 'SFX'].map((stem, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-teal-400 font-bold block">{stem}</span>
                    <div className="w-full bg-slate-800 h-12 rounded flex items-end justify-center p-1">
                      <div className="w-3 bg-teal-400 rounded-sm animate-pulse" style={{ height: `${60 + i * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 10. DAVINCI FINISHING SUITE */}
        {stageId === 'edit' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md w-full">
            <div className="w-full p-5 rounded-2xl bg-slate-950/90 border border-rose-500/30 backdrop-blur-md shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-rose-400 font-bold">
                <div className="flex items-center space-x-2">
                  <Scissors size={16} />
                  <span>DAVINCI COLOR GRADING & CONFORM</span>
                </div>
                <span className="text-rose-400">ACEScc Rec.709</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-300 flex justify-between items-center">
                <span>Timeline Cuts: <strong>4 EDL Events</strong></span>
                <span className="text-emerald-400">Master Export: Ready</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Viewport Control Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center space-x-3 text-slate-400">
            <Sliders size={13} className="text-amber-400" />
            <span>Focal/Metric:</span>
            <input
              type="range"
              min={18}
              max={85}
              value={activeParam}
              onChange={(e) => setActiveParam(Number(e.target.value))}
              className="w-24 accent-amber-500 cursor-pointer"
            />
            <span className="text-amber-300 font-bold">{activeParam}mm</span>
          </div>

          <div className="flex items-center space-x-2">
            {['Cinematic Neon', 'Golden Studio', 'Noir Midnight'].map((p) => (
              <button
                key={p}
                onClick={() => setRoomPreset(p)}
                className={`px-2 py-0.5 rounded text-[10px] border transition ${
                  roomPreset === p
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interactive3DRoom;
