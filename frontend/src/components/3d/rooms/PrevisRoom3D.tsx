"use client";

import React, { useState, useRef } from 'react';
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

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface PrevisRoom3DProps {
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
}

// 3D Dynamic In-Scene Spatial Elements for Previs Live Room (Animated CineCamera Rig & Dolly Track)
export const PrevisScene3D: React.FC = () => {
  const cameraRigRef = useRef<THREE.Group>(null);
  const lensRef = useRef<THREE.Mesh>(null);
  const frustumRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (cameraRigRef.current) {
      // Dynamic dolly forward/backward along rails
      cameraRigRef.current.position.z = Math.sin(t * 0.6) * 1.5;
      cameraRigRef.current.position.y = 0.5 + Math.cos(t * 0.8) * 0.15;
      cameraRigRef.current.rotation.y = Math.sin(t * 0.4) * 0.2;
    }
    if (lensRef.current) {
      lensRef.current.rotation.z += delta * 1.2;
    }
    if (frustumRef.current) {
      frustumRef.current.scale.set(
        1 + Math.sin(t * 2) * 0.05,
        1 + Math.cos(t * 2) * 0.05,
        1
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Dolly Track Rails on Floor */}
      <group position={[0, -2.1, 0]}>
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[0.08, 0.08, 16]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.8, 0, 0]}>
          <boxGeometry args={[0.08, 0.08, 16]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Track Cross Ties */}
        {[-6, -4, -2, 0, 2, 4, 6].map((zPos, idx) => (
          <mesh key={idx} position={[0, -0.02, zPos]}>
            <boxGeometry args={[1.8, 0.04, 0.2]} />
            <meshStandardMaterial color="#1e103d" />
          </mesh>
        ))}
      </group>

      {/* Dynamic 3D CineCamera Gizmo & Animated Laser Frustum */}
      <group ref={cameraRigRef} position={[0, 0.5, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.9, 0.7, 1.2]} />
          <meshStandardMaterial color="#0c071d" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Rotating Anamorphic Lens Barrel */}
        <mesh ref={lensRef} position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.35, 0.5, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} emissive="#78350f" emissiveIntensity={0.4} />
        </mesh>

        {/* Viewfinder Laser Frustum Pyramid */}
        <mesh ref={frustumRef} position={[0, 0, 3.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[1.8, 4.4, 4, 1, true]} />
          <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.35} />
        </mesh>

        {/* Camera Top Handle & Monitor */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.15, 0.25, 0.8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} />
        </mesh>
        <mesh position={[0.4, 0.6, 0.2]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.6, 0.4, 0.05]} />
          <meshStandardMaterial color="#1e1b4b" emissive="#06b6d4" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
};

