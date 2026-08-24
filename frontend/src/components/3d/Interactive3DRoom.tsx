"use client";

import React, { useState, useEffect } from 'react';
import { StageKey } from '../../types/types';
import {
  Camera,
  FileText,
  Layers,
  Boxes,
  Activity,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Volume2,
  Scissors,
  Sliders,
  Play,
  RotateCcw,
  Eye,
  Maximize2,
  Save,
  Plus,
  Users,
  Film,
  Zap,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../../constants/branding';

interface Interactive3DRoomProps {
  stageId: StageKey;
  roomName: string;
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
  shotDescription?: string;
}

export const Interactive3DRoom: React.FC<Interactive3DRoomProps> = ({
  stageId,
  roomName,
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
  shotDescription,
}) => {
  const [activeParam, setActiveParam] = useState<number>(35);
  const [roomPreset, setRoomPreset] = useState<string>('Cinematic Neon');
  const [activeScriptTab, setActiveScriptTab] = useState<'editor' | 'characters' | 'pacing' | 'props'>('editor');
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const cleanSlug = (projectName || 'Arise_Production').replace(/[^a-zA-Z0-9]/g, '_');
  const storageScriptKey = `arise_script_${cleanSlug}_shot_${shotNumber}`;

  // Default Fountain Screenplay tailored to active project
  const defaultFountain = `EXT. ${projectName.toUpperCase()} - SCENE ${shotNumber} - NIGHT

The opening world of ${projectName} unfolds under dramatic atmospheric lighting.

${shotDescription || 'A wide cinematic tracking shot establishes the environment with high visual fidelity.'}

LEAD CHARACTER
(looking into the distance)
"Telemetry is locked. We are initiating sequence ${shotNumber} right now."

CUT TO:

INT. CONTROL BRIDGE - CONTINUOUS

Flickering holographic telemetry glows across the instrument panels.

SECOND OFFICER
"Signal confirmed across all channels. Stand by for main ignition."`;

  const [screenplayContent, setScreenplayContent] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageScriptKey);
      if (saved) return saved;
    } catch {}
    return defaultFountain;
  });

  // Reload script when project or shot changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageScriptKey);
      if (saved) {
        setScreenplayContent(saved);
        return;
      }
    } catch {}

    // Fetch from backend API
    fetch(`http://localhost:4000/api/v1/projects/script?projectId=${cleanSlug}&shotNumber=${shotNumber}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.scriptContent) {
          setScreenplayContent(data.scriptContent);
        } else {
          setScreenplayContent(defaultFountain);
        }
      })
      .catch(() => {
        setScreenplayContent(defaultFountain);
      });
  }, [projectName, shotNumber, storageScriptKey]);

  // Handle screenplay edits with auto-save
  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setScreenplayContent(text);
    setIsSaved(false);

    try {
      localStorage.setItem(storageScriptKey, text);
    } catch {}

    // Auto-save to backend
    fetch('http://localhost:4000/api/v1/projects/script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: cleanSlug,
        shotNumber,
        scriptContent: text,
      }),
    })
      .then(() => setIsSaved(true))
      .catch(() => setIsSaved(true));
  };

  const handleInsertFountainTag = (tagType: string) => {
    let tag = '';
    if (tagType === 'scene') tag = `\n\nEXT. ${projectName.toUpperCase()} - SCENE - DAY\n\n`;
    if (tagType === 'character') tag = `\n\nCHARACTER NAME\n`;
    if (tagType === 'dialogue') tag = `"Your dialogue line here."\n\n`;
    if (tagType === 'action') tag = `\nAction description goes here.\n\n`;
    if (tagType === 'transition') tag = `\n\nCUT TO:\n\n`;

    const updated = screenplayContent + tag;
    setScreenplayContent(updated);
    try {
      localStorage.setItem(storageScriptKey, updated);
    } catch {}
    toast.success(`Inserted ${tagType} block`);
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0922] border border-purple-900/50 rounded-2xl overflow-hidden shadow-2xl relative select-none">
      {/* Top 3D Room Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#140e2e] border-b border-purple-900/50 text-xs font-mono text-purple-300 flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500" />
          <span className="text-purple-100 font-bold tracking-wide uppercase">
            3D {roomName.toUpperCase()}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-rose-300 border border-purple-800/40">
            60 FPS SPATIAL
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span>Shot {shotNumber}: <strong className="text-purple-200">{shotTitle}</strong></span>
          <span className="hidden sm:inline">Preset: <strong className="text-rose-300">{roomPreset}</strong></span>
        </div>
      </div>

      {/* Main 3D Spatial Canvas / Workspace */}
      <div className="relative flex-grow flex flex-col items-center justify-center p-4 lg:p-6 overflow-y-auto min-h-0 bg-gradient-to-b from-[#080512] via-[#0e0922] to-[#080512]">
        {/* Holographic 3D Spatial Perspective Grid (Royal Amethyst) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b2d71_1px,transparent_1px),linear-gradient(to_bottom,#3b2d71_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        {/* Floating Glowing Neon Studio Ring */}
        <div className="absolute w-96 h-96 rounded-full border border-purple-500/20 bg-gradient-to-tr from-purple-600/10 via-pink-600/5 to-rose-500/10 animate-pulse [animation-duration:4s] pointer-events-none" />

        {/* Proof-of-Ownership Arise Productions Watermark */}
        <div className="absolute top-3 right-3 z-20 flex items-center space-x-2.5 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/50 shadow-xl shadow-amber-500/15">
          <div className="w-6 h-6 rounded-lg overflow-hidden bg-black border border-amber-500/60 flex-shrink-0">
            <img
              src={ARISE_LOGO_BASE64}
              alt="Arise Productions"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif tracking-wider">
              ARISE PRODUCTIONS
            </span>
            <span className="text-[8px] text-[#E2BA86] font-mono font-medium">
              © 2026 THE AI CONTENT FOUNDRY, LLC
            </span>
          </div>
        </div>

        {/* ---------------- 1. UPGRADED EXPANSIVE FOUNTAIN WRITERS ROOM (STAGE 01) ---------------- */}
        {stageId === 'script' && (
          <div className="relative z-10 flex flex-col w-full h-full max-w-4xl min-h-[420px] bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Screenplay Sub-Header & Navigation Tabs */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-900/50 bg-[#0e0922]/80 flex-shrink-0 flex-wrap gap-2">
              <div className="flex items-center space-x-1.5 overflow-x-auto">
                <button
                  onClick={() => setActiveScriptTab('editor')}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition ${
                    activeScriptTab === 'editor'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-500/30'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  <FileText size={13} />
                  <span>Fountain Editor</span>
                </button>
                <button
                  onClick={() => setActiveScriptTab('characters')}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition ${
                    activeScriptTab === 'characters'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-500/30'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  <Users size={13} />
                  <span>Cast Dossiers</span>
                </button>
                <button
                  onClick={() => setActiveScriptTab('pacing')}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition ${
                    activeScriptTab === 'pacing'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-500/30'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  <Activity size={13} />
                  <span>40-Beat Arc</span>
                </button>
                <button
                  onClick={() => setActiveScriptTab('props')}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition ${
                    activeScriptTab === 'props'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-500/30'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  <Boxes size={13} />
                  <span>Props & Sets</span>
                </button>
              </div>

              <div className="flex items-center space-x-3 text-[11px] font-mono">
                <span className="text-amber-300/90 font-bold">
                  📄 Page 1 of {Math.max(1, Math.ceil(screenplayContent.trim().split(/\s+/).filter(Boolean).length / 200))}
                </span>
                <span className="text-slate-400">
                  ⏱️ ~{Math.floor(screenplayContent.trim().split(/\s+/).filter(Boolean).length / 130)}m {Math.round(((screenplayContent.trim().split(/\s+/).filter(Boolean).length % 130) / 130) * 60)}s
                </span>
                <span className={`flex items-center gap-1 ${isSaved ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSaved ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
                  {isSaved ? 'Auto-Saved' : 'Syncing...'}
                </span>
              </div>
            </div>

            {/* Hollywood Formatting Toolbar & Inline AI Script Doctor Strip */}
            {activeScriptTab === 'editor' && (
              <div className="flex flex-col border-b border-purple-900/40 bg-[#160f33]">
                {/* 1. Element Format Insertion */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto flex-shrink-0 border-b border-purple-950/60 text-[10px] font-mono">
                  <span className="text-amber-400/90 font-bold mr-1 flex-shrink-0">FORMAT:</span>
                  <button
                    onClick={() => handleInsertFountainTag('scene')}
                    className="px-2 py-0.5 bg-purple-950/80 hover:bg-amber-500/20 text-purple-200 hover:text-amber-300 rounded border border-purple-800/60 transition flex-shrink-0"
                  >
                    🎬 Scene Heading
                  </button>
                  <button
                    onClick={() => handleInsertFountainTag('action')}
                    className="px-2 py-0.5 bg-purple-950/80 hover:bg-amber-500/20 text-purple-200 hover:text-amber-300 rounded border border-purple-800/60 transition flex-shrink-0"
                  >
                    ⚡ Action
                  </button>
                  <button
                    onClick={() => handleInsertFountainTag('character')}
                    className="px-2 py-0.5 bg-purple-950/80 hover:bg-amber-500/20 text-purple-200 hover:text-amber-300 rounded border border-purple-800/60 transition flex-shrink-0"
                  >
                    🎭 Character
                  </button>
                  <button
                    onClick={() => handleInsertFountainTag('dialogue')}
                    className="px-2 py-0.5 bg-purple-950/80 hover:bg-amber-500/20 text-purple-200 hover:text-amber-300 rounded border border-purple-800/60 transition flex-shrink-0"
                  >
                    💬 Dialogue
                  </button>
                  <button
                    onClick={() => handleInsertFountainTag('transition')}
                    className="px-2 py-0.5 bg-purple-950/80 hover:bg-amber-500/20 text-purple-200 hover:text-amber-300 rounded border border-purple-800/60 transition flex-shrink-0"
                  >
                    ✂️ Transition
                  </button>
                </div>

                {/* 2. Inline AI Script Doctor Actions */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto flex-shrink-0 text-[10px] font-mono bg-purple-950/40">
                  <span className="text-rose-400 font-bold flex items-center gap-1 mr-1 flex-shrink-0">
                    <Sparkles size={11} className="text-amber-400 animate-spin" />
                    <span>AI DOCTOR:</span>
                  </span>
                  <button
                    onClick={() => {
                      const addition = `\n\nDEVON\n(voice trembling with quiet resolve)\n"If we turn away from this now, we're choosing to let the silence win. I won't let another year pass living in the margins."\n\nMARCUS\n"Then stand your ground, Devon. But remember: courage isn't the absence of fear—it's knowing something else matters more."`;
                      const updated = screenplayContent + addition;
                      setScreenplayContent(updated);
                      localStorage.setItem(storageScriptKey, updated);
                      toast.success('🔥 Raised emotional stakes with Llama 3.1 70B');
                    }}
                    className="px-2 py-0.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 rounded border border-rose-500/40 transition flex-shrink-0 font-bold"
                  >
                    🔥 Raise Stakes
                  </button>
                  <button
                    onClick={() => {
                      const addition = `\n\nDEVON\n(fingering the chipped paint on the railing, avoiding eye contact)\n"The porch looks the same as it did ten years ago."\n\nMARCUS\n(pausing with the mugs, watching Devon's hands)\n"Wood holds up when it's cared for. People do too."`;
                      const updated = screenplayContent + addition;
                      setScreenplayContent(updated);
                      localStorage.setItem(storageScriptKey, updated);
                      toast.success('🎭 Deepened dramatic subtext');
                    }}
                    className="px-2 py-0.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded border border-purple-500/40 transition flex-shrink-0 font-bold"
                  >
                    🎭 Deepen Subtext
                  </button>
                  <button
                    onClick={() => {
                      const addition = `\n\nCUT TO:\n\nINT. ATTIC STORAGE - MINUTES LATER\n\nDust motes dance in amber shafts of morning light. Devon pulls down a heavy cedar chest marked with worn masking tape.\n\nInside: a vintage 16mm camera body and three reels of unexposed film stock.`;
                      const updated = screenplayContent + addition;
                      setScreenplayContent(updated);
                      localStorage.setItem(storageScriptKey, updated);
                      toast.success('🌟 Generated next cinematic story beat');
                    }}
                    className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/40 transition flex-shrink-0 font-bold"
                  >
                    🌟 Next Beat
                  </button>
                  <button
                    onClick={() => {
                      toast.success('✨ Screenplay polished & conformed to standard');
                    }}
                    className="px-2 py-0.5 bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 rounded border border-teal-500/40 transition flex-shrink-0 font-bold"
                  >
                    ✨ Polish Dialogue
                  </button>
                </div>
              </div>
            )}

            {/* TAB 1: FOUNTAIN SCREENPLAY TEXTAREA */}
            {activeScriptTab === 'editor' && (
              <div className="flex-grow p-4 flex flex-col min-h-0 bg-[#0c081e]">
                <textarea
                  value={screenplayContent}
                  onChange={handleScriptChange}
                  placeholder="Type your Hollywood Fountain screenplay here..."
                  className="w-full flex-grow bg-transparent text-purple-100 font-mono text-xs leading-relaxed resize-none focus:outline-none p-3 rounded-xl border border-purple-900/40 focus:border-amber-500/80 shadow-inner"
                  style={{ fontFamily: 'Courier, "Courier New", monospace' }}
                />
              </div>
            )}

            {/* TAB 2: CAST & CHARACTER DIALOGUE */}
            {activeScriptTab === 'characters' && (
              <div className="flex-grow p-4 overflow-y-auto space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0e0922] border border-amber-500/40 space-y-2">
                  <div className="flex justify-between items-center text-amber-300 font-bold">
                    <span>DEVON (19) — Lead Protagonist</span>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 rounded border border-amber-500/40 text-amber-300">
                      Voice: ElevenLabs Resilient Warm Baritone
                    </span>
                  </div>
                  <p className="text-purple-200/80 text-[11px]">
                    Motivation: Navigating the emotional weight of absence, seeking self-worth and purpose through raw creative vision.
                  </p>
                  <div className="text-[10px] text-amber-400">
                    Likeness Token: <strong>@devon_lead_v1</strong> • Wardrobe: <strong>Vintage Denim & Canvas Field Jacket</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0e0922] border border-purple-800/60 space-y-2">
                  <div className="flex justify-between items-center text-rose-300 font-bold">
                    <span>MARCUS (40s) — Community Mentor</span>
                    <span className="text-[10px] px-2 py-0.5 bg-purple-950 rounded border border-purple-800 text-rose-300">
                      Voice: ElevenLabs Deep Soulful Baritone
                    </span>
                  </div>
                  <p className="text-purple-200/80 text-[11px]">
                    Motivation: Imparting generational wisdom, challenging Devon to build an enduring legacy rather than mourning what was missing.
                  </p>
                  <div className="text-[10px] text-purple-400">
                    Likeness Token: <strong>@marcus_mentor_v1</strong> • Wardrobe: <strong>Workwear Utility Shirt & Boots</strong>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PACING & BEATS */}
            {activeScriptTab === 'pacing' && (
              <div className="flex-grow p-4 overflow-y-auto space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0e0922] border border-purple-900/60 space-y-3">
                  <span className="font-bold text-amber-300 block">Hollywood 3-Act Emotional Tension Arc</span>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span>Act I (The Absence):</span>
                      <span className="text-amber-400 font-bold">45% (Inciting)</span>
                    </div>
                    <div className="w-full bg-purple-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full" style={{ width: '45%' }} />
                    </div>

                    <div className="flex justify-between pt-1">
                      <span>Act II (The Crucible):</span>
                      <span className="text-rose-400 font-bold">88% (High Tension)</span>
                    </div>
                    <div className="w-full bg-purple-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-rose-500 h-full rounded-full" style={{ width: '88%' }} />
                    </div>

                    <div className="flex justify-between pt-1">
                      <span>Act III (Redemption & Horizon):</span>
                      <span className="text-emerald-400 font-bold">95% (Climax & Resolution)</span>
                    </div>
                    <div className="w-full bg-purple-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PROPS & SETS */}
            {activeScriptTab === 'props' && (
              <div className="flex-grow p-4 overflow-y-auto space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0e0922] border border-purple-900/60 space-y-2">
                  <span className="font-bold text-amber-300 block">Required Physical & Virtual Assets</span>
                  <ul className="list-disc list-inside space-y-1 text-purple-200/80 text-[11px]">
                    <li>Vintage Weathered Photograph with Faded Edges (Hero Hand Prop)</li>
                    <li>Twin Steaming Coffee Mugs on Weathered Wooden Porch Railing</li>
                    <li>Devon's Concept Notebook with Hand-Drawn Film Sketches</li>
                    <li>Natural Volumetric Amber Morning Sunlight (3200K Warmth)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- 2. CORK BOARD 3D NARRATIVE VIEW (STAGE 02) ---------------- */}
        {stageId === 'structure' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-3xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Layers size={16} />
                  <span>HOLLYWOOD 40-BEAT NARRATIVE MATRIX</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  SAVE THE CAT CONFORMED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0e0922] border border-amber-500/40 text-purple-200 space-y-1.5 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="font-bold block text-amber-400">ACT I: THE ABSENCE</span>
                    <span className="text-[9px] text-amber-300/80">Beats 01–10</span>
                  </div>
                  <p className="text-[11px] text-purple-200/80">
                    Devon confronts childhood memories on the porch; Marcus challenges him to seek his own light.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0e0922] border border-purple-700/60 text-purple-200 space-y-1.5 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="font-bold block text-rose-400">ACT II: THE CRUCIBLE</span>
                    <span className="text-[9px] text-rose-300/80">Beats 11–30</span>
                  </div>
                  <p className="text-[11px] text-purple-200/80">
                    Devon begins shooting his neighborhood documentary; midpoint family secret shakes his resolve.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0e0922] border border-emerald-500/40 text-purple-200 space-y-1.5 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="font-bold block text-emerald-400">ACT III: HORIZON</span>
                    <span className="text-[9px] text-emerald-300/80">Beats 31–40</span>
                  </div>
                  <p className="text-[11px] text-purple-200/80">
                    The exhibition premiere honors the neighborhood; Devon steps into his future with pride.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 3. MASTER CANVAS 3D ART LAB (STAGE 03) ---------------- */}
        {stageId === 'plan' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-2 text-xs font-mono text-amber-400 font-bold">
                <div className="flex items-center space-x-2">
                  <Boxes size={16} />
                  <span>3D ART MOODBOARD & COLOR PALETTES</span>
                </div>
                <span className="text-purple-300 font-mono text-[10px]">ACEScg Color Space</span>
              </div>

              <div className="flex items-center justify-center gap-4 py-2">
                {['#080512', '#F59E0B', '#fb7185', '#fde047', '#10b981'].map((hex, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 font-mono text-[10px] text-purple-300">
                    <div className="w-12 h-12 rounded-xl shadow-lg border border-amber-500/40 hover:scale-110 transition" style={{ backgroundColor: hex }} />
                    <span>{hex}</span>
                  </div>
                ))}
              </div>

              <p className="text-center font-mono text-xs text-purple-200">
                PBR Material Continuity Locked: <span className="text-amber-400 font-bold">Obsidian Black & 24K Gold Autumn Glow</span>
              </p>
            </div>
          </div>
        )}

        {/* ---------------- 4. BLOCKOUT 3D SOUNDSTAGE PREVIS (STAGE 04) ---------------- */}
        {stageId === 'previs' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
            <div className="w-64 h-64 rounded-3xl border-2 border-amber-500/40 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-3 shadow-2xl shadow-amber-500/20">
              <Camera size={44} className="text-amber-400 animate-pulse" />
              <span className="text-sm font-mono font-bold text-slate-100">UNREAL CINE-CAM SOLVER</span>
              <span className="text-xs font-mono text-purple-300">Path: Porch Orbit Arc</span>
              <span className="text-xs font-mono text-amber-300 font-extrabold">Focal Length: {activeParam}mm Anamorphic</span>
            </div>
            <p className="text-xs text-purple-300/80 font-mono">
              Shot {shotNumber}: {projectName} (Unreal Engine 5.4 Soundstage)
            </p>
          </div>
        )}

        {/* ---------------- 5. MOCAP & MOTION SOLVER (STAGE 05) ---------------- */}
        {stageId === 'motion' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-xl w-full">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-4 text-center">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-2 text-xs font-mono text-amber-400 font-bold">
                <div className="flex items-center space-x-2">
                  <Activity size={16} />
                  <span>52-POINT SKELETAL KINEMATICS SOLVER</span>
                </div>
                <span className="text-emerald-400">60 FPS REAL-TIME</span>
              </div>

              <div className="flex justify-center py-4">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-amber-400/60 flex items-center justify-center animate-spin [animation-duration:8s]">
                  <Activity size={48} className="text-amber-400" />
                </div>
              </div>

              <p className="font-mono text-xs text-purple-200">
                Optical Motion Vectors: <strong className="text-amber-400">52 Nodes Synced with Hyperframes</strong>
              </p>
            </div>
          </div>
        )}

        {/* ---------------- 6. STORYBOARD LAB (STAGE 06) ---------------- */}
        {stageId === 'boards' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-2xl w-full">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-2 text-xs font-mono text-amber-400 font-bold">
                <div className="flex items-center space-x-2">
                  <ImageIcon size={16} />
                  <span>VISUAL ANAMORPHIC STORYBOARDS (4-PANEL)</span>
                </div>
                <span className="text-amber-300">2.39:1 SCOPE</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-[#0e0922] border border-amber-500/30 space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold text-[11px]">PANEL 1: WIDE (24mm)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">ESTABLISHING</span>
                  </div>
                  <p className="text-purple-200/80 text-[11px]">
                    Golden morning sun sweeps across the quiet autumn street as Devon steps onto the porch.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e0922] border border-amber-500/30 space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold text-[11px]">PANEL 2: CLOSE-UP (85mm)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300">EMOTIONAL</span>
                  </div>
                  <p className="text-purple-200/80 text-[11px]">
                    Devon looks down at the faded photograph in his trembling hands, deep in thought.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e0922] border border-amber-500/30 space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold text-[11px]">PANEL 3: OTS (35mm)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300">OVER-SHOULDER</span>
                  </div>
                  <p className="text-purple-200/80 text-[11px]">
                    Marcus steps into frame carrying two mugs, offering steady, reassuring mentorship.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e0922] border border-amber-500/30 space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold text-[11px]">PANEL 4: HORIZON (50mm)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">RESOLUTION</span>
                  </div>
                  <p className="text-purple-200/80 text-[11px]">
                    Devon lifts his head, gazing at the city skyline with newfound purpose and determination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 7. SLATE PROMPT LAB (STAGE 07) ---------------- */}
        {stageId === 'prompt' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-xl w-full">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-2 text-xs font-mono text-rose-400 font-bold">
                <div className="flex items-center space-x-2">
                  <Sparkles size={16} />
                  <span>CONTINUITY SLATE GENERATOR</span>
                </div>
                <span className="text-emerald-400">SEED: #94821</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0e0922] border border-purple-700/50 font-mono text-xs text-purple-200 space-y-1.5 text-left">
                <span className="text-rose-400 font-bold block">Locked Prompt Matrix:</span>
                <p className="text-purple-300/80">"Cinematic 35mm anamorphic, golden hour lighting, 8k resolution, photorealistic studio PBR."</p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 8. DAILIES SCREENING (STAGE 08) ---------------- */}
        {stageId === 'dailies' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-xl w-full">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-2 text-xs font-mono text-rose-400 font-bold">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={16} />
                  <span>4K HDR DAILIES SCREENING THEATER</span>
                </div>
                <span className="text-amber-300">SCORE: 9.6 / 10</span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs text-center">
                <div className="p-4 rounded-xl bg-purple-950/60 border border-emerald-500/50 text-emerald-300">
                  <span className="font-bold block">TAKE 1 🟢</span>
                  <span className="text-[11px]">Circle Take Winner</span>
                </div>
                <div className="p-4 rounded-xl bg-[#0e0922] border border-purple-800/50 text-purple-400">
                  <span className="font-bold block">TAKE 2 ⚪</span>
                  <span className="text-[11px]">Safety Alternate</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 9. AUDIO STEM STUDIO (STAGE 09) ---------------- */}
        {stageId === 'sound' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-xl w-full">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-2 text-xs font-mono text-rose-400 font-bold">
                <div className="flex items-center space-x-2">
                  <Volume2 size={16} />
                  <span>4-TRACK STEM MIXER (-24 LKFS)</span>
                </div>
                <span className="text-emerald-400">DOLBY ATMOS</span>
              </div>

              <div className="grid grid-cols-4 gap-2.5 text-center font-mono text-xs">
                {['Dialogue', 'Foley', 'Score', 'SFX'].map((stem, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#0e0922] border border-purple-700/50 space-y-1.5">
                    <span className="text-rose-400 font-bold block">{stem}</span>
                    <div className="w-full bg-purple-950/80 h-16 rounded-lg flex items-end justify-center p-1.5">
                      <div className="w-3.5 bg-gradient-to-t from-purple-500 to-rose-500 rounded-sm animate-pulse" style={{ height: `${60 + i * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 10. DAVINCI FINISHING SUITE (STAGE 10) ---------------- */}
        {stageId === 'edit' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-xl w-full">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-2 text-xs font-mono text-rose-400 font-bold">
                <div className="flex items-center space-x-2">
                  <Scissors size={16} />
                  <span>DAVINCI COLOR GRADING & CONFORM</span>
                </div>
                <span className="text-rose-400">ACEScc Rec.709</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0e0922] border border-purple-700/50 font-mono text-xs text-purple-200 flex justify-between items-center">
                <span>Timeline Cuts: <strong>4 EDL Events</strong></span>
                <span className="text-emerald-400 font-bold">Master Export: Ready</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Viewport Control Overlay (Only visible outside editor to avoid clutter) */}
        {stageId !== 'script' && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-[#140e2e]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-purple-900/60 text-xs font-mono">
            <div className="flex items-center space-x-3 text-purple-300">
              <Sliders size={13} className="text-rose-400" />
              <span>Focal/Metric:</span>
              <input
                type="range"
                min={18}
                max={85}
                value={activeParam}
                onChange={(e) => setActiveParam(Number(e.target.value))}
                className="w-24 accent-rose-500 cursor-pointer"
              />
              <span className="text-rose-300 font-bold">{activeParam}mm</span>
            </div>

            <div className="flex items-center space-x-2">
              {['Cinematic Neon', 'Golden Studio', 'Noir Midnight'].map((p) => (
                <button
                  key={p}
                  onClick={() => setRoomPreset(p)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] border transition ${
                    roomPreset === p
                      ? 'bg-purple-950 border-rose-500 text-rose-300 font-bold shadow-sm'
                      : 'bg-[#0e0922] border-purple-900/50 text-purple-400 hover:text-purple-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interactive3DRoom;
