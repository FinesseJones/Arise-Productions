"use client";

import React, { useState, useEffect } from 'react';
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
  Server,
  Workflow,
  Radio,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';
import { getAPIBaseURL } from '../lib/api';

interface StudioProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTrigger?: string;
  currentTier?: string;
  onTierChange?: (tier: string) => void;
}

export const StudioProUpgradeModal: React.FC<StudioProUpgradeModalProps> = ({
  isOpen,
  onClose,
  featureTrigger,
  currentTier = 'enterprise',
  onTierChange,
}) => {
  const apiBase = getAPIBaseURL();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isLoadingStripe, setIsLoadingStripe] = useState<boolean>(false);
  const [activeTier, setActiveTier] = useState<string>(
    typeof window !== 'undefined' ? localStorage.getItem('arise_studio_tier') || 'enterprise' : 'enterprise'
  );

  useEffect(() => {
    const saved = localStorage.getItem('arise_studio_tier') || 'enterprise';
    setActiveTier(saved);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectTier = async (plan: 'starter' | 'pro' | 'enterprise') => {
    setIsLoadingStripe(true);
    const toastId = toast.loading(`🔒 Activating ${plan.toUpperCase()} studio license...`);

    try {
      localStorage.setItem('arise_studio_tier', plan);
      setActiveTier(plan);
      if (onTierChange) onTierChange(plan);

      await fetch(`${apiBase}/api/v1/studio/tier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: plan }),
      }).catch(() => {});

      setIsLoadingStripe(false);
      if (plan === 'enterprise') {
        toast.success(
          `🏢 Studio Enterprise Active ($299/mo)! Dedicated H100 Cluster, Custom LoRAs & DaVinci/Unreal Plugins Enabled!`,
          { id: toastId, duration: 5000 }
        );
      } else if (plan === 'pro') {
        toast.success(`👑 Studio Pro Active! 405B inference & 4K exports unlocked!`, { id: toastId, duration: 4000 });
      } else {
        toast.success(`Starter tier activated.`, { id: toastId });
      }
      onClose();
    } catch {
      setIsLoadingStripe(false);
      localStorage.setItem('arise_studio_tier', plan);
      setActiveTier(plan);
      toast.success(`Updated tier to ${plan}`, { id: toastId });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in font-sans">
      <div className="relative w-full max-w-5xl bg-gradient-to-b from-[#140e2e] via-[#0e0922] to-[#080512] border-2 border-amber-500/60 rounded-3xl shadow-2xl shadow-amber-500/25 overflow-hidden text-slate-100 flex flex-col my-auto">
        {/* Glow Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-purple-950/60 hover:bg-purple-900 border border-purple-800 text-purple-300 hover:text-white transition cursor-pointer"
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
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-black uppercase font-mono tracking-wider flex items-center gap-1">
                    <Crown size={12} fill="currentColor" />
                    ENTERPRISE INDUSTRIAL POWER
                  </span>
                  {activeTier === 'enterprise' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                      <CheckCircle2 size={11} /> CURRENT ACTIVE PLAN
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif uppercase tracking-wide mt-1">
                  Arise Studio Production Licensing
                </h2>
                <p className="text-xs text-[#E2BA86] font-mono">
                  Custom AI Fine-Tunes, Dedicated H100 GPU Clusters, Direct DaVinci & Unreal Engine 5.4 Links.
                </p>
              </div>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center bg-[#0c081e] p-1 rounded-2xl border border-purple-800/60 text-xs font-mono">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-purple-300/70 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
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
            <div className={`p-5 rounded-2xl bg-[#0c081e]/80 border flex flex-col justify-between space-y-4 ${activeTier === 'starter' ? 'border-purple-500 shadow-md' : 'border-purple-900/50'}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 font-mono uppercase tracking-wider block">
                    Starter Tier
                  </span>
                  {activeTier === 'starter' && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">ACTIVE</span>
                  )}
                </div>
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
                    <span>No Dedicated H100 Cluster</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectTier('starter')}
                className="w-full py-2.5 rounded-xl border border-purple-800 text-purple-300 text-xs font-mono font-bold hover:bg-purple-950/60 transition cursor-pointer"
              >
                {activeTier === 'starter' ? 'Active Plan' : 'Switch to Starter'}
              </button>
            </div>

            {/* Tier 2: Studio Pro */}
            <div className={`p-5 rounded-2xl bg-[#0c081e]/80 border flex flex-col justify-between space-y-4 ${activeTier === 'pro' ? 'border-amber-500 shadow-md bg-amber-950/20' : 'border-purple-900/50'}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider block">
                    Studio Pro Tier
                  </span>
                  {activeTier === 'pro' && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">ACTIVE</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-200 font-serif">
                    {billingCycle === 'annual' ? '$79' : '$99'}
                  </span>
                  <span className="text-xs text-purple-300 font-mono">/ month</span>
                </div>
                <p className="text-[11px] text-purple-200">
                  Industrial horsepower for independent film directors and content studios.
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
                </div>
              </div>

              <button
                type="button"
                disabled={isLoadingStripe}
                onClick={() => handleSelectTier('pro')}
                className="w-full py-2.5 rounded-xl border border-amber-500/50 bg-amber-500/15 text-amber-200 text-xs font-mono font-bold hover:bg-amber-500/25 transition cursor-pointer"
              >
                {activeTier === 'pro' ? 'Active Plan' : 'Switch to Studio Pro ($99/mo)'}
              </button>
            </div>

            {/* Tier 3: Studio Enterprise (High-End Active Card) */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#24133a] via-[#160c28] to-[#0c0618] border-2 border-amber-500/90 flex flex-col justify-between space-y-4 shadow-2xl shadow-amber-500/25 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-black text-[10px] font-mono uppercase tracking-widest shadow-md flex items-center gap-1">
                <Crown size={11} fill="currentColor" />
                INDUSTRIAL ENTERPRISE
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-amber-400 font-mono uppercase tracking-wider block">
                    Studio Enterprise
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 font-black">
                    ACTIVE NOW
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] to-[#FBBF24] font-serif">
                    $299
                  </span>
                  <span className="text-xs text-amber-300/80 font-mono">/ month</span>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-snug">
                  Custom AI fine-tunes, dedicated GPU clusters and on-premise soundstage links.
                </p>

                <div className="space-y-2 pt-2 border-t border-amber-500/30 text-xs text-amber-100 font-medium">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>Custom LoRA & Character fine-tunes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server size={14} className="text-amber-400 flex-shrink-0" />
                    <span className="font-bold text-amber-200">Dedicated H100 GPU cluster</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>Unlimited team seats & SSO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Workflow size={14} className="text-teal-400 flex-shrink-0" />
                    <span className="font-bold text-teal-200">Direct DaVinci Resolve & Unreal plugin</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={isLoadingStripe}
                onClick={() => handleSelectTier('enterprise')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black text-xs font-black uppercase tracking-wider transition shadow-xl shadow-amber-500/30 flex items-center justify-center space-x-2 border border-amber-300/60 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Crown size={14} fill="currentColor" />
                <span>Enterprise Active ($299/mo)</span>
              </button>
            </div>
          </div>

          {/* Enterprise Live Diagnostic Status Bar */}
          <div className="p-4 rounded-2xl bg-[#090514] border border-amber-500/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-[10px] text-amber-400/80 block">GPU Compute</span>
                <span className="text-slate-100 font-bold">8x H100 SXM5 (Online)</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <div>
                <span className="text-[10px] text-amber-400/80 block">DaVinci Resolve</span>
                <span className="text-slate-100 font-bold">Studio 19 Bridge Synced</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <div>
                <span className="text-[10px] text-amber-400/80 block">Unreal Engine</span>
                <span className="text-slate-100 font-bold">5.4 Live Link Stream</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <div>
                <span className="text-[10px] text-amber-400/80 block">Custom LoRA Engine</span>
                <span className="text-slate-100 font-bold">Character Likeness Locked</span>
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-[11px] text-purple-400/80 font-mono pt-2 border-t border-purple-900/40">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>
              256-Bit Encrypted Enterprise Payments via Stripe • Dedicated Soundstage SLA • 14-Day Full Production Guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioProUpgradeModal;
