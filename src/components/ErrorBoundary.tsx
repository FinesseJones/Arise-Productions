"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Arise Studio ErrorBoundary Caught Error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    localStorage.removeItem('arise_session_active');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] p-6 bg-[#080512] text-slate-100 font-sans select-text">
          <div className="max-w-xl w-full p-8 rounded-3xl bg-[#12082b]/95 border border-amber-500/40 shadow-2xl shadow-amber-500/20 text-center space-y-5 backdrop-blur-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-500/25">
              <ShieldAlert size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#F59E0B] font-serif uppercase tracking-wide">
                {this.props.fallbackTitle || 'Studio Subsystem Recovered'}
              </h2>
              <p className="text-xs text-amber-200/80 font-sans">
                The studio runtime caught an unexpected exception and protected your workspace from crashing.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-2xl bg-[#06030e] border border-rose-500/30 text-left font-mono text-[11px] text-rose-300 max-h-32 overflow-y-auto custom-scrollbar">
                <span className="font-bold text-rose-400">Error: </span>
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-amber-500/25"
              >
                <RefreshCw size={14} />
                <span>Recover & Rerender</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="px-4 py-2.5 rounded-xl bg-[#180d38] hover:bg-[#251554] border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                <Home size={14} />
                <span>Front of Studio</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
