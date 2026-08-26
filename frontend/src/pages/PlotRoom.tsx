"use client";

import React, { useState } from 'react';
import { GenerateField } from '../components/GenerateField';
import {
  BookOpen,
  Sparkles,
  Download,
  Users,
  Film,
  Camera,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Zap,
  Save,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';

interface PlotRoomProps {
  projectName?: string;
}

export function PlotRoom({ projectName = 'A Fatherless Child' }: PlotRoomProps) {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Step 01: Ideation & Plotting
  const [coreIdea, setCoreIdea] = useState(
    'A talented young urban artist discovers a hidden map of architectural blueprints left by his absent father, triggering a high-stakes quest across the changing skyline of his city.'
  );
  const [themes, setThemes] = useState(
    'Generational absence, self-worth forged in adversity, and the courageous discovery that identity is built from within, not bestowed by the past.'
  );
  const [genres, setGenres] = useState('Cinematic Drama, Urban Mystery, Independent Cinema');
  const [tone, setTone] = useState(
    'Introspective, gritty yet luminous, emotionally raw, and grounded with moments of poetic visual triumph in 3200K golden light.'
  );
  const [narrativeFlow, setNarrativeFlow] = useState(
    'Linear 3-Act structure with non-linear memory flashbacks triggered by specific city landmarks and sound cues.'
  );

  // Step 02: Character Crafting
  const [protagonist, setProtagonist] = useState(
    'DEVON (20s) - Reluctant street muralist with an acute architectural photographic memory. Want: Uncover father truth. Need: Claim his self-worth.'
  );
  const [mentor, setMentor] = useState(
    'MARCUS (40s) - Master restorer and community keeper. Offers tough love, practical carpentry wisdom, and steady perspective.'
  );
  const [antagonist, setAntagonist] = useState(
    'VALE (50s) - Real estate mogul demolishing the historic district, holding the final missing piece of Devon father blueprint legacy.'
  );

  // Step 03: Scriptwriting
  const [sceneHeading, setSceneHeading] = useState('INT. DEVON STUDIO APARTMENT - NIGHT');
  const [actionLines, setActionLines] = useState(
    'Rain streaks across the skylight. Devon unrolls a faded cyan blueprint on the worktable. Amber desk light cuts across his focused eyes.'
  );
  const [sampleDialogue, setSampleDialogue] = useState(
    'DEVON\n(tracing the blueprint lines)\nHe didn\'t run away. He was building this for us all along.\n\nMARCUS\nThen finish what he started, kid.'
  );

  // Step 04: Storyboarding
  const [shotComposition, setShotComposition] = useState(
    'Wide master tracking shot pushing in from doorway to low-angle medium close-up on Devon face (35mm Cine lens, f/2.0, 3-point key/fill/rim).'
  );
  const [aspectRatio, setAspectRatio] = useState('2.39:1 (Cinemascope Anamorphic)');
  const [visualFlow, setVisualFlow] = useState(
    'Rhythmic cut matching the tempo of thunder outside, transitioning from claustrophobic interior to soaring urban exterior.'
  );

  // Step 05: Polish & Publish
  const [colorGradingPreset, setColorGradingPreset] = useState(
    'Kodak 2383 Print Film Emulation with rich amber highlights (#F59E0B) and deep cyan-indigo shadow contrast.'
  );
  const [audioMastering, setAudioMastering] = useState(
    '5.1 Dolby Atmos stem mix with -24.0 LKFS dialogue loudness and subterranean LFE rumble during thunder strikes.'
  );
  const [exportDeliverables, setExportDeliverables] = useState(
    '4K DCI ProRes 4444 Master, 1080p Web Stream H.265, Multi-Track EDL Timeline Cut.'
  );

  const shared = {
    stageId: 'structure',
    role: 'Sagas Story Architect AI',
    roomName: 'Ideation & Plot Room',
    context: `Project: ${projectName}`,
  };

  const handleExportFullBible = () => {
    const markdown = `# ${projectName.toUpperCase()} — SAGAS PRODUCTION BIBLE
© 2026 THE AI CONTENT FOUNDRY, LLC • ALL RIGHTS RESERVED

## 01: IDEATION & PLOTTING
- **Core Idea:** ${coreIdea}
- **Themes:** ${themes}
- **Genres:** ${genres}
- **Tone & Mood:** ${tone}
- **Narrative Flow:** ${narrativeFlow}

---

## 02: CHARACTER CRAFTING
- **Protagonist:** ${protagonist}
- **Mentor:** ${mentor}
- **Antagonist / Obstacle:** ${antagonist}

---

## 03: SCRIPTWRITING
- **Scene Slugline:** ${sceneHeading}
- **Action Description:** ${actionLines}
- **Key Dialogue:**
\`\`\`fountain
${sampleDialogue}
\`\`\`

---

## 04: STORYBOARDING & VISUALIZATION
- **Shot Composition:** ${shotComposition}
- **Aspect Ratio:** ${aspectRatio}
- **Visual Rhythm:** ${visualFlow}

---

## 05: POLISH & PUBLISH
- **Color Grading:** ${colorGradingPreset}
- **Audio Master:** ${audioMastering}
- **Deliverables:** ${exportDeliverables}
`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Sagas_Production_Bible.md`;
    a.click();
    toast.success('📥 Exported Sagas Production Bible!');
  };

  const steps = [
    { num: 1, label: '01: Ideation & Plotting', icon: BookOpen, desc: 'Theme, genre, core idea & narrative flow' },
    { num: 2, label: '02: Character Crafting', icon: Users, desc: 'Traits, motives, backstories & voices' },
    { num: 3, label: '03: Scriptwriting', icon: Film, desc: 'Screenplay formatting, sluglines & dialogue' },
    { num: 4, label: '04: Storyboarding', icon: Camera, desc: 'Visual scenes, lens packages & camera flow' },
    { num: 5, label: '05: Polish & Publish', icon: Sliders, desc: 'Color grading, audio stem master & 4K exports' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gradient-to-b from-[#080512] via-[#0e0922] to-[#080512] text-slate-100 font-sans select-none">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="p-5 rounded-2xl bg-[#140e2e]/95 border border-purple-900/60 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/60 bg-black flex-shrink-0 flex items-center justify-center">
              <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif">
                  Plot & Production Foundation
                </h1>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  SAGAS 5-STEP FORMAT
                </span>
              </div>
              <p className="text-xs font-mono text-[#E2BA86]">
                Master Production Blueprint for <strong className="text-amber-300">{projectName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleExportFullBible}
              className="flex items-center space-x-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 text-xs font-mono text-amber-300 font-bold transition shadow-lg"
            >
              <Download size={13} />
              <span>Export Production Bible</span>
            </button>
          </div>
        </div>

        {/* 5-Step Step-by-Step Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-br from-purple-900/80 to-purple-950 border-amber-400 text-white shadow-lg shadow-purple-950/60'
                    : 'bg-[#120a2e]/60 border-purple-900/40 text-purple-300/70 hover:text-white hover:bg-[#180e3c]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon size={16} className={isActive ? 'text-amber-400' : 'text-purple-400'} />
                  <span className={`text-[10px] font-mono font-black ${isActive ? 'text-amber-300' : 'text-purple-500'}`}>
                    0{s.num}
                  </span>
                </div>
                <div className="mt-2">
                  <h4 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-purple-200'}`}>
                    {s.label.split(': ')[1]}
                  </h4>
                  <p className="text-[9px] text-purple-400/60 truncate mt-0.5">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Form Step Content */}
        <div className="p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-900/60 backdrop-blur-xl shadow-2xl space-y-5">
          {/* STEP 01 */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-purple-900/50 pb-2">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Step 01 • Ideation & Plotting</span>
                <h3 className="text-sm font-bold text-slate-100">Define Core Vision, Themes & Narrative Arc</h3>
              </div>

              <GenerateField
                label="Core Idea & Premise"
                info="Define your story's inciting premise, central hook, and high-concept core."
                placeholder="What is the core premise and hook of your story?"
                value={coreIdea}
                onChange={setCoreIdea}
                {...shared}
              />

              <GenerateField
                label="Themes & Message"
                info="The central philosophical question and core takeaway."
                placeholder="What deeper themes does your story explore?"
                value={themes}
                onChange={setThemes}
                {...shared}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GenerateField
                  label="Genres"
                  info="Primary and secondary genres."
                  placeholder="e.g. Sci-Fi Noir, Psychological Thriller"
                  value={genres}
                  onChange={setGenres}
                  multiline={false}
                  {...shared}
                />
                <GenerateField
                  label="Tone & Visual Atmosphere"
                  info="Cinematic tone, lighting style, and emotional palette."
                  placeholder="e.g. Gritty, moody, golden hour lighting"
                  value={tone}
                  onChange={setTone}
                  multiline={false}
                  {...shared}
                />
              </div>

              <GenerateField
                label="Narrative Flow & Structure"
                info="3-Act, 5-Act, Save The Cat, or non-linear story flow."
                placeholder="How does the story unfold from opening image to resolution?"
                value={narrativeFlow}
                onChange={setNarrativeFlow}
                {...shared}
              />
            </div>
          )}

          {/* STEP 02 */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-purple-900/50 pb-2">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Step 02 • Character Crafting</span>
                <h3 className="text-sm font-bold text-slate-100">Cast Profiles, Psychological Arcs & Motivations</h3>
              </div>

              <GenerateField
                label="Protagonist (Hero Lead)"
                info="Name, age, traits, internal want vs external need, and distinctive voice."
                placeholder="Describe your protagonist's background and emotional struggle..."
                value={protagonist}
                onChange={setProtagonist}
                {...shared}
              />

              <GenerateField
                label="Mentor / Catalyst Character"
                info="The guiding force, ally, or wisdom keeper challenging the hero."
                placeholder="Describe the mentor's lessons, flaws, and perspective..."
                value={mentor}
                onChange={setMentor}
                {...shared}
              />

              <GenerateField
                label="Antagonist / Core Conflict"
                info="The opposing force, rival, or systemic obstacle in the protagonist's path."
                placeholder="What force stands in the hero's way and what do they want?"
                value={antagonist}
                onChange={setAntagonist}
                {...shared}
              />
            </div>
          )}

          {/* STEP 03 */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-purple-900/50 pb-2">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Step 03 • Scriptwriting & Dialogue</span>
                <h3 className="text-sm font-bold text-slate-100">Fountain Screenplay Formatting, Scene Action & Dialogue</h3>
              </div>

              <GenerateField
                label="Scene Slugline (Heading)"
                info="INT/EXT. LOCATION - DAY/NIGHT format."
                placeholder="e.g. INT. SOUNDSTAGE 4 - NIGHT"
                value={sceneHeading}
                onChange={setSceneHeading}
                multiline={false}
                {...shared}
              />

              <GenerateField
                label="Scene Action Description"
                info="Visceral, present-tense visual description of the environment and character actions."
                placeholder="Describe what we see and hear in the scene..."
                value={actionLines}
                onChange={setActionLines}
                {...shared}
              />

              <GenerateField
                label="Formatted Fountain Dialogue"
                info="Character cues, parentheticals, and punchy dialogue lines with subtext."
                placeholder="CHARACTER NAME\n(parenthetical)\nDialogue line goes here..."
                value={sampleDialogue}
                onChange={setSampleDialogue}
                {...shared}
              />
            </div>
          )}

          {/* STEP 04 */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-purple-900/50 pb-2">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Step 04 • Storyboarding & Visual Flow</span>
                <h3 className="text-sm font-bold text-slate-100">Shot Framing, Lens Selection & Visual Coverage</h3>
              </div>

              <GenerateField
                label="Shot Composition & Framing"
                info="Focal length, camera angle, dolly moves, and 3-point lighting vectors."
                placeholder="e.g. Low-angle tracking shot on 50mm prime, golden key light..."
                value={shotComposition}
                onChange={setShotComposition}
                {...shared}
              />

              <GenerateField
                label="Cinematic Aspect Ratio"
                info="Aspect ratio format for the visual canvas."
                placeholder="e.g. 2.39:1 Cinemascope, 16:9 Standard, 9:16 Vertical"
                value={aspectRatio}
                onChange={setAspectRatio}
                multiline={false}
                {...shared}
              />

              <GenerateField
                label="Visual Rhythm & Pacing"
                info="How the shots cut together to match the tempo of the scene."
                placeholder="Describe the editing rhythm and camera momentum..."
                value={visualFlow}
                onChange={setVisualFlow}
                {...shared}
              />
            </div>
          )}

          {/* STEP 05 */}
          {activeStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-purple-900/50 pb-2">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Step 05 • Polish, Color, Sound & Publish</span>
                <h3 className="text-sm font-bold text-slate-100">Final Color Timing, Stem Audio Mastering & 4K Deliverables</h3>
              </div>

              <GenerateField
                label="Color Grading Preset & LUT"
                info="Lift, Gamma, Gain color wheel balance and film print emulation."
                placeholder="e.g. Kodak 2383 LUT, deep shadows, warm skin tones..."
                value={colorGradingPreset}
                onChange={setColorGradingPreset}
                {...shared}
              />

              <GenerateField
                label="Audio Stem Master & Loudness"
                info="4-track stem mix balance and -24.0 LKFS loudness targets."
                placeholder="e.g. 5.1 Atmos surround mix, dynamic dialogue clarity..."
                value={audioMastering}
                onChange={setAudioMastering}
                {...shared}
              />

              <GenerateField
                label="Export Deliverables & Resolution"
                info="Resolution, codecs, and container formats for streaming and cinema."
                placeholder="e.g. 4K DCI ProRes 4444, H.265 Web Stream, EDL Cut..."
                value={exportDeliverables}
                onChange={setExportDeliverables}
                multiline={false}
                {...shared}
              />
            </div>
          )}

          {/* Step Navigation Bottom Bar */}
          <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 rounded-xl bg-purple-950 border border-purple-800 text-xs font-mono text-purple-300 disabled:opacity-30 hover:text-white transition"
            >
              ← Previous Step
            </button>

            <span className="text-xs font-mono text-amber-400 font-bold">
              STEP {activeStep} OF 5
            </span>

            <button
              disabled={activeStep === 5}
              onClick={() => setActiveStep((p) => Math.min(p + 1, 5))}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-xs font-mono text-white font-bold disabled:opacity-30 transition shadow-md"
            >
              Next Step →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlotRoom;
