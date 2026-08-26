import React, { useState, useRef } from 'react';
import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  Scissors,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  Download,
  Film,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../../../lib/api';

export interface EditRoom3DProps {
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
}

// 3D Dynamic Reference Grading Monitors & Animated RGB Waveform Scopes
export const EditScene3D: React.FC = () => {
  const scopeRef = useRef<THREE.Mesh>(null);
  const trackball1 = useRef<THREE.Mesh>(null);
  const trackball2 = useRef<THREE.Mesh>(null);
  const trackball3 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (scopeRef.current) {
      scopeRef.current.position.y = Math.sin(t * 3) * 0.05;
    }
    if (trackball1.current) trackball1.current.rotation.y += delta * 0.8;
    if (trackball2.current) trackball2.current.rotation.x += delta * 0.6;
    if (trackball3.current) trackball3.current.rotation.z += delta * 0.9;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Primary Reference 4K Cinema Grading Monitor */}
      <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.12}>
        <group position={[-2, 1.4, -1]} rotation={[0, 0.25, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[3.2, 2.0, 0.1]} />
            <meshStandardMaterial color="#090518" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[3.0, 1.8]} />
            <meshStandardMaterial
              color="#0d0722"
              emissive="#d97706"
              emissiveIntensity={0.4}
              roughness={0.2}
            />
          </mesh>
        </group>
      </Float>

      {/* Secondary Dynamic Waveform RGB Parade Monitor */}
      <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.15}>
        <group position={[2, 1.4, -1]} rotation={[0, -0.25, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[3.2, 2.0, 0.1]} />
            <meshStandardMaterial color="#090518" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh ref={scopeRef} position={[0, 0, 0.06]}>
            <planeGeometry args={[3.0, 1.8]} />
            <meshStandardMaterial
              color="#030712"
              emissive="#10b981"
              emissiveIntensity={0.55}
              wireframe
            />
          </mesh>
        </group>
      </Float>

      {/* 3D Physical Color Grading Control Desk with 3-Way Lift/Gamma/Gain Trackballs */}
      <group position={[0, -0.6, 0]} rotation={[0.4, 0, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4.2, 0.2, 1.8]} />
          <meshStandardMaterial color="#0c071d" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Lift Trackball */}
        <group position={[-1.2, 0.15, 0]}>
          <mesh ref={trackball1}>
            <sphereGeometry args={[0.28, 24, 24]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} wireframe />
          </mesh>
        </group>

        {/* Gamma Trackball */}
        <group position={[0, 0.15, 0]}>
          <mesh ref={trackball2}>
            <sphereGeometry args={[0.28, 24, 24]} />
            <meshStandardMaterial color="#06b6d4" metalness={0.9} roughness={0.1} wireframe />
          </mesh>
        </group>

        {/* Gain Trackball */}
        <group position={[1.2, 0.15, 0]}>
          <mesh ref={trackball3}>
            <sphereGeometry args={[0.28, 24, 24]} />
            <meshStandardMaterial color="#ec4899" metalness={0.9} roughness={0.1} wireframe />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// Holographic Video Editing & Publishing Suite matching Sagas Image 3
