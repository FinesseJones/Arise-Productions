"use client";

import React, { useState, useEffect } from 'react';
import { Float, Text } from '@react-three/drei';
import {
  FileText,
  Sparkles,
  Users,
  Activity,
  Save,
  Download,
  Copy,
  Plus,
  Trash2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../../../lib/api';

export interface ScriptRoom3DProps {
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
}

// 3D In-Scene Spatial Elements for ScriptBreak Room
export const ScriptScene3D: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Floating Screenplay Pages in 3D Space */}
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh position={[-3.2, 0.8, -1]} rotation={[0.1, 0.4, -0.05]}>
          <planeGeometry args={[1.6, 2.2]} />
          <meshStandardMaterial
            color="#fef08a"
            roughness={0.6}
            metalness={0.1}
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.35}>
        <mesh position={[3.4, 1.2, -1.2]} rotation={[-0.1, -0.3, 0.08]}>
          <planeGeometry args={[1.4, 2.0]} />
          <meshStandardMaterial
            color="#fde047"
            roughness={0.7}
            metalness={0.1}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>

      {/* Warm Golden Script Doctor Spotlight */}
      <spotLight
        position={[0, 4, 2]}
        target-position={[0, 0, 0]}
        intensity={2.0}
        color="#fbbf24"
        angle={0.45}
        penumbra={0.7}
      />
    </group>
  );
};

