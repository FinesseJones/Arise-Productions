"use client";

import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Sparkles,
  Film,
  Tv,
  Zap,
  Plus,
  Trash2,
  Rocket,
  CheckCircle2,
  History,
  Tag,
  Search,
  Filter,
  Layers,
  ArrowRight,
  RefreshCw,
  BookOpen,
  MessageSquare,
  Clock,
  Target,
  Flame,
  Diamond,
  Send,
  Sliders,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../lib/api';
import { ARISE_LOGO_BASE64 } from '../constants/branding';

export interface StoryIdea {
  id: string;
  title: string;
  format: 'short_form' | 'feature_film' | 'tv_series';
  runtimeEstimate?: string;
  logline: string;
  hook?: string;
  coreConflict?: string;
  thematicEngine?: string;
  structureBlueprint?: string;
  targetAudience?: string;
  marketComps?: string;
  status: 'concept' | 'developing' | 'greenlit' | 'in_production';
  tags?: string[];
  projectId?: string | null;
  created_at: string;
  updated_at: string;
  history?: Array<{ timestamp: string; author: string; note: string }>;
}

interface IdeaRoomProps {
  onPromoteToProject?: (projectId: string, projectName: string) => void;
  onNavigateToRoom?: (roomKey: string) => void;
}

export function IdeaRoom({ onPromoteToProject, onNavigateToRoom }: IdeaRoomProps) {
  const apiBase = getAPIBaseURL();
  const [activeFormatTab, setActiveFormatTab] = useState<'all' | 'short_form' | 'feature_film' | 'tv_series'>('all');
  const [ideas, setIdeas] = useState<StoryIdea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  // Form State for New / Editing Idea
  const [formFormat, setFormFormat] = useState<'short_form' | 'feature_film' | 'tv_series'>('feature_film');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formRuntime, setFormRuntime] = useState<string>('115 Minutes');
  const [formHook, setFormHook] = useState<string>('');
  const [formLogline, setFormLogline] = useState<string>('');
  const [formConflict, setFormConflict] = useState<string>('');
  const [formThemes, setFormThemes] = useState<string>('');
  const [formBlueprint, setFormBlueprint] = useState<string>('');
  const [formAudience, setFormAudience] = useState<string>('Adult 18+ / Prestige Cinema');
  const [formComps, setFormComps] = useState<string>('');
  const [formTags, setFormTags] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'concept' | 'developing' | 'greenlit' | 'in_production'>('concept');
  const [newNote, setNewNote] = useState<string>('');

  // AI Field Generation loading flags
  const [aiGeneratingField, setAiGeneratingField] = useState<string | null>(null);

  // In-Room Quick Chat with Orion Vance
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; text: string }>>([
    {
      role: 'assistant',
      text: "💡 **Orion Vance (IP Architect):** Welcome to the **Idea Lab & Concept Vault**! I'm here to help you incubate high-concept hooks, design season engines for episodic TV, or craft sharp proof-of-concept short films. What universe or premise are we exploring today?"
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Fetch Ideas from Backend
  const loadIdeas = async () => {
    setIsLoading(true);
    try {
      const url = activeFormatTab === 'all' ? `${apiBase}/api/v1/ideas` : `${apiBase}/api/v1/ideas?format=${activeFormatTab}`;
      const res = await fetch(url).then((r) => r.json());
      if (res && res.success && Array.isArray(res.ideas)) {
        setIdeas(res.ideas);
        if (res.ideas.length > 0 && !selectedIdeaId) {
          setSelectedIdeaId(res.ideas[0].id);
        }
      }
    } catch (e) {
      console.warn('Could not load ideas:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, [activeFormatTab, apiBase]);

  const selectedIdea = ideas.find((i) => i.id === selectedIdeaId) || ideas[0] || null;

  // Sync form when selectedIdea changes
  const handleSelectIdea = (idea: StoryIdea) => {
    setSelectedIdeaId(idea.id);
    setFormFormat(idea.format);
    setFormTitle(idea.title);
    setFormRuntime(idea.runtimeEstimate || '');
    setFormHook(idea.hook || '');
    setFormLogline(idea.logline);
    setFormConflict(idea.coreConflict || '');
    setFormThemes(idea.thematicEngine || '');
    setFormBlueprint(idea.structureBlueprint || '');
    setFormAudience(idea.targetAudience || '');
    setFormComps(idea.marketComps || '');
    setFormTags(idea.tags ? idea.tags.join(', ') : '');
    setFormStatus(idea.status);
    setNewNote('');
  };

  // Reset form for blank idea
  const handleNewBlankIdea = () => {
    setSelectedIdeaId(null);
    setFormTitle('');
    setFormHook('');
    setFormLogline('');
    setFormConflict('');
    setFormThemes('');
    setFormBlueprint('');
    setFormComps('');
    setFormTags(formFormat === 'short_form' ? 'Short Film, Festival' : formFormat === 'tv_series' ? 'TV Series, Episodic' : 'Feature Film, Theatrical');
    setFormRuntime(formFormat === 'short_form' ? '10 Minutes' : formFormat === 'tv_series' ? '8 Episodes' : '110 Minutes');
    setFormStatus('concept');
    setNewNote('Initial creative spark initiated.');
  };

  // AI Field Generator for Pitch Architect
  const handleAIGenerate = async (field: 'hook' | 'logline' | 'themes' | 'blueprint' | 'comps') => {
    setAiGeneratingField(field);
    const toastId = toast.loading(`💡 Orion Vance generating ${field.toUpperCase()}...`);

    const formatLabel = formFormat === 'short_form' ? 'Short-Form Film (5-15 min)' : formFormat === 'tv_series' ? 'Episodic TV Series' : 'Feature Film (3-Act)';

    try {
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are Orion Vance, Chief IP Architect at Arise Production Studio. Generate an ultra-compelling, high-concept ${field.toUpperCase()} tailored specifically for a ${formatLabel}. Return ONLY the concise text result with high cinematic authority.`
            },
            {
              role: 'user',
              content: `Title: ${formTitle || 'Untitled Concept'}\nFormat: ${formatLabel}\nCurrent Logline: ${formLogline}\nCurrent Hook: ${formHook}\nConflict: ${formConflict}\n\nTask: Generate an award-winning ${field.toUpperCase()} for this production concept.`
            }
          ]
        })
      }).then((r) => r.json());

      const reply = res?.reply || res?.message || res?.text;
      if (reply) {
        const clean = reply.replace(/["']/g, '').trim();
        if (field === 'hook') setFormHook(clean);
        if (field === 'logline') setFormLogline(clean);
        if (field === 'themes') setFormThemes(clean);
        if (field === 'blueprint') setFormBlueprint(clean);
        if (field === 'comps') setFormComps(clean);
        toast.success(`✨ Generated ${field.toUpperCase()} successfully!`, { id: toastId });
      } else {
        toast.error('Could not generate field.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error during generation.', { id: toastId });
    } finally {
      setAiGeneratingField(null);
    }
  };

  // Save Idea to Database
  const handleSaveIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formLogline.trim()) {
      toast.error('Please enter at least a Title and a Logline.');
      return;
    }

    const payload = {
      id: selectedIdeaId || undefined,
      title: formTitle.trim(),
      format: formFormat,
      runtimeEstimate: formRuntime.trim(),
      hook: formHook.trim(),
      logline: formLogline.trim(),
      coreConflict: formConflict.trim(),
      thematicEngine: formThemes.trim(),
      structureBlueprint: formBlueprint.trim(),
      targetAudience: formAudience.trim(),
      marketComps: formComps.trim(),
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
      status: formStatus,
      note: newNote.trim() || undefined,
      author: 'Creator'
    };

    try {
      const res = await fetch(`${apiBase}/api/v1/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then((r) => r.json());

      if (res && res.success && res.idea) {
        toast.success(`💾 Idea "${res.idea.title}" saved to Idea Vault!`, { icon: '💡' });
        await loadIdeas();
        setSelectedIdeaId(res.idea.id);
        setNewNote('');
      } else {
        toast.error(res?.error || 'Failed to save idea');
      }
    } catch (err) {
      toast.error('Network error saving idea');
    }
  };

  // Delete Idea
  const handleDeleteIdea = async (ideaId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete idea "${title}" from the vault?`)) return;

    try {
      const res = await fetch(`${apiBase}/api/v1/ideas/${ideaId}`, { method: 'DELETE' }).then((r) => r.json());
      if (res.success) {
        toast.success(`Idea "${title}" removed from vault.`);
        if (selectedIdeaId === ideaId) setSelectedIdeaId(null);
        await loadIdeas();
      }
    } catch (e) {
      toast.error('Error deleting idea');
    }
  };

  // Promote Idea to Active 10-Stage Project
  const handlePromoteIdea = async (ideaId: string, ideaTitle: string) => {
    const toastId = toast.loading(`🚀 Promoting "${ideaTitle}" to active 10-Stage Production...`);
    try {
      const res = await fetch(`${apiBase}/api/v1/ideas/${ideaId}/promote`, { method: 'POST' }).then((r) => r.json());
      if (res && res.success && res.project) {
        toast.success(`🎉 "${res.project.name}" is now an ACTIVE production project with 10-stage manifest!`, { id: toastId, duration: 4000 });
        await loadIdeas();
        if (onPromoteToProject) {
          onPromoteToProject(res.project.id, res.project.name);
        } else if (onNavigateToRoom) {
          onNavigateToRoom('script');
        }
      } else {
        toast.error(res?.error || 'Promotion failed', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error during project promotion', { id: toastId });
    }
  };

  // Send In-Room Chat Message
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsChatLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/v1/agents/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: 'idea_architect',
          agentName: 'Orion Vance',
          role: 'IP Architect',
          message: userText,
          systemPrompt: `You are Orion Vance, Chief IP Architect at Arise Production Studio. The user is brainstorming or refining concepts in the Idea Lab. Assist them in structuring high-concept pitches across Short-Form, Feature Films, and TV Series. Suggest concrete hooks, dramatic conflicts, and market angles.`
        })
      }).then((r) => r.json());

      if (res && res.assistantMessage && res.assistantMessage.content) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: res.assistantMessage.content }]);
      } else if (res && res.reply) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: res.reply }]);
      } else {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: "💡 I've noted that concept angle. Let me know if you want to draft a formal logline or blueprint!" }]);
      }
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: 'assistant', text: "💡 Concept noted in studio scratchpad. What should we calibrate next?" }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Filtered Ideas based on Search
  const filteredIdeas = ideas.filter((i) => {
    const matchesSearch = searchQuery === '' || 
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.logline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.tags && i.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080512] text-slate-100 overflow-hidden font-sans select-text">
      {/* Top Format Banner & Segmenter */}
      <div className="px-6 py-3 bg-[#0d0722]/95 border-b border-amber-500/30 flex items-center justify-between flex-wrap gap-3 flex-shrink-0 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-black font-black shadow-md shadow-amber-500/20">
            <Lightbulb size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#F59E0B]">
                00 IDEA LAB & IP CONCEPT VAULT
              </h2>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/40 font-mono font-bold">
                INCUBATOR ENGINE
              </span>
            </div>
            <p className="text-[10px] text-amber-200/70 font-mono">
              Cross-Format Concept Incubation • Separate Bases for Short-Form, Feature Film & TV Series
            </p>
          </div>
        </div>

        {/* Format Filter Tabs */}
        <div className="flex items-center bg-[#150a30] p-1 rounded-xl border border-amber-500/30 text-xs font-mono">
          <button
            onClick={() => setActiveFormatTab('all')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeFormatTab === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold shadow'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <span>🌟</span>
            <span>All Ideas ({ideas.length})</span>
          </button>

          <button
            onClick={() => setActiveFormatTab('short_form')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeFormatTab === 'short_form'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-extrabold shadow'
                : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <Zap size={12} />
            <span>⚡ Short Films</span>
          </button>

          <button
            onClick={() => setActiveFormatTab('feature_film')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeFormatTab === 'feature_film'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold shadow'
                : 'text-amber-300/70 hover:text-white'
            }`}
          >
            <Film size={12} />
            <span>🎬 Feature Films</span>
          </button>

          <button
            onClick={() => setActiveFormatTab('tv_series')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeFormatTab === 'tv_series'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold shadow'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Tv size={12} />
            <span>📺 TV Series</span>
          </button>
        </div>

        {/* New Blank Idea Action */}
        <button
          onClick={handleNewBlankIdea}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
        >
          <Plus size={14} />
          <span>New Pitch Concept</span>
        </button>
      </div>

      {/* Main 3-Column Studio Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Formatted Idea Vault Browser */}
        <div className="w-80 lg:w-96 border-r border-amber-500/20 bg-[#0a0518]/95 flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-3 border-b border-amber-500/20 flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-2.5 text-amber-400/60" />
              <input
                type="text"
                placeholder="Search ideas, loglines, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#140a2c] border border-amber-500/30 text-xs text-slate-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
            <button
              onClick={loadIdeas}
              title="Refresh Vault"
              className="p-1.5 rounded-lg bg-[#140a2c] border border-amber-500/30 text-amber-300 hover:text-white transition"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Ideas List Cards */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
            {filteredIdeas.length === 0 ? (
              <div className="text-center py-12 text-amber-400/40 font-mono text-xs">
                <Lightbulb size={24} className="mx-auto mb-2 opacity-40" />
                <p>No ideas found in this category.</p>
                <p className="text-[10px] mt-1 text-slate-400">Click "+ New Pitch Concept" to create one.</p>
              </div>
            ) : (
              filteredIdeas.map((idea) => {
                const isSelected = idea.id === selectedIdeaId;
                const formatColor =
                  idea.format === 'short_form'
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                    : idea.format === 'tv_series'
                    ? 'border-purple-500/50 bg-purple-950/20 text-purple-300'
                    : 'border-amber-500/50 bg-amber-950/20 text-amber-300';

                const statusBadge =
                  idea.status === 'in_production'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : idea.status === 'greenlit'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : idea.status === 'developing'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/40';

                return (
                  <div
                    key={idea.id}
                    onClick={() => handleSelectIdea(idea)}
                    className={`p-3 rounded-2xl border transition cursor-pointer select-none text-left relative overflow-hidden group ${
                      isSelected
                        ? 'border-amber-400 bg-[#1e103f] shadow-lg shadow-amber-500/10'
                        : 'border-amber-500/20 bg-[#12082b] hover:border-amber-500/50 hover:bg-[#180c38]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase border font-bold ${formatColor}`}>
                          {idea.format === 'short_form' ? '⚡ Short' : idea.format === 'tv_series' ? '📺 TV Series' : '🎬 Feature'}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase border font-semibold ${statusBadge}`}>
                          {idea.status}
                        </span>
                      </div>
                      {idea.runtimeEstimate && (
                        <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5">
                          <Clock size={10} />
                          {idea.runtimeEstimate}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition line-clamp-1">
                      {idea.title}
                    </h4>

                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 font-sans leading-relaxed">
                      {idea.logline}
                    </p>

                    {idea.tags && idea.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap mt-2">
                        {idea.tags.slice(0, 3).map((tag, tIdx) => (
                          <span key={tIdx} className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-amber-400/80 border border-white/5">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center Column: Pitch Architect & Idea Editor */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#080512] p-5 custom-scrollbar">
          <form onSubmit={handleSaveIdea} className="space-y-4 max-w-4xl mx-auto w-full">
            {/* Top Idea Actions Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1">
                  <Sliders size={13} />
                  <span>Pitch Blueprint Specification</span>
                </span>
                {selectedIdeaId && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-700/50">
                    ID: {selectedIdeaId}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedIdeaId && (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePromoteIdea(selectedIdeaId, formTitle)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
                    >
                      <Rocket size={13} />
                      <span>Promote to Production</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteIdea(selectedIdeaId, formTitle)}
                      className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 transition"
                      title="Delete Idea"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
                >
                  <CheckCircle2 size={14} />
                  <span>Save to Vault</span>
                </button>
              </div>
            </div>

            {/* Row 1: Format, Status, Runtime, Title */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#110729] p-3.5 rounded-2xl border border-amber-500/30">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-amber-300 uppercase font-bold">Category Format</label>
                <select
                  value={formFormat}
                  onChange={(e) => setFormFormat(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#1a0c3d] border border-amber-500/40 text-xs text-amber-200 font-mono focus:outline-none focus:border-amber-400"
                >
                  <option value="short_form">⚡ Short-Form Film (5-15m)</option>
                  <option value="feature_film">🎬 Feature Film (3-Act)</option>
                  <option value="tv_series">📺 TV & Episodic Series</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-amber-300 uppercase font-bold">Status Stage</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#1a0c3d] border border-amber-500/40 text-xs text-amber-200 font-mono focus:outline-none focus:border-amber-400"
                >
                  <option value="concept">💡 Initial Concept</option>
                  <option value="developing">🔥 In Development</option>
                  <option value="greenlit">💎 Greenlit by Executive</option>
                  <option value="in_production">🚀 Active In Production</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-amber-300 uppercase font-bold">Runtime / Scope</label>
                <input
                  type="text"
                  placeholder="e.g. 10 Min / 8 Episodes / 115 Min"
                  value={formRuntime}
                  onChange={(e) => setFormRuntime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#1a0c3d] border border-amber-500/40 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-amber-300 uppercase font-bold">Target Audience / Rating</label>
                <input
                  type="text"
                  placeholder="e.g. Adult 18+ / Festival Indie"
                  value={formAudience}
                  onChange={(e) => setFormAudience(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#1a0c3d] border border-amber-500/40 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="md:col-span-4 space-y-1 pt-1">
                <label className="text-[10px] font-mono text-amber-300 uppercase font-bold">Project Concept Title</label>
                <input
                  type="text"
                  placeholder="Enter High-Concept Project Title..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#1a0c3d] border border-amber-500/40 text-sm font-bold text-amber-200 placeholder-amber-400/30 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Row 2: High-Concept Hook */}
            <div className="bg-[#110729] p-3.5 rounded-2xl border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-amber-300 uppercase font-bold flex items-center gap-1.5">
                  <Flame size={12} className="text-amber-400" />
                  <span>The Irresistible Narrative Hook (What makes this irresistible?)</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleAIGenerate('hook')}
                  disabled={aiGeneratingField === 'hook'}
                  className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1 transition"
                >
                  <Sparkles size={11} className={aiGeneratingField === 'hook' ? 'animate-spin' : ''} />
                  <span>AI Spark Hook</span>
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="The core premise hook or visual catalyst that hooks the viewer in the first 60 seconds..."
                value={formHook}
                onChange={(e) => setFormHook(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0c3d] border border-amber-500/40 text-xs text-slate-100 focus:outline-none focus:border-amber-400 resize-none font-sans"
              />
            </div>

            {/* Row 3: Hollywood Logline */}
            <div className="bg-[#110729] p-3.5 rounded-2xl border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-amber-300 uppercase font-bold flex items-center gap-1.5">
                  <Target size={12} className="text-amber-400" />
                  <span>Cinematic Logline (Protagonist + Inciting Incident + Conflict + Stakes)</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleAIGenerate('logline')}
                  disabled={aiGeneratingField === 'logline'}
                  className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1 transition"
                >
                  <Sparkles size={11} className={aiGeneratingField === 'logline' ? 'animate-spin' : ''} />
                  <span>AI Refine Logline</span>
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="When [Protagonist] discovers [Inciting Incident], they must [Action/Conflict] before [High-Stakes Catastrophe]..."
                value={formLogline}
                onChange={(e) => setFormLogline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0c3d] border border-amber-500/40 text-xs text-slate-100 focus:outline-none focus:border-amber-400 resize-none font-sans"
              />
            </div>

            {/* Row 4: Two Column Thematic Engine & Blueprint */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Thematic Engine */}
              <div className="bg-[#110729] p-3.5 rounded-2xl border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-amber-300 uppercase font-bold">Thematic Engine</label>
                  <button
                    type="button"
                    onClick={() => handleAIGenerate('themes')}
                    disabled={aiGeneratingField === 'themes'}
                    className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold flex items-center gap-1 transition"
                  >
                    <Sparkles size={10} />
                    <span>AI Themes</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Core philosophical question, emotional dilemma, and universal truth..."
                  value={formThemes}
                  onChange={(e) => setFormThemes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a0c3d] border border-amber-500/40 text-xs text-slate-100 focus:outline-none focus:border-amber-400 resize-none font-sans"
                />
              </div>

              {/* Structural Blueprint / Season Engine */}
              <div className="bg-[#110729] p-3.5 rounded-2xl border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-amber-300 uppercase font-bold">
                    {formFormat === 'tv_series' ? '📺 Multi-Episode Season Arc' : formFormat === 'short_form' ? '⚡ 4-Beat Short Blueprint' : '🎬 3-Act Feature Blueprint'}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAIGenerate('blueprint')}
                    disabled={aiGeneratingField === 'blueprint'}
                    className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold flex items-center gap-1 transition"
                  >
                    <Sparkles size={10} />
                    <span>AI Blueprint</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder={
                    formFormat === 'tv_series'
                      ? 'Ep 1: Inciting Case -> Ep 4: Mid-Season Pivot -> Ep 8: Finale Revelation...'
                      : formFormat === 'short_form'
                      ? 'Beat 1: Setup -> Beat 2: Complication -> Beat 3: Climax -> Beat 4: Twist Payoff...'
                      : 'Act 1: Porch Discovery -> Act 2A: Alliance -> Act 2B: Midpoint -> Act 3: Climax...'
                  }
                  value={formBlueprint}
                  onChange={(e) => setFormBlueprint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a0c3d] border border-amber-500/40 text-xs text-slate-100 focus:outline-none focus:border-amber-400 resize-none font-sans"
                />
              </div>
            </div>

            {/* Row 5: Market Comps & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#110729] p-3.5 rounded-2xl border border-amber-500/30">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-amber-300 uppercase font-bold">Market Comparisons (Comps)</label>
                  <button
                    type="button"
                    onClick={() => handleAIGenerate('comps')}
                    disabled={aiGeneratingField === 'comps'}
                    className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold flex items-center gap-1 transition"
                  >
                    <Sparkles size={10} />
                    <span>AI Comps</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Severance x Blade Runner 2049 x Dark"
                  value={formComps}
                  onChange={(e) => setFormComps(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#1a0c3d] border border-amber-500/40 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-amber-300 uppercase font-bold">Genre & Style Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Sci-Fi, Cyberpunk, Mystery, Anamorphic"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#1a0c3d] border border-amber-500/40 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Row 6: Revision Note to Append to History */}
            <div className="bg-[#110729] p-3.5 rounded-2xl border border-amber-500/30 space-y-1.5">
              <label className="text-[10px] font-mono text-amber-300 uppercase font-bold flex items-center gap-1">
                <History size={12} />
                <span>Log Creative Revision Note (Appended to Permanent Concept History)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Calibrated the midpoint reveal after consulting with Orion Vance..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#1a0c3d] border border-amber-500/40 text-xs text-slate-100 font-sans focus:outline-none focus:border-amber-400"
              />
            </div>
          </form>

          {/* Historical Revisions Log for Selected Idea */}
          {selectedIdea && selectedIdea.history && selectedIdea.history.length > 0 && (
            <div className="mt-5 max-w-4xl mx-auto w-full bg-[#0e0722] p-4 rounded-2xl border border-purple-900/40 space-y-2">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <History size={13} />
                <span>Permanent Development History Log ({selectedIdea.history.length} Entries)</span>
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                {selectedIdea.history.map((h, hIdx) => (
                  <div key={hIdx} className="p-2 rounded-xl bg-black/40 border border-white/5 text-xs flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-purple-300 font-bold">{h.author}:</span>
                      <p className="text-slate-200">{h.note}</p>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 flex-shrink-0">
                      {new Date(h.timestamp).toLocaleDateString()} {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: In-Room Orion Vance Ideation Chat */}
        <div className="w-80 lg:w-96 border-l border-amber-500/20 bg-[#0a0518]/95 flex flex-col overflow-hidden flex-shrink-0">
          {/* Header */}
          <div className="p-3 border-b border-amber-500/20 flex items-center justify-between bg-[#0e0722]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-xs font-bold text-black shadow">
                💡
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300">Orion Vance</h4>
                <p className="text-[9px] font-mono text-slate-400">Chief IP Architect</p>
              </div>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Llama 3.3 70B
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {chatMessages.map((m, mIdx) => (
              <div
                key={mIdx}
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-500/20 text-amber-100 border border-amber-500/40 ml-4'
                    : 'bg-[#150a30] text-slate-200 border border-purple-800/40 mr-2 whitespace-pre-wrap'
                }`}
              >
                {m.text}
              </div>
            ))}
            {isChatLoading && (
              <div className="p-3 rounded-2xl bg-[#150a30] border border-purple-800/40 text-xs text-amber-300 flex items-center gap-2 font-mono animate-pulse">
                <RefreshCw size={12} className="animate-spin" />
                <span>Orion is formulating high-concept direction...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChatMessage} className="p-3 border-t border-amber-500/20 bg-[#0d0722] flex gap-2">
            <input
              type="text"
              placeholder="Ask Orion to brainstorm, critique or expand..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-[#150a30] border border-amber-500/40 text-xs text-slate-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 font-sans"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:opacity-40 text-black font-bold rounded-xl transition flex items-center justify-center flex-shrink-0"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default IdeaRoom;
