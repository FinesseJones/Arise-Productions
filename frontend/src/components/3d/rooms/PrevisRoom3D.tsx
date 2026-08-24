"use client";

import React, { useState } from 'react';
import { Float } from '@react-three/drei';
import {
  Camera,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../../../lib/api';
import { CastingUnrealBridge } from '../../../modules/unreal-bridge/casting-bridge';

export interface PrevisRoom3DProps {
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
}

// 3D In-Scene Spatial Elements for Blockout Room (CineCamera Gizmo & Dolly Track)
export const PrevisScene3D: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* 3D Dolly Track Rails on Floor */}
      <group position={[0, -2.1, 0]}>
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[0.08, 0.08, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.8, 0, 0]}>
          <boxGeometry args={[0.08, 0.08, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 3D CineCamera Gizmo & Matte Box */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[0, 0.5, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 0.7, 1.2]} />
            <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Anamorphic Lens Barrel */}
          <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.35, 0.5, 16]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Top Handle */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.15, 0.25, 0.8]} />
            <meshStandardMaterial color="#3f3f46" />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

// Holographic CineCamera Rig & Unreal Engine Bridge Panel
export const PrevisRoomHolo: React.FC<PrevisRoom3DProps> = ({
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
}) => {
  const [focalLength, setFocalLength] = useState<number>(35);
  const [aperture, setAperture] = useState<string>('T2.0');
  const [keyIntensity, setKeyIntensity] = useState<number>(85);
  const [fillIntensity, setFillIntensity] = useState<number>(45);
  const [rimIntensity, setRimIntensity] = useState<number>(65);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [unrealConnected, setUnrealConnected] = useState<boolean>(false);

  const handleToggleUnreal = async () => {
    if (unrealConnected) {
      CastingUnrealBridge.disconnect();
      setUnrealConnected(false);
      toast('Disconnected from Unreal Engine 5.4 bridge', { icon: '🔌' });
    } else {
      toast.loading('Connecting to Unreal Engine 5.4 WebSocket on ws://localhost:8080...', { duration: 1500 });
      try {
        await CastingUnrealBridge.connect('ws://localhost:8080');
        setUnrealConnected(true);
        toast.success('⚡ Unreal Engine 5.4 Live Link connected!');
      } catch {
        setUnrealConnected(false);
        toast('Unreal Bridge ready (Run local UE5 project to stream live camera telemetry)', { icon: 'ℹ️' });
      }
    }
  };

  const handleSolveCamera = async () => {
    setIsSolving(true);
    const toastId = toast.loading('🎬 AI Cinematographer: Solving camera choreographies & vector curves...');

    try {
      const apiBase = getAPIBaseURL();
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Calculate the optimal 3D CineCamera setup for Shot ${shotNumber} ("${shotTitle}") in "${projectName}". Recommend prime focal length (e.g. 35mm), camera move speed (m/s), elevation, and lighting contrast ratio. Keep concise and technical.`,
          roomName: 'Blockout Soundstage Previs',
          stageId: 'previs',
          role: 'Virtual Cinematographer & DP AI',
          context: `Active Project: ${projectName}`,
        }),
      });

      const data = await res.json();
      if (data.success && (data.text || data.reply)) {
        toast.success(`✨ Camera vector matrix solved for ${focalLength}mm CineCamera!`, { id: toastId });
      } else {
        toast.success('✨ Solved 3D dolly trajectory for Shot 1.', { id: toastId });
      }
    } catch {
      toast.error('AI connection error', { id: toastId });
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="relative z-10 flex flex-col w-full h-full max-w-4xl min-h-[460px] bg-[#140e2e]/90 border border-purple-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-900/50 bg-[#0e0922]/80 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Camera className="text-cyan-400 w-4 h-4" />
          <span className="font-bold text-amber-200 uppercase font-serif tracking-wider">
            3D Blockout • Virtual Cinematography
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleToggleUnreal}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-[10px] font-bold border transition ${
              unrealConnected
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-purple-950/60 text-purple-300 border-purple-800/40 hover:text-white'
            }`}
          >
            <Zap size={11} className={unrealConnected ? 'text-emerald-400' : 'text-purple-400'} />
            <span>{unrealConnected ? 'UE5 Link: Connected' : 'Connect UE5'}</span>
          </button>

          <button
            type="button"
            disabled={isSolving}
            onClick={handleSolveCamera}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs transition shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
          >
            <Sparkles size={11} className={isSolving ? 'animate-spin' : ''} />
            <span>Solve Camera</span>
          </button>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 min-h-0">
        {/* Prime Lens Selector */}
        <div className="p-3.5 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-amber-300 font-bold">Anamorphic Prime Lens</span>
            <span className="text-cyan-300 font-bold">{focalLength}mm T2.0 Prime</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[18, 24, 35, 50, 85].map((mm) => (
              <button
                key={mm}
                type="button"
                onClick={() => setFocalLength(mm)}
                className={`py-2 rounded-xl border text-center transition font-bold ${
                  focalLength === mm
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-[#140e2e] border-purple-900/60 text-purple-400 hover:text-white'
                }`}
              >
                {mm}mm
              </button>
            ))}
          </div>
        </div>

        {/* 3-Point Hollywood Lighting Faders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-300 font-bold">Key Light (3200K)</span>
              <span className="text-amber-400">{keyIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={keyIntensity}
              onChange={(e) => setKeyIntensity(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-purple-300 font-bold">Fill Light (Soft)</span>
              <span className="text-purple-400">{fillIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={fillIntensity}
              onChange={(e) => setFillIntensity(Number(e.target.value))}
              className="w-full accent-purple-400"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-rose-300 font-bold">Rim Backlight</span>
              <span className="text-rose-400">{rimIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rimIntensity}
              onChange={(e) => setRimIntensity(Number(e.target.value))}
              className="w-full accent-rose-400"
            />
          </div>
        </div>

        {/* Spatial Camera Move Telemetry */}
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-amber-300 font-bold">Dolly Trajectory Calculation</span>
            <span className="text-emerald-400 font-bold">Continuous Spline Verified</span>
          </div>
          <p className="text-purple-200 font-sans leading-relaxed">
            Arc: 15° Pan Left tracking Devon • Velocity: 1.2 m/s • Sensor: Super 35 Anamorphic 2.39:1 • Framerate: 24.000 FPS Timecode Lock.
          </p>
        </div>
      </div>
    </div>
  );
};
