"use client";

import React, { useState } from 'react';
import GenerateField from '../components/GenerateField';
import { Layers, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ARISE_LOGO_BASE64 } from '../constants/branding';

interface ActsRoomProps {
  projectName?: string;
  onNavigateToRoom?: (roomKey: string) => void;
}

export function ActsRoom({ projectName = 'A Fatherless Child', onNavigateToRoom }: ActsRoomProps) {
  const [teaser, setTeaser] = useState(
    'A quiet autumn dawn over a weathered front porch. Devon (19) stares at a faded photograph of his father, holding his breath as the neighborhood awakens in golden 3200K mist.'
  );
  const [act1, setAct1] = useState(
    'Devon unearths a wooden chest in the attic containing a vintage 16mm camera and blueprints of the community hall. Marcus urges him to seek answers, but Devon fears dredging up old wounds.'
  );
  const [act2A, setAct2A] = useState(
    'Devon begins recording oral histories of neighborhood elders, learning that his father built the very foundations of the neighborhood hall before disappearing.'
  );
  const [act2B, setAct2B] = useState(
    'A flash storm threatens the archival footage workshop. Evelyn pleads with Devon to stop digging into the past, triggering a crisis of faith and an emotional dark night.'
  );
  const [act3, setAct3] = useState(
    'Marcus gifts Devon a vintage prime lens. Devon rallies the community for the screening premiere in the restored hall. Devon stands on the porch, gazing forward into the waking city.'
  );

  const shared = {
    stageId: 'structure',
    role: 'Story Architect AI',
    roomName: 'Acts Room',
    context: `Project: ${projectName}`,
  };

  const handleExport = () => {
    const markdown = `# ${projectName.toUpperCase()} - 5-ACT NARRATIVE ARCHITECTURE\n\n## TEASER / COLD OPEN\n${teaser}\n\n## ACT 1: THE SETUP & CATALYST\n${act1}\n\n## ACT 2A: THE RESPONSE & EXPEDITION\n${act2A}\n\n## ACT 2B: THE ATTACK & DARK NIGHT\n${act2B}\n\n## ACT 3: THE CLIMAX & TRANSFORMATION\n${act3}\n\n---\n© 2026 THE AI CONTENT FOUNDRY, LLC`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Acts_Architecture.md`;
    a.click();
    toast.success('📥 Exported Acts Narrative manifest!');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gradient-to-b from-[#080512] via-[#0e0922] to-[#080512] text-slate-100 font-sans">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="p-5 rounded-2xl bg-[#140e2e]/95 border border-purple-900/60 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/60 bg-black flex-shrink-0 flex items-center justify-center">
              <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif">
                  Acts & Arcs Architecture
                </h1>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  NEW
                </span>
              </div>
              <p className="text-xs font-mono text-[#E2BA86]">
                5-Act Hollywood Structural Arc for <strong className="text-amber-300">{projectName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="flex items-center space-x-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-1.5 text-xs font-mono text-amber-300 font-bold transition"
          >
            <Download size={13} />
            <span>Export Acts</span>
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-6 rounded-2xl bg-[#140e2e]/95 border border-purple-900/60 backdrop-blur-xl shadow-2xl space-y-4">
          <GenerateField
            label="Teaser / Cold Open"
            info="The visual hook that sets the emotional premise before titles roll."
            placeholder="Describe the gripping opening visual or hook..."
            value={teaser}
            onChange={setTeaser}
            {...shared}
          />

          <GenerateField
            label="Act 1: The Setup & Catalyst"
            info="Ordinary world, inciting incident, and the threshold the protagonist must cross."
            placeholder="Describe Act 1 setup, status quo, and catalyst..."
            value={act1}
            onChange={setAct1}
            {...shared}
          />

          <GenerateField
            label="Act 2A: The Response & Rising Action"
            info="Fun & games, initial victories, and the deepening world exploration."
            placeholder="Describe the initial response and rising momentum..."
            value={act2A}
            onChange={setAct2A}
            {...shared}
          />

          <GenerateField
            label="Act 2B: The Attack & Dark Night"
            info="Midpoint shift, stakes escalate, all is lost moment and deepest wound triggered."
            placeholder="Describe the high-stakes complications and all-is-lost crisis..."
            value={act2B}
            onChange={setAct2B}
            {...shared}
          />

          <GenerateField
            label="Act 3: The Climax & Transformation"
            info="The ultimate trial, resolution of internal conflict, and the transformed final image."
            placeholder="Describe the climactic confrontation and transformed state..."
            value={act3}
            onChange={setAct3}
            {...shared}
          />

          {/* 🌟 NEXT STEP ADVANCE ACTION BAR */}
          <div className="pt-6 border-t border-amber-500/30 flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigateToRoom?.('characters')}
              className="px-4 py-2 rounded-xl bg-[#140b2e] hover:bg-[#1f1044] border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-2 shadow-sm"
            >
              <span>⬅️ 02: Characters & Cast</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToRoom?.('beats')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider transition shadow-lg shadow-amber-500/25 flex items-center gap-2"
              >
                <Layers size={14} />
                <span>👉 Next: 04: Beats Matrix 🎚️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActsRoom;
