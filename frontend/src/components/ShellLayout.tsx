"use client";

import React, { useState, useEffect } from 'react';
import PipelineStages from './PipelineStages';
import StatusBoard from './StatusBoard';
import DirectorAgent from './DirectorAgent';
import StageWorkspace from './StageWorkspace';
import StudioArchitecturalView from './StudioArchitecturalView';
import VideoScreeningRoom from './VideoScreeningRoom';
import DataVaultAndHistory from './DataVaultAndHistory';
import OriginalSuitesHub from './OriginalSuitesHub';
import ProductionPitchDeckModal from './ProductionPitchDeckModal';
import StudioProUpgradeModal from './StudioProUpgradeModal';
import PlotRoom from '../pages/PlotRoom';
import ActsRoom from '../pages/ActsRoom';
import BeatsRoom from '../pages/BeatsRoom';
import CharactersRoom from '../pages/CharactersRoom';
import DepartmentAgentsHub from './agents/DepartmentAgentsHub';
import { useStudioSocket } from '../hooks/useStudioSocket';
import { stages } from '../types/stages';
import {
  Building2,
  LayoutGrid,
  ShieldCheck,
  Cpu,
  Key,
  Check,
  Sparkles,
  Film,
  FolderArchive,
  Sliders,
  FileText,
  BookOpen,
  Layers,
  Activity,
  Users,
  Crown,
} from 'lucide-react';
import { ARISE_LOGO_BASE64 } from '../constants/branding';
import { getAPIBaseURL } from '../lib/api';
import toast from 'react-hot-toast';

interface ShellLayoutProps {
  projectId?: string;
  projectName: string;
  activeStage: string | null;
  onStageSelect: (stageId: string) => void;
  onChangeProject?: () => void;
}

