"use client";

import React, { useState, useRef } from 'react';
import { ProjectStatus } from '../types/types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Tv,
  Film,
  Smartphone,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';

interface VideoScreeningRoomProps {
  projectStatus: ProjectStatus;
}

export const VideoScreeningRoom: React.FC<VideoScreeningRoomProps> = ({ projectStatus }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(14.5);
  const [duration, setDuration] = useState<number>(45.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '2.39:1'>('16:9');
  const [selectedTake, setSelectedTake] = useState<string>('Take 3 (Final Grade)');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Available video takes / dailies for Episode 1: "Echoes of Absence"
  const shotTakes = [
    { id: 'take-01', name: 'Scene 1: Sunrise Porch Establishing (4K Master)', res: '4K DCI 24fps', date: '08:15 AM', status: 'Master Take 🟢' },
    { id: 'take-02', name: 'Scene 1: Devon & Marcus Dialogue Close-Up (ProRes 4444)', res: '4K 60fps', date: '09:30 AM', status: 'Circle Take 🟢' },
    { id: 'take-03', name: 'Scene 2: Vale Zoning Hearing Confrontation (4K DCI)', res: '4K ProRes 4444', date: '11:45 AM', status: 'Color Graded' },
    { id: 'take-04', name: 'Scene 2: Cassie Leaked Eviction Dossier (Cinema 2.39:1)', res: '4K ACEScg', date: '14:20 PM', status: 'Foley Mixed' },
    { id: 'take-05', name: 'Scene 3: Midnight Sub-Level Vault Search (HDR Low-Light)', res: '4K 60fps UE5.4', date: '18:05 PM', status: 'VFX Locked' },
    { id: 'take-06', name: 'Scene 3: Emergency Injunction & Dawn Stand (Master Episode Cut)', res: '4K DCI ProRes XQ', date: '21:30 PM', status: 'FINAL MASTER 🟢' },
  ];

  const formatTimecode = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    const frames = Math.floor((secs % 1) * 24);
    return `00:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const handleStepFrame = (delta: number) => {
    setCurrentTime((t) => Math.max(0, Math.min(duration, t + delta * (1 / 24))));
  };

  const handleExport = () => {
    toast.success('🎬 Exporting master video cut with EDL conform...');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/70 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Film size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Studio 4K Video Screening Room & Dailies</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                CALIBRATED
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Project: <span className="text-amber-300 font-bold">{projectStatus.projectName}</span> • Master Timeline Player
            </p>
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setAspectRatio('16:9')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
              aspectRatio === '16:9' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv size={12} />
            <span>16:9 Widescreen</span>
          </button>
          <button
            onClick={() => setAspectRatio('2.39:1')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
              aspectRatio === '2.39:1' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film size={12} />
            <span>2.39:1 Anamorphic</span>
          </button>
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
              aspectRatio === '9:16' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone size={12} />
            <span>9:16 Vertical</span>
          </button>
        </div>
      </div>

      {/* Main Screening Canvas & Controls */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Center Video Viewport */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
          {/* Simulated 4K Cinematic Viewport */}
          <div
            className={`relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center transition-all duration-300 ${
              aspectRatio === '16:9'
                ? 'w-full max-w-4xl aspect-video'
                : aspectRatio === '2.39:1'
                ? 'w-full max-w-5xl aspect-[2.39/1]'
                : 'h-full max-h-[560px] aspect-[9/16]'
            }`}
          >
            {/* Cinematic Gradient / 3D Canvas Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-amber-950/30 flex items-center justify-center">
              <div className="text-center space-y-3 p-6 select-none">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <Film className="w-10 h-10 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 uppercase tracking-widest font-serif">
                    {projectStatus.projectName}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-mono mt-0.5">
                    {selectedTake} • 3840x2160 UHD • Rec.709
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>CineCameraActor 35mm Prime Active</span>
                </div>
              </div>
            </div>

            {/* Timecode Overlay */}
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs text-amber-300 font-bold">
              TC: {formatTimecode(currentTime)}
            </div>

            {/* Stage Tag */}
            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
              Pass: <strong className="text-emerald-400">Master Dailies</strong>
            </div>

            {/* Proof-of-Ownership Arise Productions Logo Watermark */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2 bg-black/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-amber-500/50 shadow-lg">
              <div className="w-5 h-5 rounded overflow-hidden bg-black border border-amber-500/60 flex-shrink-0">
                <img
                  src={ARISE_LOGO_BASE64}
                  alt="Arise Productions"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[9px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif tracking-wider">
                  ARISE PRODUCTIONS
                </span>
                <span className="text-[7px] text-[#E2BA86] font-mono">
                  © 2026 THE AI CONTENT FOUNDRY, LLC
                </span>
              </div>
            </div>

            {/* Center Big Play Button */}
            {!isPlaying && (
              <button
                onClick={handleTogglePlay}
                className="absolute w-16 h-16 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl transition hover:scale-110"
              >
                <Play size={26} className="ml-1" />
              </button>
            )}
          </div>

          {/* Scrubber & Playback Controls Bar */}
          <div className="w-full max-w-4xl mt-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            {/* Scrubber track */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration}
                step={0.0416}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>{formatTimecode(currentTime)}</span>
                <span>{formatTimecode(duration)}</span>
              </div>
            </div>

            {/* Transport controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStepFrame(-1)}
                  title="Previous Frame (<)"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                >
                  <ChevronLeft size={14} />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 text-xs transition"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={() => handleStepFrame(1)}
                  title="Next Frame (>)"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                >
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={() => setCurrentTime(0)}
                  title="Rewind to Start"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                >
                  <RotateCcw size={14} />
                </button>

                {/* Speed switcher */}
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 focus:outline-none"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1.0}>1.0x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2.0}>2.0x</option>
                </select>
              </div>

              {/* Volume and Export */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} />}
                </button>

                <button
                  onClick={handleExport}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-mono transition"
                >
                  <Download size={13} />
                  <span>Export Video</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Rail: Takes & Dailies Selector */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/60 p-5 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-amber-400" />
              <span>Shot Takes & Dailies</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">3 Available</span>
          </div>

          <div className="space-y-2.5">
            {shotTakes.map((take) => (
              <button
                key={take.id}
                onClick={() => setSelectedTake(take.name)}
                className={`w-full p-3 rounded-xl border text-left transition space-y-1.5 ${
                  selectedTake === take.name
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{take.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {take.res}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{take.status}</span>
                  <span>{take.date}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              <span>Camera & Color Scopes</span>
            </h4>
            <div className="space-y-1 text-[11px] font-mono text-slate-400">
              <p>• Color Space: <strong className="text-slate-200">ACEScg / Rec.709</strong></p>
              <p>• Camera Science: <strong className="text-slate-200">Blackmagic Gen 5 BRAW</strong></p>
              <p>• CineCamera: <strong className="text-slate-200">35mm Prime f/1.8</strong></p>
              <p>• Audio Loudness: <strong className="text-slate-200">-24.0 LKFS Broadcast</strong></p>
            </div>

            <button
              onClick={async () => {
                const toastId = toast.loading('🎬 Compiling DaVinci Resolve Timeline (ACEScc)...');
                try {
                  const apiBase = typeof window !== 'undefined'
                    ? (window.location.port === '5173' || window.location.port === '3000'
                        ? `http://${window.location.hostname}:4000`
                        : '')
                    : '';
                  const res = await fetch(`${apiBase}/api/v1/editorial/export-timeline`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      projectId: projectStatus.projectId || 'proj-fatherless-child',
                      shots: projectStatus.shots || [],
                    }),
                  });
                  const data = await res.json();
                  if (data && data.success && data.edlContent) {
                    const blob = new Blob([data.edlContent], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${(projectStatus.projectName || 'Arise_Production').replace(/[^a-zA-Z0-9]/g, '_')}_DaVinci_Timeline.edl`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    toast.success('✨ Exported DaVinci Resolve EDL Timeline!', { id: toastId });
                  } else {
                    toast.error('Failed to compile timeline', { id: toastId });
                  }
                } catch {
                  toast.error('Export request failed', { id: toastId });
                }
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:opacity-90 text-black font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition text-xs"
            >
              <Download size={14} />
              <span>Export DaVinci Resolve Timeline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoScreeningRoom;
