import React, { useRef, useState } from 'react';
import { X, Play, Pause, Maximize2, Volume2, VolumeX, Film, Sparkles, CheckCircle2 } from 'lucide-react';

interface StudioVideoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudioVideoTourModal: React.FC<StudioVideoTourModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-950/95 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">Arise Production Studio — Master Video Tour</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  1080p 60FPS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                10-Stage Hollywood Virtual Production Pipeline & Live Interactive Soundstage Tour
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
          <video
            ref={videoRef}
            src="/videos/arise_studio_walkthrough_demo.mp4"
            autoPlay
            loop
            playsInline
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Overlay Controls */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shadow-lg"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-xs font-mono text-slate-300">
                Full 10-Stage Walkthrough • 14 Rooms & AI Agents
              </span>
            </div>
            <button
              onClick={toggleFullScreen}
              className="p-2 rounded-lg bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Jump Markers */}
        <div className="px-6 py-3 bg-slate-900/40 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Includes 00 Idea Lab, ScriptBreak, Cork Board, ACEScg Plan, Previs 3D, Mocap, 5.1 Atmos & Distribution</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Broadcast Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioVideoTourModal;
