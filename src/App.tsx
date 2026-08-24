"use client";

import React, { useState } from 'react';
import ShellLayout from './components/ShellLayout';
import { Toaster } from 'react-hot-toast';
import { Plus, Link2, Film, Smartphone, Tv, Sparkles, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from './constants/branding';

const App: React.FC = () => {
  const [projectName, setProjectName] = useState<string>(() => {
    return localStorage.getItem('arise_last_project_name') || 'Titanic - Found Footage';
  });
  const [projectId, setProjectId] = useState<string>(() => {
    return localStorage.getItem('arise_last_project_id') || 'proj-titanic';
  });
  const [activeStageId, setActiveStageId] = useState<string | null>(() => {
    return localStorage.getItem('arise_last_stage_id') || 'script';
  });
  const [isProjectSelected, setIsProjectSelected] = useState<boolean>(() => {
    return localStorage.getItem('arise_session_active') === 'true';
  });
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Project Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [format, setFormat] = useState<'long_form' | 'short_form' | 'episodic_tv'>('long_form');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Sync session state from backend on startup
  React.useEffect(() => {
    fetch('http://localhost:4000/api/v1/session/state')
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
  }, []);

  // Save session state whenever user switches projects or stages
  const handleStageSelect = (stageId: string) => {
    setActiveStageId(stageId);
    localStorage.setItem('arise_last_stage_id', stageId);
    fetch('http://localhost:4000/api/v1/session/state', {
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
    fetch('http://localhost:4000/api/v1/session/state', {
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
    const toastId = toast.loading('🎬 Arise Ingest Engine: Generating bespoke screenplay & 10-stage manifest...');

    try {
      const payload = {
        title: newTitle.trim() || 'Adapted Media Production',
        format,
        seasonNumber: season,
        episodeNumber: episode,
        aspectRatio: format === 'short_form' ? '9:16' : format === 'episodic_tv' ? '2.39:1' : '16:9',
        sourceType: mediaUrl ? (mediaUrl.includes('youtube') ? 'youtube_link' : 'social_link') : 'scratch',
        sourceUrl: mediaUrl.trim(),
      };

      // Call local backend endpoint or fallback gracefully
      const res = await fetch('http://localhost:4000/api/v1/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((r) => r.json()).catch(() => null);

      const titleCreated = res?.project?.name || payload.title;
      const idCreated = res?.project?.id || res?.project?.slug || `proj-${titleCreated.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      setProjectName(titleCreated);
      setProjectId(idCreated);
      setIsProjectSelected(true);
      setShowCreateModal(false);

      localStorage.setItem('arise_last_project_id', idCreated);
      localStorage.setItem('arise_last_project_name', titleCreated);
      localStorage.setItem('arise_session_active', 'true');

      toast.success(`✨ SUCCESS: Project "${titleCreated}" created with AI screenplay & shots!`, { id: toastId });
    } catch (err: any) {
      toast.error(`Ingestion error: ${err.message}`, { id: toastId });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col justify-between font-sans">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {!isProjectSelected ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-8 space-y-6 bg-[radial-gradient(ellipse_80%_60%_at_50%_25%,rgba(245,158,11,0.18),transparent_70%)] bg-[#050505] flex-grow">
          {/* Arise Productions Logo - Edge-to-Edge Hero Box */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/35 border-2 border-amber-500/60 bg-black flex items-center justify-center p-0 transition duration-300 hover:scale-105 hover:shadow-amber-500/50">
              <img
                src={ARISE_LOGO_BASE64}
                alt="Arise Productions"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] via-[#F59E0B] to-[#D97706] tracking-widest uppercase font-serif drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]">
                ARISE PRODUCTION
              </h1>
              <p className="text-xs sm:text-sm text-[#E2BA86] font-mono tracking-widest uppercase mt-1 drop-shadow-sm font-semibold">
                A PRODUCT OF THE AI CONTENT FOUNDRY, LLC
              </p>
            </div>
          </div>

          <div className="bg-[#0c0a10]/95 border border-amber-500/40 p-7 sm:p-8 shadow-2xl shadow-amber-500/15 rounded-3xl max-w-xl w-full space-y-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <h2 className="text-lg font-bold text-amber-100">
                Select Studio Production
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-mono transition shadow-sm font-bold"
              >
                <Plus size={13} />
                <span>New Production</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider">
                Active Project Manifest
              </label>
              <select
                value={projectName}
                onChange={(e) => {
                  const name = e.target.value;
                  setProjectName(name);
                  if (name.includes('Titanic')) setProjectId('proj-titanic');
                  else if (name.includes('Alien')) setProjectId('proj-alien');
                  else if (name.includes('Deep Space')) setProjectId('proj-space');
                  else setProjectId(`proj-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
                }}
                className="w-full p-3.5 bg-[#060508] border border-amber-500/40 rounded-xl text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-xs"
              >
                <option value="Titanic - Found Footage">🎬 Titanic - Found Footage (Feature Film / Long-Form)</option>
                <option value="Alien - Hive Mind">📺 Alien - Hive Mind (Episodic TV Series - S1 E1)</option>
                <option value="Deep Space Journey">📱 Deep Space Journey (Short-Form / Reel 9:16)</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleLaunchProject()}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-black rounded-xl transition shadow-xl shadow-amber-500/30 text-sm uppercase tracking-wider border border-amber-300/50"
              >
                🚀 Launch Studio
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-3.5 bg-[#17141f] hover:bg-[#231e30] text-amber-200 border border-amber-500/40 font-bold rounded-xl transition text-sm flex items-center gap-1.5 font-mono"
              >
                <Link2 size={16} className="text-amber-400" />
                <span>Ingest Media</span>
              </button>
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
                    className="text-amber-400/80 hover:text-amber-200 text-xs font-mono px-2 py-1 rounded-lg bg-amber-500/10"
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
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition ${
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
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition ${
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
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition ${
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
                    className="w-full py-3.5 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-black rounded-xl transition text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 border border-amber-300/50"
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
  );
};

export default App;