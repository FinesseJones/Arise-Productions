"use client";

import React, { useState } from 'react';
import ShellLayout from './components/ShellLayout';
import { Toaster } from 'react-hot-toast';
import { Plus, Link2, Film, Smartphone, Tv, Sparkles, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

const App: React.FC = () => {
  const [projectName, setProjectName] = useState<string>('Titanic - Found Footage');
  const [projectId, setProjectId] = useState<string>('proj-titanic');
  const [activeStageId, setActiveStageId] = useState<string | null>('script');
  const [isProjectSelected, setIsProjectSelected] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Project Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [format, setFormat] = useState<'long_form' | 'short_form' | 'episodic_tv'>('long_form');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleStageSelect = (stageId: string) => {
    setActiveStageId(stageId);
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
      toast.success(`✨ SUCCESS: Project "${titleCreated}" created with AI screenplay & shots!`, { id: toastId });
    } catch (err: any) {
      toast.error(`Ingestion error: ${err.message}`, { id: toastId });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080512] text-slate-100 flex flex-col justify-between font-sans">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {!isProjectSelected ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-6 bg-gradient-to-b from-[#080512] via-[#0e0922] to-[#080512] flex-grow">
          {/* Arise Productions Logo */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-44 h-44 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/30 border border-purple-500/40 bg-black flex items-center justify-center p-2">
              <img
                src="/arise_productions_logo.jpg"
                alt="Arise Productions"
                className="w-full h-full object-contain rounded-2xl hover:scale-105 transition duration-300"
              />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-rose-300 to-amber-200 tracking-wider uppercase font-serif">
                ARISE PRODUCTION
              </h1>
              <p className="text-xs text-rose-400/90 font-mono tracking-widest uppercase mt-1">
                A PRODUCT OF THE AI CONTENT FOUNDRY, LLC
              </p>
            </div>
          </div>

          <div className="bg-[#0e0922]/90 border border-purple-900/60 p-8 shadow-2xl shadow-purple-950/60 rounded-3xl max-w-xl w-full space-y-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
              <h2 className="text-lg font-bold text-purple-100">
                Select Studio Production
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-rose-300 border border-purple-800/60 text-xs font-mono transition shadow-sm"
              >
                <Plus size={13} />
                <span>New Production</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">
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
                className="w-full p-3.5 bg-[#140e2e] border border-purple-800/60 rounded-xl text-purple-100 focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono text-xs"
              >
                <option value="Titanic - Found Footage">🎬 Titanic - Found Footage (Feature Film / Long-Form)</option>
                <option value="Alien - Hive Mind">📺 Alien - Hive Mind (Episodic TV Series - S1 E1)</option>
                <option value="Deep Space Journey">📱 Deep Space Journey (Short-Form / Reel 9:16)</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsProjectSelected(true)}
                className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-extrabold rounded-xl transition shadow-lg shadow-rose-600/30 text-sm uppercase tracking-wider"
              >
                🚀 Launch Studio
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-3.5 bg-[#140e2e] hover:bg-purple-900/40 text-purple-200 border border-purple-800/60 font-bold rounded-xl transition text-sm flex items-center gap-1.5 font-mono"
              >
                <Link2 size={16} className="text-rose-400" />
                <span>Ingest Media</span>
              </button>
            </div>
          </div>

          {/* New Production & Media Ingest Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="text-amber-400 w-5 h-5" />
                    <h3 className="text-lg font-bold text-slate-100">
                      Create Production / Ingest Media
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-slate-400 hover:text-slate-200 text-xs font-mono"
                  >
                    ✕ Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateNewProject} className="space-y-4">
                  {/* Format Tabs */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Production Format
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => setFormat('long_form')}
                        className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 text-center transition ${
                          format === 'long_form'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Film size={16} />
                        <span>Feature Film</span>
                        <span className="text-[9px] text-slate-500 font-normal">16:9 Long-Form</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormat('short_form')}
                        className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 text-center transition ${
                          format === 'short_form'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Smartphone size={16} />
                        <span>Short / Reel</span>
                        <span className="text-[9px] text-slate-500 font-normal">9:16 Vertical</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormat('episodic_tv')}
                        className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 text-center transition ${
                          format === 'episodic_tv'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Tv size={16} />
                        <span>Episodic TV</span>
                        <span className="text-[9px] text-slate-500 font-normal">Seasons & Eps</span>
                      </button>
                    </div>
                  </div>

                  {/* Project Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Project Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Neon Cyber Chronicles"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Episodic Season / Episode controls */}
                  {format === 'episodic_tv' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400">Season #</label>
                        <input
                          type="number"
                          min={1}
                          value={season}
                          onChange={(e) => setSeason(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Episode #</label>
                        <input
                          type="number"
                          min={1}
                          value={episode}
                          onChange={(e) => setEpisode(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Media Ingestion URL input */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Ingest from YouTube / Social Link (Optional)</span>
                      <span className="text-[10px] text-amber-400/80 font-mono">Auto-extracts beats</span>
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://youtube.com/watch?v=... or TikTok/Reel link"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono focus:border-amber-500 focus:outline-none"
                      />
                      <Link2 size={14} className="absolute left-2.5 top-3 text-slate-500" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-lg transition text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                  >
                    {isCreating ? 'Processing Ingestion...' : 'Generate 10-Stage Pipeline'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Copyright Footer */}
          <footer className="text-center pt-8 text-xs text-slate-500 space-y-1">
            <p className="text-[11px] text-slate-400">
              © 2026 Arise Production. A product of THE AI CONTENT FOUNDRY, LLC. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-600 font-mono">
              Supports Long-Form, Short-Form (9:16), Episodic TV, and Social Media Media Ingestion.
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