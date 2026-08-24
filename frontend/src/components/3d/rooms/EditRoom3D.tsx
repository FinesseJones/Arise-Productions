"use client";

import React, { useState } from 'react';
import { Float } from '@react-three/drei';
import {
  Scissors,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  Download,
  Film,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../../../lib/api';

export interface EditRoom3DProps {
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
}

// 3D Reference Grading Monitors & Timecode Screen
export const EditScene3D: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Primary Reference Monitor */}
      <Float speed={1.0} rotationIntensity={0.06} floatIntensity={0.12}>
        <group position={[-2, 1.4, -1]} rotation={[0, 0.25, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.2, 2.0, 0.1]} />
            <meshStandardMaterial color="#09090b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[3.0, 1.8]} />
            <meshStandardMaterial color="#1e1b4b" emissive="#3b0764" emissiveIntensity={0.4} />
          </mesh>
        </group>
      </Float>

      {/* Secondary Waveform Scope Monitor */}
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.15}>
        <group position={[2, 1.4, -1]} rotation={[0, -0.25, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.2, 2.0, 0.1]} />
            <meshStandardMaterial color="#09090b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[3.0, 1.8]} />
            <meshStandardMaterial color="#030712" emissive="#065f46" emissiveIntensity={0.3} />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

// Holographic DaVinci MCP Finishing Suite Panel
export const EditRoomHolo: React.FC<EditRoom3DProps> = ({
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
}) => {
  const [selectedLut, setSelectedLut] = useState<string>('Kodak 2383 Film Print');
  const [lift, setLift] = useState<number>(0);
  const [gamma, setGamma] = useState<number>(50);
  const [gain, setGain] = useState<number>(100);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const [edlEvents] = useState([
    { id: 'e1', shot: 'Shot 01', range: '00:00:00:00 - 00:00:24:00', type: 'Cut', lut: 'Kodak 2383' },
    { id: 'e2', shot: 'Shot 02', range: '00:00:24:00 - 00:00:48:00', type: 'Dissolve (12f)', lut: 'ACEScc' },
    { id: 'e3', shot: 'Shot 03', range: '00:00:48:00 - 00:01:15:00', type: 'Cut', lut: 'Kodak 2383' },
  ]);

  const handleExportEDL = () => {
    setIsExporting(true);
    const edlContent = `TITLE: ${projectName.toUpperCase()}\nFCM: NON-DROP FRAME\n001  AX       V     C        00:00:00:00 00:00:24:00 00:00:00:00 00:00:24:00\n* FROM CLIP NAME: SHOT_01_PORCH_WIDE_24MM\n002  AX       V     C        00:00:24:00 00:00:48:00 00:00:24:00 00:00:48:00\n* FROM CLIP NAME: SHOT_02_HERO_CLOSEUP_85MM\n003  AX       V     C        00:00:48:00 00:01:15:00 00:00:48:00 00:01:15:00\n* FROM CLIP NAME: SHOT_03_OTS_MENTORSHIP_35MM`;
    
    const blob = new Blob([edlContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Editorial_Conform.edl`;
    a.click();

    setTimeout(() => {
      setIsExporting(false);
      toast.success('📥 Exported broadcast-grade DaVinci EDL conform list!');
    }, 800);
  };

  return (
    <div className="relative z-10 flex flex-col w-full h-full max-w-4xl min-h-[460px] bg-[#140e2e]/90 border border-purple-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-900/50 bg-[#0e0922]/80 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Scissors className="text-rose-400 w-4 h-4" />
          <span className="font-bold text-amber-200 uppercase font-serif tracking-wider">
            3D DaVinci MCP • Editorial & Color Suite
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-purple-400">SMPTE: 00:00:00:00 @ 24.000 FPS</span>
          <button
            type="button"
            onClick={handleExportEDL}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-xs transition shadow-md shadow-rose-500/20 active:scale-95 disabled:opacity-50"
          >
            <Download size={12} />
            <span>Export EDL</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 min-h-0">
        {/* 3-Way Lift / Gamma / Gain Color Grading Wheels */}
        <div className="p-3.5 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-amber-300 font-bold">3-Way Color Wheels & Tone Curves</span>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-purple-400">LUT:</span>
              <select
                value={selectedLut}
                onChange={(e) => setSelectedLut(e.target.value)}
                className="bg-[#140e2e] border border-purple-800/60 rounded-lg text-purple-200 text-[10px] font-mono px-2 py-0.5"
              >
                <option value="Kodak 2383 Film Print">Kodak 2383 Film Print</option>
                <option value="ACEScc Rec.709">ACEScc Rec.709</option>
                <option value="Teal & Orange Hollywood">Teal & Orange Hollywood</option>
                <option value="Bleach Bypass Gritty">Bleach Bypass Gritty</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {/* Lift Wheel */}
            <div className="p-2.5 rounded-xl bg-[#140e2e] border border-purple-900/50 flex flex-col items-center space-y-2">
              <span className="font-bold text-cyan-400">LIFT (Shadows)</span>
              <div className="w-14 h-14 rounded-full border-2 border-cyan-500/60 bg-black/40 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
              </div>
              <span className="text-[10px] text-purple-400">{lift}%</span>
            </div>

            {/* Gamma Wheel */}
            <div className="p-2.5 rounded-xl bg-[#140e2e] border border-purple-900/50 flex flex-col items-center space-y-2">
              <span className="font-bold text-amber-400">GAMMA (Midtones)</span>
              <div className="w-14 h-14 rounded-full border-2 border-amber-500/60 bg-black/40 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
              </div>
              <span className="text-[10px] text-purple-400">{gamma}%</span>
            </div>

            {/* Gain Wheel */}
            <div className="p-2.5 rounded-xl bg-[#140e2e] border border-purple-900/50 flex flex-col items-center space-y-2">
              <span className="font-bold text-rose-400">GAIN (Highlights)</span>
              <div className="w-14 h-14 rounded-full border-2 border-rose-500/60 bg-black/40 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-rose-400 shadow-sm shadow-rose-400" />
              </div>
              <span className="text-[10px] text-purple-400">{gain}%</span>
            </div>
          </div>
        </div>

        {/* Multi-Track EDL Timeline Cuts */}
        <div className="p-3.5 rounded-xl bg-[#0c081e]/80 border border-purple-900/60 space-y-2">
          <span className="text-purple-300 font-bold uppercase tracking-wider block text-[10px]">
            Conform EDL Event Cuts
          </span>
          <div className="space-y-1.5">
            {edlEvents.map((e) => (
              <div
                key={e.id}
                className="p-2.5 rounded-lg bg-[#140e2e] border border-purple-900/40 flex items-center justify-between text-[11px]"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-amber-300">{e.shot}</span>
                  <span className="text-purple-300">{e.range}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40 font-bold">
                    {e.type}
                  </span>
                  <span className="text-[10px] text-rose-400 font-bold">{e.lut}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
