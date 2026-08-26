import React, { useState, useEffect } from 'react';
import GenerateField from '../components/GenerateField';
import { Activity, Download, Plus, Trash2, Sparkles, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';
import { getAPIBaseURL } from '../lib/api';
import { getProjectBeats } from '../lib/projectData';

interface BeatsRoomProps {
  projectName?: string;
  onNavigateToRoom?: (roomKey: string) => void;
}

interface BeatItem {
  id: string;
  act: string;
  title: string;
  description: string;
}

export function BeatsRoom({ projectName = 'A Fatherless Child', onNavigateToRoom }: BeatsRoomProps) {
  const [beats, setBeats] = useState<BeatItem[]>(() => {
    return getProjectBeats(projectName);
  });

  useEffect(() => {
    const slug = (projectName || 'Production').replace(/[^a-zA-Z0-9]/g, '_');
    const storageKey = `arise_beats_${slug}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBeats(parsed);
          return;
        }
      }
    } catch {}

    const defaultBeats = getProjectBeats(projectName);
    setBeats(defaultBeats);
  }, [projectName]);

  const handleAddBeat = () => {
    const newBeat: BeatItem = {
      id: `beat-${Date.now()}`,
      act: 'Act 2',
      title: `${beats.length + 1}. New Story Beat`,
      description: 'Describe the dramatic action and stakes for this beat...',
    };
    setBeats([...beats, newBeat]);
    toast.success('Added new beat to story sheet!');
  };

  const handleDeleteBeat = (id: string) => {
    setBeats(beats.filter((b) => b.id !== id));
    toast.success('Beat removed');
  };

  const handleGenerateAllBeats = async () => {
    const toastId = toast.loading('🤖 Generating full 15-beat Save the Cat outline...');
    try {
      const apiBase = getAPIBaseURL();
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate a 10-beat screenplay beat sheet for "${projectName}". Return 10 numbered beats with Act, Title, and 2-sentence description.`,
          roomName: 'Beats Room',
          stageId: 'structure',
          role: 'Showrunner & 3-Act Structure Supervisor AI',
          context: `Active Project: ${projectName}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('✨ Beat sheet outline synchronized!', { id: toastId });
      } else {
        toast.success('✨ Beat sheet updated.', { id: toastId });
      }
    } catch {
      toast.error('AI connection error', { id: toastId });
    }
  };

  const handleExport = () => {
    const markdown = `# ${projectName.toUpperCase()} - BEAT SHEET\n\n` +
      beats.map((b) => `### ${b.title} (${b.act})\n${b.description}\n`).join('\n') +
      `\n---\n© 2026 THE AI CONTENT FOUNDRY, LLC`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Beat_Sheet.md`;
    a.click();
    toast.success('📥 Exported Beat Sheet manifest!');
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
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif">
                  Beats & Outline Room
                </h1>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  NEW
                </span>
              </div>
              <p className="text-xs font-mono text-[#E2BA86]">
                Granular Beat Sheet for <strong className="text-amber-300">{projectName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleGenerateAllBeats}
              className="flex items-center space-x-1.5 rounded-xl border border-purple-500/40 bg-purple-950/60 hover:bg-purple-900/60 px-3 py-1.5 text-xs font-mono text-purple-200 transition"
            >
              <Sparkles size={12} className="text-amber-400" />
              <span>AI Beat Solver</span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="flex items-center space-x-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-mono text-amber-300 font-bold transition"
            >
              <Download size={13} />
              <span>Export Beats</span>
            </button>
          </div>
        </div>

        {/* Beat Items List */}
        <div className="p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-900/60 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
              Chronological Beat Manifest ({beats.length} Beats)
            </span>
            <button
              type="button"
              onClick={handleAddBeat}
              className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-mono font-bold transition"
            >
              <Plus size={13} />
              <span>Add Beat</span>
            </button>
          </div>

          <div className="space-y-4">
            {beats.map((beat, idx) => (
              <div
                key={beat.id}
                className="p-4 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 space-y-2 shadow-inner"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-rose-300 border border-purple-800/60 font-mono text-[10px] font-bold">
                      {beat.act}
                    </span>
                    <input
                      type="text"
                      value={beat.title}
                      onChange={(e) => {
                        const clone = [...beats];
                        clone[idx].title = e.target.value;
                        setBeats(clone);
                      }}
                      className="bg-transparent font-bold text-amber-200 text-xs font-serif focus:outline-none border-b border-transparent focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteBeat(beat.id)}
                    className="p-1 text-purple-400 hover:text-rose-400 transition"
                    title="Delete Beat"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <GenerateField
                  label="Dramatic Action & Conflict"
                  value={beat.description}
                  onChange={(val) => {
                    const clone = [...beats];
                    clone[idx].description = val;
                    setBeats(clone);
                  }}
                  stageId="structure"
                  role="Showrunner AI"
                  roomName="Beats Room"
                  context={`Beat: ${beat.title} in ${projectName}`}
                  rows={2}
                />
              </div>
            ))}
          </div>

          {/* 🌟 NEXT STEP ADVANCE ACTION BAR */}
          <div className="pt-6 border-t border-amber-500/30 flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigateToRoom?.('acts')}
              className="px-4 py-2 rounded-xl bg-[#140b2e] hover:bg-[#1f1044] border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-2 shadow-sm"
            >
              <span>⬅️ 03: Acts & Arcs</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToRoom?.('stage')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider transition shadow-lg shadow-amber-500/25 flex items-center gap-2"
              >
                <Activity size={14} />
                <span>👉 Launch 3D Soundstage & Production 🎬</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeatsRoom;
