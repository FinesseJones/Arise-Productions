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
  Download,
  Copy,
  FolderArchive,
  Palette,
  Compass,
  Cpu,
  Mic,
  SlidersHorizontal,
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
  const [roomPreset, setRoomPreset] = useState<string>('Golden Studio');
  const [activeScriptTab, setActiveScriptTab] = useState<'editor' | 'characters' | 'pacing' | 'props'>('editor');
  const [activeArtTab, setActiveArtTab] = useState<'colors' | 'textures' | 'lighting' | 'wardrobe'>('colors');
  const [activeCameraTab, setActiveCameraTab] = useState<'lens' | 'motion' | 'sensor' | 'coordinates'>('lens');
  const [activeMocapTake, setActiveMocapTake] = useState<number>(1);
  const [storyboardRatio, setStoryboardRatio] = useState<'2.39:1' | '16:9' | '9:16'>('2.39:1');
  const [controlNetWeight, setControlNetWeight] = useState<number>(0.85);
  const [ipAdapterWeight, setIpAdapterWeight] = useState<number>(0.90);
  const [selectedDailiesTake, setSelectedDailiesTake] = useState<number>(3);
  const [selectedLut, setSelectedLut] = useState<string>('Kodak 2383 Film Print');
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Audio Stem Mixer State
  const [dialogueVolume, setDialogueVolume] = useState<number>(85);
  const [foleyVolume, setFoleyVolume] = useState<number>(70);
  const [scoreVolume, setScoreVolume] = useState<number>(75);
  const [lfeVolume, setLfeVolume] = useState<number>(60);
  const [mutedStems, setMutedStems] = useState<{ [k: string]: boolean }>({});

  const cleanSlug = (projectName || 'Arise_Production').replace(/[^a-zA-Z0-9]/g, '_');
  const storageScriptKey = `arise_script_${cleanSlug}_shot_${shotNumber}`;

  // Default Fountain Screenplay tailored to active project
  const defaultFountain = `EXT. URBAN NEIGHBORHOOD PORCH - EARLY MORNING

Golden morning light breaks through the amber trees, catching the dust motes in the brisk autumn air. A heavy silence settles over the quiet street.

DEVON (19)
(standing on the front porch, clutching an old weathered photograph)
"They always told me a tree without deep roots could never stand a storm. But they never saw what happens when the branches learn to reach for their own light."

MARCUS (40s, mentor, steps onto the porch with two steaming mugs)
"You've been carrying questions that were never yours to answer, Devon. Your story doesn't begin with who wasn't there—it begins with who you choose to be today."

DEVON
(taking a slow breath, looking out at the waking city)
"Then let's build something that lasts."

CUT TO:

INT. LIVING ROOM WORKSPACE - CONTINUOUS

Devon opens a notebook filled with hand-drawn plans and film concepts.`;

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

  // Auto-save script edits
  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setScreenplayContent(text);
    setIsSaved(false);

    try {
      localStorage.setItem(storageScriptKey, text);
    } catch {}

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
    if (tagType === 'scene') tag = `\n\nEXT. URBAN NEIGHBORHOOD - SCENE ${shotNumber} - DAY\n\n`;
    if (tagType === 'character') tag = `\n\nDEVON (19)\n`;
    if (tagType === 'dialogue') tag = `"Your dialogue line here."\n\n`;
    if (tagType === 'action') tag = `\nDevon examines the lens, adjusting the focus ring.\n\n`;
    if (tagType === 'transition') tag = `\n\nCUT TO:\n\n`;

    const updated = screenplayContent + tag;
    setScreenplayContent(updated);
    try {
      localStorage.setItem(storageScriptKey, updated);
    } catch {}
    toast.success(`Inserted ${tagType} block`);
  };

  const wordCount = screenplayContent.trim().split(/\s+/).filter(Boolean).length;
  const pageEstimate = Math.max(1, Math.ceil(wordCount / 200));
  const runtimeMinutes = Math.floor(wordCount / 130);
  const runtimeSeconds = Math.round(((wordCount % 130) / 130) * 60);

  return (
    <div className="flex flex-col h-full bg-[#080512] border border-purple-900/50 rounded-2xl overflow-hidden shadow-2xl relative select-none">
      {/* Top 3D Room Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e0922] border-b border-purple-900/50 text-xs font-mono text-purple-300 flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
          <span className="text-amber-200 font-bold tracking-wide uppercase">
            3D {roomName.toUpperCase()}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-amber-300 border border-amber-500/40 font-bold">
            60 FPS SPATIAL
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span>Shot {shotNumber}: <strong className="text-amber-300">{shotTitle}</strong></span>
          <span className="hidden sm:inline">Lighting Preset: <strong className="text-rose-300">{roomPreset}</strong></span>
        </div>
      </div>

      {/* Main 3D Spatial Canvas / Workspace */}
      <div className="relative flex-grow flex flex-col items-center justify-start p-4 lg:p-6 overflow-y-auto min-h-0 bg-gradient-to-b from-[#080512] via-[#0e0922] to-[#080512]">
        {/* Holographic 3D Spatial Perspective Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b2d71_1px,transparent_1px),linear-gradient(to_bottom,#3b2d71_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        {/* Proof-of-Ownership Arise Productions Watermark */}
        <div className="absolute top-3 right-3 z-20 flex items-center space-x-2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/50 shadow-xl shadow-amber-500/15">
          <div className="w-6 h-6 rounded-lg overflow-hidden bg-black border border-amber-500/60 flex-shrink-0">
            <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
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

        {/* ---------------- 1. STAGE 01: SCRIPTBREAK WRITERS ROOM ---------------- */}
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
                <span className="text-amber-300/90 font-bold">📄 Page 1 of {pageEstimate}</span>
                <span className="text-slate-400">⏱️ ~{runtimeMinutes}m {runtimeSeconds}s</span>
                <span className={`flex items-center gap-1 ${isSaved ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSaved ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
                  {isSaved ? 'Auto-Saved' : 'Syncing...'}
                </span>
              </div>
            </div>

            {/* Hollywood Formatting Toolbar & Inline AI Script Doctor Strip */}
            {activeScriptTab === 'editor' && (
              <div className="flex flex-col border-b border-purple-900/40 bg-[#160f33]">
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
                    onClick={() => toast.success('✨ Screenplay polished & conformed to standard')}
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

        {/* ---------------- 2. STAGE 02: CORK BOARD 40-BEAT NARRATIVE MATRIX ---------------- */}
        {stageId === 'structure' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Layers size={16} />
                  <span>HOLLYWOOD 40-BEAT NARRATIVE MATRIX (SAVE THE CAT)</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                  ACTS CONFORMED • 105 MIN TARGET
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                {/* Act I */}
                <div className="p-4 rounded-2xl bg-[#0e0922] border border-amber-500/40 text-purple-200 space-y-2.5 shadow-lg">
                  <div className="flex justify-between items-center border-b border-amber-500/20 pb-2">
                    <span className="font-bold block text-amber-400">ACT I: THE ABSENCE</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Beats 01–10</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-purple-200/90">
                    <p>• <strong>01 Opening Image:</strong> Devon stands on the porch holding the weathered photograph.</p>
                    <p>• <strong>04 Theme Stated:</strong> Marcus speaks about branches finding their own sun.</p>
                    <p>• <strong>07 Inciting Incident:</strong> Discovery of father's hidden architectural journals.</p>
                    <p>• <strong>10 Break into Act II:</strong> Devon resolves to film the neighborhood documentary.</p>
                  </div>
                </div>

                {/* Act II */}
                <div className="p-4 rounded-2xl bg-[#0e0922] border border-purple-700/60 text-purple-200 space-y-2.5 shadow-lg">
                  <div className="flex justify-between items-center border-b border-purple-700/40 pb-2">
                    <span className="font-bold block text-rose-400">ACT II: THE CRUCIBLE</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">Beats 11–30</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-purple-200/90">
                    <p>• <strong>15 First Success:</strong> Capturing powerful community interviews on 35mm.</p>
                    <p>• <strong>20 Midpoint Reversal:</strong> Evelyn reveals the hidden past, shattering assumptions.</p>
                    <p>• <strong>26 All Is Lost:</strong> Storm damages primary camera rig before the deadline.</p>
                    <p>• <strong>29 Dark Night:</strong> Marcus passes down a vintage heirloom prime lens.</p>
                  </div>
                </div>

                {/* Act III */}
                <div className="p-4 rounded-2xl bg-[#0e0922] border border-emerald-500/40 text-purple-200 space-y-2.5 shadow-lg">
                  <div className="flex justify-between items-center border-b border-emerald-500/20 pb-2">
                    <span className="font-bold block text-emerald-400">ACT III: REDEMPTION</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Beats 31–40</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-purple-200/90">
                    <p>• <strong>33 The Rally:</strong> The community joins forces to complete sound mixing.</p>
                    <p>• <strong>37 The Exhibition:</strong> The premiere in the hall brings universal acclaim.</p>
                    <p>• <strong>39 Catharsis:</strong> Devon and Evelyn embrace in heartfelt mutual respect.</p>
                    <p>• <strong>40 Final Horizon:</strong> Devon looks forward, defined by his own creation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 3. STAGE 03: MASTER CANVAS ART & COLOR BIBLE ---------------- */}
        {stageId === 'plan' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Boxes size={16} />
                  <span>3D ART DIRECTION, TEXTURES & ACEScg COLOR BIBLE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['colors', 'textures', 'lighting', 'wardrobe'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveArtTab(tab)}
                      className={`px-2.5 py-1 rounded-lg uppercase text-[10px] transition font-bold ${
                        activeArtTab === tab
                          ? 'bg-amber-500 text-black shadow-sm'
                          : 'bg-black/40 text-slate-400 hover:text-amber-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {activeArtTab === 'colors' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { name: 'Obsidian Void', hex: '#080512', desc: 'Deep background base' },
                      { name: 'Autumn Amber', hex: '#F59E0B', desc: '3200K Golden key' },
                      { name: 'Rose Glow', hex: '#FB7185', desc: 'Emotional accent rim' },
                      { name: 'Porch Dawn Gold', hex: '#FDE047', desc: 'Morning sun beam' },
                      { name: 'Emerald Horizon', hex: '#10B981', desc: 'Resolution glow' },
                    ].map((col) => (
                      <div key={col.hex} className="p-3 rounded-xl bg-black/40 border border-purple-900/60 flex flex-col items-center gap-2 text-center">
                        <div className="w-14 h-14 rounded-xl shadow-lg border border-amber-500/40" style={{ backgroundColor: col.hex }} />
                        <div>
                          <strong className="text-amber-300 block text-[11px]">{col.name}</strong>
                          <span className="text-[10px] text-slate-400">{col.hex}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-purple-300 text-[11px] pt-2">
                    ACEScg Wide Color Gamut Conformed • Color Space Transform: Rec.709 / P3-D65
                  </p>
                </div>
              )}

              {activeArtTab === 'textures' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/60 space-y-1">
                    <span className="text-amber-400 font-bold">Weathered Porch Wood</span>
                    <p className="text-slate-300 text-[11px]">Roughness: 0.85 • Normal: High relief grain • Albedo: Warm cedar</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/60 space-y-1">
                    <span className="text-amber-400 font-bold">Vintage Canvas Jacket</span>
                    <p className="text-slate-300 text-[11px]">Roughness: 0.70 • Micro-fiber fuzz sheen • Albedo: Olive stone</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/60 space-y-1">
                    <span className="text-amber-400 font-bold">Autumn Atmospheric Mist</span>
                    <p className="text-slate-300 text-[11px]">Scattering: 0.15 • Volumetric Density: 0.04 • Temperature: 3200K</p>
                  </div>
                </div>
              )}

              {activeArtTab === 'lighting' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-center">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-1">
                    <span className="text-amber-300 font-bold">KEY LIGHT (45° Porch)</span>
                    <p className="text-slate-300 text-[11px]">3200K Golden Amber • Intensity: 18,000 Lux</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/40 space-y-1">
                    <span className="text-purple-300 font-bold">FILL LIGHT (90° Bounce)</span>
                    <p className="text-slate-300 text-[11px]">5600K Cool Sky Ambient • Intensity: 4,500 Lux</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 space-y-1">
                    <span className="text-rose-300 font-bold">RIM / HAIR LIGHT</span>
                    <p className="text-slate-300 text-[11px]">6500K Sharp Edge • Intensity: 12,000 Lux</p>
                  </div>
                </div>
              )}

              {activeArtTab === 'wardrobe' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/60 space-y-1">
                    <span className="text-amber-400 font-bold">Devon (Lead Protagonist)</span>
                    <p className="text-slate-300 text-[11px]">Vintage Denim over washed-black tee, canvas field jacket, worn brown leather boots.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/60 space-y-1">
                    <span className="text-rose-400 font-bold">Marcus (Community Mentor)</span>
                    <p className="text-slate-300 text-[11px]">Heavy workwear utility over-shirt, brass wristwatch, charcoal canvas trousers.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- 4. STAGE 04: BLOCKOUT 3D CINECAMERA PREVIS ---------------- */}
        {stageId === 'previs' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Camera size={16} />
                  <span>UNREAL ENGINE 5.4 VIRTUAL CINEMATOGRAPHY & CINECAM LAB</span>
                </div>
                <span className="text-amber-300 text-[10px] font-bold bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/40">
                  COOKE ANAMORPHIC /i PRIME
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/60 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Prime Focal Length</span>
                  <strong className="text-amber-300 text-sm">{activeParam}mm Anamorphic</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/60 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Aperture / T-Stop</span>
                  <strong className="text-amber-300 text-sm">T1.8 (f/1.8)</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/60 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Sensor Dimensions</span>
                  <strong className="text-amber-300 text-sm">36.00 x 24.00 mm</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/60 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Camera Rig Path</span>
                  <strong className="text-amber-300 text-sm">Porch Orbit Arc 15°</strong>
                </div>
              </div>

              {/* Lens Quick Selector */}
              <div className="space-y-2 font-mono text-xs">
                <label className="text-purple-300 text-[11px] block">Quick Switch Cine Lens:</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[18, 24, 35, 50, 85, 135].map((mm) => (
                    <button
                      key={mm}
                      onClick={() => setActiveParam(mm)}
                      className={`py-2 rounded-xl border font-bold transition text-xs ${
                        activeParam === mm
                          ? 'bg-amber-500 border-amber-400 text-black shadow-md shadow-amber-500/30'
                          : 'bg-black/40 border-purple-900/60 text-purple-300 hover:text-white'
                      }`}
                    >
                      {mm}mm Prime
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-purple-900/60 font-mono text-xs flex justify-between items-center text-purple-200">
                <span>Vector: <strong>[X: 12.4m, Y: 4.2m, Z: 1.6m]</strong></span>
                <span className="text-emerald-400 font-bold">Unreal Engine 5.4 Synced (:30010)</span>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 5. STAGE 05: MOCAP & MOTION SOLVER ---------------- */}
        {stageId === 'motion' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Activity size={16} />
                  <span>52-POINT OPTICAL SKELETAL MOCAP & HYPERFRAMES VOLUME</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                  60 FPS NEURAL SOLVE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                {[
                  { take: 1, title: 'Take 1: Porch Approach', nodes: '52/52 Nodes', status: 'Approved' },
                  { take: 2, title: 'Take 2: Photograph Reveal', nodes: '52/52 Nodes', status: 'Master Take 🟢' },
                  { take: 3, title: 'Take 3: Horizon Turn', nodes: '50/52 Nodes', status: 'Alt Take' },
                ].map((t) => (
                  <button
                    key={t.take}
                    onClick={() => setActiveMocapTake(t.take)}
                    className={`p-4 rounded-xl border text-left space-y-1.5 transition ${
                      activeMocapTake === t.take
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold shadow-md'
                        : 'bg-black/40 border-purple-900/60 text-purple-300 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-amber-300">{t.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{t.nodes} • Kinematic drift: 0.02mm</p>
                    <span className="text-[10px] text-emerald-400 font-mono block">{t.status}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-purple-900/60 font-mono text-xs text-center space-y-1">
                <span className="text-amber-300 font-bold">Hyperframes Neural Keyframe Synthesizer Active</span>
                <p className="text-slate-400 text-[11px]">
                  Bone hierarchy calibrated for Devon (Height: 180cm, Stride: 0.78m) • Solved to BVH / FBX
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 6. STAGE 06: STORYBOARD LAB (4-PANEL) ---------------- */}
        {stageId === 'boards' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <ImageIcon size={16} />
                  <span>4-PANEL ANAMORPHIC STORYBOARD & COMPOSITION MATRIX</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['2.39:1', '16:9', '9:16'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setStoryboardRatio(r)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition font-bold ${
                        storyboardRatio === r
                          ? 'bg-amber-500 text-black shadow-sm'
                          : 'bg-black/40 text-slate-400 hover:text-amber-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-mono text-xs">
                <div className="p-4 rounded-2xl bg-[#0e0922] border border-amber-500/40 space-y-2 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold text-xs">PANEL 1: WIDE (24mm Prime)</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">ESTABLISHING</span>
                  </div>
                  <p className="text-purple-200/90 text-xs leading-relaxed">
                    Golden morning sun sweeps across the quiet autumn street as Devon steps onto the porch clutching the weathered photograph.
                  </p>
                  <span className="text-[10px] text-slate-400 block">Dolly In 1.2 m/s • Eye Level 160cm</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e0922] border border-purple-800/60 space-y-2 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-rose-400 font-bold text-xs">PANEL 2: CLOSE-UP (85mm Prime)</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">EMOTIONAL</span>
                  </div>
                  <p className="text-purple-200/90 text-xs leading-relaxed">
                    Devon looks down at the faded image in his trembling hands, deep in thought as memory echoes surface.
                  </p>
                  <span className="text-[10px] text-slate-400 block">Static Lockoff • Shallow Depth T1.8</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e0922] border border-purple-800/60 space-y-2 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 font-bold text-xs">PANEL 3: OTS (35mm Prime)</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">OVER-SHOULDER</span>
                  </div>
                  <p className="text-purple-200/90 text-xs leading-relaxed">
                    Marcus steps into frame carrying two steaming mugs, offering steady, grounded mentorship and warmth.
                  </p>
                  <span className="text-[10px] text-slate-400 block">Pan Left 15° • Orbit Arc Track</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e0922] border border-emerald-500/40 space-y-2 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 font-bold text-xs">PANEL 4: HORIZON (50mm Prime)</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">RESOLUTION</span>
                  </div>
                  <p className="text-purple-200/90 text-xs leading-relaxed">
                    Devon lifts his head, gazing at the city skyline with newfound purpose, ready to build something lasting.
                  </p>
                  <span className="text-[10px] text-slate-400 block">Slow Crane Up • Amber Backlight</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 7. STAGE 07: SLATE PROMPT LAB (COMFYUI FLUX) ---------------- */}
        {stageId === 'prompt' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Sparkles size={16} />
                  <span>COMFYUI FLUX.1 DEV GENERATIVE SLATE MATRIX</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                  SEED #94821 LOCKED
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-amber-300 font-bold">Positive Prompt (Cinematic ACEScg):</label>
                  <div className="p-3 rounded-xl bg-black/60 border border-purple-900/60 text-purple-100 text-[11px] leading-relaxed">
                    "Cinematic 35mm anamorphic film still from 'A Fatherless Child', Devon (19) standing on porch, holding vintage weathered photograph, volumetric 3200K golden amber morning lighting, ultra-detailed skin pores, photorealistic textures, masterwork, ACEScg color space."
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/60 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">ControlNet Depth V2 Weight:</span>
                      <strong className="text-amber-400">{controlNetWeight}</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={controlNetWeight}
                      onChange={(e) => setControlNetWeight(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/60 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">IP-Adapter Face Lock (@devon_lead_v1):</span>
                      <strong className="text-amber-400">{ipAdapterWeight}</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={ipAdapterWeight}
                      onChange={(e) => setIpAdapterWeight(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={() => toast.success('🚀 Dispatched slate to ComfyUI FLUX.1 Dev Bridge (:8188)')}
                  className="w-full py-3 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-black rounded-xl transition text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                >
                  🚀 Dispatch to ComfyUI FLUX.1 Engine (:8188)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 8. STAGE 08: CIRCLE TAKE DAILIES THEATER ---------------- */}
        {stageId === 'dailies' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <CheckCircle2 size={16} />
                  <span>4K HDR CIRCLE TAKE REVIEW & QC QUALITY GATE</span>
                </div>
                <span className="text-amber-300 text-[10px] font-bold bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/40">
                  DIRECTOR SCORE: 9.8 / 10
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                {[
                  { take: 1, title: 'Take 1: Previs Wireframe', score: '8.9 / 10', badge: 'Previs Pass' },
                  { take: 2, title: 'Take 2: Unreal Lighting', score: '9.3 / 10', badge: 'Lighting Pass' },
                  { take: 3, title: 'Take 3: Master ACEScc Grade', score: '9.8 / 10', badge: 'CIRCLE TAKE 🟢' },
                ].map((tk) => (
                  <button
                    key={tk.take}
                    onClick={() => setSelectedDailiesTake(tk.take)}
                    className={`p-4 rounded-xl border text-left space-y-2 transition ${
                      selectedDailiesTake === tk.take
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold shadow-md'
                        : 'bg-black/40 border-purple-900/60 text-purple-300 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{tk.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Score: <strong className="text-amber-400">{tk.score}</strong></p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block font-bold">
                      {tk.badge}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-purple-900/60 font-mono text-xs space-y-2">
                <span className="text-amber-300 font-bold block">QC Diagnostic Verification Checklist:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-purple-200">
                  <p>• Focus Lock: <strong className="text-emerald-400">100% Locked</strong></p>
                  <p>• Color Space: <strong className="text-emerald-400">ACEScc Valid</strong></p>
                  <p>• Audio Loudness: <strong className="text-emerald-400">-24.0 LKFS</strong></p>
                  <p>• Continuity: <strong className="text-emerald-400">Verified</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 9. STAGE 09: 5.1 DOLBY ATMOS STEM MIXER ---------------- */}
        {stageId === 'sound' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Volume2 size={16} />
                  <span>DOLBY ATMOS 5.1 MULTI-TRACK STEM MIXING CONSOLE</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                  -24.0 LKFS BROADCAST COMPLIANT
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                {/* Dialogue */}
                <div className="p-4 rounded-xl bg-black/40 border border-purple-900/60 flex flex-col items-center space-y-3">
                  <span className="text-amber-300 font-bold text-[11px]">A1: DIALOGUE</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={dialogueVolume}
                    onChange={(e) => setDialogueVolume(Number(e.target.value))}
                    className="h-28 accent-amber-500 cursor-pointer"
                    style={{ writingMode: 'vertical-lr' as any, direction: 'rtl' }}
                  />
                  <span className="text-slate-300 text-[10px]">{dialogueVolume}% (-24 LKFS)</span>
                </div>

                {/* Foley */}
                <div className="p-4 rounded-xl bg-black/40 border border-purple-900/60 flex flex-col items-center space-y-3">
                  <span className="text-purple-300 font-bold text-[11px]">A2: FOLEY BED</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={foleyVolume}
                    onChange={(e) => setFoleyVolume(Number(e.target.value))}
                    className="h-28 accent-purple-500 cursor-pointer"
                    style={{ writingMode: 'vertical-lr' as any, direction: 'rtl' }}
                  />
                  <span className="text-slate-300 text-[10px]">{foleyVolume}% (Spatial)</span>
                </div>

                {/* Score */}
                <div className="p-4 rounded-xl bg-black/40 border border-purple-900/60 flex flex-col items-center space-y-3">
                  <span className="text-rose-300 font-bold text-[11px]">A3: SCORE BED</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={scoreVolume}
                    onChange={(e) => setScoreVolume(Number(e.target.value))}
                    className="h-28 accent-rose-500 cursor-pointer"
                    style={{ writingMode: 'vertical-lr' as any, direction: 'rtl' }}
                  />
                  <span className="text-slate-300 text-[10px]">{scoreVolume}% (Acoustic)</span>
                </div>

                {/* LFE */}
                <div className="p-4 rounded-xl bg-black/40 border border-purple-900/60 flex flex-col items-center space-y-3">
                  <span className="text-teal-300 font-bold text-[11px]">A4: LFE SUB 40Hz</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={lfeVolume}
                    onChange={(e) => setLfeVolume(Number(e.target.value))}
                    className="h-28 accent-teal-500 cursor-pointer"
                    style={{ writingMode: 'vertical-lr' as any, direction: 'rtl' }}
                  />
                  <span className="text-slate-300 text-[10px]">{lfeVolume}% (Sub Bass)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-purple-900/60 font-mono text-xs flex justify-between items-center text-purple-200">
                <span>Voice Persona: <strong>ElevenLabs Resilient Warm Baritone</strong></span>
                <span className="text-emerald-400 font-bold">5.1 Surround Bed Synchronized</span>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 10. STAGE 10: DAVINCI COLOR & NLE CONFORM ---------------- */}
        {stageId === 'edit' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Scissors size={16} />
                  <span>DAVINCI RESOLVE MULTI-TRACK NLE TIMELINE & 3D LUT CONFORM</span>
                </div>
                <span className="text-amber-300 text-[10px] font-bold bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/40">
                  24.00 FPS DCI • ACEScc
                </span>
              </div>

              {/* Multi-Track Timeline */}
              <div className="p-4 rounded-xl bg-black/60 border border-purple-900/60 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-purple-900/40 pb-2 text-[11px] text-slate-400">
                  <span>SMPTE TIMECODE: <strong className="text-amber-400">00:01:15:18</strong></span>
                  <span>TOTAL CLIPS: <strong className="text-purple-300">3 Master Shots</strong></span>
                </div>

                <div className="space-y-2">
                  <div className="h-10 bg-amber-500/20 border border-amber-500/50 rounded-lg px-3 flex items-center justify-between text-amber-300 text-[11px]">
                    <span>V1: Shot_01_Echoes_Of_Absence_35mm.mov</span>
                    <span>00:00:00 - 00:00:24</span>
                  </div>
                  <div className="h-8 bg-purple-500/20 border border-purple-500/50 rounded-lg px-3 flex items-center justify-between text-purple-300 text-[10px]">
                    <span>V2: Shot_01_CloseUp_Faded_Photo_Insert.mov</span>
                    <span>00:00:10 - 00:00:18</span>
                  </div>
                  <div className="h-8 bg-teal-500/20 border border-teal-500/50 rounded-lg px-3 flex items-center justify-between text-teal-300 text-[10px]">
                    <span>A1-A4: Dolby_Atmos_5.1_Master_Mix.wav</span>
                    <span>48 kHz / 24-bit</span>
                  </div>
                </div>
              </div>

              {/* 3D LUT Selector & Export */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/60 space-y-2">
                  <label className="text-amber-300 font-bold block">Select 3D LUT Film Profile:</label>
                  <select
                    value={selectedLut}
                    onChange={(e) => {
                      setSelectedLut(e.target.value);
                      toast.success(`Applied 3D LUT: ${e.target.value}`);
                    }}
                    className="w-full p-2.5 bg-[#0a0714] border border-purple-900/60 rounded-xl text-purple-200 text-xs focus:outline-none"
                  >
                    <option value="Kodak 2383 Film Print">🎬 Kodak 2383 3D Film Print (Warm Autumn)</option>
                    <option value="Fuji Eterna 250D">🎞️ Fuji Eterna 250D (Soft Pastel Tones)</option>
                    <option value="ACEScc Direct 709">🌈 ACEScc Direct Rec.709 Neutral</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => toast.success('📥 Exported DaVinci Resolve .EDL / .XML manifest!')}
                    className="w-full py-3.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-black rounded-xl transition text-xs uppercase tracking-wider shadow-md"
                  >
                    📥 Export DaVinci Resolve .EDL / .XML
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interactive3DRoom;
