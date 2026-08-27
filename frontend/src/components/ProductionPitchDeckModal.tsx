"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Download, X, Copy, Check, Film, Users, Layers, Camera, Volume2, Palette, ShieldCheck, RefreshCw, Edit3, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';
import { ProjectStatus } from '../types/types';
import { getProjectPlot, getProjectCharacters, getProjectActs, getProjectBeats } from '../lib/projectData';

interface ProductionPitchDeckModalProps {
  projectStatus: ProjectStatus;
  onClose: () => void;
}

export const ProductionPitchDeckModal: React.FC<ProductionPitchDeckModalProps> = ({ projectStatus, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'bible' | 'beats' | 'characters' | 'technical'>('bible');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const projectId = projectStatus.projectId || 'proj-fatherless-child';
  const projectName = projectStatus.projectName || 'A Fatherless Child';
  const cleanSlug = projectName.replace(/[^a-zA-Z0-9]/g, '_');

  const defaultPlot = getProjectPlot(projectName);
  const defaultCharacters = getProjectCharacters(projectName);
  const defaultActs = getProjectActs(projectName);
  const defaultBeats = getProjectBeats(projectName);

  // Live state loaded from backend database
  const [liveBible, setLiveBible] = useState<any>({
    title: projectName,
    logline: defaultPlot.logline,
    themes: defaultPlot.themes,
    genres: defaultPlot.genres,
    tone: defaultPlot.tone,
    audience: defaultPlot.audience,
    format: 'episodic_tv',
    acts: defaultActs,
    beats: defaultBeats,
    characters: defaultCharacters,
  });

  const apiBase = typeof window !== 'undefined'
    ? (window.location.port === '5173' || window.location.port === '3000'
        ? `http://${window.location.hostname}:4000`
        : '')
    : '';

  const loadLiveBible = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/projects/story-bible?projectId=${encodeURIComponent(projectId)}`);
      const data = await res.json();
      if (data.success && data.storyBible) {
        setLiveBible({
          title: data.storyBible.title || projectName,
          logline: data.storyBible.logline || defaultPlot.logline,
          themes: data.storyBible.themes || defaultPlot.themes,
          genres: data.storyBible.genres || defaultPlot.genres,
          tone: data.storyBible.tone || defaultPlot.tone,
          audience: data.storyBible.audience || defaultPlot.audience,
          format: data.storyBible.format || 'episodic_tv',
          acts: data.storyBible.acts || defaultActs,
          beats: data.storyBible.beats || defaultBeats,
          characters: data.storyBible.characters || defaultCharacters,
          updated_at: data.storyBible.updated_at,
        });
      }
    } catch (err) {
      console.warn('[PitchDeckModal] Could not fetch live story bible:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLiveBible();
  }, [projectId]);

  const handleSaveBible = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/projects/story-bible`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          ...liveBible,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('💾 Story Bible persisted live to production database!');
        setIsEditing(false);
        setLiveBible(data.storyBible);
      } else {
        toast.error(`Failed to save: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      toast.error(`Save error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const currentCharacters = liveBible.characters && liveBible.characters.length > 0
    ? liveBible.characters
    : defaultCharacters;

  const currentActs = Array.isArray(liveBible.acts)
    ? liveBible.acts
    : [
        { act: 'Act I', title: 'The Setup & Absence', description: liveBible.logline },
        { act: 'Act II', title: 'The Crucible & Rezoning', description: 'Escalating community stakes and confrontation.' },
        { act: 'Act III', title: 'The Shared Stand', description: 'Generational breakthrough and community victory.' },
      ];

  const handleCopyText = () => {
    const pitchText = `
================================================================================
                    ARISE PRODUCTIONS • PRODUCTION PITCH BIBLE
                   © 2026 THE AI CONTENT FOUNDRY, LLC. ALL RIGHTS RESERVED.
================================================================================

TITLE: ${liveBible.title || projectName}
GENRE: ${Array.isArray(liveBible.genres) ? liveBible.genres.join(' / ') : liveBible.genres} (${liveBible.tone || 'Emotionally grounded, warm, poetic realism'})
AUDIENCE: ${liveBible.audience || 'Four-Quadrant Theatrical (PG-13)'}
FORMAT: Episodic TV / Feature (2.39:1 CinemaScope & 16:9 UHD)
STUDIO: Arise Production Studio
STATUS: Pre-Production & 3D Virtual Production Conformed

LOGLINE:
${liveBible.logline}

THEMATIC CORE:
${liveBible.themes}

--------------------------------------------------------------------------------
1. HOLLYWOOD 3-ACT BEAT SHEET SUMMARY
--------------------------------------------------------------------------------
${currentActs.map((a: any) => `${(a.act || '').toUpperCase()}: ${(a.title || '').toUpperCase()}\n${a.description || ''}`).join('\n\n')}

--------------------------------------------------------------------------------
2. PRINCIPAL CHARACTER DOSSIERS
--------------------------------------------------------------------------------
${currentCharacters.map((c: any, i: number) => `${i + 1}. ${(c.name || "Character").toUpperCase()} — ${(c.role || "Role").toUpperCase()}${c.age ? ` (Age ${c.age})` : ''}
   • Personality: ${c.personality || c.backstory || ''}
   • Archetypes: ${Array.isArray(c.archetypes) ? c.archetypes.join(', ') : (c.archetypes || 'Hero')} (${c.arcType || 'Positive Arc'})
   • IP-Adapter Token: @${(c.name || 'character').toLowerCase().replace(/[^a-z0-9]/g, '_')}_v1 (Likeness Locked)`).join('\n\n')}

--------------------------------------------------------------------------------
3. VIRTUAL PRODUCTION & TECHNICAL CONFORM SPECS
--------------------------------------------------------------------------------
• Primary Camera: Unreal Engine 5.4 CineCamera (Cooke Anamorphic /i Prime 35mm T1.8)
• Color Pipeline: ACEScc Wide Gamut with Kodak 2383 3D Film Print LUT Emulation
• Spatial Audio: Dolby Atmos 5.1 Stem Master (-24.0 LKFS Broadcast Compliant)
• Generative VFX: ComfyUI FLUX.1 Dev with ControlNet Depth V2 (Weight: 0.85)
• Editorial Conform: DaVinci Resolve 19 Multi-Track Timeline (V1/V2, A1-A4 EDL)
    `.trim();

    navigator.clipboard.writeText(pitchText);
    setCopied(true);
    toast.success('✨ Production Pitch Bible copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadBible = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `# 🎬 ARISE PRODUCTION PITCH BIBLE & PRODUCTION MANIFEST\n\n` +
      `**Project:** ${liveBible.title || projectName}\n` +
      `**Genre:** ${Array.isArray(liveBible.genres) ? liveBible.genres.join(', ') : liveBible.genres} | **Tone:** ${liveBible.tone}\n` +
      `**Studio:** Arise Productions (A product of THE AI CONTENT FOUNDRY, LLC)\n` +
      `**Copyright:** © 2026 THE AI CONTENT FOUNDRY, LLC. All Rights Reserved.\n\n` +
      `---\n\n` +
      `## 📖 Logline & Dramatic Vision\n` +
      `${liveBible.logline}\n\n` +
      `**Themes:** ${liveBible.themes}\n\n` +
      `---\n\n` +
      `## 🏛️ Hollywood 3-Act Structure\n\n` +
      currentActs.map((a: any) => `### ${a.act}: ${a.title}\n${a.description}\n`).join('\n') +
      `\n---\n\n` +
      `## 🎭 Principal Character Manifest\n\n` +
      currentCharacters.map((c: any) => `* **${c.name} (${c.role}${c.age ? `, Age ${c.age}` : ''}):** ${c.personality} • @${(c.name || 'char').toLowerCase().replace(/[^a-z0-9]/g, '_')}_v1`).join('\n') +
      `\n\n---\n\n` +
      `## 🎥 Technical & Virtual Production Conform\n` +
      `* **CineCamera:** 35mm Anamorphic Prime (T1.8) • Full-Frame 36x24mm\n` +
      `* **Color Grading:** ACEScc with Kodak 2383 33-point 3D LUT\n` +
      `* **Spatial Audio:** Dolby Atmos 5.1 (-24 LKFS Target)\n` +
      `* **Editorial NLE:** DaVinci Resolve Multi-Track XML / EDL\n`
    ], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${cleanSlug}_Master_Pitch_Bible_2026.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`📥 Downloaded ${cleanSlug}_Master_Pitch_Bible_2026.md!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="bg-[#0c0a14] border border-amber-500/50 rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl shadow-amber-500/20 overflow-hidden font-sans">
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-[#140e22] border-b border-amber-500/40 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-amber-500/70 p-0 flex items-center justify-center shadow-md">
              <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase tracking-wider font-serif">
                  {liveBible.title || projectName} — Pitch Bible & One-Pager
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE DB SYNCED
                </span>
              </div>
              <p className="text-[11px] text-[#E2BA86] font-mono">
                © 2026 Arise Production • A Product of THE AI CONTENT FOUNDRY, LLC
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer ${
                isEditing
                  ? 'bg-purple-600 text-white border-purple-400'
                  : 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 border-purple-700/50'
              }`}
              title="Edit Story Bible content directly"
            >
              <Edit3 size={13} />
              <span>{isEditing ? 'View Mode' : 'Edit Bible'}</span>
            </button>

            {isEditing && (
              <button
                onClick={handleSaveBible}
                disabled={isSaving}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition cursor-pointer shadow-md"
              >
                <Save size={13} />
                <span>{isSaving ? 'Saving...' : 'Save Live'}</span>
              </button>
            )}

            <button
              onClick={loadLiveBible}
              className="p-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
              title="Refresh from studio database"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-mono transition cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Bible'}</span>
            </button>
            <button
              onClick={handleDownloadBible}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-bold text-xs font-mono transition shadow-md cursor-pointer"
            >
              <Download size={14} />
              <span>Export MD</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 transition ml-2 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#0a0712] border-b border-purple-900/40 text-xs font-mono">
          <button
            onClick={() => setActiveView('bible')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeView === 'bible'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <FileText size={14} />
            <span>Master One-Pager</span>
          </button>

          <button
            onClick={() => setActiveView('beats')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeView === 'beats'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <Layers size={14} />
            <span>3-Act Narrative Arc</span>
          </button>

          <button
            onClick={() => setActiveView('characters')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeView === 'characters'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <Users size={14} />
            <span>Character Dossiers ({currentCharacters.length})</span>
          </button>

          <button
            onClick={() => setActiveView('technical')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeView === 'technical'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <Camera size={14} />
            <span>Virtual DP & Audio Specs</span>
          </button>
        </div>

        {/* Modal Body Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#0a0712] via-[#0e091d] to-[#0a0712]">
          {/* TAB 1: MASTER ONE-PAGER */}
          {activeView === 'bible' && (
            <div className="space-y-6">
              {/* Hero Banner Card */}
              <div className="p-6 rounded-2xl bg-[#140e2e]/90 border border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block font-bold">
                      Official Production Pitch One-Pager
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={liveBible.title}
                        onChange={(e) => setLiveBible({ ...liveBible, title: e.target.value })}
                        className="text-2xl font-black text-amber-300 bg-black/60 border border-amber-500/50 rounded-lg px-3 py-1 mt-1 w-full font-serif"
                      />
                    ) : (
                      <h3 className="text-2xl font-black text-slate-100 font-serif mt-0.5">{liveBible.title}</h3>
                    )}
                  </div>
                  <div className="text-right font-mono text-xs text-amber-300/80">
                    <p>Format: <strong>Episodic TV / 16:9 UHD Scope</strong></p>
                    <p>Target Audience: <strong>{liveBible.audience || 'Four-Quadrant Theatrical (PG-13)'}</strong></p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wider">Logline</h4>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={liveBible.logline}
                      onChange={(e) => setLiveBible({ ...liveBible, logline: e.target.value })}
                      className="w-full text-sm text-slate-200 font-serif bg-black/60 p-3 rounded-xl border border-amber-500/50 focus:border-amber-400 outline-none"
                    />
                  ) : (
                    <p className="text-sm text-slate-200 leading-relaxed font-serif italic bg-black/40 p-3.5 rounded-xl border border-purple-900/60">
                      "{liveBible.logline}"
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-black/50 border border-purple-900/50 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Genre & Tone</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={liveBible.tone}
                        onChange={(e) => setLiveBible({ ...liveBible, tone: e.target.value })}
                        className="text-xs text-slate-200 bg-black/70 border border-purple-700 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <p className="text-xs text-slate-200 font-medium">
                        {Array.isArray(liveBible.genres) ? liveBible.genres.join(', ') : liveBible.genres} • {liveBible.tone}
                      </p>
                    )}
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-purple-900/50 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Visual Language</span>
                    <p className="text-xs text-slate-200 font-medium">35mm Anamorphic • ACEScg Rec.709 Grade</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-purple-900/50 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Core Themes</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={liveBible.themes}
                        onChange={(e) => setLiveBible({ ...liveBible, themes: e.target.value })}
                        className="text-xs text-slate-200 bg-black/70 border border-purple-700 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <p className="text-xs text-slate-200 font-medium">{liveBible.themes}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Synopsis & World Outline */}
              <div className="p-6 rounded-2xl bg-[#140e2e]/90 border border-purple-900/60 space-y-3 font-mono text-xs">
                <span className="font-bold text-amber-300 uppercase tracking-wider block">Production World & Sanctuary Scope</span>
                <p className="text-purple-200/90 leading-relaxed text-xs">
                  Set in the vibrant, culturally rich East District urban community, <em>{liveBible.title}</em> follows social worker Ayanna Jackson (25) and community leader Malachi Davis (27) as they stand on the front lines against predatory municipal redevelopment. By providing a sanctuary where fatherless youth are never abandoned, the story explores the profound emotional resilience, faith, and generational healing required to preserve community roots.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: 3-ACT / NARRATIVE ARC */}
          {activeView === 'beats' && (
            <div className="space-y-4">
              {currentActs.map((act: any, idx: number) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#140e2e]/90 border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold uppercase">{act.act}: {act.title}</span>
                    <span className="text-emerald-400">Production Locked</span>
                  </div>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={act.description}
                      onChange={(e) => {
                        const nextActs = [...currentActs];
                        nextActs[idx] = { ...nextActs[idx], description: e.target.value };
                        setLiveBible({ ...liveBible, acts: nextActs });
                      }}
                      className="w-full text-xs font-mono text-purple-200 bg-black/60 p-2.5 rounded-lg border border-purple-700"
                    />
                  ) : (
                    <p className="text-xs font-mono text-purple-200/90 leading-relaxed">{act.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CHARACTER DOSSIERS */}
          {activeView === 'characters' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentCharacters.map((c: any, i: number) => (
                <div key={c.id || i} className="p-5 rounded-2xl bg-[#140e2e] border border-amber-500/40 space-y-3 font-mono text-xs shadow-xl">
                  <div className="flex items-center justify-between border-b border-purple-900/60 pb-2">
                    <span className="font-bold text-amber-300 text-sm">
                      {(c.name || "Character").toUpperCase()}{c.age ? ` (${c.age})` : ''}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      {(c.role || "Role").toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-purple-200/80 text-[11px]">
                    {c.occupation && <p><strong>Role/Occupation:</strong> {c.occupation}</p>}
                    <p><strong>Archetypes:</strong> {Array.isArray(c.archetypes) ? c.archetypes.join(', ') : c.archetypes} ({c.arcType || 'Positive Arc'})</p>
                    <p><strong>Personality:</strong> {c.personality}</p>
                    {c.backstory && <p className="text-slate-300/90 italic">"{c.backstory}"</p>}
                    <p className="text-[10px] text-amber-400/80 pt-1">
                      <strong>IP-Adapter Token:</strong> @{(c.name || 'char').toLowerCase().replace(/[^a-z0-9]/g, '_')}_v1 (Likeness Locked)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TECHNICAL CONFORM & VIRTUAL DP SPECS */}
          {activeView === 'technical' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-5 rounded-2xl bg-[#140e2e] border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Camera size={16} />
                  <span>Unreal Engine 5.4 Virtual Cinematography</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-purple-200">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-purple-900/60">
                    <span className="text-slate-400 block text-[10px]">Sensor Format</span>
                    <strong className="text-amber-300">Full Frame 36x24mm</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-purple-900/60">
                    <span className="text-slate-400 block text-[10px]">Prime Lens</span>
                    <strong className="text-amber-300">35mm Anamorphic T1.8</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-purple-900/60">
                    <span className="text-slate-400 block text-[10px]">Color Pipeline</span>
                    <strong className="text-amber-300">ACEScg / ACEScc</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-purple-900/60">
                    <span className="text-slate-400 block text-[10px]">Frame Rate</span>
                    <strong className="text-amber-300">24.00 FPS DCI</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#140e2e] border border-purple-800/60 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <Volume2 size={16} />
                  <span>Dolby Atmos 5.1 Multi-Track Stem Setup</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-purple-200/90">
                  <p>• <strong>Stem A1 (Dialogue):</strong> Center Channel isolated, denoised, and leveled at -24.0 LKFS.</p>
                  <p>• <strong>Stem A2 (Foley & Spatial):</strong> Environmental ambience, footsteps, prop textures in 5.1 bed.</p>
                  <p>• <strong>Stem A3 (Score Bed):</strong> Orchestral score with dynamic thematic Leitmotifs in stereo wide.</p>
                  <p>• <strong>Stem A4 (LFE Subwoofer):</strong> 40 Hz emotional impact pulses on narrative transitions.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionPitchDeckModal;
