import React, { useState } from 'react';
import { Sparkles, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../lib/api';

export type GenerateFieldProps = {
  label: string;
  info?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  stageId?: string; // one of 10 stages: 'script','structure','plan','previs','motion','boards','prompt','dailies','sound','edit'
  role?: string; // department persona, e.g. 'Story Architect AI'
  roomName?: string; // e.g. 'Plot Room'
  context?: string; // project/shot context passed to the model
  multiline?: boolean;
  rows?: number;
};

export function GenerateField({
  label,
  info,
  placeholder,
  value,
  onChange,
  stageId = 'structure',
  role = 'AI Specialist',
  roomName = 'Studio Department',
  context = '',
  multiline = true,
  rows = 4,
}: GenerateFieldProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<boolean>(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setLastGenerated(false);

    try {
      const apiBase = getAPIBaseURL();
      const res = await fetch(`${apiBase}/api/v1/nvidia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate the "${label}" for this film/production project. Instructions/Placeholder: "${placeholder ?? ''}". ${
            value ? `Current draft to refine and elevate: "${value}"` : ''
          }`.trim(),
          roomName,
          role,
          stageId,
          context: context || `Studio Department: ${roomName}`,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      const generatedText = (data.text || data.reply || '').replace(/^"|"$/g, '').trim();
      onChange(generatedText);
      setLastGenerated(true);
      toast.success(`✨ Generated ${label}!`);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Something went wrong';
      setError(errMsg);
      toast.error(`Failed to generate ${label}: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-5 font-mono text-xs">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] font-serif">
            {label}
          </span>
          {info && (
            <span title={info} className="cursor-help text-purple-400 hover:text-amber-300 transition">
              <Info size={13} />
            </span>
          )}
          {lastGenerated && (
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 size={11} /> AI Synced
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 px-3 py-1 text-xs font-black text-black shadow-md shadow-amber-500/20 disabled:opacity-50 transition active:scale-95"
        >
          <Sparkles size={11} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Generating…' : 'Generate'}</span>
        </button>
      </div>

      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          rows={rows}
          onChange={(e) => {
            onChange(e.target.value);
            setLastGenerated(false);
          }}
          className="w-full rounded-xl border border-purple-900/60 bg-[#0c081e] p-3 text-xs leading-relaxed text-purple-100 placeholder:text-purple-400/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 shadow-inner"
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            setLastGenerated(false);
          }}
          className="w-full rounded-xl border border-purple-900/60 bg-[#0c081e] p-3 text-xs leading-relaxed text-purple-100 placeholder:text-purple-400/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 shadow-inner"
        />
      )}

      {error && (
        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default GenerateField;
