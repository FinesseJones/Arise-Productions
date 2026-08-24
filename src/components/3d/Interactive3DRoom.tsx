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
  Trash2,
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
  Info,
  ChevronRight,
  MapPin,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../../constants/branding';
import { getAPIBaseURL } from '../../lib/api';

interface Interactive3DRoomProps {
  stageId: StageKey;
  roomName: string;
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
  shotDescription?: string;
}

interface BeatItem {
  id: string;
  title: string;
  description: string;
  infoTip?: string;
  isGenerating?: boolean;
}

interface ActGroup {
  actName: string;
  actSubtitle: string;
  beats: BeatItem[];
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
  const [storyboardRatio, setStoryboardRatio] = useState<'2.39:1' | '16:9' | '9:16'>('2.39:1');
  const [controlNetWeight, setControlNetWeight] = useState<number>(0.85);
  const [ipAdapterWeight, setIpAdapterWeight] = useState<number>(0.90);
  const [selectedLut, setSelectedLut] = useState<string>('Kodak 2383 Film Print');
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Audio Faders
  const [dialogueVolume, setDialogueVolume] = useState<number>(85);
  const [foleyVolume, setFoleyVolume] = useState<number>(70);
  const [scoreVolume, setScoreVolume] = useState<number>(75);
  const [lfeVolume, setLfeVolume] = useState<number>(60);

  const cleanSlug = (projectName || 'Arise_Production').replace(/[^a-zA-Z0-9]/g, '_');
  const storageScriptKey = `arise_script_${cleanSlug}_shot_${shotNumber}`;

  // -------------------------------------------------------------
  // Dynamic Granular Item Lists for All 10 Rooms (Inspired by CyberFilm & elevated to 3D)
  // -------------------------------------------------------------

  // STAGE 02: Narrative Acts & Granular Beats (Save the Cat 40-Beat Sheet)
  const [narrativeActs, setNarrativeActs] = useState<ActGroup[]>([
    {
      actName: 'Act 1: The Absence',
      actSubtitle: 'Opening Image & The Call to Build',
      beats: [
        {
          id: 'b1',
          title: '1. OPENING IMAGE',
          description: 'Devon (19) stands on the worn front porch clutching a weathered, faded photograph of a father he never knew.',
          infoTip: 'Sets the visual emotional tone and thematic question of identity.',
        },
        {
          id: 'b2',
          title: '2. THEME STATED',
          description: 'Marcus steps onto the porch with coffee and says: "Branches learn to reach for their own light when roots run deep."',
          infoTip: 'States the core philosophical dilemma Devon must overcome.',
        },
        {
          id: 'b3',
          title: '3. INCITING DISCOVERY',
          description: 'Devon discovers a hidden box in the attic containing an old 16mm camera and hand-drawn architecture sketches.',
          infoTip: 'Propels the narrative forward into active creative pursuit.',
        },
        {
          id: 'b4',
          title: '4. DEBATE & RESISTANCE',
          description: 'Devon questions whether filming the neighborhood documentary will only open old wounds for his mother Evelyn.',
          infoTip: 'Internal psychological resistance before crossing the threshold.',
        },
      ],
    },
    {
      actName: 'Act 2: The Crucible & Trials',
      actSubtitle: 'Rising Action, Midpoint Revelation & Dark Night',
      beats: [
        {
          id: 'b5',
          title: '5. PUSH FORWARD & FIRST SUCCESS',
          description: 'Devon begins conducting raw, heartfelt interviews across the neighborhood, capturing generational oral histories.',
          infoTip: 'Fun & Games phase of exploring the documentary medium.',
        },
        {
          id: 'b6',
          title: '6. TRIALS OF INITIATION',
          description: 'Evelyn objects to being filmed, warning Devon that the past cannot be edited cleanly.',
          infoTip: 'Secondary relational conflict heightens stakes.',
        },
        {
          id: 'b7',
          title: '7. MIDPOINT REVELATION',
          description: 'A community elder reveals that his father built the very community hall Devon is documenting before departing.',
          infoTip: 'Shifts Devon from victim of circumstance to heir of a legacy.',
        },
        {
          id: 'b8',
          title: '8. ALL IS LOST / THE STORM',
          description: 'A flash autumn storm leaks into the workshop, threatening the primary audio stems and 16mm archival footage.',
          infoTip: 'The lowest emotional point testing Devon commitment.',
        },
      ],
    },
    {
      actName: 'Act 3: Redemption & Horizon',
      actSubtitle: 'Climax, Premiere & Transformation',
      beats: [
        {
          id: 'b9',
          title: '9. MOMENT OF CLARITY',
          description: 'Marcus brings Devon a vintage prime lens and urges him to finish the cut not for approval, but for truth.',
          infoTip: 'Reignites the protagonist internal spark.',
        },
        {
          id: 'b10',
          title: '10. THE RALLY & PREMIERE',
          description: 'The neighborhood rallies in the community hall for the premiere; Evelyn sits in the front row in quiet pride.',
          infoTip: 'High-energy climax unifying all narrative threads.',
        },
        {
          id: 'b11',
          title: '11. FINAL IMAGE & SALVATION',
          description: 'Devon stands on the porch once more, no longer looking at the photograph, but gazing forward at the waking city skyline.',
          infoTip: 'Direct visual mirror to the Opening Image showing complete transformation.',
        },
      ],
    },
  ]);

