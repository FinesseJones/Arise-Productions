import React, { useState, useEffect } from 'react';
import GenerateField from '../components/GenerateField';
import {
  Activity,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Camera,
  Film,
  Sun,
  TrendingUp,
  FileText,
  Sliders,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';
import { getAPIBaseURL } from '../lib/api';
import { getProjectBeats } from '../lib/projectData';
import { exportToFountain, exportToFinalDraftFDX, ScreenplayScene } from '../lib/ScreenplayFountainExporter';

interface BeatsRoomProps {
  projectName?: string;
  onNavigateToRoom?: (roomKey: string) => void;
}

export interface BeatItem {
  id: string;
  act: string;
  title: string;
  description: string;
  tensionScore: number; // 0 to 100% dramatic tension
  cameraBlocking: string; // e.g. "24mm Crane Down to 50mm Over-Shoulder"
  lightingMood: string; // e.g. "Chiaroscuro Noir • 4:1 Key/Fill"
}

export function BeatsRoom({ projectName = 'A Fatherless Child', onNavigateToRoom }: BeatsRoomProps) {
  const [beats, setBeats] = useState<BeatItem[]>(() => {
    return (getProjectBeats(projectName) as any[]).map((b, i) => ({
      id: b.id || `beat-${i + 1}`,
      act: b.act || `Act ${Math.min(3, Math.floor(i / 3) + 1)}`,
      title: b.title || `${i + 1}. Story Beat`,
      description: b.description || '',
      tensionScore: Math.min(100, Math.max(15, Math.floor(30 + Math.sin(i * 0.7) * 45 + i * 4))),
      cameraBlocking: i === 0 ? '24mm Wide Establishing • Crane Down' : i % 2 === 0 ? '50mm Medium Tracking' : '85mm Close-Up • Shallow DOF f/1.8',
      lightingMood: i % 2 === 0 ? 'Cinematic Amber Key • Cool Rim' : 'High-Contrast Noir • 4:1 Ratio',
    }));
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedBeatIdx, setSelectedBeatIdx] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const slug = (projectName || 'Production').replace(/[^a-zA-Z0-9]/g, '_');
    const storageKey = `arise_beats_${slug}`;
    const apiBase = getAPIBaseURL();

    const fetchBeats = async () => {
      try {
        const res = await fetch(`${apiBase}/api/v1/projects/beats?projectId=${encodeURIComponent(projectName)}`);
        const data = await res.json();
        if (data && data.success && Array.isArray(data.beats) && data.beats.length > 0) {
          if (isMounted) {
            const enriched = data.beats.map((b: any, i: number) => ({
              ...b,
              tensionScore: b.tensionScore ?? Math.min(100, Math.max(15, Math.floor(30 + Math.sin(i * 0.7) * 45 + i * 4))),
              cameraBlocking: b.cameraBlocking || (i === 0 ? '24mm Wide Establishing' : '50mm Medium Tracking'),
              lightingMood: b.lightingMood || 'Cinematic Amber Key',
            }));
            setBeats(enriched);
            try {
              localStorage.setItem(storageKey, JSON.stringify(enriched));
            } catch {}
          }
          return;
        }
      } catch (err) {
        console.warn('[BeatsRoom] Server beats fetch failed, checking local cache:', err);
      }

      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const normalized = parsed.map((item: any, i: number) => ({
              id: item?.id || `beat-${i + 1}`,
              act: item?.act || 'Act 1',
              title: item?.title || `${i + 1}. Story Beat`,
              description: item?.description || '',
              tensionScore: item?.tensionScore ?? Math.min(100, Math.max(15, Math.floor(30 + Math.sin(i * 0.7) * 45 + i * 4))),
              cameraBlocking: item?.cameraBlocking || '50mm Medium Tracking',
              lightingMood: item?.lightingMood || 'Cinematic Amber Key',
            }));
            if (isMounted) setBeats(normalized);
            return;
          }
        }
      } catch {}
    };

    fetchBeats();
    return () => {
      isMounted = false;
    };
  }, [projectName]);

  const persistBeats = async (updatedBeats: BeatItem[]) => {
    const slug = (projectName || 'Production').replace(/[^a-zA-Z0-9]/g, '_');
    const storageKey = `arise_beats_${slug}`;
    const apiBase = getAPIBaseURL();

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedBeats));
    } catch {}

    try {
      await fetch(`${apiBase}/api/v1/projects/beats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: projectName, beats: updatedBeats }),
      });
    } catch (err) {
      console.warn('[BeatsRoom] Error persisting beats to server:', err);
    }
  };

  const handleAddBeat = () => {
    const newBeat: BeatItem = {
      id: `beat-${Date.now()}`,
      act: 'Act 2',
      title: `${beats.length + 1}. New Dramatic Beat`,
      description: 'Describe the dramatic turning point and stakes...',
      tensionScore: 65,
      cameraBlocking: '50mm Over-Shoulder • Dolly In',
      lightingMood: 'High-Contrast Amber Key',
    };
    const updated = [...beats, newBeat];
    setBeats(updated);
    persistBeats(updated);
    toast.success('✨ Added new beat to story matrix!');
  };

  const handleDeleteBeat = (id: string) => {
    const updated = beats.filter((b) => b.id !== id);
    setBeats(updated);
    persistBeats(updated);
    toast.success('Beat removed');
  };

  const updateBeatField = <K extends keyof BeatItem>(idx: number, field: K, val: BeatItem[K]) => {
    const clone = [...beats];
    clone[idx] = { ...clone[idx], [field]: val };
    setBeats(clone);
  };

  const handleSaveBeats = async () => {
    setIsSaving(true);
    const toastId = toast.loading('💾 Persisting 15-Beat Matrix & Camera Breakdown...');
    try {
      await persistBeats(beats);
      toast.success('✅ Beat sheet & camera breakdown persisted!', { id: toastId });
    } catch {
      toast.error('Failed to persist beats', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportFountain = () => {
    const scenes: ScreenplayScene[] = beats.map((b, i) => ({
      id: b.id,
      sceneNumber: i + 1,
      slugline: `INT. SCENE ${i + 1} - ${b.title.toUpperCase()}`,
      summary: b.description,
      actionLines: [
        b.description,
        `[CAMERA BLOCKING: ${b.cameraBlocking}]`,
        `[LIGHTING ATMOSPHERE: ${b.lightingMood} • DRAMATIC TENSION: ${b.tensionScore}%]`,
      ],
      dialogueBlocks: [
        {
          character: 'PROTAGONIST',
          text: 'We hold the line right here.',
        },
      ],
    }));

    const text = exportToFountain(scenes, {
      title: projectName || 'Arise Production',
      author: 'THE AI CONTENT FOUNDRY, LLC',
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Screenplay.fountain`;
    a.click();
    toast.success('📥 Exported Hollywood Standard Fountain Screenplay!');
  };

  const handleExportFDX = () => {
    const scenes: ScreenplayScene[] = beats.map((b, i) => ({
      id: b.id,
      sceneNumber: i + 1,
      slugline: `INT. SCENE ${i + 1} - ${b.title.toUpperCase()}`,
      summary: b.description,
      actionLines: [
        b.description,
        `[CAMERA: ${b.cameraBlocking} | LIGHTING: ${b.lightingMood}]`,
      ],
      dialogueBlocks: [],
    }));

    const xml = exportToFinalDraftFDX(scenes, {
      title: projectName || 'Arise Production',
      author: 'THE AI CONTENT FOUNDRY, LLC',
    });

    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_FinalDraft.fdx`;
    a.click();
    toast.success('📥 Exported Final Draft (.fdx) Package!');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gradient-to-b from-[#080512] via-[#0e0922] to-[#080512] text-slate-100 font-sans">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Bar */}
        <div className="p-5 rounded-2xl bg-[#140e2e]/95 border border-amber-500/30 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/60 bg-black flex-shrink-0 flex items-center justify-center shadow-md">
              <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif">
                  15-Beat Dramatic Arc & Previs Breakdown
                </h1>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  STATE-OF-THE-ART
                </span>
              </div>
              <p className="text-xs font-mono text-[#E2BA86]">
                PROJECT: <strong className="text-amber-300">{projectName}</strong> • TENSION & CAMERA BLOCKING SOLVER
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-1.5">
            <button
              type="button"
              onClick={handleSaveBeats}
              disabled={isSaving}
              className="flex items-center space-x-1.5 rounded-xl border border-emerald-500/50 bg-emerald-950/60 hover:bg-emerald-900/60 px-3 py-1.5 text-xs font-mono text-emerald-200 font-bold transition shadow-sm"
            >
              <span>{isSaving ? '💾 Saving...' : '💾 Save Matrix'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportFountain}
              className="flex items-center space-x-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-mono text-amber-300 font-bold transition"
            >
              <FileText size={13} />
              <span>Fountain (.fountain)</span>
            </button>

            <button
              type="button"
              onClick={handleExportFDX}
              className="flex items-center space-x-1.5 rounded-xl border border-purple-500/40 bg-purple-950/60 hover:bg-purple-900/60 px-3 py-1.5 text-xs font-mono text-purple-200 font-bold transition"
            >
              <Download size={13} />
              <span>Final Draft (.fdx)</span>
            </button>
          </div>
        </div>

        {/* 📈 UPGRADE: 15-BEAT DRAMATIC TENSION ARC GRAPH */}
        <div className="p-5 rounded-2xl bg-[#0d0724]/95 border border-purple-500/30 backdrop-blur-xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono text-amber-300 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} className="text-amber-400" />
              <span>Dramatic Tension & Narrative Pacing Curve</span>
            </h3>
            <span className="text-[10px] font-mono text-purple-300/80">
              Avg Tension: {(beats.reduce((acc, b) => acc + b.tensionScore, 0) / (beats.length || 1)).toFixed(0)}%
            </span>
          </div>

          {/* SVG Tension Arc */}
          <div className="w-full h-28 bg-[#060312] rounded-xl border border-purple-900/40 p-3 relative overflow-hidden flex items-end justify-between gap-1">
            {beats.map((b, idx) => {
              const isSelected = selectedBeatIdx === idx;
              const heightPct = Math.max(12, b.tensionScore);
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBeatIdx(idx)}
                  className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group"
                >
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 shadow-md shadow-amber-500/50'
                        : 'bg-gradient-to-t from-purple-900 via-purple-600 to-indigo-500 hover:from-amber-600 hover:to-amber-400'
                    }`}
                  />
                  <span className="text-[8px] font-mono text-slate-400 group-hover:text-amber-300 mt-1">
                    #{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chronological Beat Items & Camera Breakdown */}
        <div className="p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-900/60 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
              Chronological Beat Manifest & 3D Camera Breakdown ({beats.length} Beats)
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
                className={`p-4 rounded-xl border transition space-y-3 ${
                  selectedBeatIdx === idx
                    ? 'bg-[#0f0927] border-amber-400/80 shadow-lg shadow-amber-500/10'
                    : 'bg-[#0c081e]/80 border-purple-900/60 hover:border-purple-700'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-rose-300 border border-purple-800/60 font-mono text-[10px] font-bold">
                      {beat.act}
                    </span>
                    <input
                      type="text"
                      value={beat.title}
                      onChange={(e) => updateBeatField(idx, 'title', e.target.value)}
                      className="bg-transparent font-bold text-amber-200 text-sm font-serif focus:outline-none border-b border-transparent focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Tension Slider */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-300">
                      <span>Tension:</span>
                      <span className="font-bold">{beat.tensionScore}%</span>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={beat.tensionScore}
                        onChange={(e) => updateBeatField(idx, 'tensionScore', Number(e.target.value))}
                        className="w-16 accent-amber-400 cursor-pointer"
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
                </div>

                <GenerateField
                  label="Dramatic Conflict & Action"
                  value={beat.description}
                  onChange={(val) => updateBeatField(idx, 'description', val)}
                  stageId="structure"
                  role="Showrunner AI"
                  roomName="Beats Room"
                  context={`Beat: ${beat.title} in ${projectName}`}
                  rows={2}
                />

                {/* 🎥 UPGRADE: 3D CAMERA BLOCKING & LIGHTING PREVIS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-purple-900/30">
                  <div className="flex items-center gap-2 bg-[#060312] p-2 rounded-lg border border-purple-900/40">
                    <Camera size={13} className="text-amber-400 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">3D Lens & Movement</span>
                      <input
                        type="text"
                        value={beat.cameraBlocking}
                        onChange={(e) => updateBeatField(idx, 'cameraBlocking', e.target.value)}
                        className="w-full bg-transparent text-xs text-amber-100 font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#060312] p-2 rounded-lg border border-purple-900/40">
                    <Sun size={13} className="text-yellow-400 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Lighting Atmosphere</span>
                      <input
                        type="text"
                        value={beat.lightingMood}
                        onChange={(e) => updateBeatField(idx, 'lightingMood', e.target.value)}
                        className="w-full bg-transparent text-xs text-amber-100 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Action Bar */}
          <div className="pt-6 border-t border-amber-500/30 flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigateToRoom?.('acts')}
              className="px-4 py-2 rounded-xl bg-[#140b2e] hover:bg-[#1f1044] border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-2 shadow-sm"
            >
              <span>⬅️ 03: Acts & Arcs</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToRoom?.('stage')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider transition shadow-lg shadow-amber-500/25 flex items-center gap-2"
            >
              <Activity size={14} />
              <span>👉 Launch 3D Soundstage & Previs 🎬</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeatsRoom;
