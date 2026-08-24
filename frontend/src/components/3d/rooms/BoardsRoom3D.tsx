"use client";

import React, { useState } from 'react';
import { Float } from '@react-three/drei';
import {
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  Film,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../../../lib/api';

export interface BoardsRoom3DProps {
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
}

// 3D In-Scene Spatial Storyboard Gallery Panels
export const BoardsScene3D: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Curved 3D Gallery Frame Panels */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[-3.2, 1.2, -0.8]} rotation={[0, 0.35, 0]}>
          <planeGeometry args={[2.2, 1.2]} />
          <meshStandardMaterial
            color="#1e1b4b"
            emissive="#312e81"
            emissiveIntensity={0.4}
            roughness={0.4}
          />
        </mesh>
      </Float>

      <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.15}>
        <mesh position={[0, 1.6, -1.2]} rotation={[0, 0, 0]}>
          <planeGeometry args={[2.8, 1.5]} />
          <meshStandardMaterial
            color="#2e1065"
            emissive="#581c87"
            emissiveIntensity={0.4}
            roughness={0.4}
          />
        </mesh>
      </Float>

      <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.22}>
        <mesh position={[3.2, 1.2, -0.8]} rotation={[0, -0.35, 0]}>
          <planeGeometry args={[2.2, 1.2]} />
          <meshStandardMaterial
            color="#1e1b4b"
            emissive="#312e81"
            emissiveIntensity={0.4}
            roughness={0.4}
          />
        </mesh>
      </Float>
    </group>
  );
};

// Holographic Storyboard Ref Panel
export const BoardsRoomHolo: React.FC<BoardsRoom3DProps> = ({
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
}) => {
  const [aspectRatio, setAspectRatio] = useState<'2.39:1' | '16:9' | '9:16'>('2.39:1');
  const [isPlayingAnimatic, setIsPlayingAnimatic] = useState<boolean>(false);

  const [panels, setPanels] = useState([
    {
      id: 'sb1',
      title: 'PANEL 1: DAWN ESTABLISHING WIDE (24mm)',
      description: 'Golden morning dawn sweeps across the quiet autumn street as Devon steps into frame holding the photograph.',
    },
    {
      id: 'sb2',
      title: 'PANEL 2: HERO CLOSE-UP (85mm T1.8)',
      description: 'Devon eyes reflect the morning light, examining the faded edges and architecture sketches of the archival picture.',
    },
    {
      id: 'sb3',
      title: 'PANEL 3: OVER-SHOULDER MENTORSHIP (35mm)',
      description: 'Marcus steps onto the porch carrying steaming mugs, offering steady presence and ancestral grounding.',
    },
    {
      id: 'sb4',
      title: 'PANEL 4: RESOLUTION HORIZON (50mm)',
      description: 'Devon lifts his gaze, looking out toward the waking city skyline with clarity and decisive intent.',
    },
  ]);

  const handleGeneratePanel = async (panelId: string) => {
    toast.loading('🎨 AI Storyboard Artist: Generating cinematic visual board...', { id: `gen-${panelId}` });

    try {
      const apiBase = getAPIBaseURL();
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate a detailed visual composition and camera staging description for Storyboard Panel (${panelId}) in project "${projectName}" (Scene: ${shotTitle}, Aspect: ${aspectRatio}). Keep it 2 sentences, describing framing, light direction, and subject pose.`,
          roomName: 'Storyboard Reference Studio',
          stageId: 'boards',
          role: 'Lead Storyboard Artist & Animatic Director AI',
          context: `Active Project: ${projectName}`,
        }),
      });

      const data = await res.json();
      if (data.success && (data.text || data.reply)) {
        const text = (data.text || data.reply).replace(/^"|"$/g, '').trim();
        setPanels((prev) =>
          prev.map((p) => (p.id === panelId ? { ...p, description: text } : p))
        );
        toast.success('✨ Storyboard Panel updated!', { id: `gen-${panelId}` });
      } else {
        toast.success('✨ Visual board refreshed.', { id: `gen-${panelId}` });
      }
    } catch {
      toast.error('AI connection error', { id: `gen-${panelId}` });
    }
  };

  return (
    <div className="relative z-10 flex flex-col w-full h-full max-w-5xl min-h-[460px] bg-[#140e2e]/90 border border-purple-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-900/50 bg-[#0e0922]/80 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <ImageIcon className="text-amber-400 w-4 h-4" />
          <span className="font-bold text-amber-200 uppercase font-serif tracking-wider">
            3D Storyboard Studio • Visual Animatics
          </span>
        </div>

        {/* Aspect Ratio Toggles */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-purple-400">Aspect Ratio:</span>
          <div className="flex bg-[#0c081e] p-0.5 rounded-lg border border-purple-900/60">
            {(['2.39:1', '16:9', '9:16'] as const).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                  aspectRatio === ratio
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-purple-400 hover:text-white'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsPlayingAnimatic((prev) => !prev);
              toast(isPlayingAnimatic ? 'Animatic Paused' : '▶️ 24 FPS Animatic Sequence Playing', { icon: '🎬' });
            }}
            className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-[11px] transition shadow-md shadow-amber-500/20"
          >
            <Play size={11} fill="currentColor" />
            <span>{isPlayingAnimatic ? 'Pause' : 'Play Animatic'}</span>
          </button>
        </div>
      </div>

      {/* Storyboard Panel Grid */}
      <div className="flex-grow p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
        {panels.map((panel, idx) => (
          <div
            key={panel.id}
            className="p-3.5 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 flex flex-col space-y-2.5 shadow-md hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 truncate">{panel.title}</span>
              <button
                type="button"
                onClick={() => handleGeneratePanel(panel.id)}
                className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition text-[9px] flex items-center gap-1"
                title="Generate Panel with AI"
              >
                <Sparkles size={10} />
                <span>AI Polish</span>
              </button>
            </div>

            {/* Simulated Anamorphic Camera Frame */}
            <div
              className={`w-full bg-[#171038] border border-purple-800/50 rounded-lg flex items-center justify-center relative overflow-hidden transition ${
                aspectRatio === '2.39:1'
                  ? 'h-24'
                  : aspectRatio === '16:9'
                  ? 'h-32'
                  : 'h-40'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <Film className="text-purple-500/30 w-8 h-8" />
              <div className="absolute bottom-2 left-2 text-[9px] text-amber-400/90 font-mono">
                Frame {idx + 1} • {aspectRatio} Cinema
              </div>
            </div>

            <p className="text-[11px] text-purple-100 font-sans leading-relaxed">
              {panel.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