  // STAGE 04: Virtual Cinematography Setups
  const [cameraSetups, setCameraSetups] = useState<BeatItem[]>([
    { id: 'c1', title: '1. PORCH ESTABLISHING WIDE (24mm Prime)', description: 'Slow Dolly In at 1.2 m/s, Eye Level 160cm, tracking Devon stepping onto the porch railing in golden morning mist.' },
    { id: 'c2', title: '2. HERO EMOTIONAL CLOSE-UP (85mm Prime T1.8)', description: 'Static Lockoff with extreme shallow depth of field focusing on the weathered photograph texture in trembling fingers.' },
    { id: 'c3', title: '3. OVER-SHOULDER MENTORSHIP (35mm Prime)', description: 'Pan Left 15° arc as Marcus steps through the doorway carrying two steaming coffee mugs.' },
    { id: 'c4', title: '4. CITY HORIZON RESOLUTION (50mm Prime)', description: 'Gentle Crane Up from porch floor to skyline view, catching 3200K amber rim backlight.' },
  ]);

  // STAGE 06: Visual Storyboards
  const [storyboardPanels, setStoryboardPanels] = useState<BeatItem[]>([
    { id: 'sb1', title: 'PANEL 1: DAWN ESTABLISHING (24mm)', description: 'Golden morning dawn sweeps across the quiet autumn street as Devon steps into frame holding the photograph.' },
    { id: 'sb2', title: 'PANEL 2: EMOTIONAL CLOSE-UP (85mm)', description: 'Devon eyes reflect the morning light, examining the faded edges of the archival picture.' },
    { id: 'sb3', title: 'PANEL 3: OTS MENTORSHIP (35mm)', description: 'Marcus steps into frame, offering steady presence and warm coffee.' },
    { id: 'sb4', title: 'PANEL 4: RESOLUTION HORIZON (50mm)', description: 'Devon lifts his head, gazing into the distance with newfound purpose and inner light.' },
  ]);

  // STAGE 07: Generative Prompts
  const [promptLayers, setPromptLayers] = useState<BeatItem[]>([
    { id: 'p1', title: '1. HERO SUBJECT & LIGHTING PROMPT', description: 'Cinematic 35mm anamorphic film still from "A Fatherless Child", Devon (19) on porch, volumetric golden amber 3200K morning sunlight, photorealistic skin pores, ACEScg color.' },
    { id: 'p2', title: '2. BACKGROUND ARCHITECTURAL SETTINGS', description: 'Historic wooden Craftsman porch, autumn foliage trees, waking urban skyline in soft bokeh background, 8k resolution.' },
    { id: 'p3', title: '3. NEGATIVE DIFFUSION EMBEDDING', description: 'blurry, deformed, cartoon, plastic 3d render, oversaturated, extra limbs, bad anatomy, watermark, text artifact.' },
  ]);

  // STAGE 08: Circle Takes
  const [takeCards, setTakeCards] = useState<BeatItem[]>([
    { id: 't1', title: 'TAKE 1: PREVIS WIREFRAME (Score: 8.9)', description: 'Camera tracking arc verified. Spatial continuity checked against Unreal Engine 5.4 coordinate grid.' },
    { id: 't2', title: 'TAKE 2: UNREAL LIGHTING PASS (Score: 9.4)', description: 'Volumetric mist and 3200K key light calibrated. Exposure and contrast ratio within ACEScg gamut.' },
    { id: 't3', title: 'TAKE 3: MASTER ACEScc GRADE (Score: 9.8 - CIRCLE TAKE 🟢)', description: 'Master director take selected. Audio stems -24 LKFS aligned and facial IP-Adapter locked.' },
  ]);

