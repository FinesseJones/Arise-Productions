"use client";

import React from 'react';
import { ARISE_LOGO_BASE64 } from '../../constants/branding';
import { ShieldCheck } from 'lucide-react';

interface StudioWatermarkProps {
  className?: string;
  variant?: 'subtle' | 'compact' | 'prominent';
  showCopyright?: boolean;
}

export const StudioWatermark: React.FC<StudioWatermarkProps> = ({
  className = '',
  variant = 'subtle',
  showCopyright = true,
}) => {
  return (
    <div
      className={`pointer-events-none select-none z-20 flex items-center gap-2 rounded-xl backdrop-blur-md border font-mono transition-all duration-300 ${
        variant === 'compact'
          ? 'px-2 py-1 bg-black/40 border-amber-500/20 text-[9px]'
          : variant === 'prominent'
          ? 'px-3 py-1.5 bg-[#09041a]/80 border-amber-500/50 shadow-xl text-[11px]'
          : 'px-2.5 py-1 bg-[#080512]/60 border-amber-500/30 text-[10px]'
      } ${className}`}
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 12px rgba(245, 158, 11, 0.15)',
      }}
    >
      <div className="w-4 h-4 rounded-md overflow-hidden border border-amber-500/50 flex-shrink-0 bg-black">
        <img
          src={ARISE_LOGO_BASE64}
          alt="Arise Productions"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase">
            ARISE PRODUCTION
          </span>
          <ShieldCheck size={10} className="text-amber-400 opacity-80" />
        </div>
        {showCopyright && (
          <span className="text-[7.5px] text-amber-300/70 tracking-tight font-sans">
            © 2026 Arise Productions, LLC • Proprietary IP Protection
          </span>
        )}
      </div>
    </div>
  );
};

export default StudioWatermark;
