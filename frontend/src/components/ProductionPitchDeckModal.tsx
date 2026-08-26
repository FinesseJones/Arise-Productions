"use client";

import React, { useState } from 'react';
import { Sparkles, FileText, Download, X, Copy, Check, Film, Users, Layers, Camera, Volume2, Palette, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';
import { ProjectStatus } from '../types/types';
import { getProjectPlot, getProjectCharacters, getProjectActs, getProjectBeats } from '../lib/projectData';

interface ProductionPitchDeckModalProps {
  projectStatus: ProjectStatus;
  onClose: () => void;
}

export const ProductionPitchDeckModal: React.FC<ProductionPitchDeckModalProps> = ({ projectStatus, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'bible' | 'beats' | 'characters' | 'technical'>('bible');

  const projectName = projectStatus.projectName || 'Arise Production';
  const cleanSlug = projectName.replace(/[^a-zA-Z0-9]/g, '_');

  const plot = getProjectPlot(projectName);
  const characters = getProjectCharacters(projectName);
  const acts = getProjectActs(projectName);
  const beats = getProjectBeats(projectName);

  const act1Beats = beats.filter(b => b.act === 'Act I');
  const act2Beats = beats.filter(b => b.act === 'Act II');
  const act3Beats = beats.filter(b => b.act === 'Act III');

  const handleCopyText = () => {
    const pitchText = `
================================================================================
                    ARISE PRODUCTIONS • PRODUCTION PITCH BIBLE
                   © 2026 THE AI CONTENT FOUNDRY, LLC. ALL RIGHTS RESERVED.
================================================================================

TITLE: ${plot.title}
GENRE: ${plot.genres.join(' / ')} (${plot.tone})
AUDIENCE: ${plot.audience}
FORMAT: Feature Film / Theatrical Long-Form (2.39:1 CinemaScope & 16:9 UHD)
STUDIO: Arise Production Studio
STATUS: Pre-Production & 3D Virtual Production Conformed

LOGLINE:
${plot.logline}

THEMATIC CORE:
${plot.themes}

--------------------------------------------------------------------------------
1. HOLLYWOOD 3-ACT BEAT SHEET SUMMARY
--------------------------------------------------------------------------------
ACT I: THE SETUP
${act1Beats.map(b => `• ${b.title}: ${b.description}`).join('\n')}

ACT II: THE CRUCIBLE & CONFLICT
${act2Beats.map(b => `• ${b.title}: ${b.description}`).join('\n')}

ACT III: THE CLIMAX & RESOLUTION
${act3Beats.map(b => `• ${b.title}: ${b.description}`).join('\n')}

--------------------------------------------------------------------------------
2. PRINCIPAL CHARACTER DOSSIERS
--------------------------------------------------------------------------------
${characters.map((c, i) => `${i + 1}. ${c.name.toUpperCase()} — ${c.role.toUpperCase()}
   • Archetype: ${c.archetypes.join(', ')} (${c.arcType})
   • Personality: ${c.personality}
   • IP-Adapter Token: @${c.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_v1 (Likeness Locked)`).join('\n\n')}

--------------------------------------------------------------------------------
3. VIRTUAL PRODUCTION & TECHNICAL CONFORM SPECS
--------------------------------------------------------------------------------
• Primary Camera: Unreal Engine 5.4 CineCamera (Cooke Anamorphic /i Prime 35mm T1.8)
• Color Pipeline: ACEScc Wide Gamut with Kodak 2383 3D Film Print LUT Emulation
• Spatial Audio: Dolby Atmos 5.1 Stem Master (-24.0 LKFS Broadcast Compliant)
• Generative VFX: ComfyUI FLUX.1 Dev with ControlNet Depth V2 (Weight: 0.85)
• Editorial Conform: DaVinci Resolve 19 Multi-Track Timeline (V1/V2, A1-A4 EDL)
    `.trim();

    navigator.clipboard.writeText(pitchText);
    setCopied(true);
    toast.success('✨ Production Pitch Bible copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadBible = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `# 🎬 ARISE PRODUCTION PITCH BIBLE & PRODUCTION MANIFEST\n\n` +
      `**Project:** ${plot.title}\n` +
      `**Genre:** ${plot.genres.join(', ')} | **Tone:** ${plot.tone}\n` +
      `**Studio:** Arise Productions (A product of THE AI CONTENT FOUNDRY, LLC)\n` +
      `**Copyright:** © 2026 THE AI CONTENT FOUNDRY, LLC. All Rights Reserved.\n\n` +
      `---\n\n` +
      `## 📖 Logline & Dramatic Vision\n` +
      `${plot.logline}\n\n` +
      `**Themes:** ${plot.themes}\n\n` +
      `---\n\n` +
      `## 🏛️ Hollywood 40-Beat Sheet & 3-Act Structure\n\n` +
      `### Act I\n${act1Beats.map(b => `* **${b.title}:** ${b.description}`).join('\n')}\n\n` +
      `### Act II\n${act2Beats.map(b => `* **${b.title}:** ${b.description}`).join('\n')}\n\n` +
      `### Act III\n${act3Beats.map(b => `* **${b.title}:** ${b.description}`).join('\n')}\n\n` +
      `---\n\n` +
      `## 🎭 Character Manifest\n\n` +
      characters.map(c => `* **${c.name} (${c.role}):** ${c.archetypes.join(', ')} • ${c.personality} • @${c.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_v1`).join('\n') +
      `\n\n---\n\n` +
      `## 🎥 Technical & Virtual Production Conform\n` +
      `* **CineCamera:** 35mm Anamorphic Prime (T1.8) • Full-Frame 36x24mm\n` +
      `* **Color Grading:** ACEScc with Kodak 2383 33-point 3D LUT\n` +
      `* **Spatial Audio:** Dolby Atmos 5.1 (-24 LKFS Target)\n` +
      `* **Editorial NLE:** DaVinci Resolve Multi-Track XML / EDL\n`
    ], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${cleanSlug}_Master_Pitch_Bible_2026.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`📥 Downloaded ${cleanSlug}_Master_Pitch_Bible_2026.md!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="bg-[#0c0a14] border border-amber-500/50 rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl shadow-amber-500/20 overflow-hidden font-sans">
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-[#140e22] border-b border-amber-500/40 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-amber-500/70 p-0 flex items-center justify-center shadow-md">
              <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase tracking-wider font-serif">
                  {plot.title} — Pitch Bible & One-Pager
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  STUDIO LOCKED
                </span>
              </div>
              <p className="text-[11px] text-[#E2BA86] font-mono">
                © 2026 Arise Production • A Product of THE AI CONTENT FOUNDRY, LLC
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyText}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-mono transition cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Bible'}</span>
            </button>
            <button
              onClick={handleDownloadBible}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-bold text-xs font-mono transition shadow-md cursor-pointer"
            >
              <Download size={14} />
              <span>Export PDF / MD</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 transition ml-2 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#0a0712] border-b border-purple-900/40 text-xs font-mono">
          <button
            onClick={() => setActiveView('bible')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeView === 'bible'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <FileText size={14} />
            <span>Master One-Pager</span>
          </button>

          <button
            onClick={() => setActiveView('beats')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeView === 'beats'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <Layers size={14} />
            <span>3-Act / 40-Beat Sheet</span>
          </button>

          <button
            onClick={() => setActiveView('characters')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeView === 'characters'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <Users size={14} />
            <span>Character Dossiers</span>
          </button>

          <button
            onClick={() => setActiveView('technical')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeView === 'technical'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <Camera size={14} />
            <span>Virtual DP & Audio Specs</span>
          </button>
        </div>

        {/* Modal Body Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#0a0712] via-[#0e091d] to-[#0a0712]">
          {/* TAB 1: MASTER ONE-PAGER */}
          {activeView === 'bible' && (
            <div className="space-y-6">
              {/* Hero Banner Card */}
              <div className="p-6 rounded-2xl bg-[#140e2e]/90 border border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block font-bold">
                      Feature Film Pitch One-Pager
                    </span>
                    <h3 className="text-2xl font-black text-slate-100 font-serif mt-0.5">{plot.title}</h3>
                  </div>
                  <div className="text-right font-mono text-xs text-amber-300/80">
                    <p>Format: <strong>16:9 / 2.39:1 Scope</strong></p>
                    <p>Target Audience: <strong>{plot.audience}</strong></p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wider">Logline</h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-serif italic bg-black/40 p-3.5 rounded-xl border border-purple-900/60">
                    "{plot.logline}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-black/50 border border-purple-900/50 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Genre & Tone</span>
                    <p className="text-xs text-slate-200 font-medium">{plot.genres.join(', ')} • {plot.tone}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-purple-900/50 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Visual Language</span>
                    <p className="text-xs text-slate-200 font-medium">35mm Anamorphic • ACEScc Rec.709 Grade</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-purple-900/50 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Core Theme</span>
                    <p className="text-xs text-slate-200 font-medium">{plot.themes}</p>
                  </div>
                </div>
              </div>

              {/* Synopsis & World Outline */}
              <div className="p-6 rounded-2xl bg-[#140e2e]/90 border border-purple-900/60 space-y-3 font-mono text-xs">
                <span className="font-bold text-amber-300 uppercase tracking-wider block">Production Synopsis</span>
                <p className="text-purple-200/90 leading-relaxed text-xs">
                  Set against the high-stakes narrative landscape of <em>{plot.title}</em>, this production explores the collision between individual agency and overwhelming systemic pressure. Through intimate character arcs, high-contrast anamorphic cinematography, and a broadcast-calibrated Dolby Atmos score, the project delivers a definitive cinematic experience.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: 3-ACT / 40-BEAT SHEET */}
          {activeView === 'beats' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#140e2e]/90 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold uppercase">Act I: The Setup & Catalyst ({act1Beats.length} Beats)</span>
                  <span className="text-emerald-400">Tension: 35% &rarr; 60%</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-purple-200/90">
                  {act1Beats.map(b => (
                    <p key={b.id}>• <strong>{b.title}:</strong> {b.description}</p>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#140e2e]/90 border border-purple-800/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400 font-bold uppercase">Act II: The Crucible & Trials ({act2Beats.length} Beats)</span>
                  <span className="text-amber-400">Tension: 65% &rarr; 95%</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-purple-200/90">
                  {act2Beats.map(b => (
                    <p key={b.id}>• <strong>{b.title}:</strong> {b.description}</p>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#140e2e]/90 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold uppercase">Act III: Redemption & Horizon ({act3Beats.length} Beats)</span>
                  <span className="text-amber-300">Tension: 95% &rarr; Resolution</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-purple-200/90">
                  {act3Beats.map(b => (
                    <p key={b.id}>• <strong>{b.title}:</strong> {b.description}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHARACTER DOSSIERS */}
          {activeView === 'characters' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {characters.map((c, i) => (
                <div key={c.id || i} className="p-5 rounded-2xl bg-[#140e2e] border border-amber-500/40 space-y-3 font-mono text-xs shadow-xl">
                  <div className="flex items-center justify-between border-b border-purple-900/60 pb-2">
                    <span className="font-bold text-amber-300 text-sm">{c.name.toUpperCase()}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      {c.role.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-purple-200/80 text-[11px]">
                    <p><strong>Archetypes:</strong> {c.archetypes.join(', ')}</p>
                    <p><strong>Arc Type:</strong> {c.arcType}</p>
                    <p><strong>Personality:</strong> {c.personality}</p>
                    <p><strong>IP-Adapter Token:</strong> @{c.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_v1 (Likeness Locked)</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TECHNICAL CONFORM & VIRTUAL DP SPECS */}
          {activeView === 'technical' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-5 rounded-2xl bg-[#140e2e] border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Camera size={16} />
                  <span>Unreal Engine 5.4 Virtual Cinematography</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-purple-200">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-purple-900/60">
                    <span className="text-slate-400 block text-[10px]">Sensor Format</span>
                    <strong className="text-amber-300">Full Frame 36x24mm</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-purple-900/60">
                    <span className="text-slate-400 block text-[10px]">Prime Lens</span>
                    <strong className="text-amber-300">35mm Anamorphic T1.8</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-purple-900/60">
                    <span className="text-slate-400 block text-[10px]">Color Pipeline</span>
                    <strong className="text-amber-300">ACEScc / ACEScg</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-purple-900/60">
                    <span className="text-slate-400 block text-[10px]">Frame Rate</span>
                    <strong className="text-amber-300">24.00 FPS DCI</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#140e2e] border border-purple-800/60 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <Volume2 size={16} />
                  <span>Dolby Atmos 5.1 Multi-Track Stem Setup</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-purple-200/90">
                  <p>• <strong>Stem A1 (Dialogue):</strong> Center Channel isolated, denoised, and leveled at -24.0 LKFS.</p>
                  <p>• <strong>Stem A2 (Foley & Spatial):</strong> Environmental ambience, footsteps, prop textures in 5.1 bed.</p>
                  <p>• <strong>Stem A3 (Score Bed):</strong> Orchestral score with dynamic thematic Leitmotifs in stereo wide.</p>
                  <p>• <strong>Stem A4 (LFE Subwoofer):</strong> 40 Hz emotional impact pulses on narrative transitions.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionPitchDeckModal;