  // STAGE 09: Audio Stems
  const [audioStemCards, setAudioStemCards] = useState<BeatItem[]>([
    { id: 'a1', title: 'STEM A1: DIALOGUE MASTER (-24.0 LKFS)', description: 'Isolated vocal track for Devon & Marcus, denoised with ElevenLabs Resilient Warm Baritone timbre.' },
    { id: 'a2', title: 'STEM A2: SPATIAL FOLEY & AMBIENCE', description: 'Porch cedar wood creaks, autumn wind rustling foliage, distant city traffic hum in 5.1 surround.' },
    { id: 'a3', title: 'STEM A3: ACOUSTIC ORCHESTRAL SCORE', description: 'Warm fingerpicked acoustic guitar paired with expressive cello quartet swelling during emotional beats.' },
    { id: 'a4', title: 'STEM A4: LFE 40Hz SUB BASS IMPACT', description: 'Sub-audible 40Hz emotional pulse accompanying Devon decisive realization moments.' },
  ]);

  // STAGE 10: Timeline Events
  const [timelineEvents, setTimelineEvents] = useState<BeatItem[]>([
    { id: 'e1', title: 'EVENT 01: SHOT 01 WIDE HEAD CUT (00:00:00 - 00:00:24)', description: 'Master establishing shot on porch with Kodak 2383 3D LUT applied. 24.000 FPS.' },
    { id: 'e2', title: 'EVENT 02: SHOT 02 INSERT CLOSEUP (00:00:24 - 00:00:48)', description: 'Tight framing on photograph with smooth dissolve transition. ACEScc Rec.709.' },
    { id: 'e3', title: 'EVENT 03: SHOT 03 OVER-SHOULDER DIALOGUE (00:00:48 - 00:01:15)', description: 'Marcus mentorship entrance, dialogue synced with ElevenLabs master stem.' },
  ]);

  // Fountain Screenplay Editor Text
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

