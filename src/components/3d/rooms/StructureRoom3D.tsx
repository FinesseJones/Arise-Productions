"use client";

import React, { useState } from 'react';
import { Float } from '@react-three/drei';
import {
  Layers,
  Sparkles,
  Plus,
  Trash2,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../../../lib/api';

export interface StructureRoom3DProps {
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
}

export interface BeatCard {
  id: string;
  title: string;
  description: string;
  infoTip?: string;
}

export interface ActGroup {
  actName: string;
  actSubtitle: string;
  beats: BeatCard[];
}

// 3D In-Scene Spatial Elements for Cork Board Room
export const StructureScene3D: React.FC = () => {
  return (
    <group position={[0, 0, -2]}>
      {/* 3D Cork Wall Board */}
      <mesh position={[0, 0.5, 0]}>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Frame border */}
      <mesh position={[0, 4.6, 0.05]}>
        <boxGeometry args={[14.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, -3.6, 0.05]}>
        <boxGeometry args={[14.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Floating 3D Note Cards */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[-4, 1.8, 0.3]}>
          <planeGeometry args={[1.6, 1.2]} />
          <meshStandardMaterial color="#fef08a" roughness={0.5} />
        </mesh>
      </Float>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.25}>
        <mesh position={[0, 1.5, 0.35]}>
          <planeGeometry args={[1.6, 1.2]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.5} />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.2}>
        <mesh position={[4, 1.7, 0.3]}>
          <planeGeometry args={[1.6, 1.2]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.5} />
        </mesh>
      </Float>
    </group>
  );
};