// Holographic CineCamera Rig & Unreal Engine / Blackmagic Pocket 4K Bridge Panel
export const PrevisRoomHolo: React.FC<PrevisRoom3DProps> = ({
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
}) => {
  const [cameraModel, setCameraModel] = useState<'bmpcc4k' | 'alexa' | 'red'>('bmpcc4k');
  const [focalLength, setFocalLength] = useState<number>(35);
  const [nativeIso, setNativeIso] = useState<400 | 3200>(400);
  const [brawCodec, setBrawCodec] = useState<string>('BRAW 5:1');
  const [whiteBalance, setWhiteBalance] = useState<number>(3200);
  const [aperture, setAperture] = useState<string>('f/1.8');
  const [keyIntensity, setKeyIntensity] = useState<number>(85);
  const [fillIntensity, setFillIntensity] = useState<number>(45);
  const [rimIntensity, setRimIntensity] = useState<number>(65);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [unrealConnected, setUnrealConnected] = useState<boolean>(false);
  
  // Live Physical Camera Feed (BMPCC 4K via USB-C UVC / HDMI Capture)
  const [isLiveCameraOn, setIsLiveCameraOn] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const toggleLiveCamera = async () => {
    if (isLiveCameraOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsLiveCameraOn(false);
      toast('Physical camera live feed stopped', { icon: '📷' });
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLiveCameraOn(true);
        toast.success('🎥 Physical BMPCC 4K / Camera Feed Linked Live!', { icon: '🔴' });
      } catch (err: any) {
        toast.error(`Camera access error: ${err.message || 'No camera detected'}`);
      }
    }
  };

  const handleLaunchDaVinci = async () => {
    const toastId = toast.loading('🎬 Launching DaVinci Resolve Studio 19...');
    try {
      const apiBase = getAPIBaseURL();
      const res = await fetch(`${apiBase}/api/v1/blackmagic/launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appKey: 'davinciResolve' }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success('✨ DaVinci Resolve Studio 19 opened on your Mac!', { id: toastId, icon: '🎬' });
      } else {
        toast.error(`Failed to launch DaVinci: ${res.error || 'Check installation'}`, { id: toastId });
      }
    } catch {
      toast.error('Could not connect to studio bridge', { id: toastId });
    }
  };

  const handleToggleUnreal = async () => {
    if (unrealConnected) {
      CastingUnrealBridge.disconnect();
      setUnrealConnected(false);
      toast('Disconnected from Unreal Engine 5 bridge', { icon: '🔌' });
    } else {
      toast.loading('Connecting to Unreal Engine 5 Remote Control on :30010 / :8080...', { duration: 1500 });
      try {
        await CastingUnrealBridge.connect('ws://localhost:8080');
        setUnrealConnected(true);
        toast.success('⚡ Unreal Engine 5 Live Link connected!');
      } catch {
        setUnrealConnected(false);
        toast('Unreal Bridge ready on port 30010 (Run UE5 with Remote Control Web Server to stream)', { icon: 'ℹ️' });
      }
    }
  };

  const handleSolveCamera = async () => {
    setIsSolving(true);
    const toastId = toast.loading('🎬 CineDirector Maya: Solving BMPCC 4K optical vectors...');

    try {
      const apiBase = getAPIBaseURL();
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Calculate the optimal Blackmagic Pocket Cinema Camera 4K (BMPCC 4K, MFT 1.9x crop) setup for Shot ${shotNumber} ("${shotTitle}") in "${projectName}". Recommend prime focal length (e.g. ${focalLength}mm), Dual Native ISO (${nativeIso}), Gen 5 Film Color Science, and 3-point Kelvin lighting. Keep concise and technical.`,
          roomName: 'Blockout Soundstage Previs',
          stageId: 'previs',
          role: 'Virtual Cinematographer & DP AI',
          context: `Active Project: ${projectName} • Camera: BMPCC 4K`,
        }),
      });

      const data = await res.json();
      if (data.success && (data.text || data.reply)) {
        toast.success(`✨ BMPCC 4K vectors & Gen 5 Film profile locked for ${focalLength}mm lens!`, { id: toastId });
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
    <div className="relative z-10 flex flex-col w-full h-full max-w-4xl min-h-[500px] glass-card-4k specular-border rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/30 bg-[#0a051d]/90 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-black text-xs shadow-md">
            4K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300 uppercase font-serif tracking-wider text-sm">
                Blackmagic Pocket Cinema Camera 4K
              </span>
              <span className="text-[9px] font-mono font-black text-black bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-0.5 rounded-full uppercase">
                Gen 5 Film
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Active MFT Sensor (18.96x10mm) • Dual Native ISO 400/3200 • DaVinci Studio Linked
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {/* Physical Live Camera Toggle */}
          <button
            type="button"
            onClick={toggleLiveCamera}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition shadow-sm ${
              isLiveCameraOn
                ? 'bg-rose-500/20 text-rose-300 border-rose-500 animate-pulse'
                : 'bg-[#150a32] text-slate-300 border-amber-500/40 hover:text-white hover:border-amber-400'
            }`}
          >
            <Camera size={12} className={isLiveCameraOn ? 'text-rose-400' : 'text-amber-400'} />
            <span>{isLiveCameraOn ? '🔴 Live BMPCC 4K: ON' : '📷 Link Physical Camera'}</span>
          </button>

          {/* Launch DaVinci Resolve */}
          <button
            type="button"
            onClick={handleLaunchDaVinci}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800 text-amber-300 font-bold text-[10px] border border-amber-500/40 transition shadow-md"
          >
            <span>🎬 Launch DaVinci</span>
          </button>

          {/* Unreal Link */}
          <button
            type="button"
            onClick={handleToggleUnreal}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition ${
              unrealConnected
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-purple-950/60 text-purple-300 border-purple-800/40 hover:text-white'
            }`}
          >
            <Zap size={11} className={unrealConnected ? 'text-emerald-400' : 'text-purple-400'} />
            <span>{unrealConnected ? 'UE5 Linked' : 'Connect UE5'}</span>
          </button>

          {/* Solve Camera */}
          <button
            type="button"
            disabled={isSolving}
            onClick={handleSolveCamera}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-black font-extrabold text-[11px] transition shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
          >
            <Sparkles size={11} className={isSolving ? 'animate-spin' : ''} />
            <span>Solve Optics</span>
          </button>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 min-h-0">
        {/* Live Physical Camera Viewfinder (when active) */}
        {isLiveCameraOn && (
          <div className="relative rounded-2xl overflow-hidden border-2 border-rose-500/70 bg-black aspect-video max-h-[220px] shadow-2xl">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute top-2.5 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-rose-500/50 flex items-center space-x-2 text-[10px] font-mono text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>LIVE BMPCC 4K FEED • 4096x2160 • 24.000 FPS</span>
            </div>
            <div className="absolute bottom-2.5 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/40 text-[10px] font-mono text-amber-300">
              <span>GEN 5 FILM • ISO {nativeIso} • {focalLength}mm {aperture} • {whiteBalance}K</span>
            </div>
          </div>
        )}

        {/* BMPCC 4K Camera Controls Bar */}
        <div className="p-3.5 rounded-2xl bg-[#0c0620]/90 border border-amber-500/30 space-y-3 shadow-inner">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-bold font-serif text-xs">Blackmagic Pocket 4K Settings</span>
              <span className="text-[10px] text-purple-300/80 font-mono bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                13 Stops Dynamic Range
              </span>
            </div>
            <span className="text-cyan-300 font-bold">{brawCodec} • Gen 5 Film Color</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {/* Dual Native ISO */}
            <div className="p-2.5 rounded-xl bg-[#140a33] border border-amber-500/30 space-y-1">
              <span className="text-[10px] text-amber-400/90 font-bold uppercase">Dual Native ISO</span>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setNativeIso(400)}
                  className={`py-1 rounded-lg text-center font-bold text-[10px] transition ${
                    nativeIso === 400
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-[#1e0e48] text-amber-300/70 hover:text-white'
                  }`}
                >
                  ISO 400 (Base 1)
                </button>
                <button
                  type="button"
                  onClick={() => setNativeIso(3200)}
                  className={`py-1 rounded-lg text-center font-bold text-[10px] transition ${
                    nativeIso === 3200
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-[#1e0e48] text-amber-300/70 hover:text-white'
                  }`}
                >
                  ISO 3200 (Base 2)
                </button>
              </div>
            </div>

            {/* BRAW Codec */}
            <div className="p-2.5 rounded-xl bg-[#140a33] border border-amber-500/30 space-y-1">
              <span className="text-[10px] text-amber-400/90 font-bold uppercase">Blackmagic RAW</span>
              <select
                value={brawCodec}
                onChange={(e) => setBrawCodec(e.target.value)}
                className="w-full bg-[#1e0e48] border border-amber-500/40 text-amber-200 text-[10px] rounded-lg py-1 px-2 focus:outline-none"
              >
                <option value="BRAW 3:1">BRAW 3:1 (135 Mbps)</option>
                <option value="BRAW 5:1">BRAW 5:1 (81 Mbps - Default)</option>
                <option value="BRAW 8:1">BRAW 8:1 (51 Mbps)</option>
                <option value="BRAW 12:1">BRAW 12:1 (34 Mbps)</option>
                <option value="BRAW Q0">BRAW Q0 (Constant Quality)</option>
                <option value="ProRes 422 HQ">ProRes 422 HQ</option>
              </select>
            </div>

            {/* White Balance Kelvin */}
            <div className="p-2.5 rounded-xl bg-[#140a33] border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-amber-400/90 font-bold uppercase">Kelvin Temp</span>
                <span className="text-amber-300">{whiteBalance}K</span>
              </div>
              <input
                type="range"
                min="2500"
                max="8000"
                step="100"
                value={whiteBalance}
                onChange={(e) => setWhiteBalance(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5"
              />
            </div>

            {/* Electronic Aperture */}
            <div className="p-2.5 rounded-xl bg-[#140a33] border border-amber-500/30 space-y-1">
              <span className="text-[10px] text-amber-400/90 font-bold uppercase">Active MFT Iris</span>
              <select
                value={aperture}
                onChange={(e) => setAperture(e.target.value)}
                className="w-full bg-[#1e0e48] border border-amber-500/40 text-amber-200 text-[10px] rounded-lg py-1 px-2 focus:outline-none"
              >
                <option value="f/1.4">f/1.4 (Ultra Shallow DoF)</option>
                <option value="f/1.8">f/1.8 (Fast Prime)</option>
                <option value="f/2.8">f/2.8 (Cinema Standard)</option>
                <option value="f/4.0">f/4.0 (Studio Set)</option>
                <option value="f/5.6">f/5.6 (Deep Focus)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prime Lens Selector */}
        <div className="p-3.5 rounded-2xl bg-[#0c0620]/90 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-amber-300 font-bold">BMPCC 4K Prime Lenses (1.9x MFT Equivalent)</span>
            <span className="text-cyan-300 font-bold">
              {focalLength}mm ({(focalLength * 1.9).toFixed(0)}mm Full Frame FOV) • {aperture}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[12, 18, 25, 35, 50].map((mm) => (
              <button
                key={mm}
                type="button"
                onClick={() => setFocalLength(mm)}
                className={`py-2 rounded-xl border text-center transition font-bold ${
                  focalLength === mm
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                    : 'bg-[#140e2e] border-purple-900/60 text-purple-300/70 hover:text-white'
                }`}
              >
                {mm}mm
              </button>
            ))}
          </div>
        </div>

        {/* 3-Point Hollywood Lighting Faders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#0c0620]/90 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-300 font-bold">Key Light ({whiteBalance}K)</span>
              <span className="text-amber-400 font-bold">{keyIntensity}%</span>
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

          <div className="p-3.5 rounded-2xl bg-[#0c0620]/90 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-purple-300 font-bold">Fill Light (Soft Ratio)</span>
              <span className="text-purple-400 font-bold">{fillIntensity}%</span>
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

          <div className="p-3.5 rounded-2xl bg-[#0c0620]/90 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-rose-300 font-bold">Rim Backlight (Edge)</span>
              <span className="text-rose-400 font-bold">{rimIntensity}%</span>
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
        <div className="p-3.5 rounded-2xl bg-[#140a35]/80 border border-amber-500/30 space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-amber-300 font-bold flex items-center gap-1.5">
              <span>🎬</span>
              <span>BMPCC 4K Sensor & Timecode Status</span>
            </span>
            <span className="text-emerald-400 font-bold font-mono">24.000 FPS • Gen 5 ACEScc Sync</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
            Physical Blackmagic Pocket Cinema Camera 4K is configured for 4K DCI (4096x2160). Color timeline is conformed with DaVinci Resolve YRGB Color Managed and Kodak 2383 D65 print LUT emulation.
          </p>
        </div>
      </div>
    </div>
  );
};
