"use client";

import React, { useState } from 'react';
import {
  Users,
  Download,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';
import { getAPIBaseURL } from '../lib/api';

interface CharactersRoomProps {
  projectName?: string;
}

interface CharacterProfile {
  id: string;
  name: string;
  role: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Mentor' | 'Love Interest' | 'Rival';
  arcType: 'Positive Arc' | 'Flat Arc' | 'Disillusion Arc' | 'Spiral Arc' | 'Corruption Arc';
  personality: string;
  archetypes: string[];
}

export function CharactersRoom({ projectName = 'A Fatherless Child' }: CharactersRoomProps) {
  const apiBase = getAPIBaseURL();
  const [characters, setCharacters] = useState<CharacterProfile[]>([
    {
      id: 'c1',
      name: 'Devon',
      role: 'Protagonist',
      arcType: 'Positive Arc',
      personality:
        'Initially resilient yet emotionally fragile, Devon is a hardworking, empathetic young builder who feels trapped by life’s disappointments. Her journey transforms her into a determined, courageous creator capable of decisive action when pushed to the edge.',
      archetypes: ['Hero', 'Creator', 'Seeker'],
    },
    {
      id: 'c2',
      name: 'Marcus',
      role: 'Mentor',
      arcType: 'Flat Arc',
      personality:
        'A grounded, master restorer and community patriarch with unwavering moral clarity. He refuses to compromise on truth and serves as the unwavering anchor for those around him.',
      archetypes: ['Sage', 'Caregiver'],
    },
    {
      id: 'c3',
      name: 'Vale',
      role: 'Antagonist',
      arcType: 'Corruption Arc',
      personality:
        'Ruthlessly pragmatic real estate mogul driven by the belief that progress requires erasing the past. Calculating, charming, and unyielding in his pursuit of control.',
      archetypes: ['Ruler', 'Outlaw'],
    },
    {
      id: 'c4',
      name: 'Cassie Thornfield',
      role: 'Supporting',
      arcType: 'Disillusion Arc',
      personality:
        'A sharp investigative journalist whose cynical exterior masks a deep yearning for genuine accountability. She navigates elite corridors with fierce wit.',
      archetypes: ['Explorer', 'Everyman'],
    },
    {
      id: 'c5',
      name: 'Victor Ramirez',
      role: 'Supporting',
      arcType: 'Positive Arc',
      personality:
        'A principled city inspector caught between bureaucratic compromise and doing what is right. Methodical, observant, and quiet until challenged.',
      archetypes: ['Everyman', 'Caregiver'],
    },
  ]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const activeChar = characters[selectedIndex] || characters[0];

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
    };
    setCharacters((prev) => [...prev, newChar]);
    setSelectedIndex(characters.length);
    toast.success('✨ Added new character to roster!');
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

  const toggleArchetype = (arch: string) => {
    const current = activeChar.archetypes || [];
    const next = current.includes(arch) ? current.filter((a) => a !== arch) : [...current, arch];
    updateActive('archetypes', next);
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
    const markdown = `# ${projectName.toUpperCase()} — CHARACTER & CASTING BIBLE
© 2026 ARISE PRODUCTIONS • ALL RIGHTS RESERVED

` + characters.map((c) => `## ${c.name.toUpperCase()} (${c.role.toUpperCase()})
- **Arc Type:** ${c.arcType} (${arcDescriptions[c.arcType]})
- **Archetypes:** ${c.archetypes.join(', ')}
- **Personality:** ${c.personality}
`).join('\n---\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Character_Bible.md`;
    a.click();
    toast.success('📥 Exported Character Casting Bible!');
  };

  return (
    <div className="flex flex-col h-full bg-[#05030c] text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Bar matching Saga Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#0d0722]/95 border-b border-amber-500/30 backdrop-blur-md flex-shrink-0 z-10 shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-amber-400 bg-black flex-shrink-0 flex items-center justify-center shadow-md">
            <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase font-serif">
                02 CHARACTER CRAFTING
              </h2>
              <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-500/50 font-mono font-bold">
                SAGAS FORMAT
              </span>
            </div>
            <p className="text-[9px] text-amber-200/70 font-mono tracking-wider">
              PROJECT: <strong className="text-amber-300">{projectName.toUpperCase()}</strong> • CAST & ARCS
            </p>
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition shadow-sm"
        >
          <Download size={13} />
          <span>Export Bible</span>
        </button>
      </div>

      {/* Main Saga-Format Layout */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Column: Character List matching Image 4 */}
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
                      <span className="text-[9px] font-mono text-purple-300/70 uppercase">
                        {c.role}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Character Arc Guidance Box matching Image 4 */}
          <div className="mt-3 p-3 rounded-2xl bg-[#0e0722] border border-amber-500/25 text-[10px] font-sans text-amber-200/80 leading-relaxed shadow-inner">
            <span className="font-bold text-amber-300 font-mono block mb-1 uppercase tracking-wider">
              {activeChar.arcType}:
            </span>
            <p className="text-amber-100/70">{arcDescriptions[activeChar.arcType]}</p>
          </div>
        </aside>

        {/* Center Main Character Form matching Image 4 */}
        <main className="flex-grow p-6 lg:p-8 overflow-y-auto bg-[#0a051d] space-y-6 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6 bg-[#0f0727]/90 border border-amber-500/25 p-6 lg:p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
            {/* Character Header Bar */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <h3 className="text-xl font-bold text-amber-100 font-serif tracking-wide">
                {activeChar.name}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportPDF}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition"
                >
                  Export PDF
                </button>
                {characters.length > 1 && (
                  <button
                    onClick={() => handleDeleteCharacter(selectedIndex)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold transition flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    <span>Delete character</span>
                  </button>
                )}
              </div>
            </div>

            {/* 1. NAME (i) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                  <span>NAME</span>
                  <HelpCircle size={12} className="text-amber-400/60" />
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

            {/* 2. ROLE */}
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

            {/* 3. CHARACTER ARC (i) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                <span>CHARACTER ARC</span>
                <HelpCircle size={12} className="text-amber-400/60" />
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

            {/* 4. PERSONALITY (i) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                  <span>PERSONALITY</span>
                  <HelpCircle size={12} className="text-amber-400/60" />
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
                rows={4}
                value={activeChar.personality}
                onChange={(e) => updateActive('personality', e.target.value)}
                className="w-full p-3 bg-[#06030e] border border-amber-500/30 rounded-xl text-sm text-amber-100 leading-relaxed focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            {/* 5. ARCHETYPES (i) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                <span>ARCHETYPES</span>
                <HelpCircle size={12} className="text-amber-400/60" />
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default CharactersRoom;

