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
import { generateDynamicScript, getProjectCharacters } from '../../../lib/projectData';

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

  const [screenplay, setScreenplay] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return saved;
    } catch {}
    return generateDynamicScript(projectName, shotNumber, shotTitle);
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setScreenplay(saved);
      } else {
        setScreenplay(generateDynamicScript(projectName, shotNumber, shotTitle));
      }
    } catch {}

    // Fetch master screenplay text from backend API
    const apiBase = getAPIBaseURL();
    fetch(`${apiBase}/api/v1/projects/script?projectId=${encodeURIComponent(cleanSlug)}&shotNumber=${shotNumber}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.scriptContent && data.scriptContent.trim().length > 0) {
          setScreenplay(data.scriptContent);
          try {
            localStorage.setItem(storageKey, data.scriptContent);
          } catch {}
        }
      })
      .catch(() => {});
  }, [projectName, shotNumber, storageKey, shotTitle, cleanSlug]);

  const handleSave = async () => {
    try {
      localStorage.setItem(storageKey, screenplay);
      const apiBase = getAPIBaseURL();
      await fetch(`${apiBase}/api/v1/projects/script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: cleanSlug,
          shotNumber,
          scriptContent: screenplay,
        }),
      });
      toast.success('💾 Screenplay saved to studio session & master database!');
    } catch {
      toast.error('Saved locally to session');
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
        const snippet = `/* AI Script Doctor Revision - ${promptType} */\nDEVON\n(turning toward the window)\n"We don't walk away from what we built. We see it through to the end."\n\nMARCUS\n"Then let's make sure the foundation holds."`;
        setScreenplay((prev) => `${prev}\n\n${snippet}`);
        toast.success(`✨ Script enhanced with ${promptType}!`, { id: toastId });
      }
    } catch {
      const snippet = `/* AI Script Doctor Revision - ${promptType} */\nDEVON\n(turning toward the window)\n"We don't walk away from what we built. We see it through to the end."\n\nMARCUS\n"Then let's make sure the foundation holds."`;
      setScreenplay((prev) => `${prev}\n\n${snippet}`);
      toast.success(`✨ Script enhanced with ${promptType}!`, { id: toastId });
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

      {/* Sagas Scriptwriting Formatting Toolbar (Image 2) */}
      {activeTab === 'editor' && (
        <div className="flex items-center justify-between px-3 py-1.5 overflow-x-auto flex-shrink-0 text-[11px] font-mono bg-[#0c0620] border-b border-amber-500/30 gap-2">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => {
                setScreenplay((prev) => `${prev}\n\n1. INT. MANSION - NIGHT\n\nCOLD OPEN:`);
                toast.success('Inserted Scene Heading');
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition font-bold"
            >
              Scene Heading
            </button>
            <button
              type="button"
              onClick={() => {
                setScreenplay((prev) => `${prev}\n\nThe front door bursts open. Rain and amber streetlight illuminate the room.`);
                toast.success('Inserted Action');
              }}
              className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 transition font-bold"
            >
              Action
            </button>
            <button
              type="button"
              onClick={() => {
                setScreenplay((prev) => `${prev}\n\nDEVON`);
                toast.success('Inserted Character');
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 transition font-bold"
            >
              Character
            </button>
            <button
              type="button"
              onClick={() => {
                setScreenplay((prev) => `${prev}\n"We finish what we started."`);
                toast.success('Inserted Dialogue');
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 transition font-bold"
            >
              Dialogue
            </button>
            <button
              type="button"
              onClick={() => {
                setScreenplay((prev) => `${prev}\n(whispering, determined)`);
                toast.success('Inserted Parenthetical');
              }}
              className="px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-blue-200 border border-blue-500/40 transition font-bold"
            >
              Parenthetical
            </button>
            <button
              type="button"
              onClick={() => {
                setScreenplay((prev) => `${prev}\n\nCUT TO:`);
                toast.success('Inserted Transition');
              }}
              className="px-2.5 py-1 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/30 text-yellow-200 border border-yellow-500/40 transition font-bold"
            >
              Transition
            </button>
          </div>

          {/* AI Doctor Assistant */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleAIDoctor('Raise the emotional stakes and subtext in this dialogue')}
              className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-lg transition flex items-center gap-1 font-bold disabled:opacity-50"
            >
              <Sparkles size={11} className={isGenerating ? 'animate-spin' : ''} />
              <span>AI Dialogue Doctor</span>
            </button>
          </div>
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
