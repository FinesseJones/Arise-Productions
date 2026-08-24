"use client";

import React, { useState } from 'react';
import GenerateField from '../components/GenerateField';
import { Users, Download, Plus, Trash2, Sparkles, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';

interface CharactersRoomProps {
  projectName?: string;
}

interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  archetype: string;
  want: string;
  need: string;
  theLie: string;
  theGhost: string;
  arc: string;
  physical: string;
  personality: string;
  voiceModel: string;
}

export function CharactersRoom({ projectName = 'A Fatherless Child' }: CharactersRoomProps) {
  const [characters, setCharacters] = useState<CharacterProfile[]>([
    {
      id: 'c1',
      name: 'Devon',
      role: 'Lead Protagonist (19yo)',
      archetype: 'The Seeker / Reluctant Architect',
      want: 'Find his missing father and uncover why he was abandoned.',
      need: 'Realize his worth is forged by his own choices, not defined by absence.',
      theLie: 'If I was worth staying for, my father would never have left.',
      theGhost: 'Growing up in the shadow of family silence and a fatherless childhood.',
      arc: 'From wounded passive observer to confident community filmmaker and builder.',
      physical: 'Slender, athletic build, watchful amber-brown eyes, expressive hands with woodcraft calluses, weathered denim jacket.',
      personality: 'Introspective, fiercely loyal, hyper-observant, quiet dignity that erupts into passionate conviction.',
      voiceModel: 'Resilient Young Baritone • Introspective • Measured rhythm with subtle southern warmth.',
    },
    {
      id: 'c2',
      name: 'Marcus',
      role: 'Mentor & Master Craftsman (40s)',
      archetype: 'The Sage / Mountain Guardian',
      want: 'Restore the historic community hall and protect Devon from destructive obsession.',
      need: 'Trust Devon with the full truth and pass down the generational torch.',
      theLie: 'Shielding young men from harsh truths is the only way to keep them safe.',
      theGhost: 'Failing to keep Devon father from leaving decades ago.',
      arc: 'From protective gatekeeper to trusting partner and elder.',
      physical: 'Broad-shouldered, silver-flecked beard, warm weathered smile, carpenter apron, steady hands.',
      personality: 'Patient, grounded, speak-when-necessary wisdom, deeply rooted community patriarch.',
      voiceModel: 'Deep Resonant Oak Baritone • Measured • Gravelly warmth with paternal reassurance.',
    },
  ]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const activeChar = characters[selectedIndex] || characters[0];

  const handleAddCharacter = () => {
    const newChar: CharacterProfile = {
      id: `char-${Date.now()}`,
      name: 'New Character',
      role: 'Supporting',
      archetype: 'The Catalyst',
      want: 'What does this character desire on the surface?',
      need: 'What emotional truth must they learn?',
      theLie: 'What falsehood do they believe about themselves?',
      theGhost: 'What past wound or trauma drives their behavior?',
      arc: 'How do they transform from beginning to end?',
      physical: 'Physical traits, age, wardrobe cues, and posture...',
      personality: 'Core temperament, mannerisms, and habits...',
      voiceModel: 'Vocal timbre, cadence, and speech style...',
    };
    setCharacters([...characters, newChar]);
    setSelectedIndex(characters.length);
    toast.success('Added new character to production roster!');
  };

  const handleDeleteCharacter = (idx: number) => {
    if (characters.length <= 1) {
      toast.error('Production must have at least one character profile.');
      return;
    }
    const updated = characters.filter((_, i) => i !== idx);
    setCharacters(updated);
    setSelectedIndex(Math.max(0, idx - 1));
    toast.success('Character profile removed');
  };

  const updateActive = (field: keyof CharacterProfile, val: string) => {
    setCharacters((prev) => {
      const clone = [...prev];
      clone[selectedIndex] = { ...clone[selectedIndex], [field]: val };
      return clone;
    });
  };

  const handleExportBible = () => {
    const markdown = `# ${projectName.toUpperCase()} - CHARACTER & CASTING BIBLE\n\n` +
      characters.map((c) => `## ${c.name.toUpperCase()} (${c.role})\n` +
        `**Archetype:** ${c.archetype}\n` +
        `**Want:** ${c.want}\n` +
        `**Need:** ${c.need}\n` +
        `**The Lie:** ${c.theLie}\n` +
        `**The Ghost / Wound:** ${c.theGhost}\n` +
        `**Character Arc:** ${c.arc}\n` +
        `**Physical Description:** ${c.physical}\n` +
        `**Personality:** ${c.personality}\n` +
        `**Voice Model:** ${c.voiceModel}\n`
      ).join('\n---\n\n') +
      `\n\n© 2026 THE AI CONTENT FOUNDRY, LLC`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Character_Bible.md`;
    a.click();
    toast.success('📥 Exported Character Casting Bible!');
  };

  const shared = {
    stageId: 'script',
    role: 'Lead Character Architect & Casting AI',
    roomName: 'Characters Room',
    context: `Character: ${activeChar.name} in ${projectName}`,
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gradient-to-b from-[#080512] via-[#0e0922] to-[#080512] text-slate-100 font-sans">
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
                  Cast & Character Engine
                </h1>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  NEW
                </span>
              </div>
              <p className="text-xs font-mono text-[#E2BA86]">
                Psychological Profiles & Archetypes for <strong className="text-amber-300">{projectName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleExportBible}
              className="flex items-center space-x-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-1.5 text-xs font-mono text-amber-300 font-bold transition"
            >
              <Download size={13} />
              <span>Export Bible</span>
            </button>
          </div>
        </div>

        {/* Character Tabs & Add Action */}
        <div className="flex items-center justify-between overflow-x-auto pb-1 gap-2">
          <div className="flex items-center space-x-2">
            {characters.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold border transition ${
                  selectedIndex === idx
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-[#140e2e] border-purple-900/60 text-purple-300 hover:text-white'
                }`}
              >
                <Users size={13} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddCharacter}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-purple-950/60 text-amber-300 border border-amber-500/40 hover:bg-purple-900/60 text-xs font-mono font-bold transition flex-shrink-0"
          >
            <Plus size={13} />
            <span>Add Character</span>
          </button>
        </div>

        {/* Main Character Profile Form */}
        <div className="p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-900/60 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={activeChar.name}
                onChange={(e) => updateActive('name', e.target.value)}
                className="text-base font-black text-amber-300 font-serif bg-transparent border-b border-transparent focus:border-amber-500 focus:outline-none"
              />
              <input
                type="text"
                value={activeChar.role}
                onChange={(e) => updateActive('role', e.target.value)}
                className="text-xs font-mono text-purple-300 bg-transparent border-b border-transparent focus:border-purple-500 focus:outline-none"
              />
            </div>

            {characters.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteCharacter(selectedIndex)}
                className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition text-xs flex items-center gap-1 font-mono"
              >
                <Trash2 size={12} />
                <span>Delete Profile</span>
              </button>
            )}
          </div>

          {/* Form Fields using GenerateField */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GenerateField
              label="Archetype & Role"
              info="Dramatic archetype (e.g., The Rebel, The Mentor, The Shapeshifter)."
              placeholder="e.g. The Reluctant Hero"
              value={activeChar.archetype}
              onChange={(val) => updateActive('archetype', val)}
              multiline={false}
              {...shared}
            />

            <GenerateField
              label="Voice Model & Timbre"
              info="Vocal pitch, accent, rhythm, and ElevenLabs reference tone."
              placeholder="e.g. Resilient Warm Baritone with measured cadence"
              value={activeChar.voiceModel}
              onChange={(val) => updateActive('voiceModel', val)}
              multiline={false}
              {...shared}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GenerateField
              label="External Want"
              info="The tangible, conscious goal the character pursues."
              placeholder="What external goal does this character fight for?"
              value={activeChar.want}
              onChange={(val) => updateActive('want', val)}
              {...shared}
            />

            <GenerateField
              label="Internal Need"
              info="The spiritual or emotional truth they must embrace to grow."
              placeholder="What internal truth must they discover?"
              value={activeChar.need}
              onChange={(val) => updateActive('need', val)}
              {...shared}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GenerateField
              label="The Lie (Flaw)"
              info="The false worldview or self-limiting belief holding them back."
              placeholder="What falsehood do they tell themselves?"
              value={activeChar.theLie}
              onChange={(val) => updateActive('theLie', val)}
              {...shared}
            />

            <GenerateField
              label="The Ghost (Wound)"
              info="The backstory trauma or origin event that created the lie."
              placeholder="What past wound forged their vulnerability?"
              value={activeChar.theGhost}
              onChange={(val) => updateActive('theGhost', val)}
              {...shared}
            />
          </div>

          <GenerateField
            label="Character Arc"
            info="The transformation trajectory across Act 1, 2, and 3."
            placeholder="Describe the arc from beginning to climax..."
            value={activeChar.arc}
            onChange={(val) => updateActive('arc', val)}
            {...shared}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GenerateField
              label="Physical Description"
              info="Visual cues, age, wardrobe, gait, and signature props."
              placeholder="Physical features, height, styling, and visual motifs..."
              value={activeChar.physical}
              onChange={(val) => updateActive('physical', val)}
              {...shared}
            />

            <GenerateField
              label="Personality & Quirks"
              info="Behavioral mannerisms, psychological triggers, and dialogue habits."
              placeholder="Temperament, habits, reaction under pressure..."
              value={activeChar.personality}
              onChange={(val) => updateActive('personality', val)}
              {...shared}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharactersRoom;
