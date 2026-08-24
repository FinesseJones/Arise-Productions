"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Check,
  Crown,
  Lock,
  Layers,
  Film,
  Camera,
  Cpu,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';

interface StudioProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTrigger?: string;
}

export const StudioProUpgradeModal: React.FC<StudioProUpgradeModalProps> = ({
  isOpen,
  onClose,
  featureTrigger,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isLoadingStripe, setIsLoadingStripe] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCheckout = async (plan: string) => {
    setIsLoadingStripe(true);
    const toastId = toast.loading(`🔒 Initializing secure Stripe Checkout for ${plan}...`);

    setTimeout(() => {
      setIsLoadingStripe(false);
      toast.success(
        `👑 Welcome to Arise Studio Pro! Unlimited 405B inference, 4K rendering & UE5 link unlocked!`,
        { id: toastId, duration: 5000 }
      );
      localStorage.setItem('arise_studio_tier', 'pro');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#140e2e] via-[#0e0922] to-[#080512] border-2 border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-500/20 overflow-hidden text-slate-100 flex flex-col my-auto">
        {/* Glow Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 via-amber-400 to-rose-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-purple-950/60 hover:bg-purple-900 border border-purple-800 text-purple-300 hover:text-white transition"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-purple-900/50 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500/70 bg-black flex-shrink-0 shadow-lg shadow-amber-500/30 flex items-center justify-center">
                <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-black uppercase font-mono tracking-wider flex items-center gap-1">
                    <Crown size={12} fill="currentColor" />
                    STUDIO PRO
                  </span>
                  {featureTrigger && (
                    <span className="text-[11px] text-amber-300 font-mono">
                      Unlocked by: <strong className="text-white">{featureTrigger}</strong>
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif uppercase tracking-wide mt-1">
                  Scale Your 3D Film Production
                </h2>
                <p className="text-xs text-[#E2BA86] font-mono">
                  Unlock Meta Llama 3.1 405B, Unlimited Shots, 4K Master Exports & Real-time UE5 Sync.
                </p>
              </div>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center bg-[#0c081e] p-1 rounded-2xl border border-purple-800/60 text-xs font-mono">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  billingCycle === 'monthly'
                    ? 'bg-purple-700 text-white font-bold'
                    : 'text-purple-300/70 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold shadow-sm'
                    : 'text-purple-300/70 hover:text-white'
                }`}
              >
                <span>Annual</span>
                <span className="text-[9px] px-1 rounded bg-black/40 text-amber-300 font-black">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Grid: Starter vs Pro vs Studio Enterprise */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tier 1: Free Starter */}
            <div className="p-5 rounded-2xl bg-[#0c081e]/80 border border-purple-900/50 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-bold text-purple-400 font-mono uppercase tracking-wider block">
                  Starter Tier
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-serif">$0</span>
                  <span className="text-xs text-purple-400 font-mono">/ forever</span>
                </div>
                <p className="text-[11px] text-purple-300/70">
                  Ideal for testing single scenes and early screenwriting sketches.
                </p>

                <div className="space-y-2 pt-2 border-t border-purple-900/40 text-xs text-purple-200">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>Llama 3.1 70B & 8B inference</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>3 Shots per production manifest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>1080p preview exports</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-400/50">
                    <Lock size={12} className="flex-shrink-0" />
                    <span>No 405B Ultra reasoning</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-purple-800 text-purple-300 text-xs font-mono font-bold hover:bg-purple-950/60 transition"
              >
                Current Plan
              </button>
            </div>

            {/* Tier 2: Studio Pro (Highlighted) */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#1c1240] to-[#120a2e] border-2 border-amber-500/80 flex flex-col justify-between space-y-4 shadow-xl shadow-amber-500/15 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black text-[10px] font-mono uppercase tracking-widest shadow-md">
                MOST POPULAR
              </div>

              <div className="space-y-3 pt-1">
                <span className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider block">
                  Studio Pro Tier
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-200 font-serif">
                    {billingCycle === 'annual' ? '$79' : '$99'}
                  </span>
                  <span className="text-xs text-purple-300 font-mono">/ month</span>
                </div>
                <p className="text-[11px] text-purple-200">
                  Full industrial horsepower for commercial creators and indie directors.
                </p>

                <div className="space-y-2 pt-2 border-t border-purple-900/60 text-xs text-purple-100">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <Sparkles size={14} className="text-amber-400 flex-shrink-0" />
                    <span>Meta Llama 3.1 405B Ultra reasoning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>Unlimited Shots & 10-Stage pipelines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>4K ProRes & EXR master exports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>Unreal Engine 5 Real-Time Sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>Priority MCP Cloud Worker queue</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={isLoadingStripe}
                onClick={() => handleCheckout('Studio Pro')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider transition shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 border border-amber-300/50 disabled:opacity-50"
              >
                <span>Upgrade to Studio Pro</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Tier 3: Enterprise Studio */}
            <div className="p-5 rounded-2xl bg-[#0c081e]/80 border border-purple-900/50 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-bold text-rose-400 font-mono uppercase tracking-wider block">
                  Studio Enterprise
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-serif">$299</span>
                  <span className="text-xs text-purple-400 font-mono">/ month</span>
                </div>
                <p className="text-[11px] text-purple-300/70">
                  Custom AI fine-tunes, dedicated GPU clusters and on-premise soundstage links.
                </p>

                <div className="space-y-2 pt-2 border-t border-purple-900/40 text-xs text-purple-200">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>Custom LoRA & Character fine-tunes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>Dedicated H100 GPU cluster</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>Unlimited team seats & SSO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>Direct DaVinci Resolve & Unreal plugin</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={isLoadingStripe}
                onClick={() => handleCheckout('Studio Enterprise')}
                className="w-full py-2.5 rounded-xl border border-rose-500/50 bg-rose-500/10 text-rose-300 text-xs font-mono font-bold hover:bg-rose-500/20 transition"
              >
                Contact Enterprise
              </button>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-[11px] text-purple-400/80 font-mono pt-2 border-t border-purple-900/40">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>
              256-Bit Encrypted Payments via Stripe • Cancel anytime • 14-Day Full Production Guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioProUpgradeModal;
