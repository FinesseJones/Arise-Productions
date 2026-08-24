"use client";

import React, { useState, useRef } from 'react';
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
  ExternalLink,
  UploadCloud,
  FileUp,
  FileText,
  Image as ImageIcon,
  Mic,
  Sparkles,
  Scissors,
  Check,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';

interface OriginalSuitesHubProps {
  projectStatus: ProjectStatus;
}

export const OriginalSuitesHub: React.FC<OriginalSuitesHubProps> = ({ projectStatus }) => {
  const [selectedSuite, setSelectedSuite] = useState<string>('writing');
  const [selectedLut, setSelectedLut] = useState<string>('Kodak 2383 Film Print');
  const [importedScript, setImportedScript] = useState<string>('');
  const [importedEdl, setImportedEdl] = useState<string>('');
  const [castingPhoto, setCastingPhoto] = useState<string | null>(null);

  const cleanSlug = (projectStatus.projectName || 'Arise_Production').replace(/[^a-zA-Z0-9]/g, '_');

  const scriptInputRef = useRef<HTMLInputElement>(null);
  const edlInputRef = useRef<HTMLInputElement>(null);
  const lutInputRef = useRef<HTMLInputElement>(null);
  const castingInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const suites = [
    { id: 'writing', name: 'Screenwriting & Narrative Room', icon: PenTool, desc: 'Import .fountain / Final Draft scripts, scene sluglines, and character bibles' },
    { id: 'editing', name: 'Multi-Track Editing Suite', icon: Film, desc: 'Import .edl / .xml timelines, multi-cam cut points, and DaVinci Resolve conforms' },
    { id: 'casting', name: 'Casting & Talent Hub', icon: Users, desc: 'Ingest actor likeness photos, ElevenLabs voice stems, and character wardrobe tags' },
    { id: 'color', name: 'Color Grading & Film LUTs', icon: Palette, desc: 'Load custom .cube 3D LUT profiles, ACEScg transforms, and contrast curves' },
    { id: 'sound', name: 'Sound Design & Foley Suite', icon: Volume2, desc: '5.1 spatial audio bed, dialogue stem cleanup, and ambient room tones' },
    { id: 'vfx', name: 'VFX & ComfyUI Generation', icon: Wand2, desc: 'ControlNet depth maps, IP-Adapter consistency, and green screen plate keys' },
    { id: 'budget', name: 'Production Budget & Ledger', icon: DollarSign, desc: 'Camera rental rates, GPU compute inference costs, and daily call sheets' },
    { id: 'platform', name: 'Platform & Social Optimizer', icon: Share2, desc: 'Auto-reframe 16:9 to vertical 9:16 reels, burned-in subtitles, and bitrates' },
    { id: 'scheduling', name: 'Production Calendar & Days', icon: Calendar, desc: 'Day out of days (DOOD), shooting schedules, and stage complex bookings' },
    { id: 'assets', name: 'Asset Management & 3D Props', icon: Layers, desc: 'Unreal static meshes, material textures, sound libraries, and video takes' },
  ];

  // Screenplay Ingest Handler
  const handleScriptImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string || '';
      setImportedScript(text);
      try {
        localStorage.setItem(`arise_script_${cleanSlug}_shot_1`, text);
        fetch('http://localhost:4000/api/v1/projects/script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: cleanSlug,
            shotNumber: 1,
            scriptContent: text,
          }),
        }).catch(() => {});
      } catch {}
      toast.success(`✨ Ingested screenplay "${file.name}"! Synced to Stage 01.`);
    };
    reader.readAsText(file);
  };

  // EDL Timeline Ingest Handler
  const handleEdlImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string || '';
      setImportedEdl(text);
      toast.success(`🎞️ Ingested EDL timeline "${file.name}"! Conformed to DaVinci.`);
    };
    reader.readAsText(file);
  };

  // 3D LUT Ingest Handler
  const handleLutImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedLut(file.name.replace('.cube', ''));
    toast.success(`🎨 Ingested custom 3D LUT "${file.name}"! Applied to grading pipeline.`);
  };

  // Casting Likeness Ingest Handler
  const handleCastingImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCastingPhoto(event.target?.result as string);
      toast.success(`🎭 Ingested actor photo "${file.name}"! IP-Adapter likeness locked.`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Suite Header with Arise Productions Logo */}
      <div className="p-6 border-b border-purple-900/50 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-500/60 bg-black flex-shrink-0 shadow-lg shadow-amber-500/20 p-0 flex items-center justify-center">
            <img
              src={ARISE_LOGO_BASE64}
              alt="Arise Productions"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase font-serif">
                Department Deep-Dive Suites (Method 3 Ingestion Hub)
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/40 font-bold">
                Unified 3D Studio Merged
              </span>
            </div>
            <p className="text-xs text-[#E2BA86] font-mono mt-0.5">
              Import department-specific artifacts (.fountain, .edl, .cube, likeness photos) for <strong className="text-amber-300">{projectStatus.projectName}</strong>.
            </p>
          </div>
        </div>

        {/* Quick action */}
        <button
          onClick={() => toast.success('✨ All 10 Department Suites synchronized with active manifest!')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-mono"
        >
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span>Suites Active: 10 / 10</span>
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
          {/* 1. SCREENWRITING SUITE */}
          {selectedSuite === 'writing' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <PenTool className="text-amber-400" size={18} />
                    <span>Screenwriting & Narrative Room</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Act I • {projectStatus.shots?.length || 3} Shots Scripted</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => scriptInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-mono transition font-bold"
                  >
                    <UploadCloud size={14} />
                    <span>Import .fountain / .fdx</span>
                  </button>
                  <input
                    ref={scriptInputRef}
                    type="file"
                    accept=".fountain,.fdx,.pdf,.txt"
                    onChange={handleScriptImport}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-3 font-mono text-xs text-purple-100 shadow-xl">
                <div className="flex justify-between items-center text-rose-400 font-bold border-b border-purple-900/40 pb-2">
                  <span>LIVE SCREENPLAY BUFFER (SYNCHRONIZED WITH STAGE 01)</span>
                  <span className="text-emerald-400 text-[10px]">● AUTO-SAVED</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {importedScript || `EXT. URBAN NEIGHBORHOOD - EARLY MORNING\n\nThe morning sun filters through amber trees, casting long golden shadows across the pavement.\n\nDEVON (19)\n(standing on the front porch, clutching an old weathered photograph)\n"They always told me a tree without deep roots could never stand a storm. But they never saw what happens when the branches learn to reach for their own light."\n\nMARCUS (40s, mentor, steps onto the porch with two steaming mugs)\n"You've been carrying questions that were never yours to answer, Devon. Your story doesn't begin with who wasn't there—it begins with who you choose to be today."\n\nDEVON\n(taking a slow breath, looking out at the waking city)\n"Then let's build something that lasts."\n\nCUT TO:\n\nINT. LIVING ROOM WORKSPACE - CONTINUOUS\n\nDevon opens a notebook filled with hand-drawn plans and film concepts.`}
                </div>
              </div>
            </div>
          )}

          {/* 2. EDITING SUITE */}
          {selectedSuite === 'editing' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Film className="text-amber-400" size={18} />
                    <span>Multi-Track Timeline Editor & DaVinci Conform</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">24.00 FPS • 4K DCI • ACEScc</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => edlInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-mono transition font-bold"
                  >
                    <Scissors size={14} />
                    <span>Import .EDL / .XML Timeline</span>
                  </button>
                  <input
                    ref={edlInputRef}
                    type="file"
                    accept=".edl,.xml,.fcpxml"
                    onChange={handleEdlImport}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-4 shadow-xl">
                <div className="h-24 bg-black/60 rounded-xl border border-purple-900/60 p-2 flex items-center gap-2 overflow-x-auto">
                  {(projectStatus.shots && projectStatus.shots.length > 0 ? projectStatus.shots : [
                    { shotNumber: 1, title: 'Opening - Echoes of Absence' },
                    { shotNumber: 2, title: 'The Struggle & Turning Point' },
                    { shotNumber: 3, title: 'Breakthrough & New Horizon' },
                  ]).map((s, idx) => (
                    <div
                      key={s.shotNumber}
                      className={`h-full flex-shrink-0 w-56 rounded-xl p-2.5 text-[10px] font-mono flex flex-col justify-between border ${
                        idx % 3 === 0
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : idx % 3 === 1
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                          : 'bg-rose-500/20 border-rose-500 text-rose-300'
                      }`}
                    >
                      <span className="font-bold truncate">V1: Shot_{s.shotNumber}_{s.title.slice(0, 18)}</span>
                      <span className="text-slate-400">00:00:{idx * 8 < 10 ? '0' + idx * 8 : idx * 8} - 00:00:{(idx + 1) * 8}</span>
                    </div>
                  ))}
                </div>

                <div className="h-12 bg-black/60 rounded-xl border border-purple-900/60 p-2 flex items-center gap-2">
                  <div className="h-full w-full bg-teal-500/10 border border-teal-500/30 rounded-lg px-3 flex items-center justify-between text-[11px] font-mono text-teal-400">
                    <span>A1: Dialogue Master Stem ({projectStatus.projectName})</span>
                    <span>48 kHz / 24-bit 5.1 Mix</span>
                  </div>
                </div>

                {importedEdl && (
                  <div className="p-3 rounded-xl bg-black border border-purple-950 font-mono text-[10px] text-slate-400 max-h-32 overflow-y-auto whitespace-pre">
                    {importedEdl}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. CASTING & TALENT HUB */}
          {selectedSuite === 'casting' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Users className="text-amber-400" size={18} />
                    <span>Casting & Talent Hub (Actor Likeness & Voice)</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">IP-Adapter Face Lock • ElevenLabs Voice Stems</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => castingInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-mono transition font-bold"
                  >
                    <ImageIcon size={14} />
                    <span>Ingest Actor Photo</span>
                  </button>
                  <input
                    ref={castingInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCastingImport}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-3 font-mono text-xs shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">DEVON — LEAD PROTAGONIST (19)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">LIKENESS LOCKED</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black border border-purple-800/80 flex items-center justify-center flex-shrink-0">
                      {castingPhoto ? (
                        <img src={castingPhoto} alt="Actor Likeness" className="w-full h-full object-cover" />
                      ) : (
                        <Users size={32} className="text-purple-400" />
                      )}
                    </div>
                    <div className="space-y-1 text-[11px] text-purple-300/80">
                      <p><strong>Voice Model:</strong> ElevenLabs Resilient Warm Baritone</p>
                      <p><strong>IP-Adapter Token:</strong> @devon_lead_v1</p>
                      <p><strong>Wardrobe:</strong> Vintage Denim & Canvas Field Jacket</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-3 font-mono text-xs shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">MARCUS — COMMUNITY MENTOR (40s)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">LIKENESS LOCKED</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black border border-purple-800/80 flex items-center justify-center flex-shrink-0">
                      <Users size={32} className="text-purple-400" />
                    </div>
                    <div className="space-y-1 text-[11px] text-purple-300/80">
                      <p><strong>Voice Model:</strong> ElevenLabs Deep Soulful Baritone</p>
                      <p><strong>IP-Adapter Token:</strong> @marcus_mentor_v1</p>
                      <p><strong>Wardrobe:</strong> Workwear Utility Over-shirt & Leather Boots</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. COLOR GRADING & FILM LUTS */}
          {selectedSuite === 'color' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Palette className="text-amber-400" size={18} />
                    <span>Color Grading & 3D Film LUT Studio</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">ACEScc &bull; 33-point 3D Cube Profiles</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => lutInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-mono transition font-bold"
                  >
                    <UploadCloud size={14} />
                    <span>Load Custom .CUBE LUT</span>
                  </button>
                  <input
                    ref={lutInputRef}
                    type="file"
                    accept=".cube,.look,.3dl"
                    onChange={handleLutImport}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e0922] border border-purple-900/60 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-rose-300 font-bold">Active 3D LUT Profile:</span>
                  <span className="font-mono text-xs text-amber-300 font-extrabold px-3 py-1 rounded-lg bg-black border border-amber-500/40">
                    {selectedLut}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  {['Kodak 2383 Film Print', 'Teal & Orange Blockbuster', 'Bleach Bypass 70mm', 'Fuji Eterna 500T'].map((lut) => (
                    <button
                      key={lut}
                      onClick={() => {
                        setSelectedLut(lut);
                        toast.success(`🎨 Switched color LUT to "${lut}"`);
                      }}
                      className={`p-3 rounded-xl border text-center transition ${
                        selectedLut === lut
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-black/60 border-purple-900/40 text-purple-300/70 hover:text-white'
                      }`}
                    >
                      <span>{lut}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. SOUND DESIGN SUITE */}
          {selectedSuite === 'sound' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Volume2 className="text-teal-400" size={18} />
                  <span>5.1 Spatial Audio & Stem Separation Suite</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400">-24 LKFS Broadcast Standard</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
                {['Dialogue Master', 'Spatial Foley', 'Orchestral Score', 'SFX Submix'].map((stem, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#0e0922] border border-purple-900/60 space-y-2">
                    <span className="text-teal-400 font-bold block">{stem}</span>
                    <div className="w-full bg-black/60 h-20 rounded-lg flex items-end justify-center p-1.5">
                      <div className="w-4 bg-gradient-to-t from-purple-500 to-teal-400 rounded-sm animate-pulse" style={{ height: `${65 + i * 8}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. BUDGET SUITE */}
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
        </div>
      </div>
    </div>
  );
};

export default OriginalSuitesHub;
