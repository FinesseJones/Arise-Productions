"use client";

import React, { useState } from 'react';
import { ProjectStatus, StageKey } from '../types/types';
import { stages } from '../types/stages';
import {
  Building2,
  Layers,
  FileText,
  Boxes,
  Camera,
  Activity,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Volume2,
  Scissors,
  ChevronRight,
  Maximize2,
  Eye,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

interface StudioArchitecturalViewProps {
  projectStatus: ProjectStatus;
  activeStageId: string | null;
  onSelectStage: (stageId: string) => void;
}

interface DepartmentWing {
  id: StageKey;
  name: string;
  roomName: string;
  wing: string;
  floor: string;
  icon: any;
  color: string;
  accentBorder: string;
  bgGradient: string;
  description: string;
  equipment: string[];
  personnel: string[];
}

const DEPARTMENTS: DepartmentWing[] = [
  {
    id: 'script',
    name: 'ScriptBreak',
    roomName: 'Writers Room & Story Vault',
    wing: 'Creative West Wing',
    floor: 'Floor 2',
    icon: FileText,
    color: 'text-amber-400',
    accentBorder: 'border-amber-500/40',
    bgGradient: 'from-amber-950/20 via-slate-900 to-slate-950',
    description: 'Screenplay breakdown, character bibles, scene headers, and dialog analysis.',
    equipment: ['Final Draft Station', 'Screenplay Parsing Engine', 'Story Bible Server'],
    personnel: ['Lead Screenwriter', 'Script Supervisor AI'],
  },
  {
    id: 'structure',
    name: 'Cork Board',
    roomName: 'Narrative Architecture Suite',
    wing: 'Creative West Wing',
    floor: 'Floor 2',
    icon: Layers,
    color: 'text-orange-400',
    accentBorder: 'border-orange-500/40',
    bgGradient: 'from-orange-950/20 via-slate-900 to-slate-950',
    description: 'Act break planning, index card sequence walls, and emotional arc mapping.',
    equipment: ['Interactive Cork Wall', 'Fountain Analyzer', 'Act Arc Simulator'],
    personnel: ['Story Editor', 'Narrative Architect AI'],
  },
  {
    id: 'plan',
    name: 'Master Canvas',
    roomName: 'Art & Asset Planning Lab',
    wing: 'Production Hub',
    floor: 'Floor 1',
    icon: Boxes,
    color: 'text-yellow-400',
    accentBorder: 'border-yellow-500/40',
    bgGradient: 'from-yellow-950/20 via-slate-900 to-slate-950',
    description: 'Master handoff packages, asset requirements, moodboards, and style continuity.',
    equipment: ['Color Palette Calibrator', 'Moodboard Matrix', 'Asset Registry Server'],
    personnel: ['Art Director', 'Asset Coordinator AI'],
  },
  {
    id: 'previs',
    name: 'Blockout 3D',
    roomName: 'Virtual Soundstage A (Previs)',
    wing: 'Stage Complex',
    floor: 'Ground Floor',
    icon: Camera,
    color: 'text-cyan-400',
    accentBorder: 'border-cyan-500/40',
    bgGradient: 'from-cyan-950/20 via-slate-900 to-slate-950',
    description: '3D spatial camera choreography, scene blocking, and Three.js/UE5 viewport pre-visualization.',
    equipment: ['Virtual Camera Rig', '60 FPS Spatial Solver', 'LED Volume Interface'],
    personnel: ['Virtual DP', 'Blockout Choreographer AI'],
  },
  {
    id: 'motion',
    name: 'Motion Previs Studio',
    roomName: 'Mocap & Tracking Volume',
    wing: 'Stage Complex',
    floor: 'Ground Floor',
    icon: Activity,
    color: 'text-blue-400',
    accentBorder: 'border-blue-500/40',
    bgGradient: 'from-blue-950/20 via-slate-900 to-slate-950',
    description: 'Optical and AI skeletal tracking, pose estimation, and camera matching.',
    equipment: ['52-Point Skeletal Solver', 'Vicon Tracking Rig', 'Optical Pose Calibrator'],
    personnel: ['Mocap Director', 'Motion Solver AI'],
  },
  {
    id: 'boards',
    name: 'Storyboard Reference Studio',
    roomName: 'Visual Concept & Animatics Lab',
    wing: 'Production Hub',
    floor: 'Floor 1',
    icon: ImageIcon,
    color: 'text-indigo-400',
    accentBorder: 'border-indigo-500/40',
    bgGradient: 'from-indigo-950/20 via-slate-900 to-slate-950',
    description: 'Shot-by-shot storyboard animatics, aspect ratio guides, and lens framing packages.',
    equipment: ['Animatic Player', 'PDF Storyboard Generator', 'Concept Descriptor GPU'],
    personnel: ['Storyboard Artist', 'Concept Generator AI'],
  },
  {
    id: 'prompt',
    name: 'Slate Prompt',
    roomName: 'Continuity & Slate Lab',
    wing: 'Tech Core',
    floor: 'Floor 2',
    icon: Sparkles,
    color: 'text-purple-400',
    accentBorder: 'border-purple-500/40',
    bgGradient: 'from-purple-950/20 via-slate-900 to-slate-950',
    description: 'Continuity-locked generative prompt packs for image, video, and audio synthesis.',
    equipment: ['Prompt Hash Validator', 'Negative Prompt Embedder', 'Seed Lock Matrix'],
    personnel: ['Prompt Engineer', 'Slate Controller AI'],
  },
  {
    id: 'dailies',
    name: 'Circle Take',
    roomName: 'Dailies Screening Room',
    wing: 'Editorial Annex',
    floor: 'Floor 1',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    accentBorder: 'border-emerald-500/40',
    bgGradient: 'from-emerald-950/20 via-slate-900 to-slate-950',
    description: 'Daily footage review, circle winner selection, quality assurance, and reshoot flagging.',
    equipment: ['4K HDR Reference Projector', 'Take Scoring Matrix', 'Reshoot Dispatcher'],
    personnel: ['Associate Producer', 'Circle Take Reviewer AI'],
  },
  {
    id: 'sound',
    name: 'Stem Studio',
    roomName: 'Audio Stem Mixing Suite',
    wing: 'Post Wing',
    floor: 'Floor 1',
    icon: Volume2,
    color: 'text-teal-400',
    accentBorder: 'border-teal-500/40',
    bgGradient: 'from-teal-950/20 via-slate-900 to-slate-950',
    description: 'Multi-track audio separation: Dialogue, Foley, Music, and SFX stems at -24 LKFS.',
    equipment: ['Dolby Atmos Stem Demuxer', 'Loudness Normalizer', 'Binaural Panner'],
    personnel: ['Sound Supervisor', 'Stem Separation AI'],
  },
  {
    id: 'edit',
    name: 'DaVinci MCP',
    roomName: 'Mastering & Finishing Suite',
    wing: 'Post Wing',
    floor: 'Floor 2',
    icon: Scissors,
    color: 'text-rose-400',
    accentBorder: 'border-rose-500/40',
    bgGradient: 'from-rose-950/20 via-slate-900 to-slate-950',
    description: 'Conform assembly, EDL generation, ACEScc color grading, and broadcast mastering.',
    equipment: ['DaVinci Resolve NLE Bridge', 'ACEScc Grade Engine', 'DCP Export Encoder'],
    personnel: ['Master Colorist', 'DaVinci Finishing AI'],
  },
];

export const StudioArchitecturalView: React.FC<StudioArchitecturalViewProps> = ({
  projectStatus,
  activeStageId,
  onSelectStage,
}) => {
  const [viewMode, setViewMode] = useState<'campus' | 'blueprint'>('campus');
  const [selectedWing, setSelectedWing] = useState<string>('All');

  // Compute status map
  const getDeptStatus = (deptId: StageKey) => {
    let complete = true;
    let inProgress = false;
    let failed = false;

    if (!projectStatus.shots || projectStatus.shots.length === 0) return '?';

    projectStatus.shots.forEach((s) => {
      const rec = s.status[deptId];
      if (rec?.statusChar === '🔴') failed = true;
      if (rec?.statusChar === '🟡') inProgress = true;
      if (rec?.statusChar !== '🟢') complete = false;
    });

    if (failed) return '🔴';
    if (complete) return '🟢';
    if (inProgress) return '🟡';
    return '⚪';
  };

  const wings = ['All', 'Creative West Wing', 'Production Hub', 'Stage Complex', 'Tech Core', 'Post Wing', 'Editorial Annex'];

  const filteredDepts = selectedWing === 'All'
    ? DEPARTMENTS
    : DEPARTMENTS.filter((d) => d.wing === selectedWing);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-6 space-y-6 select-none font-sans">
      {/* Top Architectural Campus Banner with Arise Productions Branding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-purple-900/50">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500/60 bg-black flex-shrink-0 shadow-xl shadow-amber-500/25 p-0 flex items-center justify-center">
            <img
              src="/arise_productions_logo.jpg"
              alt="Arise Productions"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] via-[#F59E0B] to-[#D97706] tracking-wider uppercase font-serif drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                ARISE PRODUCTION 3D FACILITY & CAMPUS
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40">
                10 DEPARTMENTS
              </span>
            </div>
            <p className="text-xs text-[#E2BA86] font-mono uppercase tracking-wider font-semibold">
              A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
            </p>
          </div>
        </div>

        {/* View Mode & Wing Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setViewMode('campus')}
              className={`px-3 py-1 rounded transition ${
                viewMode === 'campus' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Campus Grid
            </button>
            <button
              onClick={() => setViewMode('blueprint')}
              className={`px-3 py-1 rounded transition ${
                viewMode === 'blueprint' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Floorplan Map
            </button>
          </div>
        </div>
      </div>

      {/* Wing Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-mono text-[11px] pr-1">Wings:</span>
        {wings.map((w) => (
          <button
            key={w}
            onClick={() => setSelectedWing(w)}
            className={`px-3 py-1 rounded-full border text-[11px] transition ${
              selectedWing === w
                ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      {/* 3D Blueprint Visualization Map (When Blueprint mode active) */}
      {viewMode === 'blueprint' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              📐 Arise Production Master Facility Blueprint (Levels 1 & 2)
            </span>
            <span className="text-xs font-mono text-slate-500">Live Stage Multiplex</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* West Wing */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-amber-400 font-mono block">WEST WING: CREATIVE & STORY</span>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                <span>Room 201: Writers Room</span>
                <span>{getDeptStatus('script')}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                <span>Room 202: Cork Board Wall</span>
                <span>{getDeptStatus('structure')}</span>
              </div>
            </div>

            {/* Central Stage Complex */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-cyan-400 font-mono block">CENTER: SOUNDSTAGE COMPLEX</span>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                <span>Soundstage A: 3D Blockout</span>
                <span>{getDeptStatus('previs')}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                <span>Volume B: Mocap Stage</span>
                <span>{getDeptStatus('motion')}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                <span>Lab C: Master Canvas</span>
                <span>{getDeptStatus('plan')}</span>
              </div>
            </div>

            {/* East Wing */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-rose-400 font-mono block">EAST WING: POST & FINISHING</span>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                <span>Suite 101: Stem Audio Studio</span>
                <span>{getDeptStatus('sound')}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                <span>Suite 102: Dailies Theater</span>
                <span>{getDeptStatus('dailies')}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                <span>Suite 201: DaVinci Color Bay</span>
                <span>{getDeptStatus('edit')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10 Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredDepts.map((dept) => {
          const statusChar = getDeptStatus(dept.id);
          const isSelected = activeStageId === dept.id;

          return (
            <div
              key={dept.id}
              onClick={() => onSelectStage(dept.id)}
              className={`p-5 rounded-2xl bg-gradient-to-br ${dept.bgGradient} border transition-all duration-200 cursor-pointer shadow-lg space-y-4 hover:scale-[1.01] ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-amber-500/10'
                  : `${dept.accentBorder} hover:border-slate-600`
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${dept.color}`}>
                    <dept.icon size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block tracking-wider">
                      {dept.wing} • {dept.floor}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{dept.roomName}</span>
                    </h3>
                  </div>
                </div>

                {/* Status Dot */}
                <div className="flex items-center space-x-1.5 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
                  <span className="text-xs">{statusChar}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {dept.description}
              </p>

              {/* Equipment Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Installed Tech:</span>
                <div className="flex flex-wrap gap-1.5">
                  {dept.equipment.map((eq) => (
                    <span
                      key={eq}
                      className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 font-mono text-[10px] border border-slate-800"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
                <span className="text-slate-500">MCP: /mcp/{dept.id}</span>
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  <span>Enter Stage</span>
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudioArchitecturalView;
