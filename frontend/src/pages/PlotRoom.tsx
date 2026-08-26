"use client";

import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Download,
  Plus,
  X,
  Layers,
  Activity,
  Users,
  Film,
  Camera,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';
import { getAPIBaseURL } from '../lib/api';

interface PlotRoomProps {
  projectName?: string;
  onNavigateToRoom?: (roomKey: string) => void;
}

export function PlotRoom({ projectName = 'A Fatherless Child', onNavigateToRoom }: PlotRoomProps) {
  const apiBase = getAPIBaseURL();
  const [title, setTitle] = useState<string>(projectName || 'Vicious Cycle');
  const [logline, setLogline] = useState<string>(
    'When a waitress discovers her miscarriage is tied to a sinister plot between fertility clinics and VR tech, she must confront mercenaries, betrayal, and her own humanity to expose the truth.'
  );
  const [themes, setThemes] = useState<string>(
    'Is seeking justice worth sacrificing your own humanity? Generational grief, technological dehumanization, and maternal instinct.'
  );
  const [selectedStoryTypes, setSelectedStoryTypes] = useState<string[]>(['David Vs Goliath', 'Monster in the House']);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Action', 'Thriller', 'Drama']);
  const [tone, setTone] = useState<string>('Emotionally charged, visceral, tech-noir suspense');
  const [audience, setAudience] = useState<string>('Adult (18+)');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const availableStoryTypes = [
    'David Vs Goliath',
    "Hero's Journey",
    'Monster in the House',
    'Rags to Riches',
    'Voyage & Return',
    'Tragedy',
    'Rebirth',
    'Buddy Love',
    'Whodunit',
    'Golden Fleece',
  ];

  const availableGenres = [
    'Action',
    'Thriller',
    'Drama',
    'Sci-Fi',
    'Crime',
    'Mystery',
    'Horror',
    'Psychological',
    'Cyberpunk',
    'Romance',
  ];

  const audiences = ['Adult (18+)', 'Young Adult (PG-13)', 'Mature Indie', 'All Ages / Family'];

  // AI Field Generator
  const handleAIGenerate = async (field: 'title' | 'logline' | 'themes' | 'tone') => {
    setIsGenerating(field);
    const toastId = toast.loading(`🎬 Arise AI Engine generating ${field.toUpperCase()}...`);

    try {
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content:
                'You are the Arise Productions Executive Showrunner and Sagas Story Architect. Generate a compelling, high-concept, award-winning cinematic response for the specified field. Return ONLY the concise text result without conversational filler.',
            },
            {
              role: 'user',
              content: `Project Title: ${title}\nLogline: ${logline}\nGenres: ${selectedGenres.join(', ')}\nTone: ${tone}\n\nTask: Generate an ultra-compelling cinematic ${field.toUpperCase()} for this production.`,
            },
          ],
        }),
      }).then((r) => r.json());

      const reply = res?.reply || res?.message;
      if (reply) {
        if (field === 'title') setTitle(reply.replace(/["']/g, '').trim());
        if (field === 'logline') setLogline(reply.replace(/["']/g, '').trim());
        if (field === 'themes') setThemes(reply.replace(/["']/g, '').trim());
        if (field === 'tone') setTone(reply.replace(/["']/g, '').trim());
        toast.success(`✨ Generated ${field.toUpperCase()} successfully!`, { id: toastId });
      } else {
        throw new Error('No AI response');
      }
    } catch (err) {
      if (field === 'title') setTitle('A Fatherless Child: The Blueprint');
      if (field === 'logline')
        setLogline(
          'An estranged architect uncovers an encrypted set of blueprints left behind in his childhood home, triggering an urban race against a shadowy developer to reclaim his family legacy.'
        );
      if (field === 'themes')
        setThemes(
          'Generational identity, overcoming paternal absence, and discovering that self-worth is built with your own hands.'
        );
      if (field === 'tone') setTone('Gritty yet luminous, intimate, emotionally raw with 3200K golden warmth.');
      toast.success(`✨ Updated ${field.toUpperCase()}!`, { id: toastId });
    } finally {
      setIsGenerating(null);
    }
  };

  const toggleStoryType = (type: string) => {
    setSelectedStoryTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleExport = () => {
    const doc = `# ${title.toUpperCase()} — PLOT OVERVIEW
© 2026 ARISE PRODUCTIONS & THE AI CONTENT FOUNDRY, LLC

## LOGLINE
${logline}

## THEMES
${themes}

## STORY TYPES
${selectedStoryTypes.join(', ')}

## GENRES
${selectedGenres.join(', ')}

## TONE
${tone}

## TARGET AUDIENCE
${audience}
`;
    const blob = new Blob([doc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_Plot_Overview.md`;
    a.click();
    toast.success('📥 Exported Plot Overview!');
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
                01 IDEATION & PLOTTING
              </h2>
              <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-500/50 font-mono font-bold">
                SAGAS FORMAT
              </span>
            </div>
            <p className="text-[9px] text-amber-200/70 font-mono tracking-wider">
              PROJECT: <strong className="text-amber-300">{title.toUpperCase()}</strong> • STORY ARCHITECTURE FOUNDATION
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition shadow-sm"
        >
          <Download size={13} />
          <span>Export Markdown</span>
        </button>
      </div>

      {/* Main Saga-Format Layout */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Saga Tree Navigation */}
        <aside className="w-56 xl:w-60 flex-shrink-0 border-r border-amber-500/20 bg-[#080418]/95 p-3 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase text-amber-400/80 font-bold px-2">Your Projects</span>
            <button
              onClick={() => onNavigateToRoom?.('ideas')}
              className="w-full text-left p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-200 truncate transition flex items-center justify-between"
            >
              <span>🎬 {title}</span>
              <span className="text-[9px] text-amber-400 font-mono">00: Ideas</span>
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase text-amber-400/80 font-bold px-2">Story Architecture</span>
            <div className="space-y-0.5 font-mono text-xs">
              <button
                onClick={() => onNavigateToRoom?.('plot')}
                className="w-full p-2 rounded-xl bg-gradient-to-r from-amber-500/25 to-purple-900/40 border border-amber-400/60 text-xs font-bold text-amber-300 flex items-center gap-2 shadow-sm text-left"
              >
                <BookOpen size={13} className="text-amber-400" />
                <span>01: Plot Overview</span>
              </button>
              <button
                onClick={() => onNavigateToRoom?.('characters')}
                className="w-full p-2 rounded-xl text-xs text-amber-200/70 hover:bg-[#12082b] hover:text-white flex items-center gap-2 cursor-pointer transition text-left"
              >
                <Users size={13} className="text-purple-400" />
                <span>02: Characters</span>
              </button>
              <button
                onClick={() => onNavigateToRoom?.('acts')}
                className="w-full p-2 rounded-xl text-xs text-amber-200/70 hover:bg-[#12082b] hover:text-white flex items-center gap-2 cursor-pointer transition text-left"
              >
                <Layers size={13} className="text-purple-400" />
                <span>03: Acts</span>
              </button>
              <button
                onClick={() => onNavigateToRoom?.('beats')}
                className="w-full p-2 rounded-xl text-xs text-amber-200/70 hover:bg-[#12082b] hover:text-white flex items-center gap-2 cursor-pointer transition text-left"
              >
                <Activity size={13} className="text-purple-400" />
                <span>04: Beats</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase text-amber-400/80 font-bold px-2">Production & Release</span>
            <div className="space-y-0.5 font-mono text-xs">
              <button
                onClick={() => onNavigateToRoom?.('stage')}
                className="w-full p-2 rounded-xl text-xs text-amber-200/70 hover:bg-[#12082b] hover:text-white flex items-center gap-2 cursor-pointer transition text-left"
              >
                <Film size={13} className="text-purple-400" />
                <span>3D Soundstage</span>
              </button>
              <button
                onClick={() => onNavigateToRoom?.('distribution')}
                className="w-full p-2 rounded-xl text-xs text-amber-200/70 hover:bg-[#12082b] hover:text-white flex items-center gap-2 cursor-pointer transition text-left"
              >
                <Sliders size={13} className="text-amber-400" />
                <span>05: Distribution</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Center: Plot Overview Form matching Saga Image 1 */}
        <main className="flex-grow p-6 lg:p-8 overflow-y-auto bg-[#0a051d] space-y-6 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6 bg-[#0f0727]/90 border border-amber-500/25 p-6 lg:p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
            {/* Title Header */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <h3 className="text-xl font-bold text-amber-100 font-serif tracking-wide">
                Plot Overview
              </h3>
              <span className="text-xs font-mono text-amber-400/80">Step 01 of 05</span>
            </div>

            {/* 1. TITLE (i) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                  <span>TITLE</span>
                  <HelpCircle size={12} className="text-amber-400/60" />
                </label>
                <button
                  type="button"
                  onClick={() => handleAIGenerate('title')}
                  disabled={isGenerating === 'title'}
                  className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition font-bold"
                >
                  <Sparkles size={11} className={isGenerating === 'title' ? 'animate-spin' : ''} />
                  <span>Generate</span>
                </button>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-[#06030e] border border-amber-500/30 rounded-xl text-sm text-amber-100 font-medium focus:ring-1 focus:ring-amber-400 focus:outline-none"
                placeholder="Enter production title..."
              />
            </div>

            {/* 2. LOGLINE (i) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                  <span>LOGLINE</span>
                  <HelpCircle size={12} className="text-amber-400/60" />
                </label>
                <button
                  type="button"
                  onClick={() => handleAIGenerate('logline')}
                  disabled={isGenerating === 'logline'}
                  className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition font-bold"
                >
                  <Sparkles size={11} className={isGenerating === 'logline' ? 'animate-spin' : ''} />
                  <span>Generate</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={logline}
                onChange={(e) => setLogline(e.target.value)}
                className="w-full p-3 bg-[#06030e] border border-amber-500/30 rounded-xl text-sm text-amber-100 leading-relaxed focus:ring-1 focus:ring-amber-400 focus:outline-none"
                placeholder="Write or generate a gripping logline..."
              />
            </div>

            {/* 3. THEMES (i) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                  <span>THEMES</span>
                  <HelpCircle size={12} className="text-amber-400/60" />
                </label>
                <button
                  type="button"
                  onClick={() => handleAIGenerate('themes')}
                  disabled={isGenerating === 'themes'}
                  className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition font-bold"
                >
                  <Sparkles size={11} className={isGenerating === 'themes' ? 'animate-spin' : ''} />
                  <span>Generate</span>
                </button>
              </div>
              <input
                type="text"
                value={themes}
                onChange={(e) => setThemes(e.target.value)}
                className="w-full p-3 bg-[#06030e] border border-amber-500/30 rounded-xl text-sm text-amber-100 leading-relaxed focus:ring-1 focus:ring-amber-400 focus:outline-none"
                placeholder="Central themes and philosophical conflict..."
              />
            </div>

            {/* 4. STORY TYPES (i) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                <span>STORY TYPES</span>
                <HelpCircle size={12} className="text-amber-400/60" />
              </label>
              <div className="flex flex-wrap gap-2">
                {availableStoryTypes.map((type) => {
                  const isSelected = selectedStoryTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleStoryType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition ${
                        isSelected
                          ? 'bg-amber-500/25 text-amber-200 border border-amber-400 shadow-sm'
                          : 'bg-[#150b2e] text-amber-200/50 border border-amber-500/20 hover:border-amber-400/40 hover:text-amber-100'
                      }`}
                    >
                      <span>{type}</span>
                      {isSelected && <X size={11} className="text-amber-400 hover:text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. GENRES (i) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                <span>GENRES</span>
                <HelpCircle size={12} className="text-amber-400/60" />
              </label>
              <div className="flex flex-wrap gap-2">
                {availableGenres.map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition ${
                        isSelected
                          ? 'bg-amber-500/25 text-amber-200 border border-amber-400 shadow-sm'
                          : 'bg-[#150b2e] text-amber-200/50 border border-amber-500/20 hover:border-amber-400/40 hover:text-amber-100'
                      }`}
                    >
                      <span>{genre}</span>
                      {isSelected && <X size={11} className="text-amber-400 hover:text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. TONE (i) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                  <span>TONE</span>
                  <HelpCircle size={12} className="text-amber-400/60" />
                </label>
                <button
                  type="button"
                  onClick={() => handleAIGenerate('tone')}
                  disabled={isGenerating === 'tone'}
                  className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition font-bold"
                >
                  <Sparkles size={11} className={isGenerating === 'tone' ? 'animate-spin' : ''} />
                  <span>Generate</span>
                </button>
              </div>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-3 bg-[#06030e] border border-amber-500/30 rounded-xl text-sm text-amber-100 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                placeholder="e.g. Emotionally charged, gritty realism, high-stakes suspense..."
              />
            </div>

            {/* 7. AUDIENCE (i) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                <span>AUDIENCE</span>
                <HelpCircle size={12} className="text-amber-400/60" />
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full p-3 bg-[#06030e] border border-amber-500/30 rounded-xl text-sm text-amber-100 focus:ring-1 focus:ring-amber-400 focus:outline-none font-mono"
              >
                {audiences.map((aud) => (
                  <option key={aud} value={aud}>
                    {aud}
                  </option>
                ))}
              </select>
            </div>

            {/* 🌟 NEXT STEP ADVANCE ACTION BAR */}
            <div className="pt-6 border-t border-amber-500/30 flex items-center justify-between flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigateToRoom?.('ideas')}
                className="px-4 py-2 rounded-xl bg-[#140b2e] hover:bg-[#1f1044] border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-2 shadow-sm"
              >
                <span>⬅️ 00: Ideas Lab</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigateToRoom?.('characters')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider transition shadow-lg shadow-amber-500/25 flex items-center gap-2"
                >
                  <Users size={14} />
                  <span>👉 Next: Characters & Cast Room 👥</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PlotRoom;
