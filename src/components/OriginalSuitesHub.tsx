"use client";

import React, { useState } from 'react';
import { ProjectStatus } from '../types/types';
import {
  PenTool,
  Film,
  Users,
  DollarSign,
  Volume2,
  Share2,
  Wand2,
  Palette,
  Calendar,
  Layers,
  BarChart3,
  Sliders,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OriginalSuitesHubProps {
  projectStatus: ProjectStatus;
}

export const OriginalSuitesHub: React.FC<OriginalSuitesHubProps> = ({ projectStatus }) => {
  const [selectedSuite, setSelectedSuite] = useState<string>('writing');

  const suites = [
    { id: 'writing', name: 'Screenwriting & Beat Sheet', icon: PenTool, desc: 'Interactive three-act structure, character voice bible, and Fountain export' },
    { id: 'editing', name: 'Multi-Track Editing Suite', icon: Film, desc: 'Multi-cam timeline, ripple cuts, J/L cuts, and DaVinci Resolve EDL conform' },
    { id: 'casting', name: 'Casting & Talent Hub', icon: Users, desc: 'Character likeness cards, voice model matching, and actor wardrobe tags' },
    { id: 'budget', name: 'Production Budget & Line Items', icon: DollarSign, desc: 'Camera rental rates, GPU inference compute cost, and daily call sheets' },
    { id: 'sound', name: 'Sound Design & Foley Suite', icon: Volume2, desc: '5.1 spatial audio bed, dialogue cleanup, ambient room tone, and stem master' },
    { id: 'vfx', name: 'VFX & ComfyUI Generation', icon: Wand2, desc: 'ControlNet depth maps, IP-Adapter consistency, and green screen plate keys' },
    { id: 'color', name: 'Color Grading & Film LUTs', icon: Palette, desc: 'ACEScg transform, 3D LUT application, contrast curve, and HDR scopes' },
    { id: 'platform', name: 'Platform & Social Optimizer', icon: Share2, desc: 'Auto-reframe 16:9 to vertical 9:16 reels, burned-in subtitles, and bitrates' },
    { id: 'scheduling', name: 'Production Calendar & Shooting Days', icon: Calendar, desc: 'Day out of days (DOOD), location permits, and camera crew schedules' },
    { id: 'assets', name: 'Asset Management & 3D Props', icon: Layers, desc: 'Unreal static meshes, material textures, sound libraries, and video takes' },
    { id: 'analytics', name: 'Analytics & Delivery Tracker', icon: BarChart3, desc: 'Render milestones, audience metrics, export speeds, and cloud sync' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="text-amber-400 w-6 h-6" />
            <h2 className="text-xl font-bold tracking-tight text-slate-100">
              Department Deep-Dive Suites
            </h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
              Unified 3D Studio Merged
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Access your complete original department toolsets for <strong className="text-amber-300">{projectStatus.projectName}</strong>.
          </p>
        </div>

        {/* Quick action */}
        <button
          onClick={() => toast.success('✨ All 11 Department Suites synchronized!')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-mono"
        >
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span>Suites Active: 11 / 11</span>
        </button>
      </div>

      {/* Tri-Pane Suite Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Navigation: Suites Menu */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/60 p-4 space-y-1.5 overflow-y-auto">
          {suites.map((s) => {
            const Icon = s.icon;
            const isActive = selectedSuite === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSuite(s.id)}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-md shadow-amber-500/5'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}>
                  <Icon size={16} />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold truncate text-slate-200">{s.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Suite Interactive Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
          {selectedSuite === 'writing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <PenTool className="text-amber-400" size={18} />
                  <span>Screenwriting & Narrative Room</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">Act I • Scene 1 of 8</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
                <p className="text-amber-400 font-bold">EXT. NORTH ATLANTIC - NIGHT</p>
                <p>The vast black ocean stretches to the freezing horizon. Below, the iron mammoth surges forward.</p>
                <p className="text-center font-bold text-amber-300">CAPTAIN SMITH</p>
                <p className="text-center italic text-slate-400">(peering into the fog)</p>
                <p className="max-w-md mx-auto text-center">Full steam ahead. Keep a sharp lookout on the starboard bow.</p>
              </div>
            </div>
          )}

          {selectedSuite === 'editing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Film className="text-amber-400" size={18} />
                  <span>Multi-Track Timeline Editor & OpenMontage Conform</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">24.00 FPS • 4K DCI</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="h-24 bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center gap-2 overflow-x-auto">
                  <div className="h-full w-48 bg-amber-500/20 border border-amber-500 rounded-lg p-2 text-[10px] font-mono flex flex-col justify-between">
                    <span className="font-bold text-amber-300">V1: Shot_01_Wide</span>
                    <span className="text-slate-400">00:00:00 - 00:00:08</span>
                  </div>
                  <div className="h-full w-56 bg-indigo-500/20 border border-indigo-500 rounded-lg p-2 text-[10px] font-mono flex flex-col justify-between">
                    <span className="font-bold text-indigo-300">V1: Shot_02_CloseUp</span>
                    <span className="text-slate-400">00:00:08 - 00:00:18</span>
                  </div>
                  <div className="h-full w-40 bg-emerald-500/20 border border-emerald-500 rounded-lg p-2 text-[10px] font-mono flex flex-col justify-between">
                    <span className="font-bold text-emerald-300">V1: Shot_03_CameraRoll</span>
                    <span className="text-slate-400">00:00:18 - 00:00:26</span>
                  </div>
                </div>
                <div className="h-12 bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center gap-2">
                  <div className="h-full w-full bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                    <span>A1: Dialogue Master Stem (Smith / Lookout)</span>
                    <span>48 kHz / 24-bit</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSuite === 'budget' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <DollarSign className="text-emerald-400" size={18} />
                  <span>Production Budget & Line Item Ledger</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">$24,500 Estimated Budget</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Virtual Camera & Unreal 5.4</span>
                  <p className="text-base font-bold text-slate-200">$4,200</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-500">GPU Inference / Comfy MCP</span>
                  <p className="text-base font-bold text-slate-200">$1,850</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Audio Mastering & Foley</span>
                  <p className="text-base font-bold text-slate-200">$3,100</p>
                </div>
              </div>
            </div>
          )}

          {selectedSuite === 'casting' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Users className="text-amber-400" size={18} />
                  <span>Casting & Talent Hub</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">3 Characters Cast</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Captain Edward Smith', 'First Officer Murdoch', 'Lookout Fleet'].map((c, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400">
                      {c.charAt(0)}
                    </div>
                    <h4 className="text-xs font-bold text-slate-200">{c}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Status: Voice Matched • 3D Mesh Bound</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedSuite === 'sound' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Volume2 className="text-emerald-400" size={18} />
                  <span>5.1 Spatial Audio & Sound Design Desk</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">Surround Master</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Track 1: Ocean Gale & Wind Bed</span>
                  <span className="text-emerald-400">-12 dB (Surround L/R)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Track 2: Hull Vibration Foley</span>
                  <span className="text-emerald-400">-18 dB (LFE Sub)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Track 3: Dialogue Center Channel</span>
                  <span className="text-emerald-400">-6 dB (Center Prime)</span>
                </div>
              </div>
            </div>
          )}

          {selectedSuite === 'platform' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Share2 className="text-amber-400" size={18} />
                  <span>Platform & Multi-Aspect Optimizer</span>
                </h3>
                <span className="text-xs font-mono text-amber-400">Auto-Reframe Engine</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-200">16:9 Theatrical</span>
                  <p className="text-[11px] text-slate-500">3840x2160 UHD • YouTube / Feature</p>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded block text-center">Ready</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-200">9:16 Vertical Reel</span>
                  <p className="text-[11px] text-slate-500">1080x1920 • TikTok / Shorts / IG</p>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded block text-center">Ready</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-200">2.39:1 Anamorphic</span>
                  <p className="text-[11px] text-slate-500">4096x1716 • Cinema Scope Master</p>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded block text-center">Ready</span>
                </div>
              </div>
            </div>
          )}

          {['vfx', 'color', 'scheduling', 'assets', 'analytics'].includes(selectedSuite) && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 capitalize">
                {selectedSuite} Suite Console
              </h3>
              <p className="text-xs text-slate-400">
                Connected live to your project pipeline and local connectors (Unreal 5.4, ComfyUI, OpenMontage, Hyperframes).
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400">
                ✓ Active parameters synchronized with {projectStatus.projectName}.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OriginalSuitesHub;
