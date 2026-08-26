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

// Holographic Storyboard Ref Panel matching Sagas Image 5
export const BoardsRoomHolo: React.FC<BoardsRoom3DProps> = ({
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
}) => {
  const [aspectRatio, setAspectRatio] = useState<'2.39:1' | '16:9' | '9:16'>('16:9');
  const [isPlayingAnimatic, setIsPlayingAnimatic] = useState<boolean>(false);
  const [editingShot, setEditingShot] = useState<any | null>(null);

  const [shots, setShots] = useState([
    {
      scene: 'Scene 1',
      shot: 'Shot 1',
      title: "Establishing shot - Devon's Studio",
      img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      description: 'Wide establishing exterior under amber street lamps as rain streaks the pavement.',
    },
    {
      scene: 'Scene 1',
      shot: 'Shot 2',
      title: 'Devon',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      description: 'Close-up on Devon analyzing the faded architectural blueprints under desk lamp.',
    },
    {
      scene: 'Scene 1',
      shot: 'Shot 3',
      title: 'Marcus',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      description: 'Medium shot of Marcus stepping into frame holding steaming coffee mugs.',
    },
    {
      scene: 'Scene 2',
      shot: 'Shot 1',
      title: 'Governor Sara Al-Khara',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      description: 'Low-angle medium close-up inside the boardroom with cold corporate lighting.',
    },
    {
      scene: 'Scene 2',
      shot: 'Shot 2',
      title: 'Cassie Thornfield',
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      description: 'Sunlit pool patio exterior, Cassie glancing suspiciously across the courtyard.',
    },
    {
      scene: 'Scene 2',
      shot: 'Shot 3',
      title: 'Det. Victor Ramirez',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      description: 'Exterior street tracking shot beside a classic sedan under golden hour lighting.',
    },
  ]);

  const handleExportPDF = () => {
    const doc = `# ${projectName.toUpperCase()} — STORYBOARD SHOT LIST
© 2026 ARISE PRODUCTIONS • ALL RIGHTS RESERVED

` + shots.map((s) => `### ${s.scene} — ${s.shot}: ${s.title}
- **Description:** ${s.description}
- **Aspect Ratio:** ${aspectRatio}
`).join('\n---\n\n');

    const blob = new Blob([doc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Storyboards.md`;
    a.click();
    toast.success('📥 Exported Storyboard Shot List!');
  };

  return (
    <div className="relative z-10 flex flex-col w-full h-full max-w-5xl min-h-[480px] bg-[#0e0722]/95 border border-amber-500/30 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden font-sans">
      {/* Header matching Image 5 */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-amber-500/25 bg-[#090416]/90 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <ImageIcon className="text-amber-400 w-5 h-5" />
          <h3 className="text-base font-bold text-amber-100 font-serif tracking-wide">
            Storyboards
          </h3>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
            04 STORYBOARDING
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-[#140b2e] p-0.5 rounded-xl border border-amber-500/30 text-xs font-mono">
            {(['2.39:1', '16:9', '9:16'] as const).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  aspectRatio === ratio
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-amber-300/70 hover:text-white'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition shadow-sm"
          >
            <Download size={13} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Storyboards Grid matching Image 5 */}
      <div className="flex-grow p-4 lg:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-0 custom-scrollbar">
        {shots.map((shot, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#070314]/90 border border-amber-500/25 overflow-hidden flex flex-col justify-between shadow-lg hover:border-amber-400/60 transition group"
          >
            {/* Card Top Bar matching Image 5 */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#120729] border-b border-amber-500/20 text-xs font-mono">
              <span className="text-amber-200 font-bold">
                {shot.scene} &nbsp; {shot.shot}
              </span>
              <button
                onClick={() => {
                  toast.success(`Editing ${shot.scene} ${shot.shot}`);
                  setEditingShot(shot);
                }}
                className="px-2.5 py-0.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold transition shadow-sm"
              >
                Edit
              </button>
            </div>

            {/* Visual Thumbnail Frame */}
            <div
              className={`w-full bg-black relative overflow-hidden flex items-center justify-center ${
                aspectRatio === '9:16' ? 'h-52' : aspectRatio === '2.39:1' ? 'h-32' : 'h-40'
              }`}
            >
              <img
                src={shot.img}
                alt={shot.title}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex items-center justify-center">
                <button
                  onClick={() => toast.success(`Playing animatic for ${shot.title}`)}
                  className="w-10 h-10 rounded-full bg-black/60 border border-amber-400/60 text-amber-300 flex items-center justify-center shadow-lg transition hover:scale-110 hover:bg-amber-500 hover:text-black"
                >
                  <Play size={16} fill="currentColor" />
                </button>
              </div>
            </div>

            {/* Card Caption Footer matching Image 5 */}
            <div className="p-3 bg-[#0d0622] border-t border-amber-500/20 space-y-1">
              <h4 className="text-xs font-bold text-amber-200 truncate font-serif">
                {shot.title}
              </h4>
              <p className="text-[10px] text-amber-100/70 line-clamp-2 leading-relaxed">
                {shot.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
