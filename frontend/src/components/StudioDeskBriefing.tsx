import React, { useEffect, useState } from 'react';
import { getAPIBaseURL } from '../lib/api';
import { Sparkles, Sun, Moon } from 'lucide-react';

interface Props {
  projectId: string;
  type: 'morning' | 'evening';
  onClose: () => void;
}

export const StudioDeskBriefing: React.FC<Props> = ({ projectId, type, onClose }) => {
  const apiBase = getAPIBaseURL();
  const [loading, setLoading] = useState(true);
  const [briefing, setBriefing] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/v1/briefing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, type }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (data.success) {
          setBriefing(data.briefing || '');
        } else {
          setError(data.error || 'Failed to generate briefing');
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Network error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiBase, projectId, type]);

  const title = type === 'evening' ? 'End-of-Day Wrap' : 'Morning Briefing';
  const Icon = type === 'evening' ? Moon : Sun;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e0922] border border-purple-800/60 rounded-3xl max-w-2xl w-full p-6 shadow-2xl shadow-purple-900/30 space-y-4">
        <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
          <div className="flex items-center gap-2.5">
            <Icon className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-amber-100 font-serif tracking-wide">
                Studio Desk — {title}
              </h3>
              <p className="text-[10px] text-purple-300/70 font-mono uppercase tracking-wider">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-400/80 hover:text-purple-200 text-xs font-mono px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 transition"
          >
            ✕ Close
          </button>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-purple-200 text-sm py-8 justify-center">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Studio Desk is reviewing the studio…</span>
          </div>
        )}

        {error && <p className="text-rose-400 text-sm py-6 text-center">{error}</p>}

        {!loading && !error && (
          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto custom-scrollbar font-sans select-text">
            {briefing}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioDeskBriefing;
