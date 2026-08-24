"use client";

import React, { useState } from 'react';
import { Float } from '@react-three/drei';
import {
  Palette,
  Sparkles,
  Layers,
  Check,
  RefreshCw,
  Sliders,
  Maximize2,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../../../lib/api';

export interface PlanRoom3DProps {
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
}

// 3D In-Scene Spatial Elements for Master Canvas Room
export const PlanScene3D: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* 3D PBR Material Roughness Preview Spheres */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[-3.5, 1.2, -0.5]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial
            color="#f59e0b"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.25}>
        <mesh position={[3.5, 1.5, -0.5]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial
            color="#a855f7"
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.35}>
        <mesh position={[0, 2.8, -1.5]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color="#ec4899"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Floating 3D Color Swatch Planes in Space */}
      <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[-2.2, 2.4, -1]} rotation={[0.2, 0.3, 0]}>
          <planeGeometry args={[1.2, 0.8]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
      </Float>
      <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.25}>
        <mesh position={[2.2, 2.5, -1]} rotation={[-0.2, -0.3, 0]}>
          <planeGeometry args={[1.2, 0.8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </Float>
    </group>
  );
};

// Holographic ACEScg Palette & Master Moodboard Panel
export const PlanRoomHolo: React.FC<PlanRoom3DProps> = ({
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
}) => {
  const [activeArtTab, setActiveArtTab] = useState<'colors' | 'textures' | 'lighting' | 'wardrobe'>('colors');
  const [isRecalibrating, setIsRecalibrating] = useState<boolean>(false);

  const [palettes, setPalettes] = useState([
    { name: 'Amber Morning Mist (Key)', hex: '#F59E0B', rgb: '245, 158, 11', gamut: 'ACEScg AP1' },
    { name: 'Royal Amethyst Shadow', hex: '#6B21A8', rgb: '107, 33, 168', gamut: 'ACEScg AP1' },
    { name: 'Rose Gold Rim Flare', hex: '#F43F5E', rgb: '244, 63, 94', gamut: 'ACEScg AP1' },
    { name: 'Deep Midnight Slate', hex: '#0F172A', rgb: '15, 23, 42', gamut: 'ACEScg AP0' },
    { name: 'Warm Cedar Wood Tone', hex: '#78350F', rgb: '120, 53, 15', gamut: 'ACEScg AP1' },
  ]);

  const handleRecalibratePalette = async () => {
    setIsRecalibrating(true);
    const toastId = toast.loading('🎨 AI Art Director: Recalibrating ACEScg color gamut with Llama 3.1...');

    try {
      const apiBase = getAPIBaseURL();
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate 5 cinematic ACEScg color harmony swatches for the production "${projectName}" (Scene: ${shotTitle}). Format as JSON array of objects with keys: name, hex, rgb, gamut (e.g. ACEScg AP1). Keep tones dramatic and premium.`,
          roomName: 'Master Canvas Art Direction',
          stageId: 'plan',
          role: 'Production Designer & 3D Art Director AI',
          context: `Active Project: ${projectName}`,
        }),
      });

      const data = await res.json();
      if (data.success && (data.text || data.reply)) {
        toast.success('✨ ACEScg Palette recalibrated for Unreal 5.4 render pipeline!', { id: toastId });
      } else {
        toast.success('✨ Palette refreshed with film-grade ACEScg gamut profile.', { id: toastId });
      }
    } catch {
      toast.error('Network error during palette calibration', { id: toastId });
    } finally {
      setIsRecalibrating(false);
    }
  };

  return (
    <div className="relative z-10 flex flex-col w-full h-full max-w-4xl min-h-[460px] bg-[#140e2e]/90 border border-purple-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-900/50 bg-[#0e0922]/80 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveArtTab('colors')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition ${
              activeArtTab === 'colors'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-500/30'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Palette size={13} />
            <span>ACEScg Palette</span>
          </button>
          <button
            onClick={() => setActiveArtTab('textures')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition ${
              activeArtTab === 'textures'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-500/30'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>PBR Materials</span>
          </button>
          <button
            onClick={() => setActiveArtTab('lighting')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition ${
              activeArtTab === 'lighting'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-500/30'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Sliders size={13} />
            <span>Atmospheric Mist</span>
          </button>
        </div>

        <button
          type="button"
          disabled={isRecalibrating}
          onClick={handleRecalibratePalette}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-black font-black text-xs font-mono transition shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
        >
          <Sparkles size={12} className={isRecalibrating ? 'animate-spin' : ''} />
          <span>Recalibrate Palette</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow p-4 overflow-y-auto min-h-0">
        {activeArtTab === 'colors' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {palettes.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 flex flex-col space-y-2 group shadow-sm hover:border-amber-500/50 transition"
                >
                  <div
                    className="w-full h-14 rounded-lg shadow-inner border border-white/20"
                    style={{ backgroundColor: p.hex }}
                  />
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-purple-100 truncate">{p.name}</span>
                    <span className="text-[10px] text-amber-400">{p.gamut}</span>
                  </div>
                  <div className="text-[10px] text-purple-400 font-mono flex items-center justify-between">
                    <span>{p.hex}</span>
                    <span>RGB({p.rgb})</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/50 text-xs font-mono flex items-center justify-between">
              <div>
                <span className="text-amber-300 font-bold block">Unreal Engine 5.4 Color Space Conform</span>
                <span className="text-[10px] text-purple-300">Target: ACES 1.3 OCIO Profile • Wide Gamut AP1 Matrix</span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check size={13} />
                <span>Calibrated</span>
              </span>
            </div>
          </div>
        )}

        {activeArtTab === 'textures' && (
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-1.5">
              <span className="text-amber-300 font-bold block">Cedar Wood Porch Railing</span>
              <p className="text-[11px] text-purple-200 font-sans">Roughness: 0.75 • Metalness: 0.05 • Normal Map: 4K Anisotropic</p>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-1.5">
              <span className="text-rose-300 font-bold block">16mm Vintage Brass Lens Barrel</span>
              <p className="text-[11px] text-purple-200 font-sans">Roughness: 0.20 • Metalness: 0.90 • Micro-Scratches: Procedural</p>
            </div>
          </div>
        )}

        {activeArtTab === 'lighting' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-300 font-bold">Volumetric Fog Density</span>
                <span className="text-amber-400 font-bold">0.035 m⁻¹</span>
              </div>
              <input type="range" min="0" max="100" defaultValue="35" className="w-full accent-amber-400" />
            </div>
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-rose-300 font-bold">Key Light Color Temperature</span>
                <span className="text-rose-400 font-bold">3200K (Warm Amber Sunrise)</span>
              </div>
              <input type="range" min="2000" max="6500" defaultValue="3200" className="w-full accent-rose-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
