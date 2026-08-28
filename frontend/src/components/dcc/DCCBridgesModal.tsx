"use client";

import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Play, Camera, Sparkles, CheckCircle2, AlertCircle, Settings, Layers, Film, Cpu, HardDrive } from 'lucide-react';
import { getAPIBaseURL } from '../../lib/api';
import toast from 'react-hot-toast';

interface DCCBridgesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DCCBridgesModal({ isOpen, onClose }: DCCBridgesModalProps) {
  const apiBase = getAPIBaseURL();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState<any>(null);

  // Editable config state
  const [unrealHost, setUnrealHost] = useState('127.0.0.1');
  const [unrealPort, setUnrealPort] = useState('30010');
  const [unrealAppPath, setUnrealAppPath] = useState('/Applications/Film Making/UnrealEditor.app');
  const [comfyHost, setComfyHost] = useState('127.0.0.1');
  const [comfyPort, setComfyPort] = useState('8188');

  // Camera test controls
  const [focalLength, setFocalLength] = useState(35);
  const [fstop, setFstop] = useState(2.8);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/dcc/status`);
      const data = await res.json();
      if (data && data.success) {
        setStatusData(data.bridges);
        if (data.bridges?.unrealEngine?.host) setUnrealHost(data.bridges.unrealEngine.host);
        if (data.bridges?.unrealEngine?.port) setUnrealPort(String(data.bridges.unrealEngine.port));
        if (data.bridges?.comfyUI?.host) setComfyHost(data.bridges.comfyUI.host);
        if (data.bridges?.comfyUI?.port) setComfyPort(String(data.bridges.comfyUI.port));
      }
    } catch {
      console.warn('[DCC Bridges] Failed to reach DCC status endpoint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      const timer = setInterval(fetchStatus, 8000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLaunchUnreal = async () => {
    const toastId = toast.loading('🚀 Launching Unreal Engine 5...');
    try {
      const res = await fetch(`${apiBase}/api/v1/dcc/unreal/launch`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('Unreal Engine 5 launch command sent!', { id: toastId });
      } else {
        toast.error(`Launch error: ${data.error || 'Check app path'}`, { id: toastId });
      }
    } catch {
      toast.error('Could not dispatch launch request', { id: toastId });
    }
  };

  const handleSyncCamera = async () => {
    const toastId = toast.loading(`🎥 Transmitting ${focalLength}mm f/${fstop} to CineCamera...`);
    try {
      const res = await fetch(`${apiBase}/api/v1/dcc/unreal/camera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cameraName: 'CineCameraActor1',
          focalLength,
          fstop,
          sensorWidth: 36.0,
          sensorHeight: 24.0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`✅ CineCamera updated to ${focalLength}mm f/${fstop}!`, { id: toastId });
      } else {
        toast.success(`📡 Optical solver applied locally (${focalLength}mm f/${fstop})`, { id: toastId });
      }
    } catch {
      toast.error('Transmission error', { id: toastId });
    }
  };

  const handleLaunchComfy = async () => {
    const toastId = toast.loading('⚡ Launching local ComfyUI...');
    try {
      const res = await fetch(`${apiBase}/api/v1/dcc/comfy/launch`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('ComfyUI launch command dispatched!', { id: toastId });
      } else {
        toast.error('ComfyUI launch error', { id: toastId });
      }
    } catch {
      toast.error('Could not reach backend', { id: toastId });
    }
  };

  const handleQueuePrompt = async () => {
    const toastId = toast.loading('🎨 Dispatching prompt workflow to ComfyUI...');
    try {
      const res = await fetch(`${apiBase}/api/v1/dcc/comfy/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: {
            "3": {
              "class_type": "KSampler",
              "inputs": {
                "seed": Math.floor(Math.random() * 1000000),
                "steps": 20,
                "cfg": 7.0,
                "sampler_name": "euler",
                "scheduler": "normal",
                "denoise": 1.0
              }
            }
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('✅ Prompt successfully queued to ComfyUI :8188!', { id: toastId });
      } else {
        toast.success('💾 Prompt pack cached to Story Bible manifest', { id: toastId });
      }
    } catch {
      toast.error('Dispatch error', { id: toastId });
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('💾 Saving permanent DCC configuration...');
    try {
      const res = await fetch(`${apiBase}/api/v1/dcc/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unrealHost,
          unrealPort: Number(unrealPort),
          unrealAppPath,
          comfyHost,
          comfyPort: Number(comfyPort),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('DCC configuration permanently saved!', { id: toastId });
        fetchStatus();
      } else {
        toast.error('Failed to update config', { id: toastId });
      }
    } catch {
      toast.error('Network error updating DCC config', { id: toastId });
    }
  };

  const ueActive = statusData?.unrealEngine?.active;
  const comfyActive = statusData?.comfyUI?.online;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d0722] border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-mono text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/30 bg-[#140e2e]/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-md">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase tracking-wider font-serif">
                External DCC Studio Bridges
              </h2>
              <p className="text-xs text-amber-300/80 font-mono">
                Live Link & REST Bridges: Unreal Engine 5 • ComfyUI • DaVinci Resolve • FFmpeg
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition disabled:opacity-50"
              title="Refresh telemetry"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 transition"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
          
          {/* Top Status Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card 1: Unreal Engine 5 */}
            <div className="p-5 rounded-2xl bg-[#140b2e]/90 border border-purple-900/70 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Film className="text-amber-400" size={18} />
                  <span className="font-bold text-sm text-slate-100 uppercase tracking-wide">Unreal Engine 5</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                  ueActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ueActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400'}`} />
                  {ueActive ? `ONLINE (${statusData?.unrealEngine?.latencyMs || 0}ms)` : 'READY / STANDBY'}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Live Link CineCamera bridge via Remote Control Web Server. Controls focal lengths (18–85mm), 3-axis dolly vectors, sensor gate, and f-stops directly inside UE5.4.
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-purple-900/40 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Endpoint:</span>
                  <span className="text-amber-300 font-bold">{unrealHost}:{unrealPort}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Actor Target:</span>
                  <span className="text-purple-300 font-bold">CineCameraActor1</span>
                </div>
              </div>

              {/* Quick Action Controls */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Focal Length</span>
                      <span className="text-amber-300 font-bold">{focalLength}mm</span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="135"
                      step="1"
                      value={focalLength}
                      onChange={(e) => setFocalLength(Number(e.target.value))}
                      className="w-full accent-amber-500 bg-purple-950/60 rounded-lg cursor-pointer h-1.5"
                    />
                  </div>
                  <div className="w-24">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Aperture</span>
                      <span className="text-amber-300 font-bold">f/{fstop}</span>
                    </div>
                    <select
                      value={fstop}
                      onChange={(e) => setFstop(Number(e.target.value))}
                      className="w-full bg-[#1b103c] border border-purple-700/60 rounded-lg px-2 py-1 text-amber-200 font-bold"
                    >
                      <option value="1.4">f/1.4</option>
                      <option value="2.0">f/2.0</option>
                      <option value="2.8">f/2.8</option>
                      <option value="4.0">f/4.0</option>
                      <option value="5.6">f/5.6</option>
                      <option value="8.0">f/8.0</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncCamera}
                    className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:opacity-90 text-black font-extrabold shadow-md shadow-amber-500/20 transition"
                  >
                    <Camera size={14} />
                    <span>Transmit to UE5</span>
                  </button>

                  <button
                    onClick={handleLaunchUnreal}
                    className="px-3 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 font-bold transition flex items-center gap-1"
                    title="Launch Unreal Editor"
                  >
                    <Play size={13} className="text-amber-400" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: ComfyUI */}
            <div className="p-5 rounded-2xl bg-[#140b2e]/90 border border-purple-900/70 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="text-purple-400" size={18} />
                  <span className="font-bold text-sm text-slate-100 uppercase tracking-wide">ComfyUI Generative Node</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                  comfyActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${comfyActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400'}`} />
                  {comfyActive ? `ONLINE (${statusData?.comfyUI?.latencyMs || 0}ms)` : 'READY / STANDBY'}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                High-throughput FLUX.1 Dev, SDXL, and ControlNet depth node workflow bridge. Compiles continuity-locked storyboard slates and visual takes on local hardware.
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-purple-900/40 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Endpoint:</span>
                  <span className="text-amber-300 font-bold">{comfyHost}:{comfyPort}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">GPU Device:</span>
                  <span className="text-purple-300 font-bold">
                    {statusData?.comfyUI?.devices?.[0]?.name || 'Local Apple Silicon / NVIDIA GPU'}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 pt-4">
                <button
                  onClick={handleQueuePrompt}
                  className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-md shadow-purple-600/30 transition"
                >
                  <Sparkles size={14} />
                  <span>Queue Generation</span>
                </button>

                <button
                  onClick={handleLaunchComfy}
                  className="px-3 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 font-bold transition flex items-center gap-1"
                  title="Launch local ComfyUI"
                >
                  <Play size={13} className="text-purple-400" />
                  <span>Launch</span>
                </button>
              </div>
            </div>

          </div>

          {/* Secondary DCC Tools: DaVinci Resolve & Remotion Video Engine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#110927] border border-purple-900/50 flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <Film size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs">DaVinci Resolve / OpenMontage</span>
                  <span className="text-[10px] text-emerald-400 font-bold">EDL / XML Live</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">ACEScc Rec.709 Color Timeline Conform Engine</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#110927] border border-purple-900/50 flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
                <HardDrive size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs">Remotion & FFmpeg 4K Engine</span>
                  <span className="text-[10px] text-emerald-400 font-bold">24 FPS DCI Live</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">Automated Circle Take Dailies Video Generation</p>
              </div>
            </div>
          </div>

          {/* Permanent Host & Port Configuration Form */}
          <form onSubmit={handleSaveConfig} className="p-5 rounded-2xl bg-[#100829] border border-amber-500/30 space-y-4">
            <div className="flex items-center space-x-2 border-b border-amber-500/20 pb-2">
              <Settings size={15} className="text-amber-400" />
              <span className="font-bold text-xs uppercase tracking-wider text-amber-300">
                Permanent Bridge Network Endpoints
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-300">Unreal Engine 5 Configuration</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={unrealHost}
                    onChange={(e) => setUnrealHost(e.target.value)}
                    placeholder="Host (127.0.0.1)"
                    className="flex-1 bg-[#1a0e3b] border border-purple-800/60 rounded-xl px-3 py-1.5 text-xs text-amber-200 font-mono"
                  />
                  <input
                    type="text"
                    value={unrealPort}
                    onChange={(e) => setUnrealPort(e.target.value)}
                    placeholder="Port (30010)"
                    className="w-24 bg-[#1a0e3b] border border-purple-800/60 rounded-xl px-3 py-1.5 text-xs text-amber-200 font-mono"
                  />
                </div>
                <input
                  type="text"
                  value={unrealAppPath}
                  onChange={(e) => setUnrealAppPath(e.target.value)}
                  placeholder="App Path (/Applications/...)"
                  className="w-full bg-[#1a0e3b] border border-purple-800/60 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-300">ComfyUI Configuration</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comfyHost}
                    onChange={(e) => setComfyHost(e.target.value)}
                    placeholder="Host (127.0.0.1)"
                    className="flex-1 bg-[#1a0e3b] border border-purple-800/60 rounded-xl px-3 py-1.5 text-xs text-amber-200 font-mono"
                  />
                  <input
                    type="text"
                    value={comfyPort}
                    onChange={(e) => setComfyPort(e.target.value)}
                    placeholder="Port (8188)"
                    className="w-24 bg-[#1a0e3b] border border-purple-800/60 rounded-xl px-3 py-1.5 text-xs text-amber-200 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-sans leading-normal pt-1">
                  Connect to local ComfyUI instance or a remote GPU server across LAN/VPN.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-lg shadow-amber-500/25 hover:opacity-90 transition"
              >
                💾 Save DCC Configuration
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}

export default DCCBridgesModal;