// Holographic Screenplay & Narrative Studio Panel
export const ScriptRoomHolo: React.FC<ScriptRoom3DProps> = ({
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'characters' | 'pacing'>('editor');
  const cleanSlug = (projectName || 'Arise_Production').replace(/[^a-zA-Z0-9]/g, '_');
  const storageKey = `arise_script_${cleanSlug}_shot_${shotNumber}`;

  const defaultFountain = `EXT. URBAN NEIGHBORHOOD PORCH - EARLY MORNING

Golden morning light breaks through the amber trees, catching the dust motes in the brisk autumn air. A heavy silence settles over the quiet street.

DEVON (19)
(standing on the front porch, clutching an old weathered photograph)
"They always told me a tree without deep roots could never stand a storm. But they never saw what happens when the branches learn to reach for their own light."

MARCUS (40s, mentor, steps onto the porch with two steaming mugs)
"You've been carrying questions that were never yours to answer, Devon. Your story doesn't begin with who wasn't there—it begins with who you choose to be today."

DEVON
(taking a slow breath, looking out at the waking city)
"Then let's build something that lasts."

CUT TO:

INT. LIVING ROOM WORKSPACE - CONTINUOUS

Devon opens a notebook filled with hand-drawn plans and film concepts.`;

  const [screenplay, setScreenplay] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return saved;
    } catch {}
    return defaultFountain;
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setScreenplay(saved);
    } catch {}
  }, [projectName, shotNumber, storageKey]);

  const handleSave = () => {
    try {
      localStorage.setItem(storageKey, screenplay);
      toast.success('💾 Screenplay saved to studio session!');
    } catch {
      toast.error('Failed to save screenplay');
    }
  };

  const handleAIDoctor = async (promptType: string) => {
    setIsGenerating(true);
    const toastId = toast.loading(`🤖 AI Script Doctor: Generating ${promptType}...`);

    try {
      const apiBase = getAPIBaseURL();
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Given this current screenplay:\n\n${screenplay}\n\nTask: ${promptType}. Provide the formatted Fountain screenplay dialogue or scene extension. Keep it professional, cinematic, and emotionally resonant.`,
          roomName: 'ScriptBreak Writers Room',
          stageId: 'script',
          role: 'Lead Screenwriter & Script Doctor AI',
          context: `Active Project: ${projectName}, Shot ${shotNumber}: ${shotTitle}`,
        }),
      });

      const data = await res.json();
      if (data.success && (data.text || data.reply)) {
        const text = (data.text || data.reply).replace(/^"|"$/g, '').trim();
        setScreenplay((prev) => `${prev}\n\n${text}`);
        toast.success(`✨ Script updated with ${promptType}!`, { id: toastId });
      } else {
        toast.error('AI model busy. Using local script enhancement.', { id: toastId });
      }
    } catch {
      toast.error('AI connection error', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative z-10 flex flex-col w-full h-full max-w-4xl min-h-[460px] bg-[#140e2e]/90 border border-purple-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
      {/* Sub-Header Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-900/50 bg-[#0e0922]/80 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition ${
              activeTab === 'editor'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-500/30'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>Fountain Editor</span>
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition ${
              activeTab === 'characters'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-500/30'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Users size={13} />
            <span>Cast Dossiers</span>
          </button>
          <button
            onClick={() => setActiveTab('pacing')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition ${
              activeTab === 'pacing'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-500/30'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Activity size={13} />
            <span>40-Beat Arc</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="text-amber-300/90 font-bold">📄 Page 1 of 110</span>
          <span className="text-slate-400">⏱️ ~1m 15s</span>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition text-[10px] font-bold"
          >
            <Save size={11} />
            <span>Save Script</span>
          </button>
        </div>
      </div>

      {/* AI Script Doctor Toolbar */}
      {activeTab === 'editor' && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto flex-shrink-0 text-[10px] font-mono bg-purple-950/40 border-b border-purple-900/40">
          <span className="text-rose-400 font-bold flex items-center gap-1 mr-1 flex-shrink-0">
            <Sparkles size={11} className="text-amber-400 animate-spin" />
            <span>AI DOCTOR:</span>
          </span>
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleAIDoctor('Raise the emotional stakes and subtext in this dialogue')}
            className="px-2 py-0.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 rounded border border-rose-500/40 transition flex-shrink-0 font-bold disabled:opacity-50"
          >
            🔥 Raise Stakes
          </button>
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleAIDoctor('Add psychological subtext and physical actor business')}
            className="px-2 py-0.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 rounded border border-purple-500/40 transition flex-shrink-0 font-bold disabled:opacity-50"
          >
            🎭 Add Subtext
          </button>
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleAIDoctor('Format standard Hollywood scene slugline and punchy action line')}
            className="px-2 py-0.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded border border-amber-500/40 transition flex-shrink-0 font-bold disabled:opacity-50"
          >
            ⚡ Hollywood Slugline
          </button>
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleAIDoctor('Sharpen comedic or dramatic rhythm and dialogue cadences')}
            className="px-2 py-0.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 rounded border border-cyan-500/40 transition flex-shrink-0 font-bold disabled:opacity-50"
          >
            ✨ Polish Cadence
          </button>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="flex-grow p-4 overflow-y-auto min-h-0">
        {activeTab === 'editor' && (
          <textarea
            value={screenplay}
            onChange={(e) => setScreenplay(e.target.value)}
            className="w-full h-full min-h-[320px] bg-transparent text-amber-100 font-mono text-xs leading-relaxed focus:outline-none resize-none placeholder-purple-400/40 selection:bg-amber-500/30 selection:text-white"
            placeholder="Write or generate your Hollywood Fountain screenplay here..."
            spellCheck={false}
          />
        )}

        {activeTab === 'characters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-2">
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
                <h4 className="font-bold text-amber-300">DEVON (19, Protagonist)</h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">LEAD</span>
              </div>
              <p className="text-[11px] text-purple-200 leading-relaxed font-sans">
                Resilient, observant young documentarian. Longs to understand his father's disappearance without letting grief define his trajectory.
              </p>
              <div className="text-[10px] text-purple-400 space-y-0.5">
                <div><strong>Want:</strong> Uncover his lineage & neighborhood history.</div>
                <div><strong>Need:</strong> Realize he is the architect of his own destiny.</div>
                <div><strong>Voice:</strong> Introspective, quiet resolve, rising passion.</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-2">
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
                <h4 className="font-bold text-rose-300">MARCUS (40s, Mentor)</h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">MENTOR</span>
              </div>
              <p className="text-[11px] text-purple-200 leading-relaxed font-sans">
                Master craftsman and keeper of oral histories. Offers steady wisdom, tough love, and seasoned perspective to Devon.
              </p>
              <div className="text-[10px] text-purple-400 space-y-0.5">
                <div><strong>Want:</strong> Protect Devon from repeating past missteps.</div>
                <div><strong>Need:</strong> Pass down the creative mantle with trust.</div>
                <div><strong>Voice:</strong> Deep baritone, warm, grounded cadence.</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pacing' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 flex items-center justify-between">
              <div>
                <span className="text-amber-300 font-bold block">Save The Cat 40-Beat Arc Distribution</span>
                <span className="text-[10px] text-purple-400">Current Scene: Beat #1 (Opening Image & Inciting Clues)</span>
              </div>
              <span className="text-xs text-emerald-400 font-bold">100% Locked</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-black/40 border border-purple-900/50">
                <div className="text-amber-400 font-bold">ACT 1: SETUP</div>
                <div className="text-purple-300 mt-1">Opening Image → Catalyst → Debate → Break into Two</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-purple-900/50">
                <div className="text-rose-400 font-bold">ACT 2: TRIALS</div>
                <div className="text-purple-300 mt-1">B Story → Midpoint Stakes → Dark Night → Climax Turn</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-purple-900/50">
                <div className="text-purple-300 font-bold">ACT 3: HORIZON</div>
                <div className="text-purple-300 mt-1">Gathering Team → Final Battle → Complete Transformation</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