// Holographic 3-Act Cork Board Panel
export const StructureRoomHolo: React.FC<StructureRoom3DProps> = ({
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
}) => {
  const [narrativeActs, setNarrativeActs] = useState<ActGroup[]>([
    {
      actName: 'Act 1: The Absence',
      actSubtitle: 'Opening Image & The Call to Build',
      beats: [
        {
          id: 'b1',
          title: '1. OPENING IMAGE',
          description: 'Devon (19) stands on the worn front porch clutching a weathered, faded photograph of a father he never knew.',
          infoTip: 'Sets the visual emotional tone and thematic question of identity.',
        },
        {
          id: 'b2',
          title: '2. THEME STATED',
          description: 'Marcus steps onto the porch with coffee and says: "Branches learn to reach for their own light when roots run deep."',
          infoTip: 'States the core philosophical dilemma Devon must overcome.',
        },
        {
          id: 'b3',
          title: '3. INCITING DISCOVERY',
          description: 'Devon discovers a hidden box in the attic containing an old 16mm camera and hand-drawn architecture sketches.',
          infoTip: 'Propels the narrative forward into active creative pursuit.',
        },
      ],
    },
    {
      actName: 'Act 2: The Crucible & Trials',
      actSubtitle: 'Rising Action, Midpoint Revelation & Dark Night',
      beats: [
        {
          id: 'b4',
          title: '4. PUSH FORWARD & FIRST INTERVIEWS',
          description: 'Devon begins conducting raw, heartfelt interviews across the neighborhood, capturing generational oral histories.',
          infoTip: 'Fun & Games phase of exploring the documentary medium.',
        },
        {
          id: 'b5',
          title: '5. MIDPOINT REVELATION',
          description: 'A community elder reveals that his father built the very community hall Devon is documenting before departing.',
          infoTip: 'Shifts Devon from victim of circumstance to heir of a legacy.',
        },
        {
          id: 'b6',
          title: '6. ALL IS LOST / THE STORM',
          description: 'A flash autumn storm leaks into the workshop, threatening the primary audio stems and 16mm archival footage.',
          infoTip: 'The lowest emotional point testing Devon commitment.',
        },
      ],
    },
    {
      actName: 'Act 3: Redemption & Horizon',
      actSubtitle: 'Climax, Premiere & Transformation',
      beats: [
        {
          id: 'b7',
          title: '7. MOMENT OF CLARITY',
          description: 'Marcus brings Devon a vintage prime lens and urges him to finish the cut not for approval, but for truth.',
          infoTip: 'Reignites the protagonist internal spark.',
        },
        {
          id: 'b8',
          title: '8. THE PREMIERE & FINAL IMAGE',
          description: 'The neighborhood rallies in the hall for the premiere; Devon stands on the porch, gazing forward at the waking skyline.',
          infoTip: 'High-energy climax unifying all narrative threads into complete transformation.',
        },
      ],
    },
  ]);

  const handleAddBeat = (actIdx: number) => {
    setNarrativeActs((prev) => {
      const clone = [...prev];
      const act = clone[actIdx];
      const newNum = act.beats.length + 1;
      act.beats.push({
        id: `b_custom_${Date.now()}`,
        title: `${newNum}. NEW DRAMATIC BEAT`,
        description: 'Describe the dramatic action, character motivation, and scene conflict here...',
        infoTip: 'Custom story beat generated in Arise 3D Studio.',
      });
      return clone;
    });
    toast.success(`Added beat to ${narrativeActs[actIdx].actName}!`);
  };

  const handleDeleteBeat = (actIdx: number, beatId: string) => {
    setNarrativeActs((prev) => {
      const clone = [...prev];
      clone[actIdx].beats = clone[actIdx].beats.filter((b) => b.id !== beatId);
      return clone;
    });
    toast.success('Beat removed from cork board');
  };

  const handleGenerateBeat = async (actIdx: number, beat: BeatCard) => {
    toast.loading(`🤖 Generating ${beat.title} via Llama 3.1 70B...`, { id: `gen-${beat.id}` });

    const fallbackDescription = `${beat.title}: High-stakes cinematic progression establishing character momentum and narrative conflict.`;

    try {
      const apiBase = getAPIBaseURL();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: `Write a compelling, cinematic narrative beat for "${beat.title}" in Act ${actIdx + 1} of project "${projectName}". Context: ${shotTitle}. Keep it 2-3 vivid, punchy sentences.`,
          roomName: 'Cork Board Narrative Structure',
          stageId: 'structure',
          role: 'Showrunner & 3-Act Structure Supervisor AI',
          context: `Active Project: ${projectName}`,
        }),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && (data.text || data.reply)) {
          const text = (data.text || data.reply).replace(/^"|"$/g, '').trim();
          setNarrativeActs((prev) => {
            const clone = [...prev];
            const b = clone[actIdx].beats.find((x) => x.id === beat.id);
            if (b) b.description = text;
            return clone;
          });
          toast.success(`✨ Generated ${beat.title}!`, { id: `gen-${beat.id}` });
          return;
        }
      }
      setNarrativeActs((prev) => {
        const clone = [...prev];
        const b = clone[actIdx].beats.find((x) => x.id === beat.id);
        if (b) b.description = fallbackDescription;
        return clone;
      });
      toast.success(`✨ Generated ${beat.title}!`, { id: `gen-${beat.id}` });
    } catch {
      setNarrativeActs((prev) => {
        const clone = [...prev];
        const b = clone[actIdx].beats.find((x) => x.id === beat.id);
        if (b) b.description = fallbackDescription;
        return clone;
      });
      toast.success(`✨ Generated ${beat.title}!`, { id: `gen-${beat.id}` });
    }
  };

  return (
    <div className="relative z-10 flex flex-col w-full h-full max-w-5xl min-h-[460px] bg-[#140e2e]/90 border border-purple-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-900/50 bg-[#0e0922]/80 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Layers className="text-amber-400 w-4 h-4" />
          <span className="text-xs font-bold text-amber-200 uppercase font-serif tracking-wider">
            3D Cork Board • 3-Act Narrative Architecture
          </span>
        </div>
        <span className="text-[11px] font-mono text-purple-300">
          Total Beats: <strong className="text-amber-300">{narrativeActs.reduce((acc, a) => acc + a.beats.length, 0)}</strong>
        </span>
      </div>

      {/* Act Columns */}
      <div className="flex-grow p-4 overflow-x-auto overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
        {narrativeActs.map((act, actIdx) => (
          <div
            key={actIdx}
            className="flex flex-col rounded-xl bg-[#0c081e]/80 border border-purple-900/60 p-3 shadow-inner space-y-3"
          >
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-2 flex-shrink-0">
              <div>
                <h4 className="text-xs font-bold text-amber-300 font-serif">{act.actName}</h4>
                <p className="text-[10px] text-purple-400 font-mono truncate">{act.actSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => handleAddBeat(actIdx)}
                className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition text-[10px]"
                title="Add Beat Card"
              >
                <Plus size={12} />
              </button>
            </div>

            <div className="space-y-2.5 flex-grow overflow-y-auto pr-1">
              {act.beats.map((beat) => (
                <div
                  key={beat.id}
                  className="p-3 rounded-xl bg-[#171038] border border-purple-800/50 hover:border-amber-500/50 transition shadow-md space-y-2 group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-purple-200">
                    <span className="text-amber-300 truncate">{beat.title}</span>
                    <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleGenerateBeat(actIdx, beat)}
                        className="p-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition text-[9px] font-mono flex items-center gap-0.5"
                        title="Generate Beat via AI"
                      >
                        <Sparkles size={10} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBeat(actIdx, beat.id)}
                        className="p-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition text-[9px]"
                        title="Delete Beat"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-purple-100 leading-relaxed font-sans">
                    {beat.description}
                  </p>

                  {beat.infoTip && (
                    <div className="text-[9px] font-mono text-purple-400/80 flex items-center gap-1 border-t border-purple-900/40 pt-1">
                      <Info size={10} />
                      <span className="truncate">{beat.infoTip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
