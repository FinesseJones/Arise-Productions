"use client";

import React, { useState } from 'react';
import ShellLayout from './components/ShellLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { Plus, Link2, Film, Smartphone, Tv, Sparkles, Play, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from './constants/branding';
import { getAPIBaseURL } from './lib/api';

const App: React.FC = () => {
  const apiBase = getAPIBaseURL();
  const [projectName, setProjectName] = useState<string>(() => {
    return localStorage.getItem('arise_last_project_name') || 'A Fatherless Child';
  });
  const [projectId, setProjectId] = useState<string>(() => {
    return localStorage.getItem('arise_last_project_id') || 'proj-fatherless-child';
  });
  const [activeStageId, setActiveStageId] = useState<string | null>(() => {
    return localStorage.getItem('arise_last_stage_id') || 'script';
  });
  const [isProjectSelected, setIsProjectSelected] = useState<boolean>(() => {
    return localStorage.getItem('arise_session_active') === 'true';
  });
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [availableProjects, setAvailableProjects] = useState<Array<{ id: string; name: string; format?: string; genre?: string; description?: string }>>([
    {
      id: 'proj-fatherless-child',
      name: 'A Fatherless Child',
      format: 'long_form',
      genre: 'Emotional Family Drama',
      description: 'Devon grapples with identity and legacy after discovering his late father’s unprocessed 16mm reels.',
    },
    {
      id: 'proj-vicious-cycle',
      name: 'Vicious Cycle',
      format: 'long_form',
      genre: 'Urban Crime Thriller',
      description: 'A streetwise detective breaks rules to dismantle a syndicate before time runs out.',
    },
    {
      id: 'proj-echoes-of-past',
      name: 'Echoes of the Past',
      format: 'short_form',
      genre: 'Sci-Fi Psychological Drama',
      description: 'A lone archivist restores holographic memory fragments in a flooded coastal city.',
    },
    {
      id: 'proj-shadow-protocol',
      name: 'Shadow Protocol',
      format: 'episodic_tv',
      genre: 'Espionage Political Thriller',
      description: 'Season 1 / Episode 1: Rogue cyber operatives uncover a global surveillance conspiracy.',
    },
  ]);

  // New Project Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [format, setFormat] = useState<'long_form' | 'short_form' | 'episodic_tv'>('long_form');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Sync session state & projects from backend and local cache on startup
  React.useEffect(() => {
    try {
      const localSaved = localStorage.getItem('arise_all_user_projects');
      if (localSaved) {
        const parsed = JSON.parse(localSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAvailableProjects((prev) => {
            const map = new Map();
            prev.forEach((p) => map.set(p.id, p));
            parsed.forEach((p) => map.set(p.id, p));
            return Array.from(map.values());
          });
        }
      }
    } catch {}

    fetch(`${apiBase}/api/v1/projects`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          setAvailableProjects((prev) => {
            const map = new Map();
            prev.forEach((p) => map.set(p.id, p));
            data.projects.forEach((p: any) => {
              if (p && p.id) {
                const existing = map.get(p.id) || {};
                map.set(p.id, { ...existing, ...p });
              }
            });
            const merged = Array.from(map.values());
            try {
              localStorage.setItem('arise_all_user_projects', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {});

    fetch(`${apiBase}/api/v1/session/state`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.sessionState) {
          const { lastActiveProjectId, lastActiveStageId } = data.sessionState;
          if (lastActiveProjectId && !localStorage.getItem('arise_last_project_id')) {
            setProjectId(lastActiveProjectId);
          }
          if (lastActiveStageId && !localStorage.getItem('arise_last_stage_id')) {
            setActiveStageId(lastActiveStageId);
          }
        }
      })
      .catch(() => {});
  }, [apiBase]);

  // Save session state whenever user switches projects or stages
  const handleStageSelect = (stageId: string) => {
    setActiveStageId(stageId);
    localStorage.setItem('arise_last_stage_id', stageId);
    fetch(`${apiBase}/api/v1/session/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastActiveProjectId: projectId, lastActiveStageId: stageId }),
    }).catch(() => {});
  };

  const handleLaunchProject = (pid?: string, pname?: string) => {
    const finalId = pid || projectId;
    const finalName = pname || projectName;
    setProjectId(finalId);
    setProjectName(finalName);
    setIsProjectSelected(true);
    localStorage.setItem('arise_last_project_id', finalId);
    localStorage.setItem('arise_last_project_name', finalName);
    localStorage.setItem('arise_session_active', 'true');
    fetch(`${apiBase}/api/v1/session/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastActiveProjectId: finalId, lastActiveStageId: activeStageId }),
    }).catch(() => {});
  };

  const handleCreateNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() && !mediaUrl.trim()) {
      toast.error('Please enter a project title or a media URL.');
      return;
    }

    setIsCreating(true);
    const toastId = toast.loading('🎬 Arise Ingest Engine: Ingesting media and generating bespoke screenplay...');

    try {
      const payload: any = {
        title: newTitle.trim() || undefined,
        name: newTitle.trim() || undefined,
        format,
        mediaUrl: mediaUrl.trim() || undefined,
        sourceUrl: mediaUrl.trim() || undefined,
        sourceType: mediaUrl.trim()
          ? mediaUrl.includes('youtube') || mediaUrl.includes('youtu.be')
            ? 'youtube_link'
            : 'social_link'
          : 'scratch',
      };

      if (format === 'episodic_tv') {
        payload.season = season;
        payload.episode = episode;
      }

      const res = await fetch(`${apiBase}/api/v1/projects/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((r) => r.json());

      const created = res.success && res.project
        ? res.project
        : {
            id: `proj-${Date.now()}`,
            name: newTitle.trim() || (mediaUrl.trim() ? `YouTube Ingest: ${mediaUrl.slice(0, 24)}` : 'New Production'),
            format,
            description: mediaUrl.trim() ? `Ingested media from ${mediaUrl}` : 'Bespoke AI Production',
          };

      setAvailableProjects((prev) => {
        const updated = [created, ...prev.filter((p) => p.id !== created.id)];
        try {
          localStorage.setItem('arise_all_user_projects', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setProjectId(created.id);
      setProjectName(created.name || created.title || 'New Production');
      setIsProjectSelected(true);
      setShowCreateModal(false);
      setNewTitle('');
      setMediaUrl('');

      localStorage.setItem('arise_last_project_id', created.id);
      localStorage.setItem('arise_last_project_name', created.name || created.title || 'New Production');
      localStorage.setItem('arise_session_active', 'true');

      toast.success(`🎉 Created and launched "${created.name || created.title}"!`, { id: toastId });
    } catch {
      const fallbackName = newTitle.trim() || (mediaUrl.trim() ? `YouTube Ingest: ${mediaUrl.slice(0, 24)}` : 'New Production');
      const fallbackId = `proj-${Date.now()}`;
      const fallbackProj = { id: fallbackId, name: fallbackName, format, description: 'Bespoke Production' };

      setAvailableProjects((prev) => {
        const updated = [fallbackProj, ...prev];
        try {
          localStorage.setItem('arise_all_user_projects', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setProjectId(fallbackId);
      setProjectName(fallbackName);
      setIsProjectSelected(true);
      setShowCreateModal(false);
      toast.success(`🎉 Created "${fallbackName}" in studio session!`, { id: toastId });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ErrorBoundary fallbackTitle="Studio App Level Error Caught">
      <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col justify-between font-sans">
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

        {!isProjectSelected ? (
          <div className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-8 space-y-6 bg-[radial-gradient(ellipse_80%_60%_at_50%_25%,rgba(245,158,11,0.18),transparent_70%)] bg-[#050505] flex-grow">
            {/* Arise Productions Logo - Edge-to-Edge Hero Box */}
            <div className="flex flex-col items-center text-center space-y-3 pt-4">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/35 border-2 border-amber-500/60 bg-black flex items-center justify-center p-0 transition duration-300 hover:scale-105 hover:shadow-amber-500/50">
                <img
                  src={ARISE_LOGO_BASE64}
                  alt="Arise Productions"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] via-[#F59E0B] to-[#D97706] tracking-widest uppercase font-serif drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]">
                  ARISE PRODUCTION
                </h1>
                <p className="text-xs sm:text-sm text-[#E2BA86] font-mono tracking-widest uppercase mt-1 drop-shadow-sm font-semibold">
                  THE AI CONTENT FOUNDRY • 16-DEPARTMENT AGENTIC STUDIO
                </p>
              </div>
            </div>

            {/* Main Action Bar */}
            <div className="flex items-center justify-center gap-3 w-full max-w-4xl">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3.5 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-extrabold rounded-2xl transition shadow-xl shadow-amber-500/30 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 border border-amber-300/50 cursor-pointer"
              >
                <Plus size={16} />
                <span>Create New Production</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-3.5 bg-[#17141f] hover:bg-[#231e30] text-amber-200 border border-amber-500/40 font-bold rounded-2xl transition text-xs sm:text-sm flex items-center gap-2 font-mono cursor-pointer"
              >
                <Link2 size={16} className="text-amber-400" />
                <span>Ingest YouTube / Social Media</span>
              </button>
            </div>

            {/* List of All Productions Cards Grid */}
            <div className="w-full max-w-4xl space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
                  🎬 Active Studio Productions ({availableProjects.length})
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Select any project to enter 16-agent soundstage
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableProjects.map((proj) => {
                  const isCurrent = proj.name === projectName;
                  return (
                    <div
                      key={proj.id}
                      className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-3 ${
                        isCurrent
                          ? 'bg-[#150a2e] border-amber-400 shadow-xl shadow-amber-500/20'
                          : 'bg-[#0c0819]/90 border-amber-500/30 hover:border-amber-400/60 hover:bg-[#120826]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-black text-amber-100 truncate font-serif">
                            🎬 {proj.name}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold uppercase">
                            {proj.format === 'short_form'
                              ? '9:16 Short'
                              : proj.format === 'episodic_tv'
                              ? 'Episodic TV'
                              : 'Feature Film'}
                          </span>
                        </div>
                        {proj.genre && (
                          <p className="text-xs text-amber-400/80 font-mono font-medium">
                            {proj.genre}
                          </p>
                        )}
                        {proj.description && (
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                            {proj.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-amber-500/20">
                        <span className="text-[10px] font-mono text-purple-300/70">
                          10 Stages & 16 Agents Ready
                        </span>
                        <button
                          onClick={() => handleLaunchProject(proj.id, proj.name)}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold rounded-xl transition text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Launch Studio</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* New Production & Media Ingest Modal */}
            {showCreateModal && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-[#0c0a10] border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl shadow-amber-500/20 space-y-5">
                  <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="text-amber-400 w-5 h-5 animate-spin" />
                      <h3 className="text-lg font-bold text-amber-100 font-serif tracking-wide">
                        Create Production / Ingest Media
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="text-amber-400/80 hover:text-amber-200 text-xs font-mono px-2 py-1 rounded-lg bg-amber-500/10 cursor-pointer"
                    >
                      ✕ Cancel
                    </button>
                  </div>

                  <form onSubmit={handleCreateNewProject} className="space-y-4">
                    {/* Format Tabs */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider block">
                        Production Format
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                        <button
                          type="button"
                          onClick={() => setFormat('long_form')}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition cursor-pointer ${
                            format === 'long_form'
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                              : 'bg-[#060508] border-slate-800 text-slate-400 hover:text-amber-200'
                          }`}
                        >
                          <Film size={16} />
                          <span>Feature Film</span>
                          <span className="text-[9px] text-amber-400/70 font-normal">16:9 Long-Form</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormat('short_form')}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition cursor-pointer ${
                            format === 'short_form'
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                              : 'bg-[#060508] border-slate-800 text-slate-400 hover:text-amber-200'
                          }`}
                        >
                          <Smartphone size={16} />
                          <span>Short / Reel</span>
                          <span className="text-[9px] text-amber-400/70 font-normal">9:16 Vertical</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormat('episodic_tv')}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition cursor-pointer ${
                            format === 'episodic_tv'
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                              : 'bg-[#060508] border-slate-800 text-slate-400 hover:text-amber-200'
                          }`}
                        >
                          <Tv size={16} />
                          <span>Episodic TV</span>
                          <span className="text-[9px] text-amber-400/70 font-normal">Seasons & Eps</span>
                        </button>
                      </div>
                    </div>

                    {/* Project Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-amber-300/80">Project Title</label>
                      <input
                        type="text"
                        placeholder="e.g., Chronicles of Avalon"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#060508] border border-amber-500/40 rounded-xl text-amber-100 text-xs font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {/* Episodic Season / Episode controls */}
                    {format === 'episodic_tv' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-amber-300/80">Season #</label>
                          <input
                            type="number"
                            min={1}
                            value={season}
                            onChange={(e) => setSeason(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-[#060508] border border-amber-500/40 rounded-xl text-amber-100 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-amber-300/80">Episode #</label>
                          <input
                            type="number"
                            min={1}
                            value={episode}
                            onChange={(e) => setEpisode(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-[#060508] border border-amber-500/40 rounded-xl text-amber-100 text-xs font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* Media Ingestion URL input */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-amber-300/80 flex items-center justify-between">
                        <span>Ingest from YouTube / Social Link (Optional)</span>
                        <span className="text-[10px] text-amber-400 font-mono">Auto-extracts beats</span>
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          placeholder="https://youtube.com/watch?v=... or TikTok/Reel link"
                          value={mediaUrl}
                          onChange={(e) => setMediaUrl(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 bg-[#060508] border border-amber-500/40 rounded-xl text-amber-100 text-xs font-mono focus:border-amber-400 focus:outline-none"
                        />
                        <Link2 size={14} className="absolute left-2.5 top-3 text-amber-500/70" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isCreating}
                      className="w-full py-3.5 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-black rounded-xl transition text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 border border-amber-300/50 cursor-pointer"
                    >
                      {isCreating ? 'Processing Ingestion with Llama 3.1 70B...' : 'Generate 10-Stage Pipeline'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Copyright Footer */}
            <footer className="text-center pt-8 text-xs text-amber-400/60 space-y-1">
              <p className="text-[11px] text-[#E2BA86]">
                © 2026 Arise Production. A product of THE AI CONTENT FOUNDRY, LLC. All rights reserved.
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Supports Long-Form, Short-Form (9:16), Episodic TV, and Social Media Ingestion.
              </p>
            </footer>
          </div>
        ) : (
          <ShellLayout
            projectId={projectId}
            projectName={projectName}
            activeStage={activeStageId}
            onStageSelect={handleStageSelect}
            onChangeProject={() => setIsProjectSelected(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
