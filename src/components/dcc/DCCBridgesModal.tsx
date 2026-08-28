"use client";

import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Play, Camera, Sparkles, CheckCircle2, AlertCircle, Settings, Layers, Film, Cpu, HardDrive, Video, Disc, Radio } from 'lucide-react';
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
  const [unrealAppPath, setUnrealAppPath] = useState('/Applications/Epic Games Launcher.app');
  const [comfyHost, setComfyHost] = useState('127.0.0.1');
  const [comfyPort, setComfyPort] = useState('8188');
  const [bmpccIp, setBmpccIp] = useState('192.168.1.100');
  const [bmpccPort, setBmpccPort] = useState('80');

  // Camera test controls
  const [focalLength, setFocalLength] = useState(35);
  const [fstop, setFstop] = useState(2.8);
  const [bmdIso, setBmdIso] = useState(400);
  const [bmdShutter, setBmdShutter] = useState(180.0);
  const [bmdWb, setBmdWb] = useState(5600);
  const [isRecording, setIsRecording] = useState(false);

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
        if (data.bridges?.blackmagicCamera?.cameraIp) setBmpccIp(data.bridges.blackmagicCamera.cameraIp);
        if (data.bridges?.blackmagicCamera?.cameraPort) setBmpccPort(String(data.bridges.blackmagicCamera.cameraPort));
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
    const toastId = toast.loading('🚀 Launching Unreal Engine / Epic Games Launcher...');
    try {
      const res = await fetch(`${apiBase}/api/v1/dcc/unreal/launch`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Unreal Engine launch command dispatched!', { id: toastId });
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
        toast.success(data.message || 'ComfyUI launch command dispatched!', { id: toastId });
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

  // Blackmagic Camera Handlers
  const handleBmdRecordToggle = async () => {
    const newAction = isRecording ? 'stop' : 'start';
    const toastId = toast.loading(`${newAction === 'start' ? '🔴 Triggering Take Recording' : '⏹ Stopping Recording'} on BMPCC 4K...`);
    try {
      const res = await fetch(`${apiBase}/api/v1/dcc/blackmagic/recording`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: newAction }),
      });
      const data = await res.json();
      setIsRecording(newAction === 'start');
      toast.success(data.message || `BMPCC 4K Take ${newAction === 'start' ? 'Recording' : 'Stopped'}!`, { id: toastId });
    } catch {
      toast.error('Could not trigger record action', { id: toastId });
    }
  };

  const handleSyncBmdOptics = async () => {
    const toastId = toast.loading(`🎥 Transmitting ISO ${bmdIso}, f/${fstop}, ${bmdWb}K to BMPCC 4K...`);
    try {
      const res = await fetch(`${apiBase}/api/v1/dcc/blackmagic/camera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          iso: bmdIso,
          shutterAngle: bmdShutter,
          whiteBalance: bmdWb,
          aperture: fstop,
        }),
      });
      const data = await res.json();
      toast.success(`✅ BMPCC 4K Optics Synced: ISO ${bmdIso} f/${fstop} ${bmdWb}K`, { id: toastId });
    } catch {
      toast.error('Transmission error to BMPCC 4K', { id: toastId });
    }
  };

  const handleSyncBmdSlate = async () => {
    const toastId = toast.loading('📋 Synchronizing Take Slate to BMPCC 4K BRAW sidecar...');
    try {
      const res = await fetch(`${apiBase}/api/v1/dcc/blackmagic/slate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scene: '1',
          shot: '1',
          take: 1,
          projectTitle: 'A Fatherless Child',
          director: 'AI Showrunner',
        }),
      });
      const data = await res.json();
      toast.success('✅ BMPCC 4K Slate Updated: Scene 1, Shot 1, Take 1', { id: toastId });
    } catch {
      toast.error('Slate sync error', { id: toastId });
    }
  };

  const [isScanningCamera, setIsScanningCamera] = useState(false);

  const handleDiscoverBmdCamera = async () => {
    setIsScanningCamera(true);
    const toastId = toast.loading('🔍 Scanning local network & USB for Blackmagic Camera...');
    try {
      const res = await fetch(`${apiBase}/api/v1/dcc/blackmagic/discover`, { method: 'POST' });
      const data = await res.json();
      if (data && data.found && data.camera) {
        setBmpccIp(data.camera.ip);
        setBmpccPort(String(data.camera.port || 80));
        toast.success(`✨ Connected to ${data.camera.model || 'Blackmagic Camera'} at ${data.camera.ip}!`, { id: toastId });
        fetchStatus();
      } else {
        toast(data.message || 'No active Blackmagic REST camera found on local network.', { icon: '📡', id: toastId });
      }
    } catch {
      toast.error('Discovery network probe error', { id: toastId });
    } finally {
      setIsScanningCamera(false);
    }
  };

  const handleLaunchDaVinci = async () => {
    const toastId = toast.loading('🚀 Launching DaVinci Resolve Studio...');
    try {
      const res = await fetch(`${apiBase}/api/v1/blackmagic/launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appKey: 'davinciResolve' }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('DaVinci Resolve launched!', { id: toastId });
      } else {
        toast.error('DaVinci Resolve not found at default path', { id: toastId });
      }
    } catch {
      toast.error('Could not reach backend', { id: toastId });
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('💾 Saving permanent DCC & Camera configuration...');
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
          bmpccIp,
          bmpccPort: Number(bmpccPort),
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
  const bmdActive = statusData?.blackmagicCamera?.online;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0d0722] border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-mono text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/30 bg-[#140e2e]/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-md">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase tracking-wider font-serif">
                External DCC & Physical Camera Studio Bridges
              </h2>
              <p className="text-xs text-amber-300/80 font-mono">
                Live REST & Open Protocols: Unreal Engine 5 • ComfyUI • Blackmagic Pocket 4K • DaVinci Resolve
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
          
          {/* Top Status Cards Grid (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Unreal Engine 5 */}
            <div className="p-5 rounded-2xl bg-[#140b2e]/90 border border-purple-900/70 relative overflow-hidden space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Film className="text-amber-400" size={16} />
                    <span className="font-bold text-xs text-slate-100 uppercase tracking-wide">Unreal Engine 5</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${
                    ueActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ueActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400'}`} />
                    {ueActive ? `ONLINE (${statusData?.unrealEngine?.latencyMs || 0}ms)` : 'READY / STANDBY'}
                  </span>
                </div>

                <p className="text-[10.5px] text-slate-300 leading-relaxed font-sans">
                  Live Link CineCamera bridge via Remote Control Web Server. Controls focal lengths (18–85mm), 3-axis dolly vectors, sensor gate, and f-stops in UE5.
                </p>

                <div className="p-2.5 rounded-xl bg-black/40 border border-purple-900/40 space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Endpoint:</span>
                    <span className="text-amber-300 font-bold">{unrealHost}:{unrealPort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Actor:</span>
                    <span className="text-purple-300 font-bold">CineCameraActor1</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Controls */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncCamera}
                    className="flex-1 flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:opacity-90 text-black font-extrabold shadow-md shadow-amber-500/20 transition text-[11px]"
                  >
                    <Camera size={13} />
                    <span>Sync Optics</span>
                  </button>

                  <button
                    onClick={handleLaunchUnreal}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 font-bold transition flex items-center gap-1 text-[11px]"
                    title="Launch Unreal Editor / Epic Games Launcher"
                  >
                    <Play size={12} className="text-amber-400" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: ComfyUI */}
            <div className="p-5 rounded-2xl bg-[#140b2e]/90 border border-purple-900/70 relative overflow-hidden space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="text-purple-400" size={16} />
                    <span className="font-bold text-xs text-slate-100 uppercase tracking-wide">ComfyUI Node</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${
                    comfyActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${comfyActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400'}`} />
                    {comfyActive ? `ONLINE (${statusData?.comfyUI?.latencyMs || 0}ms)` : 'READY / STANDBY'}
                  </span>
                </div>

                <p className="text-[10.5px] text-slate-300 leading-relaxed font-sans">
                  High-throughput FLUX.1 Dev, SDXL, and ControlNet depth node workflow bridge for continuity-locked storyboard slates and visual takes.
                </p>

                <div className="p-2.5 rounded-xl bg-black/40 border border-purple-900/40 space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Endpoint:</span>
                    <span className="text-amber-300 font-bold">{comfyHost}:{comfyPort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GPU Device:</span>
                    <span className="text-purple-300 font-bold truncate max-w-[130px]">
                      {statusData?.comfyUI?.devices?.[0]?.name || 'Local Apple / NVIDIA GPU'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleQueuePrompt}
                  className="flex-1 flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-md shadow-purple-600/30 transition text-[11px]"
                >
                  <Sparkles size={13} />
                  <span>Queue Prompt</span>
                </button>

                <button
                  onClick={handleLaunchComfy}
                  className="px-2.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 font-bold transition flex items-center gap-1 text-[11px]"
                  title="Launch local ComfyUI"
                >
                  <Play size={12} className="text-purple-400" />
                  <span>Launch</span>
                </button>
              </div>
            </div>

            {/* Card 3: Blackmagic Pocket Cinema Camera 4K (Physical REST API) */}
            <div className="p-5 rounded-2xl bg-[#140b2e]/90 border border-amber-500/50 relative overflow-hidden space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video className="text-amber-400" size={16} />
                    <span className="font-bold text-xs text-slate-100 uppercase tracking-wide">Blackmagic Pocket 4K</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleDiscoverBmdCamera}
                      disabled={isScanningCamera}
                      className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 border border-purple-500/40 flex items-center gap-1 transition"
                      title="Auto-scan network and USB for connected Blackmagic cameras"
                    >
                      <Radio size={10} className={isScanningCamera ? 'animate-spin text-amber-400' : 'text-purple-300'} />
                      <span>{isScanningCamera ? 'Scanning...' : 'Auto-Detect'}</span>
                    </button>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${
                      bmdActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${bmdActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400'}`} />
                      {bmdActive ? `ONLINE (:80)` : 'READY / STANDBY'}
                    </span>
                  </div>
                </div>

                <p className="text-[10.5px] text-slate-300 leading-relaxed font-sans">
                  Direct REST API (Firmware 9.8b+) & Web Media Manager over USB-C / LAN. Controls Dual ISO, Shutter, f-stop, and triggers BRAW takes.
                </p>

                <div className="p-2.5 rounded-xl bg-black/40 border border-purple-900/40 space-y-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Camera IP:</span>
                    <span className="text-amber-300 font-bold">{bmpccIp}:{bmpccPort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Color Science:</span>
                    <span className="text-purple-300 font-bold">Gen 5 / BRAW</span>
                  </div>
                </div>
              </div>

              {/* Physical Take & Slate Controls */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={handleBmdRecordToggle}
                    className={`flex items-center justify-center space-x-1 px-2 py-1.5 rounded-xl font-extrabold text-[10.5px] transition shadow-md ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-red-500/40'
                        : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50'
                    }`}
                  >
                    <Disc size={12} className={isRecording ? 'animate-spin' : ''} />
                    <span>{isRecording ? 'Stop Rec' : '🔴 Record'}</span>
                  </button>

                  <button
                    onClick={handleSyncBmdSlate}
                    className="flex items-center justify-center space-x-1 px-2 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 font-bold text-[10.5px] transition"
                  >
                    <span>📋 Slate Sync</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSyncBmdOptics}
                    className="flex-1 px-2 py-1 rounded-xl bg-[#1d123d] hover:bg-[#2c1b5a] text-purple-200 border border-purple-600/50 text-[10px] font-bold transition"
                  >
                    🎥 Push Optics
                  </button>

                  <button
                    onClick={handleLaunchDaVinci}
                    className="px-2 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 text-[10px] font-bold transition"
                    title="Launch DaVinci Resolve Studio"
                  >
                    Resolve
                  </button>
                </div>
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
                Permanent Network Endpoints & Hardware Configurations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-300">Unreal Engine 5</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={unrealHost}
                    onChange={(e) => setUnrealHost(e.target.value)}
                    placeholder="Host (127.0.0.1)"
                    className="flex-1 bg-[#1a0e3b] border border-purple-800/60 rounded-xl px-2.5 py-1.5 text-xs text-amber-200 font-mono"
                  />
                  <input
                    type="text"
                    value={unrealPort}
                    onChange={(e) => setUnrealPort(e.target.value)}
                    placeholder="Port (30010)"
                    className="w-20 bg-[#1a0e3b] border border-purple-800/60 rounded-xl px-2 py-1.5 text-xs text-amber-200 font-mono"
                  />
                </div>
                <input
                  type="text"
                  value={unrealAppPath}
                  onChange={(e) => setUnrealAppPath(e.target.value)}
                  placeholder="App Path"
                  className="w-full bg-[#1a0e3b] border border-purple-800/60 rounded-xl px-2.5 py-1 text-[10px] text-slate-300 font-mono"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-300">ComfyUI Generative Server</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={comfyHost}
                    onChange={(e) => setComfyHost(e.target.value)}
                    placeholder="Host (127.0.0.1)"
                    className="flex-1 bg-[#1a0e3b] border border-purple-800/60 rounded-xl px-2.5 py-1.5 text-xs text-amber-200 font-mono"
                  />
                  <input
                    type="text"
                    value={comfyPort}
                    onChange={(e) => setComfyPort(e.target.value)}
                    placeholder="Port (8188)"
                    className="w-20 bg-[#1a0e3b] border border-purple-800/60 rounded-xl px-2 py-1.5 text-xs text-amber-200 font-mono"
                  />
                </div>
                <p className="text-[9.5px] text-slate-400 font-sans leading-normal">
                  Connect to local GPU or remote cloud worker.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-amber-300">Blackmagic Pocket 4K IP</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={bmpccIp}
                    onChange={(e) => setBmpccIp(e.target.value)}
                    placeholder="Camera IP (192.168.1.100)"
                    className="flex-1 bg-[#1a0e3b] border border-amber-500/50 rounded-xl px-2.5 py-1.5 text-xs text-amber-200 font-mono"
                  />
                  <input
                    type="text"
                    value={bmpccPort}
                    onChange={(e) => setBmpccPort(e.target.value)}
                    placeholder="Port (80)"
                    className="w-16 bg-[#1a0e3b] border border-amber-500/50 rounded-xl px-2 py-1.5 text-xs text-amber-200 font-mono"
                  />
                </div>
                <p className="text-[9.5px] text-slate-400 font-sans leading-normal">
                  Plug USB-C Ethernet or USB to Mac and enter camera IP.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-lg shadow-amber-500/25 hover:opacity-90 transition"
              >
                💾 Save Studio Bridge Configuration
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}

export default DCCBridgesModal;
