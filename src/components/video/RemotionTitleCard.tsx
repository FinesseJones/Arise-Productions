"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Film, Type, Play } from 'lucide-react';

export interface RemotionTitleCardProps {
  title: string;
  episode?: string;
  characterName?: string;
  characterRole?: string;
  aspectRatio?: string;
  showSubtitle?: boolean;
  subtitleText?: string;
}

export const RemotionTitleCard: React.FC<RemotionTitleCardProps> = ({
  title = 'A Fatherless Child',
  episode = 'Episode 1: Echoes of Absence',
  characterName,
  characterRole,
  aspectRatio = '16:9',
  showSubtitle = true,
  subtitleText = '"Your story doesn\'t begin with who wasn\'t there—it begins with who you choose to be today."',
}) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 180);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const opacity = Math.min(1, frame / 30);
  const scale = 1 + (frame / 180) * 0.05;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6 overflow-hidden select-none z-30">
      {/* Top Left: Production Badge */}
      <div
        className="self-start transition-opacity duration-700 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40"
        style={{ opacity }}
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[10px] font-mono font-bold text-amber-200 tracking-wider uppercase">
          REMOTION 4K OVERLAY
        </span>
      </div>

      {/* Center: Cinematic Title & Episode Card */}
      <div
        className="flex flex-col items-center text-center space-y-2 max-w-xl transition-all duration-300"
        style={{
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif tracking-widest uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          {title}
        </h1>
        {episode && (
          <p className="text-xs sm:text-sm font-mono text-amber-200/90 tracking-wider uppercase drop-shadow">
            {episode}
          </p>
        )}

        {/* Dynamic Lower-Third Character Tag */}
        {characterName && (
          <div className="mt-2 px-4 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/50 backdrop-blur-md flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-300 font-serif">{characterName}</span>
            {characterRole && (
              <>
                <span className="text-purple-400 text-xs">•</span>
                <span className="text-[10px] font-mono text-purple-200">{characterRole}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom: Kinetic Subtitle Bar */}
      {showSubtitle && subtitleText && (
        <div
          className="self-center mb-2 px-6 py-2 rounded-2xl bg-black/80 backdrop-blur-md border border-amber-500/30 max-w-2xl text-center transition-opacity duration-500"
          style={{ opacity: Math.max(0.2, opacity) }}
        >
          <p className="text-xs sm:text-sm font-serif text-amber-300 italic tracking-wide drop-shadow">
            {subtitleText}
          </p>
        </div>
      )}
    </div>
  );
};

export default RemotionTitleCard;
