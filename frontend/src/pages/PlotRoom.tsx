"use client";

import React, { useState } from 'react';
import { GenerateField } from '../components/GenerateField';
import { BookOpen, Sparkles, Download, Save, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';

interface PlotRoomProps {
  projectName?: string;
}

export function PlotRoom({ projectName = 'A Fatherless Child' }: PlotRoomProps) {
  const [themes, setThemes] = useState(
    'Generational absence, self-worth forged in adversity, and the courageous discovery that identity is built from within, not bestowed by the past.'
  );
  const [storyType, setStoryType] = useState('Coming-of-Age Cinematic Drama / Legacy Quest');
  const [genres, setGenres] = useState('Drama, Independent Cinema, Social Realism');
  const [tone, setTone] = useState(
    'Introspective, gritty yet luminous, emotionally raw, and grounded with moments of poetic visual triumph in 3200K golden light.'
  );
  const [bStory, setBStory] = useState(
    'The mentorship bond with Marcus and the restoring of the neighborhood community hall, mirroring Devon inner healing.'
  );

  const shared = {
    stageId: 'structure',
    role: 'Story Architect AI',
    roomName: 'Plot Room',
    context: `Project: ${projectName}`,
  };

  const handleExport = () => {
    const plotSummary = `# ${projectName.toUpperCase()} - PLOT OVERVIEW\n\n## THEMES\n${themes}\n\n## STORY TYPE\n${storyType}\n\n## GENRES\n${genres}\n\n## TONE\n${tone}\n\n## B STORY\n${bStory}\n\n---\n© 2026 THE AI CONTENT FOUNDRY, LLC`;
    const blob = new Blob([plotSummary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Plot_Overview.md`;
    a.click();
    toast.success('📥 Exported Plot Overview manifest!');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gradient-to-b from-[#080512] via-[#0e0922] to-[#080512] text-slate-100 font-sans">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="p-5 rounded-2xl bg-[#140e2e]/95 border border-purple-900/60 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/60 bg-black flex-shrink-0 flex items-center justify-center">
              <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif">
                Plot Overview Room
              </h1>
              <p className="text-xs font-mono text-[#E2BA86]">
                Narrative Foundations for <strong className="text-amber-300">{projectName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center space-x-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-1.5 text-xs font-mono text-amber-300 font-bold transition"
            >
              <Download size={13} />
              <span>Export Narrative</span>
            </button>
          </div>
        </div>

        {/* Form Fields with GenerateField */}
        <div className="p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-900/60 backdrop-blur-xl shadow-2xl space-y-4">
          <GenerateField
            label="Themes"
            info="The core philosophical message and central question explored by the film."
            placeholder="What is the central message of your story?"
            value={themes}
            onChange={setThemes}
            {...shared}
          />

          <GenerateField
            label="Story Type"
            info="The primary narrative archetype (e.g. Hero's Journey, Rite of Passage, Monster in the House)."
            placeholder="What plot archetype(s) does your story follow?"
            value={storyType}
            onChange={setStoryType}
            multiline={false}
            {...shared}
          />

          <GenerateField
            label="Genres"
            info="Primary and secondary film categories."
            placeholder="What categories does your story fall under?"
            value={genres}
            onChange={setGenres}
            multiline={false}
            {...shared}
          />

          <GenerateField
            label="Tone"
            info="The atmospheric mood, lighting feel, and emotional rhythm."
            placeholder="What is the basic mood or atmosphere of your story?"
            value={tone}
            onChange={setTone}
            {...shared}
          />

          <GenerateField
            label="B Story (Subplot)"
            info="The secondary narrative thread (often relational or internal) that teaches the theme."
            placeholder="What is the subplot to your story?"
            value={bStory}
            onChange={setBStory}
            {...shared}
          />
        </div>
      </div>
    </div>
  );
}

export default PlotRoom;