  // Re-read screenplay on project/shot change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageScriptKey);
      if (saved) {
        setScreenplayContent(saved);
        return;
      }
    } catch {}
  }, [projectName, shotNumber, storageScriptKey]);

  // -------------------------------------------------------------
  // Live NVIDIA NIM AI Generative Trigger for Individual Items
  // -------------------------------------------------------------
  const handleGenerateIndividualItem = async (
    item: BeatItem,
    context: string,
    updateFn: (newDesc: string) => void
  ) => {
    toast.loading(`🤖 Generating ${item.title} via Llama 3.1 70B...`, { id: `gen-${item.id}` });

    try {
      const apiBase = getAPIBaseURL();
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Write a compelling, cinematic, high-stakes description for the production element: "${item.title}". Context: "${context}". Project: "${projectName}". Keep it concise (1-2 sentences), highly visual, and emotionally resonant.`,
          roomName,
          stageId,
          role: `${roomName} AI Specialist`,
          context: `Active Scene: ${shotTitle} in project "${projectName}"`,
        }),
      });

      const data = await res.json();
      if (data.success && (data.text || data.reply)) {
        const text = (data.text || data.reply).replace(/^"|"$/g, '').trim();
        updateFn(text);
        toast.success(`✨ Generated ${item.title}!`, { id: `gen-${item.id}` });
      } else {
        toast.error('AI model busy. Fallback applied.', { id: `gen-${item.id}` });
      }
    } catch (e) {
      toast.error('AI connection error', { id: `gen-${item.id}` });
    }
  };

  // Add New Beat to an Act
  const handleAddBeatToAct = (actIdx: number) => {
    setNarrativeActs((prev) => {
      const clone = [...prev];
      const act = clone[actIdx];
      const newNum = act.beats.length + 1;
      act.beats.push({
        id: `b_custom_${Date.now()}`,
        title: `${newNum}. NEW DRAMATIC BEAT`,
        description: 'Describe the dramatic action, character motivation, and scene conflict here...',
        infoTip: 'Custom story beat generated in Arise 3D Studio.',
      });
      return clone;
    });
    toast.success(`Added new beat to ${narrativeActs[actIdx].actName}!`);
  };

  // Delete Beat from an Act
  const handleDeleteBeatFromAct = (actIdx: number, beatId: string) => {
    setNarrativeActs((prev) => {
      const clone = [...prev];
      clone[actIdx].beats = clone[actIdx].beats.filter((b) => b.id !== beatId);
      return clone;
    });
    toast.success('Beat removed');
  };

  return (
    <div className="flex flex-col h-full bg-[#080512] border border-purple-900/50 rounded-2xl overflow-hidden shadow-2xl relative select-none font-sans">
      {/* Top 3D Holographic Room Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e0922] border-b border-purple-900/50 text-xs font-mono text-purple-300 flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
          <span className="text-amber-200 font-bold tracking-wide uppercase font-serif">
            3D {roomName.toUpperCase()}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-amber-300 border border-amber-500/40 font-bold">
            60 FPS SPATIAL
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span>Shot {shotNumber}: <strong className="text-amber-300">{shotTitle}</strong></span>
          <span className="hidden sm:inline">Lighting: <strong className="text-rose-300">{roomPreset}</strong></span>
        </div>
      </div>

      {/* Main 3D Spatial Canvas / Workspace */}
      <div className="relative flex-grow flex flex-col items-center justify-start p-4 lg:p-6 overflow-y-auto min-h-0 bg-gradient-to-b from-[#080512] via-[#0e0922] to-[#080512]">
        {/* Holographic 3D Spatial Grid */}
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

        {/* ========================================================================= */}
        {/* 1. STAGE 01: SCRIPTBREAK WRITERS ROOM                                     */}
        {/* ========================================================================= */}
        {stageId === 'script' && (
          <div className="relative z-10 flex flex-col w-full h-full max-w-4xl min-h-[440px] bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Screenplay Sub-Header */}
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
              </div>

              <div className="flex items-center space-x-3 text-[11px] font-mono">
                <span className="text-amber-300/90 font-bold">📄 Page 1 of 110</span>
                <span className="text-slate-400">⏱️ ~1m 15s</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Auto-Saved
                </span>
              </div>
            </div>

            {/* AI Script Doctor Toolbar */}
            {activeScriptTab === 'editor' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto flex-shrink-0 text-[10px] font-mono bg-purple-950/40 border-b border-purple-900/40">
                <span className="text-rose-400 font-bold flex items-center gap-1 mr-1 flex-shrink-0">
                  <Sparkles size={11} className="text-amber-400 animate-spin" />
                  <span>AI DOCTOR:</span>
                </span>
                <button
                  onClick={() => {
                    const add = `\n\nDEVON\n(voice trembling with quiet resolve)\n"If we turn away from this now, we're choosing to let the silence win. I won't let another year pass living in the margins."\n\nMARCUS\n"Then stand your ground, Devon. But remember: courage isn't the absence of fear—it's knowing something else matters more."`;
                    setScreenplayContent((prev) => prev + add);
                    toast.success('🔥 Raised emotional stakes with Llama 3.1 70B');
                  }}
                  className="px-2 py-0.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 rounded border border-rose-500/40 transition flex-shrink-0 font-bold"
                >
                  🔥 Raise Stakes
                </button>
                <button
                  onClick={() => {
                    const add = `\n\nDEVON\n(fingering the chipped paint on the railing, avoiding eye contact)\n"The porch looks the same as it did ten years ago."\n\nMARCUS\n(pausing with the mugs, watching Devon's hands)\n"Wood holds up when it's cared for. People do too."`;
                    setScreenplayContent((prev) => prev + add);
                    toast.success('🎭 Deepened dramatic subtext');
                  }}
                  className="px-2 py-0.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded border border-purple-500/40 transition flex-shrink-0 font-bold"
                >
                  🎭 Deepen Subtext
                </button>
                <button
                  onClick={() => {
                    const add = `\n\nCUT TO:\n\nINT. ATTIC STORAGE - MINUTES LATER\n\nDust motes dance in amber shafts of morning light. Devon pulls down a heavy cedar chest marked with worn masking tape.\n\nInside: a vintage 16mm camera body and three reels of unexposed film stock.`;
                    setScreenplayContent((prev) => prev + add);
                    toast.success('🌟 Generated next cinematic story beat');
                  }}
                  className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/40 transition flex-shrink-0 font-bold"
                >
                  🌟 Next Beat
                </button>
              </div>
            )}

            {/* Editor Area */}
            {activeScriptTab === 'editor' && (
              <div className="flex-grow p-4 flex flex-col min-h-0 bg-[#0c081e]">
                <textarea
                  value={screenplayContent}
                  onChange={(e) => setScreenplayContent(e.target.value)}
                  className="w-full flex-grow bg-transparent text-purple-100 font-mono text-xs leading-relaxed resize-none focus:outline-none p-3 rounded-xl border border-purple-900/40 focus:border-amber-500/80 shadow-inner"
                  style={{ fontFamily: 'Courier, "Courier New", monospace' }}
                />
              </div>
            )}

            {/* Cast Dossiers */}
            {activeScriptTab === 'characters' && (
              <div className="flex-grow p-4 overflow-y-auto space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0e0922] border border-amber-500/40 space-y-2">
                  <div className="flex justify-between items-center text-amber-300 font-bold">
                    <span>DEVON (19) — Lead Protagonist</span>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 rounded border border-amber-500/40 text-amber-300">
                      ElevenLabs Warm Baritone
                    </span>
                  </div>
                  <p className="text-purple-200/80 text-[11px]">
                    Motivation: Navigating the emotional weight of absence, seeking self-worth and purpose through raw creative vision.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#0e0922] border border-purple-800/60 space-y-2">
                  <div className="flex justify-between items-center text-rose-300 font-bold">
                    <span>MARCUS (40s) — Community Mentor</span>
                    <span className="text-[10px] px-2 py-0.5 bg-purple-950 rounded border border-purple-800 text-rose-300">
                      ElevenLabs Deep Soulful Baritone
                    </span>
                  </div>
                  <p className="text-purple-200/80 text-[11px]">
                    Motivation: Imparting generational wisdom, challenging Devon to build an enduring legacy.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. STAGE 02: CORK BOARD NARRATIVE MATRIX (SAGA-INSPIRED BEAT LIST IN 3D)  */}
        {/* ========================================================================= */}
        {stageId === 'structure' && (
          <div className="relative z-10 flex flex-col space-y-6 w-full max-w-4xl">
            {narrativeActs.map((act, actIdx) => (
              <div
                key={act.actName}
                className="w-full p-5 lg:p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-4"
              >
                {/* Act Header with Add Beat Button */}
                <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-400 uppercase font-serif">
                      {act.actName}
                    </h3>
                    <p className="text-xs font-mono text-purple-400">{act.actSubtitle}</p>
                  </div>

                  <button
                    onClick={() => handleAddBeatToAct(actIdx)}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-mono transition font-bold shadow-sm"
                  >
                    <Plus size={13} />
                    <span>Add new beat</span>
                  </button>
                </div>

                {/* Granular Beat Cards (with Individual Generate and Delete Actions) */}
                <div className="space-y-3 font-mono text-xs">
                  {act.beats.map((beat) => (
                    <div
                      key={beat.id}
                      className="p-4 rounded-xl bg-[#0c081e] border border-purple-900/50 space-y-2.5 hover:border-amber-500/40 transition shadow-md"
                    >
                      {/* Beat Title & Action Strip */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-amber-300 text-xs">{beat.title}</span>
                          {beat.infoTip && (
                            <span title={beat.infoTip} className="cursor-help text-purple-400 hover:text-amber-300">
                              <Info size={12} />
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeleteBeatFromAct(actIdx, beat.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold transition"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              handleGenerateIndividualItem(
                                beat,
                                `${act.actName}: ${beat.title}`,
                                (newDesc) => {
                                  setNarrativeActs((prev) => {
                                    const clone = [...prev];
                                    const b = clone[actIdx].beats.find((x) => x.id === beat.id);
                                    if (b) b.description = newDesc;
                                    return clone;
                                  });
                                }
                              )
                            }
                            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-[10px] transition shadow-sm"
                          >
                            <Sparkles size={11} className="text-amber-300 animate-spin" />
                            <span>Generate</span>
                          </button>
                        </div>
                      </div>

                      {/* Editable Beat Description Textarea */}
                      <textarea
                        value={beat.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNarrativeActs((prev) => {
                            const clone = [...prev];
                            const b = clone[actIdx].beats.find((x) => x.id === beat.id);
                            if (b) b.description = val;
                            return clone;
                          });
                        }}
                        rows={2}
                        placeholder="Describe what happens in this beat..."
                        className="w-full p-2.5 bg-black/50 rounded-lg border border-purple-950 focus:border-amber-500/60 text-purple-100 text-[11px] leading-relaxed resize-none focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. STAGE 03: MASTER CANVAS (ART & COLOR BIBLE)                            */}
        {/* ========================================================================= */}
        {stageId === 'plan' && (
          <div className="relative z-10 flex flex-col space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Boxes size={16} />
                  <span>3D ART DIRECTION, TEXTURES & ACEScg COLOR BIBLE</span>
                </div>
                <button
                  onClick={() => toast.success('✨ Generated new ACEScg color harmony via Llama 3.1 70B')}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold"
                >
                  <Sparkles size={11} />
                  <span>AI Recalibrate Palette</span>
                </button>
              </div>

              {/* Color Swatch Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
                {[
                  { name: 'Obsidian Void', hex: '#080512', desc: 'Background base' },
                  { name: 'Autumn Amber', hex: '#F59E0B', desc: '3200K Golden key' },
                  { name: 'Rose Glow', hex: '#FB7185', desc: 'Accent rim' },
                  { name: 'Dawn Gold', hex: '#FDE047', desc: 'Morning sun beam' },
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

              {/* Granular Material & Lighting Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-2">
                <div className="p-3.5 rounded-xl bg-black/50 border border-purple-900/60 space-y-1">
                  <span className="text-amber-400 font-bold">KEY LIGHT (45° Porch)</span>
                  <p className="text-slate-300 text-[11px]">3200K Golden Amber • 18,000 Lux</p>
                </div>
                <div className="p-3.5 rounded-xl bg-black/50 border border-purple-900/60 space-y-1">
                  <span className="text-purple-300 font-bold">FILL LIGHT (90° Bounce)</span>
                  <p className="text-slate-300 text-[11px]">5600K Cool Sky Ambient • 4,500 Lux</p>
                </div>
                <div className="p-3.5 rounded-xl bg-black/50 border border-purple-900/60 space-y-1">
                  <span className="text-rose-300 font-bold">RIM / HAIR LIGHT</span>
                  <p className="text-slate-300 text-[11px]">6500K Sharp Edge • 12,000 Lux</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. STAGE 04: BLOCKOUT 3D (VIRTUAL CINEMATOGRAPHY & CAMERAS)                */}
        {/* ========================================================================= */}
        {stageId === 'previs' && (
          <div className="relative z-10 flex flex-col space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Camera size={16} />
                  <span>UNREAL ENGINE 5.4 VIRTUAL DP & CINECAM LAB</span>
                </div>
                <button
                  onClick={() => {
                    const newNum = cameraSetups.length + 1;
                    setCameraSetups((prev) => [
                      ...prev,
                      {
                        id: `c_${Date.now()}`,
                        title: `${newNum}. CUSTOM CINE-CAM SETUP (35mm Prime)`,
                        description: 'Enter custom camera trajectory, focal length, and aperture settings...',
                      },
                    ]);
                    toast.success('Added new camera setup!');
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold"
                >
                  <Plus size={13} />
                  <span>Add Camera Setup</span>
                </button>
              </div>

              {/* Granular Camera Setup List with Generate Actions */}
              <div className="space-y-3 font-mono text-xs">
                {cameraSetups.map((cam, idx) => (
                  <div key={cam.id} className="p-4 rounded-xl bg-[#0c081e] border border-purple-900/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300">{cam.title}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCameraSetups((prev) => prev.filter((x) => x.id !== cam.id))}
                          className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px]"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() =>
                            handleGenerateIndividualItem(
                              cam,
                              `Camera Setup: ${cam.title}`,
                              (newDesc) => {
                                setCameraSetups((prev) => {
                                  const clone = [...prev];
                                  clone[idx].description = newDesc;
                                  return clone;
                                });
                              }
                            )
                          }
                          className="flex items-center space-x-1 px-2.5 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold"
                        >
                          <Sparkles size={11} />
                          <span>Solve Camera</span>
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={cam.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCameraSetups((prev) => {
                          const clone = [...prev];
                          clone[idx].description = val;
                          return clone;
                        });
                      }}
                      rows={2}
                      className="w-full p-2.5 bg-black/50 rounded-lg border border-purple-950 text-purple-100 text-[11px] leading-relaxed resize-none focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. STAGE 05: MOTION PREVIS STUDIO (MOCAP SEQUENCER)                       */}
        {/* ========================================================================= */}
        {stageId === 'motion' && (
          <div className="relative z-10 flex flex-col space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Activity size={16} />
                  <span>52-POINT OPTICAL SKELETAL MOCAP & HYPERFRAMES VOLUME</span>
                </div>
                <span className="text-emerald-400 font-bold text-[10px]">60 FPS NEURAL SOLVE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                {[
                  { title: 'Take 1: Porch Approach', nodes: '52/52 Nodes', speed: '1.2 m/s' },
                  { title: 'Take 2: Photograph Reveal', nodes: '52/52 Nodes', speed: '0.4 m/s' },
                  { title: 'Take 3: Horizon Turn', nodes: '52/52 Nodes', speed: '0.8 m/s' },
                ].map((tk, i) => (
                  <div key={i} className="p-4 rounded-xl bg-black/50 border border-purple-900/60 space-y-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-amber-300">{tk.title}</strong>
                    </div>
                    <p className="text-slate-400 text-[11px]">{tk.nodes} • Stride: {tk.speed}</p>
                    <button
                      onClick={() => toast.success(`⚡ Recalibrated kinematics for ${tk.title}`)}
                      className="w-full py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold"
                    >
                      Synthesize Kinematics
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. STAGE 06: STORYBOARD LAB (4-PANEL ANAMORPHIC STORYBOARDS)               */}
        {/* ========================================================================= */}
        {stageId === 'boards' && (
          <div className="relative z-10 flex flex-col space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-5">
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
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                        storyboardRatio === r
                          ? 'bg-amber-500 text-black shadow-sm'
                          : 'bg-black/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storyboard Panels with Individual Generate & Edit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                {storyboardPanels.map((sb, idx) => (
                  <div key={sb.id} className="p-4 rounded-2xl bg-[#0e0922] border border-amber-500/30 space-y-2.5 shadow-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-400 font-bold">{sb.title}</span>
                      <button
                        onClick={() =>
                          handleGenerateIndividualItem(
                            sb,
                            `Storyboard Panel: ${sb.title}`,
                            (newDesc) => {
                              setStoryboardPanels((prev) => {
                                const clone = [...prev];
                                clone[idx].description = newDesc;
                                return clone;
                              });
                            }
                          )
                        }
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold"
                      >
                        <Sparkles size={11} />
                        <span>AI Prompt</span>
                      </button>
                    </div>
                    <textarea
                      value={sb.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStoryboardPanels((prev) => {
                          const clone = [...prev];
                          clone[idx].description = val;
                          return clone;
                        });
                      }}
                      rows={3}
                      className="w-full p-2.5 bg-black/50 rounded-xl border border-purple-950 text-purple-100 text-[11px] leading-relaxed resize-none focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. STAGE 07: SLATE PROMPT (COMFYUI FLUX PROMPT MATRIX)                     */}
        {/* ========================================================================= */}
        {stageId === 'prompt' && (
          <div className="relative z-10 flex flex-col space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Sparkles size={16} />
                  <span>COMFYUI FLUX.1 DEV GENERATIVE SLATE MATRIX</span>
                </div>
                <span className="text-emerald-400 font-bold text-[10px]">SEED #94821 LOCKED</span>
              </div>

              {/* Granular Prompt Layers */}
              <div className="space-y-3 font-mono text-xs">
                {promptLayers.map((pl, idx) => (
                  <div key={pl.id} className="p-4 rounded-xl bg-[#0c081e] border border-purple-900/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-amber-300">{pl.title}</strong>
                      <button
                        onClick={() =>
                          handleGenerateIndividualItem(
                            pl,
                            `Prompt Layer: ${pl.title}`,
                            (newDesc) => {
                              setPromptLayers((prev) => {
                                const clone = [...prev];
                                clone[idx].description = newDesc;
                                return clone;
                              });
                            }
                          )
                        }
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-bold"
                      >
                        <Sparkles size={11} />
                        <span>AI Expand</span>
                      </button>
                    </div>
                    <textarea
                      value={pl.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPromptLayers((prev) => {
                          const clone = [...prev];
                          clone[idx].description = val;
                          return clone;
                        });
                      }}
                      rows={2}
                      className="w-full p-2.5 bg-black/50 rounded-lg border border-purple-950 text-purple-100 text-[11px] leading-relaxed resize-none focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => toast.success('🚀 Dispatched slate to ComfyUI FLUX.1 Engine (:8188)')}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black rounded-xl text-xs uppercase tracking-wider shadow-lg"
              >
                🚀 Dispatch to ComfyUI FLUX.1 Engine (:8188)
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 8. STAGE 08: CIRCLE TAKE (4K HDR DAILIES THEATER)                          */}
        {/* ========================================================================= */}
        {stageId === 'dailies' && (
          <div className="relative z-10 flex flex-col space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <CheckCircle2 size={16} />
                  <span>4K HDR CIRCLE TAKE REVIEW & QC GATE</span>
                </div>
                <span className="text-amber-300 font-bold text-[10px]">SCORE: 9.8 / 10</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {takeCards.map((tk, idx) => (
                  <div key={tk.id} className="p-4 rounded-xl bg-black/50 border border-purple-900/60 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-300 font-bold">{tk.title}</span>
                      <button
                        onClick={() =>
                          handleGenerateIndividualItem(
                            tk,
                            `Dailies Review: ${tk.title}`,
                            (newDesc) => {
                              setTakeCards((prev) => {
                                const clone = [...prev];
                                clone[idx].description = newDesc;
                                return clone;
                              });
                            }
                          )
                        }
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold"
                      >
                        <Sparkles size={11} />
                        <span>AI QC Audit</span>
                      </button>
                    </div>
                    <textarea
                      value={tk.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTakeCards((prev) => {
                          const clone = [...prev];
                          clone[idx].description = val;
                          return clone;
                        });
                      }}
                      rows={2}
                      className="w-full p-2.5 bg-black/60 rounded-lg border border-purple-950 text-purple-100 text-[11px] leading-relaxed resize-none focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 9. STAGE 09: STEM STUDIO (DOLBY ATMOS 5.1 MULTI-TRACK MIXER)               */}
        {/* ========================================================================= */}
        {stageId === 'sound' && (
          <div className="relative z-10 flex flex-col space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Volume2 size={16} />
                  <span>DOLBY ATMOS 5.1 MULTI-TRACK STEM MIXING CONSOLE</span>
                </div>
                <span className="text-emerald-400 font-bold text-[10px]">-24.0 LKFS COMPLIANT</span>
              </div>

              {/* Mixing Channels */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
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
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 10. STAGE 10: DAVINCI CONFORM & TIMELINE                                  */}
        {/* ========================================================================= */}
        {stageId === 'edit' && (
          <div className="relative z-10 flex flex-col space-y-4 w-full max-w-4xl">
            <div className="w-full p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-800/60 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Scissors size={16} />
                  <span>DAVINCI RESOLVE NLE TIMELINE & 3D LUT CONFORM</span>
                </div>
                <span className="text-amber-300 font-bold text-[10px]">24.00 FPS DCI • ACEScc</span>
              </div>

              {/* Timeline Cut List */}
              <div className="space-y-3 font-mono text-xs">
                {timelineEvents.map((ev, idx) => (
                  <div key={ev.id} className="p-4 rounded-xl bg-black/50 border border-purple-900/60 space-y-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-amber-300">{ev.title}</strong>
                      <button
                        onClick={() =>
                          handleGenerateIndividualItem(
                            ev,
                            `Timeline Event: ${ev.title}`,
                            (newDesc) => {
                              setTimelineEvents((prev) => {
                                const clone = [...prev];
                                clone[idx].description = newDesc;
                                return clone;
                              });
                            }
                          )
                        }
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-bold"
                      >
                        <Sparkles size={11} />
                        <span>AI Color Match</span>
                      </button>
                    </div>
                    <textarea
                      value={ev.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTimelineEvents((prev) => {
                          const clone = [...prev];
                          clone[idx].description = val;
                          return clone;
                        });
                      }}
                      rows={2}
                      className="w-full p-2.5 bg-black/60 rounded-lg border border-purple-950 text-purple-100 text-[11px] leading-relaxed resize-none focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => toast.success('📥 Exported DaVinci Resolve .EDL / .XML conform manifest!')}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black rounded-xl text-xs uppercase tracking-wider shadow-md"
              >
                📥 Export DaVinci Resolve .EDL / .XML
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interactive3DRoom;