const ShellLayout: React.FC<ShellLayoutProps> = ({
  projectId,
  projectName,
  activeStage,
  onStageSelect,
  onChangeProject,
}) => {
  const apiBase = getAPIBaseURL();
  const [mainView, setMainView] = useState<
    'agents' | 'stage' | 'plot' | 'acts' | 'beats' | 'characters' | 'architecture' | 'screening' | 'suites' | 'vault'
  >('agents');
  const [activeShotNumber, setActiveShotNumber] = useState<number>(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showNvidiaModal, setShowNvidiaModal] = useState<boolean>(false);
  const [showPitchBibleModal, setShowPitchBibleModal] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [defaultModel, setDefaultModel] = useState<string>('meta/llama-3.1-70b-instruct');
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [maskedKey, setMaskedKey] = useState<string>('None');

  // Dynamic project ID computation
  const effectiveProjectId = projectId || (
    projectName.toLowerCase().includes('alien')
      ? 'proj-alien'
      : projectName.toLowerCase().includes('space')
      ? 'proj-space'
      : projectName.toLowerCase().includes('titanic')
      ? 'proj-titanic'
      : `proj-${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  );

  // Live WebSocket Connection to Central API Bridge
  const { projectStatus, isConnected, telemetry, sendCommand } = useStudioSocket({
    projectId: effectiveProjectId,
    projectName,
  });

  // Check NVIDIA NIM status from backend
  const fetchNvidiaStatus = async () => {
    try {
      const res = await fetch(`${apiBase}/api/v1/nvidia/status`).then((r) => r.json()).catch(() => null);
      if (res && res.success) {
        setHasKey(res.hasKey);
        setMaskedKey(res.maskedKey);
        setDefaultModel(res.defaultModel);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchNvidiaStatus();
  }, [apiBase]);

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    try {
      const res = await fetch(`${apiBase}/api/v1/nvidia/set-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success('✨ NVIDIA NIM API Key saved successfully!');
        setHasKey(true);
        setMaskedKey(res.maskedKey);
        setApiKeyInput('');
        setShowNvidiaModal(false);
      } else {
        toast.error(res.error || 'Failed to save API key');
      }
    } catch (err: any) {
      toast.error('Network error while saving API key');
    }
  };

  const handleSwitchModel = async (modelId: string) => {
    try {
      const res = await fetch(`${apiBase}/api/v1/nvidia/set-model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelId }),
      }).then((r) => r.json());

      if (res.success) {
        setDefaultModel(modelId);
        toast.success(`Switched default model to ${modelId.split('/')[1] || modelId}`);
      }
    } catch (err: any) {
      toast.error('Failed to switch model');
    }
  };

  // Find active stage metadata
  const currentStageObj = stages.find((s) => s.id === activeStage) || stages[3]; // Default to Blockout

  const handleSelectFromArchitect = (stageId: string) => {
    onStageSelect(stageId);
    setMainView('stage');
  };

  const handleSelectShotStage = (shotNumber: number, stageId: string) => {
    onStageSelect(stageId);
    setActiveShotNumber(shotNumber);
    setMainView('stage');
  };

  return (
    <div className="flex flex-col h-screen bg-[#080512] text-slate-100 overflow-hidden font-sans">
      {/* Top Studio Header & Telemetry Bar */}
      <header className="flex items-center justify-between px-5 py-2.5 bg-[#0e0922]/95 border-b border-purple-900/50 select-none flex-shrink-0 backdrop-blur-md">
        <div className="flex items-center space-x-3.5">
          {/* Official Arise Productions Logo Badge - Fits Entire Icon */}
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-amber-500/60 bg-black flex-shrink-0 shadow-lg shadow-amber-500/25 p-0 flex items-center justify-center transition hover:scale-105">
            <img
              src={ARISE_LOGO_BASE64}
              alt="Arise Productions"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] via-[#F59E0B] to-[#D97706] uppercase font-serif drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                ARISE PRODUCTION
              </h1>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/40 font-mono font-bold">
                STUDIO v1.0
              </span>
            </div>
            <p className="text-[10px] text-[#E2BA86] font-mono tracking-wider uppercase font-semibold">
              A PRODUCT OF THE AI CONTENT FOUNDRY, LLC
            </p>
          </div>
        </div>

        {/* Center Mode Switcher & Navigation */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar max-w-full">
          <div className="flex bg-[#140e2e] p-0.5 rounded-xl border border-amber-500/30 text-[11px] font-mono shadow-inner space-x-0.5 flex-shrink-0">
            {/* 0. Executive Department Agents Hub */}
            <button
              onClick={() => setMainView('agents')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                mainView === 'agents'
                  ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                  : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <span>🏛️</span>
              <span>Command Center</span>
            </button>

            {/* 1. 3D Soundstage */}
            <button
              onClick={() => setMainView('stage')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                mainView === 'stage'
                  ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                  : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <LayoutGrid size={12} />
              <span>3D Soundstage</span>
            </button>

            {/* 2. Sagas Plot Room */}
            <button
              onClick={() => setMainView('plot')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                mainView === 'plot'
                  ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                  : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <BookOpen size={12} />
              <span>01: Plot</span>
            </button>

            {/* 2d. Cast Room */}
            <button
              onClick={() => setMainView('characters')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                mainView === 'characters'
                  ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                  : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <Users size={12} />
              <span>02: Cast</span>
            </button>

            {/* 3. 3D Campus */}
            <button
              onClick={() => setMainView('architecture')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                mainView === 'architecture'
                  ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                  : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <Building2 size={12} />
              <span>3D Campus</span>
            </button>

            {/* 4. 4K Video Screening Room */}
            <button
              onClick={() => setMainView('screening')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                mainView === 'screening'
                  ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                  : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <Film size={12} />
              <span>Screening</span>
            </button>

            {/* 5. Suites Hub */}
            <button
              onClick={() => setMainView('suites')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                mainView === 'suites'
                  ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                  : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <Sliders size={12} />
              <span>Suites</span>
            </button>

            {/* 6. Production Data Vault */}
            <button
              onClick={() => setMainView('vault')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                mainView === 'vault'
                  ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                  : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <FolderArchive size={12} />
              <span>Vault</span>
            </button>
          </div>

          {/* Hollywood Pitch Bible Button */}
          <button
            onClick={() => setShowPitchBibleModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono transition shadow-sm font-bold flex-shrink-0"
          >
            <FileText size={12} className="text-amber-400" />
            <span>Bible</span>
          </button>

          {/* NVIDIA NIM Free Tier Button */}
          <button
            onClick={() => setShowNvidiaModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 text-[11px] font-mono transition shadow-sm flex-shrink-0"
          >
            <Cpu size={12} className="text-purple-400" />
            <span className="font-bold">{defaultModel.split('/')[1] || 'Llama 3.1 70B'}</span>
          </button>

          {/* Stripe-Powered Studio Pro Upgrade Button */}
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold border border-amber-300 text-[11px] font-mono transition shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 flex-shrink-0"
          >
            <Crown size={12} fill="currentColor" />
            <span>Pro</span>
          </button>

          <div className="hidden xl:flex items-center space-x-1 text-[11px] text-amber-300/70 border-l border-amber-500/30 pl-2.5 flex-shrink-0">
            <span className="text-amber-400/60">Project:</span>
            <span className="text-amber-200 font-semibold truncate max-w-[120px]">{projectStatus.projectName}</span>
            {onChangeProject && (
              <button
                onClick={onChangeProject}
                className="text-amber-400 hover:text-amber-300 underline ml-1"
              >
                Switch
              </button>
            )}
          </div>
        </div>

        {/* Live Bridge Connection Indicator & Telemetry */}
        <div className="flex items-center space-x-4 text-xs">
          {telemetry && (
            <div className="hidden md:flex items-center space-x-2 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-800/60">
              <span className="animate-pulse text-rose-400">⚡</span>
              <span className="text-purple-200 font-mono text-[11px]">{telemetry.message}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-md border border-slate-700">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="font-mono text-slate-300 text-[11px]">
              {isConnected ? 'BRIDGE ONLINE' : 'RECONNECTING...'}
            </span>
          </div>
        </div>
      </header>

      {/* NVIDIA NIM Free Tier Modal */}
      {showNvidiaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="text-emerald-400 w-5 h-5" />
                <h3 className="text-base font-bold text-slate-100">
                  NVIDIA NIM AI Models & API Key Manager
                </h3>
              </div>
              <button
                onClick={() => setShowNvidiaModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Model Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Select Default Free Tier Model
              </label>
              <div className="space-y-2 font-mono text-xs">
                {[
                  { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B Instruct', desc: 'Fast, creative screenplay & dialogue specialist' },
                  { id: 'meta/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', desc: 'Deep scene breakdown & 3D camera vector solves' },
                  { id: 'nvidia/nemotron-4-340b-instruct', name: 'Nemotron-4 340B Instruct', desc: '340B massive model for full-season continuity & bibles' },
                  { id: 'meta/llama-3.1-405b-instruct', name: 'Llama 3.1 405B Instruct', desc: '405B powerhouse for intricate multi-act reasoning' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSwitchModel(m.id)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition ${
                      defaultModel === m.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{m.name}</span>
                        {defaultModel === m.id && <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 rounded font-black">ACTIVE</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">{m.desc}</p>
                    </div>
                    {defaultModel === m.id && <Check size={16} className="text-emerald-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* API Key Form */}
            <form onSubmit={handleSaveApiKey} className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <label className="text-slate-400 flex items-center gap-1.5">
                  <Key size={13} className="text-amber-400" />
                  <span>NVIDIA API Key</span>
                </label>
                <span className="text-[10px] font-mono text-slate-500">
                  Status: {hasKey ? <strong className="text-emerald-400">Attached ({maskedKey})</strong> : <strong className="text-amber-400">Not Configured</strong>}
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="nvapi-..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="flex-grow px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono focus:border-emerald-500 focus:outline-none select-text"
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text && text.trim()) {
                        setApiKeyInput(text.trim());
                        toast.success('📋 Pasted API Key from clipboard!');
                      } else {
                        toast.error('Clipboard is empty. Copy your key first.');
                      }
                    } catch (e) {
                      toast('Please use Cmd+V to paste into the field.', { icon: '⌨️' });
                    }
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs font-mono transition flex items-center gap-1"
                >
                  <span>📋 Paste</span>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition"
                >
                  Save Key
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Get your free NVIDIA API Key from <a href="https://build.nvidia.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">build.nvidia.com</a>. Saved to local <code>.env</code>.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Main Studio Body */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Rail: 10 Pipeline Stages (Visible in stage and architecture views) */}
        {['stage', 'architecture'].includes(mainView) && (
          <aside className="w-64 xl:w-72 flex-shrink-0 border-r border-slate-800 bg-slate-900/60 overflow-y-auto">
            <PipelineStages
              activeStageId={activeStage}
              projectStatus={projectStatus}
              onStageSelect={(id) => {
                onStageSelect(id);
                setMainView('stage');
              }}
            />
          </aside>
        )}

        {/* Center Workspace: Dynamic based on MainView */}
        <main className="flex-grow p-0 overflow-y-auto bg-slate-950 flex flex-col">
          {mainView === 'agents' && (
            <DepartmentAgentsHub
              projectName={projectStatus.projectName}
              projectId={effectiveProjectId}
              onNavigateToRoom={(roomKey) => {
                if (roomKey === 'plot') {
                  setMainView('plot');
                } else if (roomKey === 'characters') {
                  setMainView('characters');
                } else if (roomKey === 'acts') {
                  setMainView('acts');
                } else if (roomKey === 'beats') {
                  setMainView('beats');
                } else {
                  setMainView('stage');
                  onStageSelect(roomKey);
                }
              }}
            />
          )}

          {mainView === 'stage' && (
            <StageWorkspace
              stage={currentStageObj}
              projectStatus={projectStatus}
              selectedShot={activeShotNumber}
              onSelectShot={setActiveShotNumber}
              onExecuteStage={(stageId) => sendCommand(`run stage ${stageId}`, stageId)}
            />
          )}

          {mainView === 'plot' && (
            <PlotRoom projectName={projectStatus.projectName} />
          )}

          {mainView === 'acts' && (
            <ActsRoom projectName={projectStatus.projectName} />
          )}

          {mainView === 'beats' && (
            <BeatsRoom projectName={projectStatus.projectName} />
          )}

          {mainView === 'characters' && (
            <CharactersRoom projectName={projectStatus.projectName} />
          )}

          {mainView === 'architecture' && (
            <StudioArchitecturalView
              projectStatus={projectStatus}
              activeStageId={activeStage}
              onSelectStage={handleSelectFromArchitect}
            />
          )}

          {mainView === 'screening' && (
            <VideoScreeningRoom projectStatus={projectStatus} />
          )}

          {mainView === 'suites' && (
            <OriginalSuitesHub projectStatus={projectStatus} />
          )}

          {mainView === 'vault' && (
            <DataVaultAndHistory projectStatus={projectStatus} />
          )}
        </main>

        {/* Right Rail: Shot Manifest & Live Status Board (Visible in stage view) */}
        {mainView === 'stage' && (
          <aside className="w-80 xl:w-96 flex-shrink-0 border-l border-slate-800 bg-slate-900/60 overflow-y-auto">
            <StatusBoard
              projectStatus={projectStatus}
              activeStageId={activeStage}
              activeShotNumber={activeShotNumber}
              onSelectShotStage={handleSelectShotStage}
            />
          </aside>
        )}
      </div>

      {/* Bottom Director Agent Bar & Legal Copyright Footer */}
      <footer className="flex-shrink-0 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md flex flex-col">
        <DirectorAgent
          onSendCommand={(cmd) => sendCommand(cmd, activeStage || 'script')}
          activeStage={activeStage}
          telemetry={telemetry}
        />

        {/* Copyright Notice */}
        <div className="px-6 py-1.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 select-none">
          <div className="flex items-center space-x-2">
            <span className="text-amber-400 font-bold font-mono">© 2026 Arise Production.</span>
            <span>A product of THE AI CONTENT FOUNDRY, LLC. All rights reserved.</span>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>NVIDIA NIM Free Tier: Active</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Hollywood Production Pitch Bible & One-Pager Modal */}
      {showPitchBibleModal && (
        <ProductionPitchDeckModal
          projectStatus={projectStatus}
          onClose={() => setShowPitchBibleModal(false)}
        />
      )}

      {/* Stripe-Powered Studio Pro Upgrade Modal */}
      <StudioProUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
};

export default ShellLayout;