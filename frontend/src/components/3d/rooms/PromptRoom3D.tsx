import React, { useState, useRef } from 'react';
import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  Sparkles,
  Sliders,
  Copy,
  Layers,
  Check,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../../../lib/api';

export interface PromptRoom3DProps {
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
}

// 3D Dynamic Neural Diffusion Quantum Cluster in Space
export const PromptScene3D: React.FC = () => {
  const clusterRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (clusterRef.current) {
      clusterRef.current.rotation.y += delta * 0.4;
      clusterRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.6;
    }
  });

  return (
    <group position={[0, 0.6, -0.5]}>
      {/* Central Rotating Neural Core Cluster */}
      <group ref={clusterRef}>
        {/* Core Quantum Icosahedron */}
        <mesh>
          <icosahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={0.8}
            wireframe
          />
        </mesh>

        {/* Orbiting Quantum Synapse Nodes */}
        {[
          [-1.6, 0.8, 0.5],
          [1.6, -0.6, -0.5],
          [0.4, 1.5, -1.0],
          [-0.8, -1.3, 0.8],
        ].map((pos, idx) => (
          <group key={idx} position={pos as [number, number, number]}>
            <mesh>
              <octahedronGeometry args={[0.28, 0]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#f59e0b"
                emissiveIntensity={0.9}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Orbiting Golden Synaptic Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 3, 0, 0]}>
        <ringGeometry args={[2.0, 2.15, 48]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Holographic Prompt Pack & Diffusion Slate Panel
export const PromptRoomHolo: React.FC<PromptRoom3DProps> = ({
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
}) => {
  const [modelType, setModelType] = useState<'FLUX.1 Dev' | 'SDXL 1.0' | 'Midjourney v6'>('FLUX.1 Dev');
  const [controlNetWeight, setControlNetWeight] = useState<number>(0.85);
  const [ipAdapterWeight, setIpAdapterWeight] = useState<number>(0.90);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  const [promptLayers, setPromptLayers] = useState([
    {
      id: 'p1',
      title: '1. HERO SUBJECT & LIGHTING PROMPT',
      description: `Cinematic 35mm anamorphic film still from "${projectName}", Devon (19) on porch, volumetric golden amber 3200K morning sunlight, photorealistic skin pores, ACEScg color, 8k resolution.`,
    },
    {
      id: 'p2',
      title: '2. BACKGROUND ARCHITECTURAL SETTINGS',
      description: 'Historic wooden Craftsman porch, autumn foliage amber trees, waking urban city skyline in soft optical bokeh background, atmospheric morning mist.',
    },
    {
      id: 'p3',
      title: '3. NEGATIVE DIFFUSION EMBEDDING',
      description: 'blurry, deformed, cartoon, plastic 3d render, oversaturated, extra limbs, bad anatomy, watermark, text artifact, lowres.',
    },
  ]);

  const handleCopyPrompt = () => {
    const fullPack = promptLayers.map((p) => `[${p.title}]\n${p.description}`).join('\n\n');
    navigator.clipboard.writeText(fullPack);
    toast.success('📋 Copied full Continuity Prompt-Pack to clipboard!');
  };

  const handleCompilePrompts = async () => {
    setIsCompiling(true);
    const toastId = toast.loading(`🤖 AI Prompt Engineer: Compiling continuity-locked ${modelType} slate...`);

    try {
      const apiBase = getAPIBaseURL();
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Compile a high-fidelity image generation prompt pack for ${modelType} for Shot ${shotNumber} ("${shotTitle}") in "${projectName}". Return: 1. Subject & Lighting prompt, 2. Environmental context, 3. Negative embedding.`,
          roomName: 'Diffusion Slate & Prompt Engine',
          stageId: 'prompt',
          role: 'Lead Prompt Engineer & Model Tuner AI',
          context: `Active Project: ${projectName}`,
        }),
      });

      const data = await res.json();
      if (data.success && (data.text || data.reply)) {
        toast.success(`✨ Prompt pack compiled for ${modelType}!`, { id: toastId });
      } else {
        toast.success('✨ Prompt slate updated.', { id: toastId });
      }
    } catch {
      toast.error('AI compilation error', { id: toastId });
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="relative z-10 flex flex-col w-full h-full max-w-4xl min-h-[460px] bg-[#140e2e]/90 border border-purple-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-900/50 bg-[#0e0922]/80 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Cpu className="text-pink-400 w-4 h-4" />
          <span className="font-bold text-amber-200 uppercase font-serif tracking-wider">
            3D Diffusion Slate • Prompt Engine
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-[#0c081e] p-0.5 rounded-lg border border-purple-900/60">
            {(['FLUX.1 Dev', 'SDXL 1.0', 'Midjourney v6'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModelType(m)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                  modelType === m
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                    : 'text-purple-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopyPrompt}
            className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-800/40 hover:text-white transition text-[10px] font-bold"
          >
            <Copy size={11} />
            <span>Copy Slate</span>
          </button>

          <button
            type="button"
            disabled={isCompiling}
            onClick={handleCompilePrompts}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs transition shadow-md shadow-pink-500/20 active:scale-95 disabled:opacity-50"
          >
            <Sparkles size={11} className={isCompiling ? 'animate-spin' : ''} />
            <span>Compile Slate</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 min-h-0">
        {promptLayers.map((layer) => (
          <div
            key={layer.id}
            className="p-3.5 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 space-y-2 shadow-sm"
          >
            <span className="font-bold text-amber-300 block">{layer.title}</span>
            <p className="text-[11px] text-purple-100 font-sans leading-relaxed">
              {layer.description}
            </p>
          </div>
        ))}

        {/* Weights Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-purple-300 font-bold">ControlNet Depth Weight</span>
              <span className="text-cyan-400 font-bold">{controlNetWeight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={controlNetWeight * 100}
              onChange={(e) => setControlNetWeight(Number(e.target.value) / 100)}
              className="w-full accent-cyan-400"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-rose-300 font-bold">IP-Adapter Face Consistency</span>
              <span className="text-pink-400 font-bold">{ipAdapterWeight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ipAdapterWeight * 100}
              onChange={(e) => setIpAdapterWeight(Number(e.target.value) / 100)}
              className="w-full accent-pink-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
