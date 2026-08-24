"use client";

import React, { useState } from 'react';
import { StageKey } from '../../types/types';
import { Camera, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../../constants/branding';
import Room3D from './Room3D';

// 10 Bespoke 3D Stage Rooms
import { ScriptScene3D, ScriptRoomHolo } from './rooms/ScriptRoom3D';
import { StructureScene3D, StructureRoomHolo } from './rooms/StructureRoom3D';
import { PlanScene3D, PlanRoomHolo } from './rooms/PlanRoom3D';
import { PrevisScene3D, PrevisRoomHolo } from './rooms/PrevisRoom3D';
import { MotionScene3D, MotionRoomHolo } from './rooms/MotionRoom3D';
import { BoardsScene3D, BoardsRoomHolo } from './rooms/BoardsRoom3D';
import { PromptScene3D, PromptRoomHolo } from './rooms/PromptRoom3D';
import { DailiesScene3D, DailiesRoomHolo } from './rooms/DailiesRoom3D';
import { SoundScene3D, SoundRoomHolo } from './rooms/SoundRoom3D';
import { EditScene3D, EditRoomHolo } from './rooms/EditRoom3D';

export interface Interactive3DRoomProps {
  stageId: StageKey;
  roomName: string;
  projectName: string;
  shotNumber: number;
  shotTitle?: string;
  shotDescription?: string;
}

export const Interactive3DRoom: React.FC<Interactive3DRoomProps> = ({
  stageId,
  roomName,
  projectName,
  shotNumber,
  shotTitle = 'Scene 1 / Shot 1',
  shotDescription,
}) => {
  const [allowOrbit, setAllowOrbit] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-full bg-[#080512] border border-purple-900/50 rounded-2xl overflow-hidden shadow-2xl relative select-none font-sans">
      {/* Top 3D Holographic Room Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e0922]/90 backdrop-blur-md border-b border-purple-900/50 text-xs font-mono text-purple-300 flex-shrink-0 z-20">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
          <span className="text-amber-200 font-bold tracking-wide uppercase font-serif">
            3D {roomName.toUpperCase()}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-amber-300 border border-amber-500/40 font-bold">
            60 FPS SPATIAL
          </span>
          <button
            type="button"
            onClick={() => {
              setAllowOrbit((prev) => !prev);
              toast(
                allowOrbit
                  ? '🎥 CineCamera: Auto Fly-To Mode Locked'
                  : '🌐 CineCamera: Free 3D Orbit Enabled',
                { icon: allowOrbit ? '🎥' : '🌐' }
              );
            }}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono border transition ${
              allowOrbit
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                : 'bg-purple-950/60 text-purple-300 border-purple-800/40 hover:text-white'
            }`}
          >
            <Camera size={11} className={allowOrbit ? 'text-cyan-400' : 'text-purple-400'} />
            <span>{allowOrbit ? 'Orbit Mode' : 'CineFly Locked'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span>
            Shot {shotNumber}: <strong className="text-amber-300">{shotTitle}</strong>
          </span>
        </div>
      </div>

      {/* Main 3D Spatial Canvas / Workspace */}
      <div className="relative flex-grow flex flex-col items-center justify-start p-4 lg:p-6 overflow-y-auto min-h-0">
        {/* Real Three.js WebGL Soundstage 3D Lit Environment with in-scene 3D elements */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Room3D
            stageId={stageId}
            roomName={roomName}
            projectName={projectName}
            shotNumber={shotNumber}
            allowOrbit={allowOrbit}
          >
            {stageId === 'script' && <ScriptScene3D />}
            {stageId === 'structure' && <StructureScene3D />}
            {stageId === 'plan' && <PlanScene3D />}
            {stageId === 'previs' && <PrevisScene3D />}
            {stageId === 'motion' && <MotionScene3D />}
            {stageId === 'boards' && <BoardsScene3D />}
            {stageId === 'prompt' && <PromptScene3D />}
            {stageId === 'dailies' && <DailiesScene3D />}
            {(stageId === 'audio' || (stageId as string) === 'sound') && <SoundScene3D />}
            {stageId === 'edit' && <EditScene3D />}
          </Room3D>
        </div>

        {/* Proof-of-Ownership Arise Productions Watermark */}
        <div className="absolute top-3 right-3 z-20 flex items-center space-x-2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/50 shadow-xl shadow-amber-500/15 pointer-events-none">
          <div className="w-6 h-6 rounded-lg overflow-hidden bg-black border border-amber-500/60 flex-shrink-0">
            <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif tracking-wider">
              ARISE PRODUCTIONS
            </span>
            <span className="text-[8px] text-[#E2BA86] font-mono font-medium">
              © 2026 THE AI CONTENT FOUNDRY, LLC
            </span>
          </div>
        </div>

        {/* Floating Glassmorphic Holo-Panels for the 10 Bespoke Stages */}
        {stageId === 'script' && (
          <ScriptRoomHolo
            projectName={projectName}
            shotNumber={shotNumber}
            shotTitle={shotTitle}
          />
        )}
        {stageId === 'structure' && (
          <StructureRoomHolo
            projectName={projectName}
            shotNumber={shotNumber}
            shotTitle={shotTitle}
          />
        )}
        {stageId === 'plan' && (
          <PlanRoomHolo
            projectName={projectName}
            shotNumber={shotNumber}
            shotTitle={shotTitle}
          />
        )}
        {stageId === 'previs' && (
          <PrevisRoomHolo
            projectName={projectName}
            shotNumber={shotNumber}
            shotTitle={shotTitle}
          />
        )}
        {stageId === 'motion' && (
          <MotionRoomHolo
            projectName={projectName}
            shotNumber={shotNumber}
            shotTitle={shotTitle}
          />
        )}
        {stageId === 'boards' && (
          <BoardsRoomHolo
            projectName={projectName}
            shotNumber={shotNumber}
            shotTitle={shotTitle}
          />
        )}
        {stageId === 'prompt' && (
          <PromptRoomHolo
            projectName={projectName}
            shotNumber={shotNumber}
            shotTitle={shotTitle}
          />
        )}
        {stageId === 'dailies' && (
          <DailiesRoomHolo
            projectName={projectName}
            shotNumber={shotNumber}
            shotTitle={shotTitle}
          />
        )}
        {(stageId === 'audio' || (stageId as string) === 'sound') && (
          <SoundRoomHolo
            projectName={projectName}
            shotNumber={shotNumber}
            shotTitle={shotTitle}
          />
        )}
        {stageId === 'edit' && (
          <EditRoomHolo
            projectName={projectName}
            shotNumber={shotNumber}
            shotTitle={shotTitle}
          />
        )}
      </div>
    </div>
  );
};

export default Interactive3DRoom;