export const EditRoomHolo: React.FC<EditRoom3DProps> = ({
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
}) => {
  const [aspectRatio, setAspectRatio] = useState<string>('YouTube (16:9)');
  const [activeSidebarTool, setActiveSidebarTool] = useState<string>('Media');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('00:00:01');

  const tools = ['Media', 'Text', 'Stock', 'Transitions', 'Subtitles'];

  const timelineClips = [
    { id: 'c1', name: 'Scene_1_Wide_Establishing.mp4', duration: '00:04.00', color: 'from-amber-600 to-amber-800' },
    { id: 'c2', name: 'Scene_1_Devon_CU.mp4', duration: '00:03.50', color: 'from-purple-600 to-purple-800' },
    { id: 'c3', name: 'Scene_1_Marcus_OTS.mp4', duration: '00:05.20', color: 'from-rose-600 to-rose-800' },
  ];

  return (
    <div className="relative z-10 flex flex-col w-full h-full max-w-5xl min-h-[520px] bg-[#0e0722]/95 border border-amber-500/30 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden font-sans">
      {/* Top Header Bar matching Image 3 */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-amber-500/25 bg-[#090416]/95 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Scissors className="text-amber-400 w-4 h-4" />
          <h3 className="text-sm font-bold text-amber-100 font-serif tracking-wide">
            05 Polish & Publish
          </h3>
          <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
            NLE FINISHING
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Aspect Ratio Selector */}
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="bg-[#140b2e] border border-amber-500/30 rounded-xl text-amber-200 text-xs font-mono px-3 py-1.5 focus:outline-none"
          >
            <option value="YouTube (16:9)">YouTube (16:9)</option>
            <option value="TikTok / Reels (9:16)">TikTok / Reels (9:16)</option>
            <option value="Cinema 4K (2.39:1)">Cinema 4K (2.39:1)</option>
          </select>

          {/* Add Audio Button */}
          <button
            onClick={() => toast.success('🎵 Audio stem tracks added to timeline')}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition shadow-sm"
          >
            + Add Audio
          </button>

          {/* Export Button */}
          <button
            onClick={() => toast.success('🚀 Exporting 4K Master Video Deliverable...')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-mono font-black transition shadow-md shadow-amber-500/20"
          >
            Export
          </button>
        </div>
      </div>

      {/* Main Studio Area: Tools Sidebar + Video Monitor */}
      <div className="flex flex-grow overflow-hidden min-h-0">
        {/* Left Tools Sidebar matching Image 3 */}
        <aside className="w-20 border-r border-amber-500/20 bg-[#080316]/90 p-2 flex flex-col items-center space-y-3 flex-shrink-0">
          {tools.map((tool) => (
            <button
              key={tool}
              onClick={() => setActiveSidebarTool(tool)}
              className={`w-full py-2 rounded-xl text-[10px] font-mono font-bold flex flex-col items-center gap-1 transition ${
                activeSidebarTool === tool
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-sm'
                  : 'text-amber-200/50 hover:bg-[#150a30] hover:text-white'
              }`}
            >
              <Film size={14} className={activeSidebarTool === tool ? 'text-amber-400' : 'text-purple-400'} />
              <span>{tool}</span>
            </button>
          ))}
        </aside>

        {/* Center: Video Preview Monitor matching Image 3 */}
        <div className="flex-grow flex flex-col bg-black items-center justify-between p-4 overflow-hidden">
          {/* Video Screen Frame */}
          <div className="w-full flex-grow flex items-center justify-center relative">
            <div
              className={`bg-zinc-950 border border-amber-500/30 rounded-2xl overflow-hidden relative shadow-2xl flex items-center justify-center ${
                aspectRatio.includes('9:16') ? 'h-64 aspect-[9/16]' : aspectRatio.includes('2.39:1') ? 'w-full max-w-xl aspect-[2.39/1]' : 'w-full max-w-lg aspect-[16/9]'
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80"
                alt="4K Video Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-black/60 border border-amber-400 text-amber-300 flex items-center justify-center hover:scale-110 transition shadow-xl"
                >
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
              <div className="absolute top-2 left-3 text-[10px] font-mono text-amber-300 bg-black/70 px-2 py-0.5 rounded border border-amber-500/30">
                4K UHD PREVIEW
              </div>
            </div>
          </div>

          {/* Video Scrubber & Playback Controls matching Image 3 */}
          <div className="w-full flex items-center justify-between px-4 py-2 bg-[#0d0722] border-t border-amber-500/20 text-xs font-mono mt-2 rounded-xl">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-amber-300 hover:text-white"
              >
                <Play size={14} fill="currentColor" />
              </button>
              <button
                onClick={() => setCurrentTime('00:00:00')}
                className="text-amber-300/70 hover:text-white"
              >
                <RotateCcw size={13} />
              </button>
              <span className="text-amber-200 font-bold">{currentTime}</span>
            </div>

            <div className="text-[10px] text-amber-300/70">
              Total Duration: <strong>00:01:15.00</strong> @ 24.00 FPS
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Multi-Track Non-Linear Editing Timeline matching Image 3 */}
      <div className="h-32 border-t border-amber-500/30 bg-[#090416] p-3 flex flex-col justify-between flex-shrink-0">
        {/* Timeline Tracks Header */}
        <div className="flex items-center justify-between text-[10px] font-mono text-amber-300/70 pb-1 border-b border-amber-500/20">
          <span>TIMELINE (VIDEO TRACK 1 & AUDIO STEMS)</span>
          <span>SNAP TO GRID: ON</span>
        </div>

        {/* Video Clips Strip */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {timelineClips.map((clip) => (
            <div
              key={clip.id}
              className={`p-2 rounded-xl bg-gradient-to-r ${clip.color} border border-amber-400/40 text-[10px] font-mono text-white flex-shrink-0 shadow-md flex items-center justify-between gap-3`}
            >
              <div className="truncate font-bold">🎬 {clip.name}</div>
              <span className="text-[9px] text-amber-200 bg-black/40 px-1.5 py-0.5 rounded">
                {clip.duration}
              </span>
            </div>
          ))}
        </div>

        {/* Audio Waveform Bed */}
        <div className="h-5 w-full bg-[#120729] rounded-lg border border-purple-900/60 overflow-hidden flex items-center px-2">
          <div className="w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-full opacity-80" />
        </div>
      </div>
    </div>
  );
};

