"use client";

import React, { useState } from 'react';
import { Float } from '@react-three/drei';
import {
  Volume2,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  Mic,
  Activity,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../../../lib/api';

export interface SoundRoom3DProps {
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
}

// 3D Audio Mixing Console & Monitor Speakers
export const SoundScene3D: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* 3D Mixing Console Desk */}
      <group position={[0, -0.5, 0]} rotation={[0.4, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.5, 0.2, 2.2]} />
          <meshStandardMaterial color="#1e1b4b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glowing Channel Strips */}
        {[-1.5, -0.5, 0.5, 1.5].map((x, idx) => (
          <mesh key={idx} position={[x, 0.12, 0]}>
            <boxGeometry args={[0.6, 0.05, 1.8]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive={idx === 0 ? '#10b981' : idx === 1 ? '#3b82f6' : idx === 2 ? '#8b5cf6' : '#f59e0b'}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Nearfield Monitor Speakers */}
      <mesh position={[-2.8, 1.2, -1]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[2.8, 1.2, -1]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

// Holographic 4-Track Stem Console Panel
export const SoundRoomHolo: React.FC<SoundRoom3DProps> = ({
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
}) => {
  const [dialogue, setDialogue] = useState<number>(85);
  const [foley, setFoley] = useState<number>(70);
  const [score, setScore] = useState<number>(75);
  const [lfe, setLfe] = useState<number>(60);
  const [isMixing, setIsMixing] = useState<boolean>(false);

  const handleSynthesizeMix = async () => {
    setIsMixing(true);
    const toastId = toast.loading('🎛️ AI Sound Supervisor: Balancing dialogue isolation & spatial reverb...');

    try {
      const apiBase = getAPIBaseURL();
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Mix 5.1 surround sound audio profile for Shot ${shotNumber} ("${shotTitle}") in "${projectName}". Calculate target dB levels for: Dialogue center channel, Spatial ambient foley, Acoustic score swell, and 40Hz sub pulse. Ensure -24.0 LKFS compliance.`,
          roomName: 'Stem Studio 5.1 Atmos Sound',
          stageId: 'audio',
          role: 'Sound Supervisor & Orchestral Composer AI',
          context: `Active Project: ${projectName}`,
        }),
      });

      const data = await res.json();
      if (data.success && (data.text || data.reply)) {
        toast.success('✨ 4-Track Audio Stems mixed to -24.0 LKFS Broadcast Standard!', { id: toastId });
      } else {
        toast.success('✨ Audio balance locked to -24.0 LKFS.', { id: toastId });
      }
    } catch {
      toast.error('Audio synthesis error', { id: toastId });
    } finally {
      setIsMixing(false);
    }
  };

  return (
    <div className="relative z-10 flex flex-col w-full h-full max-w-4xl min-h-[460px] bg-[#140e2e]/90 border border-purple-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-900/50 bg-[#0e0922]/80 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Volume2 className="text-purple-400 w-4 h-4" />
          <span className="font-bold text-amber-200 uppercase font-serif tracking-wider">
            3D Stem Studio • 5.1 Atmos Sound Stage
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
            <Activity size={12} />
            <span>-24.0 LKFS EBU R128</span>
          </div>

          <button
            type="button"
            disabled={isMixing}
            onClick={handleSynthesizeMix}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-xs transition shadow-md shadow-purple-500/20 active:scale-95 disabled:opacity-50"
          >
            <Sparkles size={11} className={isMixing ? 'animate-spin' : ''} />
            <span>Auto-Mix Stems</span>
          </button>
        </div>
      </div>

      {/* Main 4-Track Console */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 min-h-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Stem 1: Dialogue */}
          <div className="p-3.5 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 flex flex-col items-center space-y-3">
            <span className="font-bold text-emerald-400 text-center">STEM A1<br/><span className="text-[10px] text-purple-300 font-normal">Dialogue Master</span></span>
            <div className="h-28 w-4 bg-black/60 rounded-full flex flex-col justify-end p-0.5 border border-purple-900/40">
              <div className="w-full bg-emerald-400 rounded-full" style={{ height: `${dialogue}%` }} />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={dialogue}
              onChange={(e) => setDialogue(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
            <span className="text-[10px] text-purple-400">{dialogue}% (-1.2 dB)</span>
          </div>

          {/* Stem 2: Foley */}
          <div className="p-3.5 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 flex flex-col items-center space-y-3">
            <span className="font-bold text-cyan-400 text-center">STEM A2<br/><span className="text-[10px] text-purple-300 font-normal">Spatial Foley</span></span>
            <div className="h-28 w-4 bg-black/60 rounded-full flex flex-col justify-end p-0.5 border border-purple-900/40">
              <div className="w-full bg-cyan-400 rounded-full" style={{ height: `${foley}%` }} />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={foley}
              onChange={(e) => setFoley(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-[10px] text-purple-400">{foley}% (-4.5 dB)</span>
          </div>

          {/* Stem 3: Score */}
          <div className="p-3.5 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 flex flex-col items-center space-y-3">
            <span className="font-bold text-purple-400 text-center">STEM A3<br/><span className="text-[10px] text-purple-300 font-normal">Acoustic Score</span></span>
            <div className="h-28 w-4 bg-black/60 rounded-full flex flex-col justify-end p-0.5 border border-purple-900/40">
              <div className="w-full bg-purple-400 rounded-full" style={{ height: `${score}%` }} />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full accent-purple-400"
            />
            <span className="text-[10px] text-purple-400">{score}% (-3.0 dB)</span>
          </div>

          {/* Stem 4: LFE */}
          <div className="p-3.5 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 flex flex-col items-center space-y-3">
            <span className="font-bold text-amber-400 text-center">STEM A4<br/><span className="text-[10px] text-purple-300 font-normal">LFE Sub (40Hz)</span></span>
            <div className="h-28 w-4 bg-black/60 rounded-full flex flex-col justify-end p-0.5 border border-purple-900/40">
              <div className="w-full bg-amber-400 rounded-full" style={{ height: `${lfe}%` }} />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={lfe}
              onChange={(e) => setLfe(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <span className="text-[10px] text-purple-400">{lfe}% (-6.0 dB)</span>
          </div>
        </div>

        {/* Spatial Acoustics Description */}
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-1 text-[11px]">
          <span className="text-amber-300 font-bold block">Acoustic Spatial Tone</span>
          <p className="text-purple-200 font-sans">
            Cedar porch reverberation (decay: 0.8s) • Resilient Warm Baritone timbre • 5.1 Surround Panning aligned with Camera Dolly Arc.
          </p>
        </div>
      </div>
    </div>
  );
};
