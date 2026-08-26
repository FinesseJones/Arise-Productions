"use client";

import React, { useState, useEffect, useRef } from 'react';
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
import IdeaRoom from '../pages/IdeaRoom';
import DistributionRoom from '../pages/DistributionRoom';
import DepartmentAgentsHub from './agents/DepartmentAgentsHub';
import ErrorBoundary from './ErrorBoundary';
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
  Lightbulb,
  Globe,
  ChevronLeft,
  ChevronRight,
  Home,
  Plus,
  FolderOpen,
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
  const [activeShotNumber, setActiveShotNumber] = useState<number>(1);
  const [mainView, setMainView] = useState<
    | 'agents'
    | 'stage'
    | 'ideas'
    | 'plot'
    | 'acts'
    | 'beats'
    | 'characters'
    | 'architecture'
    | 'screening'
    | 'suites'
    | 'vault'
    | 'distribution'
  >('agents');

  // Modals
  const [showPitchBibleModal, setShowPitchBibleModal] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showNvidiaModal, setShowNvidiaModal] = useState<boolean>(false);

  // Active Studio Licensing Tier (Default: Enterprise $299/mo)
  const [studioTier, setStudioTier] = useState<string>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('arise_studio_tier') || 'enterprise' : 'enterprise'
  );

  // NVIDIA NIM Model & API Key State
  const [defaultModel, setDefaultModel] = useState<string>('meta/llama-3.1-70b-instruct');
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [maskedKey, setMaskedKey] = useState<string>('None');

  const effectiveProjectId = projectId || (
    projectName.toLowerCase().includes('alien')
      ? 'proj-alien'
      : projectName.toLowerCase().includes('space')
      ? 'proj-space'
      : projectName.toLowerCase().includes('titanic')
      ? 'proj-titanic'
      : `proj-${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  );

  const navScrollRef = useRef<HTMLDivElement>(null);

  const scrollNav = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };

  // Live WebSocket Connection to Central API Bridge
  const { projectStatus, isConnected, telemetry, sendCommand } = useStudioSocket({
    projectId: effectiveProjectId,
    projectName,
  });

  // Fetch NVIDIA NIM Key Status & default model on mount
  useEffect(() => {
    fetch(`${apiBase}/api/v1/nvidia/status`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setHasKey(data.hasKey);
          setMaskedKey(data.maskedKey || 'None');
          if (data.defaultModel) setDefaultModel(data.defaultModel);
        }
      })
      .catch(() => {});
  }, [apiBase]);

  // Handle Model Selection change
  const handleSelectModel = async (modelId: string) => {
    setDefaultModel(modelId);
    try {
      await fetch(`${apiBase}/api/v1/nvidia/model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId }),
      });
      toast.success(`Switched default inference to ${modelId.split('/')[1] || modelId}`);
    } catch {
      toast.error('Failed to update NVIDIA model preference');
    }
  };

  // Handle saving custom NVIDIA API Key
  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    try {
      const res = await fetch(`${apiBase}/api/v1/nvidia/key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
      }).then((r) => r.json());

      if (res.success) {
        setHasKey(true);
        setMaskedKey(res.maskedKey);
        setApiKeyInput('');
        toast.success('NVIDIA API Key securely saved in encrypted runtime memory!');
      } else {
        toast.error(res.error || 'Failed to save API key');
      }
    } catch {
      toast.error('Network error saving API key');
    }
  };

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
    <div className="flex flex-col h-screen h-[100dvh] bg-[#080512] text-slate-100 overflow-hidden font-sans">
      {/* Top Studio Header & Telemetry Bar (4K Glassmorphic Specular Theme) */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#09041a]/95 border-b border-amber-500/30 select-none flex-shrink-0 backdrop-blur-2xl specular-border z-30 shadow-2xl gap-3">
        {/* Left Side: Arise Logo, Title, and Front of Studio Navigation */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            type="button"
            onClick={onChangeProject}
            title="Return to Front of Studio & All Projects"
            className="w-9 h-9 rounded-xl overflow-hidden border-2 border-amber-500/60 bg-black flex-shrink-0 shadow-lg shadow-amber-500/25 p-0 flex items-center justify-center transition hover:scale-105 hover:border-amber-400 cursor-pointer"
          >
            <img
              src={ARISE_LOGO_BASE64}
              alt="Arise Productions"
              className="w-full h-full object-cover rounded-xl"
            />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onChangeProject}
                className="text-xs sm:text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] via-[#F59E0B] to-[#D97706] uppercase font-serif drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] hover:opacity-90 text-left cursor-pointer"
                title="Click to go to Front of Studio (All Projects)"
              >
                ARISE PRODUCTION
              </button>
              <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/40 font-mono font-bold">
                v1.0
              </span>
            </div>
            <p className="text-[9px] text-[#E2BA86] font-mono tracking-wider uppercase font-semibold">
              THE AI CONTENT FOUNDRY
            </p>
          </div>

          {/* Quick Front of Studio / New Production Buttons */}
          <div className="flex items-center space-x-1.5 pl-2 border-l border-amber-500/30">
            <button
              type="button"
              onClick={onChangeProject}
              className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold transition flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
              title="Return to Front of Studio & All Projects"
            >
              <Home size={12} />
              <span>Front of Studio</span>
            </button>

            <button
              type="button"
              onClick={onChangeProject}
              className="px-2.5 py-1 rounded-xl bg-[#1a0e36] hover:bg-[#271552] text-amber-200 border border-purple-800/60 text-[11px] font-mono font-bold transition flex items-center gap-1 whitespace-nowrap cursor-pointer"
              title="Create New Production or Ingest Media"
            >
              <Plus size={12} className="text-amber-400" />
              <span>New Production</span>
            </button>
          </div>
        </div>

        {/* Center Mode Switcher & Navigation with Left/Right Scroll Arrows & Luxury Scrollbar */}
        <div className="flex items-center space-x-1.5 flex-1 min-w-0 px-1.5">
          <button
            type="button"
            onClick={() => scrollNav('left')}
            className="p-1.5 rounded-xl bg-[#140e2e] hover:bg-[#201548] text-amber-400 border border-amber-500/30 flex-shrink-0 transition shadow-sm hover:border-amber-400 cursor-pointer active:scale-95"
            title="Scroll Navigation Left"
          >
            <ChevronLeft size={14} />
          </button>

          <div
            ref={navScrollRef}
            className="flex items-center space-x-1 enterprise-nav-scrollbar scroll-smooth flex-1 pb-1 pt-0.5"
          >
            <div className="flex bg-[#140e2e] p-1 rounded-xl border border-amber-500/30 text-[11px] font-mono shadow-inner space-x-0.5 flex-shrink-0">
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

              {/* 1.5. 00 Idea Lab & IP Concept Vault */}
              <button
                onClick={() => setMainView('ideas')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  mainView === 'ideas'
                    ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                    : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
                }`}
              >
                <Lightbulb size={12} />
                <span>00: Ideas</span>
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

              {/* 2e. Acts Room */}
              <button
                onClick={() => setMainView('acts')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  mainView === 'acts'
                    ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                    : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
                }`}
              >
                <Layers size={12} />
                <span>03: Acts</span>
              </button>

              {/* 2f. Beats Room */}
              <button
                onClick={() => setMainView('beats')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  mainView === 'beats'
                    ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                    : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
                }`}
              >
                <Activity size={12} />
                <span>04: Beats</span>
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

              {/* 7. 05: Distribution & Marketing Release Hub */}
              <button
                onClick={() => setMainView('distribution')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  mainView === 'distribution'
                    ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                    : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
                }`}
              >
                <Globe size={12} />
                <span>05: Distribution</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollNav('right')}
            className="p-1.5 rounded-xl bg-[#140e2e] hover:bg-[#201548] text-amber-400 border border-amber-500/30 flex-shrink-0 transition shadow-sm hover:border-amber-400 cursor-pointer active:scale-95"
            title="Scroll Navigation Right"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Right Tools & Active Project HUD */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Hollywood Pitch Bible Button */}
          <button
            onClick={() => setShowPitchBibleModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono transition shadow-sm font-bold flex-shrink-0 cursor-pointer"
          >
            <FileText size={12} className="text-amber-400" />
            <span>Bible</span>
          </button>

          {/* NVIDIA NIM Free Tier Button */}
          <button
            onClick={() => setShowNvidiaModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 text-[11px] font-mono transition shadow-sm flex-shrink-0 cursor-pointer"
          >
            <Cpu size={12} className="text-purple-400" />
            <span className="font-bold">{defaultModel.split('/')[1] || 'Llama 3.1 70B'}</span>
          </button>

          {/* Active Enterprise Tier License Badge */}
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-black border border-amber-300 text-[11px] font-mono transition shadow-lg shadow-amber-500/25 cursor-pointer active:scale-95 flex-shrink-0"
            title="Arise Studio Enterprise ($299/mo) Active - Dedicated H100 Cluster & Plugins"
          >
            <Crown size={12} fill="currentColor" />
            <span className="uppercase tracking-wider">
              {studioTier === 'enterprise' ? 'Enterprise ($299/mo)' : studioTier === 'pro' ? 'Studio Pro' : 'Free Tier'}
            </span>
          </button>

          <div className="hidden xl:flex items-center space-x-1 text-[11px] text-amber-300/70 border-l border-amber-500/30 pl-2.5 flex-shrink-0">
            <span className="text-amber-400/60">Project:</span>
            <span className="text-amber-200 font-semibold truncate max-w-[120px]">{projectStatus.projectName}</span>
            {onChangeProject && (
              <button
                onClick={onChangeProject}
                className="text-amber-400 hover:text-amber-300 underline ml-1 cursor-pointer"
              >
                Switch
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Studio Viewport (Protected with ErrorBoundary) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Rail: 10-Stage Pipeline Progression (Visible in stage view) */}
        {mainView === 'stage' && (
          <aside className="w-56 xl:w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/60 overflow-y-auto">
            <PipelineStages
              stages={stages}
              activeStage={activeStage}
              projectStatus={projectStatus}
              onSelectStage={onStageSelect}
            />
          </aside>
        )}

        {/* Central Workspace Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <ErrorBoundary fallbackTitle="Studio Workspace Recovered" onReset={() => setMainView('agents')}>
            {mainView === 'agents' && (
              <DepartmentAgentsHub
                projectName={projectStatus.projectName}
                activeStageId={activeStage}
                onSelectStage={onStageSelect}
                onNavigateToRoom={(roomKey) => {
                  if (['plot', 'characters', 'acts', 'beats', 'screening', 'architecture', 'suites', 'vault', 'distribution', 'ideas'].includes(roomKey)) {
                    setMainView(roomKey as any);
                  } else {
                    setMainView('stage');
                    onStageSelect(roomKey);
                  }
                }}
              />
            )}

            {mainView === 'stage' && (
              <StageWorkspace
                activeStage={activeStage}
                projectStatus={projectStatus}
                activeShotNumber={activeShotNumber}
                onSelectStage={onStageSelect}
                onSelectShot={setActiveShotNumber}
              />
            )}

            {mainView === 'ideas' && (
              <IdeaRoom
                onPromoteToProject={(newPid, newName) => {
                  if (onChangeProject) onChangeProject();
                  setMainView('stage');
                  onStageSelect('script');
                }}
                onNavigateToRoom={(roomKey) => {
                  if (['plot', 'characters', 'acts', 'beats', 'screening', 'architecture', 'suites', 'vault', 'distribution', 'ideas', 'agents'].includes(roomKey)) {
                    setMainView(roomKey as any);
                  } else {
                    setMainView('stage');
                    onStageSelect(roomKey);
                  }
                }}
              />
            )}

            {mainView === 'plot' && (
              <PlotRoom
                projectName={projectStatus.projectName}
                onNavigateToRoom={(roomKey) => {
                  if (['plot', 'characters', 'acts', 'beats', 'screening', 'architecture', 'suites', 'vault', 'distribution', 'ideas', 'agents'].includes(roomKey)) {
                    setMainView(roomKey as any);
                  } else {
                    setMainView('stage');
                    onStageSelect(roomKey);
                  }
                }}
              />
            )}

            {mainView === 'characters' && (
              <CharactersRoom
                projectName={projectStatus.projectName}
                onNavigateToRoom={(roomKey) => {
                  if (['plot', 'characters', 'acts', 'beats', 'screening', 'architecture', 'suites', 'vault', 'distribution', 'ideas', 'agents'].includes(roomKey)) {
                    setMainView(roomKey as any);
                  } else {
                    setMainView('stage');
                    onStageSelect(roomKey);
                  }
                }}
              />
            )}

            {mainView === 'acts' && (
              <ActsRoom
                projectName={projectStatus.projectName}
                onNavigateToRoom={(roomKey) => {
                  if (['plot', 'characters', 'acts', 'beats', 'screening', 'architecture', 'suites', 'vault', 'distribution', 'ideas', 'agents'].includes(roomKey)) {
                    setMainView(roomKey as any);
                  } else {
                    setMainView('stage');
                    onStageSelect(roomKey);
                  }
                }}
              />
            )}

            {mainView === 'beats' && (
              <BeatsRoom
                projectName={projectStatus.projectName}
                onNavigateToRoom={(roomKey) => {
                  if (['plot', 'characters', 'acts', 'beats', 'screening', 'architecture', 'suites', 'vault', 'distribution', 'ideas', 'agents'].includes(roomKey)) {
                    setMainView(roomKey as any);
                  } else {
                    setMainView('stage');
                    onStageSelect(roomKey);
                  }
                }}
              />
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

            {mainView === 'distribution' && (
              <DistributionRoom
                projectId={effectiveProjectId}
                projectName={projectStatus.projectName}
                onNavigateToRoom={(roomKey) => {
                  if (['plot', 'characters', 'acts', 'beats', 'screening', 'architecture', 'suites', 'vault', 'distribution', 'ideas', 'agents'].includes(roomKey)) {
                    setMainView(roomKey as any);
                  } else {
                    setMainView('stage');
                    onStageSelect(roomKey);
                  }
                }}
              />
            )}
          </ErrorBoundary>
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

      {/* Stripe-Powered Studio Enterprise & Pro Upgrade Modal */}
      <StudioProUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={studioTier}
        onTierChange={(t) => setStudioTier(t)}
      />

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
                  {
                    id: 'meta/llama-3.1-70b-instruct',
                    name: 'Llama 3.1 70B Instruct (General Director)',
                  },
                  {
                    id: 'mistralai/mistral-large-2-instruct',
                    name: 'Mistral Large 2 (Creative Screenwriter)',
                  },
                  {
                    id: 'nvidia/llama-3.1-nemotron-70b-instruct',
                    name: 'Nemotron 70B (High-Precision Reasoning)',
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectModel(m.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      defaultModel === m.id
                        ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{m.name}</span>
                    {defaultModel === m.id && <Check size={14} className="text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* API Key Configuration */}
            <form onSubmit={handleSaveApiKey} className="space-y-3 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Custom NVIDIA API Key (Optional)
              </label>
              <p className="text-xs text-slate-400">
                Current Status:{' '}
                <span className="font-mono text-emerald-400">
                  {hasKey ? `Configured (${maskedKey})` : 'Default Free Studio Key'}
                </span>
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="nvapi-..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-xl text-xs transition font-mono"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShellLayout;
