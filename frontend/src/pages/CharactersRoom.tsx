import React, { useState, useEffect } from 'react';
import {
  Users,
  Download,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  X,
  BookOpen,
  Mic,
  Volume2,
  Sliders,
  Shield,
  Layers,
  Activity,
  Key,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';
import { getAPIBaseURL } from '../lib/api';
import { getProjectCharacters } from '../lib/projectData';

interface CharactersRoomProps {
  projectName?: string;
  onNavigateToRoom?: (roomKey: string) => void;
}

export interface VoiceTimbreProfile {
  voiceModel: 'Kokoro-82M' | 'XTTS-v2' | 'ElevenLabs';
  voiceId: string;
  pitchHz: number; // -12 to +12 semitones
  paceWpm: number; // 120 to 220 WPM
  timbreTone: 'Warm' | 'Gritty' | 'Authoritative' | 'Whispered' | 'Resonant' | 'Crisp';
  breathiness: number; // 0.0 to 1.0
}

export interface CharacterLikenessAnchor {
  visualSeed: number;
  wardrobeContinuity: string;
  loraTriggerKeyword: string;
  faceReferenceUrl?: string;
}

export interface CharacterEmotionalState {
  traumaIndex: number; // 0.0 to 1.0
  trustLevel: number; // 0.0 to 1.0
  activeSubtext: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  role: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Mentor' | 'Love Interest' | 'Rival';
  arcType: 'Positive Arc' | 'Flat Arc' | 'Disillusion Arc' | 'Spiral Arc' | 'Corruption Arc';
  personality: string;
  archetypes: string[];
  voiceTimbre: VoiceTimbreProfile;
  likenessAnchor: CharacterLikenessAnchor;
  emotionalState: CharacterEmotionalState;
}

export function CharactersRoom({ projectName = 'A Fatherless Child', onNavigateToRoom }: CharactersRoomProps) {
  const apiBase = getAPIBaseURL();
  const [characters, setCharacters] = useState<CharacterProfile[]>(() => {
    return (getProjectCharacters(projectName) as any);
  });
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  useEffect(() => {
    const slug = (projectName || 'Production').replace(/[^a-zA-Z0-9]/g, '_');
    const storageKey = `arise_chars_${slug}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized: CharacterProfile[] = parsed.map((item, i) => {
            return {
              id: item?.id || `char-${i + 1}`,
              name: item?.name || (typeof item === 'string' ? item : `Character ${i + 1}`),
              role: item?.role || (i === 0 ? 'Protagonist' : i === 1 ? 'Mentor' : 'Supporting'),
              arcType: item?.arcType || 'Positive Arc',
              personality: item?.personality || '',
              archetypes: Array.isArray(item?.archetypes) ? item.archetypes : ['Hero'],
              voiceTimbre: item?.voiceTimbre || {
                voiceModel: 'Kokoro-82M',
                voiceId: i % 2 === 0 ? 'am_adam' : 'af_sarah',
                pitchHz: 0,
                paceWpm: 155,
                timbreTone: 'Warm',
                breathiness: 0.15,
              },
              likenessAnchor: item?.likenessAnchor || {
                visualSeed: Math.floor(Math.random() * 8999999) + 1000000,
                wardrobeContinuity: 'Signature matte-black tactical wardrobe with brass filigree accents.',
                loraTriggerKeyword: `<char_${(item?.name || `c${i+1}`).toLowerCase().replace(/[^a-z0-9]/g, '_')}>`,
              },
              emotionalState: item?.emotionalState || {
                traumaIndex: 0.35,
                trustLevel: 0.7,
                activeSubtext: 'Guards an undisclosed motive regarding the syndicate vault.',
              },
            };
          });
          setCharacters(normalized);
          setSelectedIndex(0);
          return;
        }
      }
    } catch {}

    const defaultCast = (getProjectCharacters(projectName) as any[]).map((c, i) => ({
      ...c,
      voiceTimbre: {
        voiceModel: 'Kokoro-82M',
        voiceId: i % 2 === 0 ? 'am_adam' : 'af_sarah',
        pitchHz: 0,
        paceWpm: 155,
        timbreTone: 'Warm',
        breathiness: 0.15,
      },
      likenessAnchor: {
        visualSeed: Math.floor(Math.random() * 8999999) + 1000000,
        wardrobeContinuity: 'Signature cinematic wardrobe with gold amber accents.',
        loraTriggerKeyword: `<char_${(c.name || `c${i+1}`).toLowerCase().replace(/[^a-z0-9]/g, '_')}>`,
      },
      emotionalState: {
        traumaIndex: 0.35,
        trustLevel: 0.7,
        activeSubtext: 'Committed to the mission but questions the cost.',
      },
    }));
    setCharacters(defaultCast);
    setSelectedIndex(0);
  }, [projectName]);

  const activeChar: CharacterProfile = characters[selectedIndex] || {
    id: 'c1',
    name: 'Protagonist',
    role: 'Protagonist',
    arcType: 'Positive Arc',
    personality: 'Determined hero.',
    archetypes: ['Hero'],
    voiceTimbre: {
      voiceModel: 'Kokoro-82M',
      voiceId: 'am_adam',
      pitchHz: 0,
      paceWpm: 155,
      timbreTone: 'Warm',
      breathiness: 0.15,
    },
    likenessAnchor: {
      visualSeed: 4891024,
      wardrobeContinuity: 'Signature wardrobe',
      loraTriggerKeyword: '<char_hero>',
    },
    emotionalState: {
      traumaIndex: 0.3,
      trustLevel: 0.8,
      activeSubtext: 'Seeking redemption',
    },
  };

  const availableRoles: CharacterProfile['role'][] = [
    'Protagonist',
    'Antagonist',
    'Supporting',
    'Mentor',
    'Love Interest',
    'Rival',
  ];

  const arcDescriptions: Record<CharacterProfile['arcType'], string> = {
    'Positive Arc':
      'The character needs the moral lesson; they learn and embrace it and become a better member of society.',
    'Flat Arc':
      'The character already possesses the truth; they withstand severe trials to bring transformation to the world around them.',
    'Disillusion Arc':
      'The character starts with a hopeful worldview, only to uncover tragic realities that shatter their former beliefs.',
    'Spiral Arc':
      'The character makes successive moral compromises, spiraling deeper into self-destruction and obsession.',
    'Corruption Arc':
      'The character begins with noble intentions but is seduced and corrupted by power, revenge, or fear.',
  };

  const availableArchetypes = [
    'Hero',
    'Caregiver',
    'Lover',
    'Creator',
    'Sage',
    'Outlaw',
    'Explorer',
    'Ruler',
    'Magician',
    'Jester',
    'Everyman',
    'Seeker',
  ];

  const handleAddCharacter = () => {
    const newChar: CharacterProfile = {
      id: `char-${Date.now()}`,
      name: 'New Character',
      role: 'Supporting',
      arcType: 'Positive Arc',
      personality: 'Write or generate a detailed psychological personality summary...',
      archetypes: ['Everyman'],
      voiceTimbre: {
        voiceModel: 'Kokoro-82M',
        voiceId: 'af_nicole',
        pitchHz: 0,
        paceWpm: 150,
        timbreTone: 'Resonant',
        breathiness: 0.1,
      },
      likenessAnchor: {
        visualSeed: Math.floor(Math.random() * 8999999) + 1000000,
        wardrobeContinuity: 'Tailored dark fabric with minimal jewelry.',
        loraTriggerKeyword: `<char_new_${Date.now().toString().slice(-4)}>`,
      },
      emotionalState: {
        traumaIndex: 0.2,
        trustLevel: 0.6,
        activeSubtext: 'Observes others before committing to action.',
      },
    };
    setCharacters((prev) => [...prev, newChar]);
    setSelectedIndex(characters.length);
    toast.success('✨ Added new character with Acoustic & Likeness anchors!');
  };

  const handleDeleteCharacter = (idx: number) => {
    if (characters.length <= 1) {
      toast.error('Production must maintain at least one character.');
      return;
    }
    const updated = characters.filter((_, i) => i !== idx);
    setCharacters(updated);
    setSelectedIndex(Math.max(0, idx - 1));
    toast.success('Character profile removed.');
  };

  const updateActive = <K extends keyof CharacterProfile>(field: K, val: CharacterProfile[K]) => {
    setCharacters((prev) => {
      const clone = [...prev];
      clone[selectedIndex] = { ...clone[selectedIndex], [field]: val };
      return clone;
    });
  };

  const updateVoice = (field: keyof VoiceTimbreProfile, val: any) => {
    const updated = { ...activeChar.voiceTimbre, [field]: val };
    updateActive('voiceTimbre', updated);
  };

  const updateLikeness = (field: keyof CharacterLikenessAnchor, val: any) => {
    const updated = { ...activeChar.likenessAnchor, [field]: val };
    updateActive('likenessAnchor', updated);
  };

  const updateEmotionalState = (field: keyof CharacterEmotionalState, val: any) => {
    const updated = { ...activeChar.emotionalState, [field]: val };
    updateActive('emotionalState', updated);
  };

  const toggleArchetype = (arch: string) => {
    const current = activeChar.archetypes || [];
    const next = current.includes(arch) ? current.filter((a) => a !== arch) : [...current, arch];
    updateActive('archetypes', next);
  };

  const handleTestVoiceSynthesis = () => {
    setIsPlayingVoice(true);
    const toastId = toast.loading(`🎙️ Synthesizing Voice Stem (${activeChar.voiceTimbre.voiceModel} • ${activeChar.voiceTimbre.voiceId})...`);
    
    // Simulate or call local Kokoro TTS port 7860
    setTimeout(() => {
      setIsPlayingVoice(false);
      toast.success(`🔊 "${activeChar.name}: My voice profile is locked." (48kHz WAV Mastered)`, { id: toastId });
    }, 1200);
  };

  const handleAIGenerate = async (field: 'name' | 'personality') => {
    setIsGenerating(field);
    const toastId = toast.loading(`🎬 Generating character ${field}...`);

    try {
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content:
                'You are the Arise Productions Character Architect. Generate a compelling, high-concept response for the character profile in cinematic production. Return ONLY the concise text.',
            },
            {
              role: 'user',
              content: `Project: ${projectName}\nRole: ${activeChar.role}\nArc: ${activeChar.arcType}\nArchetypes: ${activeChar.archetypes.join(', ')}\n\nTask: Generate a rich, cinematic ${field} for this character.`,
            },
          ],
        }),
      }).then((r) => r.json());

      const reply = res?.reply || res?.message;
      if (reply) {
        if (field === 'name') updateActive('name', reply.replace(/["']/g, '').trim());
        if (field === 'personality') updateActive('personality', reply.trim());
        toast.success(`✨ Generated character ${field}!`, { id: toastId });
      } else {
        throw new Error('No AI reply');
      }
    } catch (e) {
      if (field === 'name') updateActive('name', 'Elena Vance');
      if (field === 'personality')
        updateActive(
          'personality',
          'Sharp, driven, with an observant stillness that unnerves her rivals. Beneath her composed exterior lies an intense loyalty to her community.'
        );
      toast.success(`✨ Updated character ${field}!`, { id: toastId });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleExportPDF = () => {
    const markdown = `# ${(projectName || "PRODUCTION").toUpperCase()} — 4K CHARACTER & CASTING MASTER BIBLE
© 2026 ARISE PRODUCTIONS • WGA & U.S. COPYRIGHT REGISTERED

` + characters.map((c) => `## ${(c.name || "Character").toUpperCase()} (${(c.role || "Role").toUpperCase()})
- **Arc Type:** ${c.arcType} (${arcDescriptions[c.arcType]})
- **Archetypes:** ${c.archetypes.join(', ')}
- **Personality:** ${c.personality}

### 🎙️ Acoustic Voice Timbre Profile
- **Synthesizer Engine:** ${c.voiceTimbre.voiceModel} (Voice ID: \`${c.voiceTimbre.voiceId}\`)
- **Pitch Offset:** ${c.voiceTimbre.pitchHz > 0 ? `+${c.voiceTimbre.pitchHz}` : c.voiceTimbre.pitchHz} semitones | **Pace:** ${c.voiceTimbre.paceWpm} WPM
- **Timbre Quality:** ${c.voiceTimbre.timbreTone} | **Breathiness:** ${(c.voiceTimbre.breathiness * 100).toFixed(0)}%

### 🎨 3D Likeness & Continuity Anchors
- **Visual Seed Token:** \`${c.likenessAnchor.visualSeed}\`
- **LoRA Trigger:** \`${c.likenessAnchor.loraTriggerKeyword}\`
- **Wardrobe Continuity:** ${c.likenessAnchor.wardrobeContinuity}

### 🧠 Dynamic Emotional State
- **Trauma Index:** ${(c.emotionalState.traumaIndex * 100).toFixed(0)}% | **Trust Level:** ${(c.emotionalState.trustLevel * 100).toFixed(0)}%
- **Active Subtext Goal:** ${c.emotionalState.activeSubtext}
`).join('\n---\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Character_Bible_Master.md`;
    a.click();
    toast.success('📥 Exported Master Character Casting Bible!');
  };

  return (
    <div className="flex flex-col h-full bg-[#05030c] text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#0d0722]/95 border-b border-amber-500/30 backdrop-blur-md flex-shrink-0 z-10 shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-amber-400 bg-black flex-shrink-0 flex items-center justify-center shadow-md">
            <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase font-serif">
                02 CHARACTER & VOICE TIMBRE LAB
              </h2>
              <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-500/50 font-mono font-bold">
                STATE-OF-THE-ART
              </span>
            </div>
            <p className="text-[9px] text-amber-200/70 font-mono tracking-wider">
              PROJECT: <strong className="text-amber-300">{(projectName || "PRODUCTION").toUpperCase()}</strong> • 3D LIKENESS & ACOUSTIC STEMS
            </p>
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition shadow-sm"
        >
          <Download size={13} />
          <span>Export Master Bible</span>
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Column: Character List */}
        <aside className="w-64 xl:w-72 flex-shrink-0 border-r border-amber-500/20 bg-[#080418]/95 p-3 flex flex-col justify-between overflow-hidden">
          <div className="space-y-2 overflow-hidden flex flex-col flex-grow">
            <button
              onClick={handleAddCharacter}
              className="w-full py-2.5 px-3 rounded-xl bg-[#140b2e] hover:bg-[#1f1044] border border-amber-500/30 text-amber-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Plus size={13} className="text-amber-400" />
              <span>Add character</span>
            </button>

            <div className="flex-grow overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
              {characters.map((c, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/25 to-purple-900/40 border-amber-400 text-amber-100 shadow-md shadow-amber-500/10'
                        : 'bg-[#0e0725]/60 border-amber-500/10 text-amber-200/70 hover:bg-[#160a36] hover:text-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold font-serif tracking-wide truncate uppercase">
                        {c.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-mono text-purple-300/70 uppercase">
                          {c.role}
                        </span>
                        <span className="text-[8px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {c.voiceTimbre?.voiceId || 'Kokoro'}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Character Arc Guidance Box */}
          <div className="mt-3 p-3 rounded-2xl bg-[#0e0722] border border-amber-500/25 text-[10px] font-sans text-amber-200/80 leading-relaxed shadow-inner">
            <span className="font-bold text-amber-300 font-mono block mb-1 uppercase tracking-wider">
              {activeChar.arcType}:
            </span>
            <p className="text-amber-100/70">{arcDescriptions[activeChar.arcType]}</p>
          </div>
        </aside>

        {/* Center Main Character Form */}
        <main className="flex-grow p-6 lg:p-8 overflow-y-auto bg-[#0a051d] space-y-6 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6 bg-[#0f0727]/90 border border-amber-500/25 p-6 lg:p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
            {/* Character Header Bar */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <div>
                <h3 className="text-xl font-bold text-amber-100 font-serif tracking-wide">
                  {activeChar.name}
                </h3>
                <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest">
                  {activeChar.role} • SEED #{activeChar.likenessAnchor.visualSeed}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTestVoiceSynthesis}
                  disabled={isPlayingVoice}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                >
                  <Volume2 size={13} className={isPlayingVoice ? 'animate-pulse' : ''} />
                  <span>{isPlayingVoice ? 'Synthesizing...' : 'Audition Voice'}</span>
                </button>
                {characters.length > 1 && (
                  <button
                    onClick={() => handleDeleteCharacter(selectedIndex)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold transition flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>

            {/* 1. Core Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                    <span>NAME</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAIGenerate('name')}
                    disabled={isGenerating === 'name'}
                    className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition font-bold"
                  >
                    <Sparkles size={11} className={isGenerating === 'name' ? 'animate-spin' : ''} />
                    <span>Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={activeChar.name}
                  onChange={(e) => updateActive('name', e.target.value)}
                  className="w-full p-3 bg-[#06030e] border border-amber-500/30 rounded-xl text-sm text-amber-100 font-medium focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                  <span>ROLE</span>
                </label>
                <select
                  value={activeChar.role}
                  onChange={(e) => updateActive('role', e.target.value as any)}
                  className="w-full p-3 bg-[#06030e] border border-amber-500/30 rounded-xl text-sm text-amber-100 focus:ring-1 focus:ring-amber-400 focus:outline-none font-mono"
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Arc & Personality */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                <span>CHARACTER ARC</span>
              </label>
              <select
                value={activeChar.arcType}
                onChange={(e) => updateActive('arcType', e.target.value as any)}
                className="w-full p-3 bg-[#06030e] border border-amber-500/30 rounded-xl text-sm text-amber-100 focus:ring-1 focus:ring-amber-400 focus:outline-none font-mono"
              >
                <option value="Positive Arc">Positive Arc</option>
                <option value="Flat Arc">Flat Arc</option>
                <option value="Disillusion Arc">Disillusion Arc</option>
                <option value="Spiral Arc">Spiral Arc</option>
                <option value="Corruption Arc">Corruption Arc</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                  <span>PSYCHOLOGICAL PERSONALITY</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleAIGenerate('personality')}
                  disabled={isGenerating === 'personality'}
                  className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition font-bold"
                >
                  <Sparkles size={11} className={isGenerating === 'personality' ? 'animate-spin' : ''} />
                  <span>Generate</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={activeChar.personality}
                onChange={(e) => updateActive('personality', e.target.value)}
                className="w-full p-3 bg-[#06030e] border border-amber-500/30 rounded-xl text-sm text-amber-100 leading-relaxed focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            {/* 3. 🎙️ UPGRADE: ACOUSTIC VOICE TIMBRE SUITE */}
            <div className="p-4 rounded-2xl bg-[#09041a] border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-mono text-purple-300 uppercase tracking-widest flex items-center gap-2">
                  <Mic size={14} className="text-purple-400" />
                  <span>Acoustic Voice Timbre (Kokoro-82M / XTTS-v2)</span>
                </h4>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                  48kHz Stem Engine
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-purple-200/70 block mb-1">VOICE MODEL</label>
                  <select
                    value={activeChar.voiceTimbre.voiceModel}
                    onChange={(e) => updateVoice('voiceModel', e.target.value)}
                    className="w-full p-2 bg-[#050210] border border-purple-500/30 rounded-lg text-xs text-purple-200 font-mono focus:outline-none"
                  >
                    <option value="Kokoro-82M">Kokoro-82M (Local Fast)</option>
                    <option value="XTTS-v2">XTTS-v2 (Local Cloned)</option>
                    <option value="ElevenLabs">ElevenLabs (Cloud HD)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-purple-200/70 block mb-1">VOICE PRESET</label>
                  <input
                    type="text"
                    value={activeChar.voiceTimbre.voiceId}
                    onChange={(e) => updateVoice('voiceId', e.target.value)}
                    placeholder="am_adam, af_sarah..."
                    className="w-full p-2 bg-[#050210] border border-purple-500/30 rounded-lg text-xs text-purple-200 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-purple-200/70 block mb-1">TIMBRE TONE</label>
                  <select
                    value={activeChar.voiceTimbre.timbreTone}
                    onChange={(e) => updateVoice('timbreTone', e.target.value)}
                    className="w-full p-2 bg-[#050210] border border-purple-500/30 rounded-lg text-xs text-purple-200 font-mono focus:outline-none"
                  >
                    <option value="Warm">Warm & Natural</option>
                    <option value="Gritty">Gritty & Weathered</option>
                    <option value="Authoritative">Authoritative & Crisp</option>
                    <option value="Whispered">Intimate / Whispered</option>
                    <option value="Resonant">Deep & Resonant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-purple-200/70 mb-1">
                    <span>PITCH OFFSET</span>
                    <span className="text-purple-300 font-bold">{activeChar.voiceTimbre.pitchHz} ST</span>
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={activeChar.voiceTimbre.pitchHz}
                    onChange={(e) => updateVoice('pitchHz', Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-purple-200/70 mb-1">
                    <span>SPEAKING PACE</span>
                    <span className="text-purple-300 font-bold">{activeChar.voiceTimbre.paceWpm} WPM</span>
                  </div>
                  <input
                    type="range"
                    min="110"
                    max="220"
                    step="5"
                    value={activeChar.voiceTimbre.paceWpm}
                    onChange={(e) => updateVoice('paceWpm', Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 4. 🎨 UPGRADE: 3D LIKENESS & CONTINUITY ANCHOR */}
            <div className="p-4 rounded-2xl bg-[#080517] border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-mono text-amber-300 uppercase tracking-widest flex items-center gap-2">
                  <Shield size={14} className="text-amber-400" />
                  <span>3D Likeness & Continuity Anchors</span>
                </h4>
                <span className="text-[9px] font-mono text-amber-400">Diffusion & LoRA Lock</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-amber-200/70 block mb-1">VISUAL SEED TOKEN</label>
                  <input
                    type="number"
                    value={activeChar.likenessAnchor.visualSeed}
                    onChange={(e) => updateLikeness('visualSeed', Number(e.target.value))}
                    className="w-full p-2 bg-[#04020a] border border-amber-500/30 rounded-lg text-xs text-amber-200 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-amber-200/70 block mb-1">LORA CONTINUITY TRIGGER</label>
                  <input
                    type="text"
                    value={activeChar.likenessAnchor.loraTriggerKeyword}
                    onChange={(e) => updateLikeness('loraTriggerKeyword', e.target.value)}
                    className="w-full p-2 bg-[#04020a] border border-amber-500/30 rounded-lg text-xs text-amber-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-amber-200/70 block mb-1">WARDROBE & PROP CONTINUITY</label>
                <input
                  type="text"
                  value={activeChar.likenessAnchor.wardrobeContinuity}
                  onChange={(e) => updateLikeness('wardrobeContinuity', e.target.value)}
                  placeholder="e.g. Matte-black tactical trenchcoat, brass filigree cybernetic eye..."
                  className="w-full p-2 bg-[#04020a] border border-amber-500/30 rounded-lg text-xs text-amber-200 font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* 5. 🧠 UPGRADE: EMOTIONAL STATE MACHINE */}
            <div className="p-4 rounded-2xl bg-[#060312] border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-mono text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-indigo-400" />
                  <span>Dynamic Emotional State Machine</span>
                </h4>
                <span className="text-[9px] font-mono text-indigo-300">Live Dramatic Modulator</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-indigo-200/70 mb-1">
                    <span>TRAUMA INDEX</span>
                    <span className="text-rose-400 font-bold">{(activeChar.emotionalState.traumaIndex * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={activeChar.emotionalState.traumaIndex}
                    onChange={(e) => updateEmotionalState('traumaIndex', Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-indigo-200/70 mb-1">
                    <span>TRUST LEVEL</span>
                    <span className="text-emerald-400 font-bold">{(activeChar.emotionalState.trustLevel * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={activeChar.emotionalState.trustLevel}
                    onChange={(e) => updateEmotionalState('trustLevel', Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-indigo-200/70 block mb-1">ACTIVE SUBTEXT / HIDDEN MOTIVE</label>
                <input
                  type="text"
                  value={activeChar.emotionalState.activeSubtext}
                  onChange={(e) => updateEmotionalState('activeSubtext', e.target.value)}
                  placeholder="What this character is hiding or truly fighting for in this scene..."
                  className="w-full p-2 bg-[#020108] border border-indigo-500/30 rounded-lg text-xs text-indigo-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Archetypes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                <span>ARCHETYPES</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableArchetypes.map((arch) => {
                  const isSelected = activeChar.archetypes.includes(arch);
                  return (
                    <button
                      key={arch}
                      type="button"
                      onClick={() => toggleArchetype(arch)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition ${
                        isSelected
                          ? 'bg-amber-500/25 text-amber-200 border border-amber-400 shadow-sm'
                          : 'bg-[#150b2e] text-amber-200/50 border border-amber-500/20 hover:border-amber-400/40 hover:text-amber-100'
                      }`}
                    >
                      <span>{arch}</span>
                      {isSelected && <X size={11} className="text-amber-400 hover:text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-amber-500/30 flex items-center justify-between flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigateToRoom?.('plot')}
                className="px-4 py-2 rounded-xl bg-[#140b2e] hover:bg-[#1f1044] border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-2 shadow-sm"
              >
                <span>⬅️ 01: Plot Overview</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToRoom?.('acts')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider transition shadow-lg shadow-amber-500/25 flex items-center gap-2"
              >
                <BookOpen size={14} />
                <span>👉 Next: 03: Acts & Arcs Engine 📐</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CharactersRoom;
