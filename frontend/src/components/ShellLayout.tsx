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
import { ProductionPitchDeckModal } from './ProductionPitchDeckModal';
import { StudioProUpgradeModal } from './StudioProUpgradeModal';
import { StudioVideoTourModal } from './StudioVideoTourModal';
import { DCCBridgesModal } from './dcc/DCCBridgesModal';
import StudioDeskBriefing from './StudioDeskBriefing';
import PlotRoom from '../pages/PlotRoom';
import ActsRoom from '../pages/ActsRoom';
import BeatsRoom from '../pages/BeatsRoom';
import CharactersRoom from '../pages/CharactersRoom';
import IdeaRoom from '../pages/IdeaRoom';
import DistributionRoom from '../pages/DistributionRoom';
import AudienceTheaterPortal from './audience/AudienceTheaterPortal';
import DepartmentAgentsHub from './agents/DepartmentAgentsHub';
import { StudioWatermark } from './common/StudioWatermark';
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
  ChevronDown,
  Menu,
  Home,
  Plus,
  FolderOpen,
  Gauge,
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
  availableProjects?: Array<{ id: string; name: string; format?: string; genre?: string; description?: string }>;
  onSelectProject?: (id: string, name: string) => void;
}

const ShellLayout: React.FC<ShellLayoutProps> = ({
  projectId,
  projectName,
  activeStage,
  onStageSelect,
  onChangeProject,
  availableProjects = [],
  onSelectProject,
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
    | 'theater'
  >('agents');

  // Modals & Menus
  const [showRoomDropdown, setShowRoomDropdown] = useState<boolean>(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState<boolean>(false);
  const [showPitchBibleModal, setShowPitchBibleModal] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showNvidiaModal, setShowNvidiaModal] = useState<boolean>(false);
  const [showDCCModal, setShowDCCModal] = useState<boolean>(false);
  const [showVideoTourModal, setShowVideoTourModal] = useState<boolean>(false);
  const [briefingType, setBriefingType] = useState<'morning' | 'evening' | null>(null);

  // Auto-fire Morning Briefing once per day
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      if (typeof window !== 'undefined' && localStorage.getItem('arise_last_morning_briefing') !== today) {
        setBriefingType('morning');
        localStorage.setItem('arise_last_morning_briefing', today);
      }
    } catch {}
  }, []);

  // Active Studio Licensing Tier (Default: Enterprise $299/mo)
  const [studioTier, setStudioTier] = useState<string>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('arise_studio_tier') || 'enterprise' : 'enterprise'
  );

  // Performance Mode: disables the blurred glass-card effect stacked over the
  // 3D canvas (rooms like Distribution stack a dozen+ at once). Auto-enables
  // for users with prefers-reduced-motion set; otherwise persisted per-user.
  const [perfMode, setPerfMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('arise_perf_mode');
    if (saved !== null) return saved === 'lite';
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-perf-mode', perfMode ? 'lite' : 'full');
    localStorage.setItem('arise_perf_mode', perfMode ? 'lite' : 'full');
  }, [perfMode]);

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
  const { projectStatus, isConnected, lastError, telemetry, sendCommand } = useStudioSocket({
    projectId: effectiveProjectId,
    projectName,
  });

  const [availableModels, setAvailableModels] = useState<Array<{ id: string; name: string; description?: string }>>([
    { id: 'nvidia/nemotron-3-super-120b-a12b', name: 'Nemotron-3-Super 120B (Active Flagship)', description: 'Primary agent brain — 128K context, high-end screenplay reasoning, and reliable autonomous tool calling' },
    { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning', name: 'Nemotron-3-Nano Reasoning 30B', description: 'Fast reasoning and rapid beat breakdown with full tool calling' },
    { id: 'minimaxai/minimax-m3', name: 'MiniMax-M3 (Creative Narrative)', description: 'High-fidelity creative writing, dialogue pacing, and verified function calling' },
    { id: 'moonshotai/kimi-k3', name: 'Moonshot Kimi K3 (Long Context)', description: 'Ultra-long context document analysis, bible ingestion, and tool execution' },
    { id: 'google/diffusiongemma-26b-a4b-it', name: 'Google DiffusionGemma 26B', description: 'Generative prompt compilation and diffusion control tuning' },
    { id: 'meta/llama-3.2-11b-vision-instruct', name: 'Llama 3.2 11B Vision Instruct (Vision Tasks Only)', description: 'Multimodal vision parsing, storyboard analysis, and image inspection tasks' },
  ]);

  // Fetch NVIDIA NIM Key Status & default model on mount with localStorage backup
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('arise_nvidia_api_key');
      if (savedKey && savedKey.startsWith('nvapi-')) {
        setHasKey(true);
        setMaskedKey(`${savedKey.slice(0, 10)}...${savedKey.slice(-4)}`);
      }
      const savedModel = localStorage.getItem('arise_selected_model');
      const obsoleteModels = [
        'mistralai/mistral-large-2-instruct',
        'meta/llama-3.1-70b-instruct',
        'meta/llama-3.1-8b-instruct',
        'meta/llama-3.3-70b-instruct',
        'nvidia/llama-3.1-nemotron-70b-instruct',
        'meta/llama-3.2-3b-instruct',
        'meta/llama-3.2-1b-instruct',
        'mistralai/mistral-7b-instruct-v0.3',
      ];
      if (savedModel && !obsoleteModels.includes(savedModel)) {
        setDefaultModel(savedModel);
      } else if (savedModel) {
        localStorage.removeItem('arise_selected_model');
        setDefaultModel('nvidia/nemotron-3-super-120b-a12b');
      } else {
        setDefaultModel('nvidia/nemotron-3-super-120b-a12b');
      }
    } catch {}

    fetch(`${apiBase}/api/v1/nvidia/status`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          if (data.hasKey) {
            setHasKey(true);
            setMaskedKey(data.maskedKey || 'None');
          } else {
            // If backend is missing key but localStorage has it, sync to backend
            const localKey = localStorage.getItem('arise_nvidia_api_key');
            if (localKey && localKey.startsWith('nvapi-')) {
              fetch(`${apiBase}/api/v1/nvidia/set-key`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: localKey }),
              }).catch(() => {});
            }
          }
          if (data.availableModels && Array.isArray(data.availableModels) && data.availableModels.length > 0) {
            setAvailableModels(data.availableModels);
          }
          if (data.defaultModel) setDefaultModel(data.defaultModel);
        }
      })
      .catch(() => {});
  }, [apiBase]);

  // Handle Model Selection change
  const handleSelectModel = async (modelId: string) => {
    setDefaultModel(modelId);
    try {
      localStorage.setItem('arise_selected_model', modelId);
    } catch {}
    try {
      await fetch(`${apiBase}/api/v1/nvidia/set-model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId }),
      });
      toast.success(`Switched default inference to ${modelId.split('/')[1] || modelId}`);
    } catch {
      toast.success(`Active inference model updated to ${modelId.split('/')[1] || modelId}`);
    }
  };

  // Handle saving custom NVIDIA API Key with instant local resilience
  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = apiKeyInput.trim();
    if (!key) return;

    // 1. Immediately save to localStorage
    try {
      localStorage.setItem('arise_nvidia_api_key', key);
    } catch {}

    setHasKey(true);
    setMaskedKey(`${key.slice(0, 10)}...${key.slice(-4)}`);
    setApiKeyInput('');

    // 2. Sync to central backend
    try {
      const res = await fetch(`${apiBase}/api/v1/nvidia/set-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key }),
      }).then((r) => r.json());

      if (res && res.success) {
        if (res.maskedKey) setMaskedKey(res.maskedKey);
        toast.success('NVIDIA API Key securely saved and active across all studio agents!');
      } else {
        toast.success('NVIDIA API Key saved locally and active for studio agents!');
      }
    } catch {
      toast.success('NVIDIA API Key saved locally and active for studio agents!');
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
      <header className="flex items-center justify-between px-3 sm:px-5 py-2 bg-[#09041a]/95 border-b border-amber-500/30 select-none flex-shrink-0 backdrop-blur-2xl specular-border z-30 shadow-2xl gap-2 w-full">
        {/* Left Side: Arise Logo, Title, and Front of Studio Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <button
            type="button"
            onClick={onChangeProject}
            title="Return to Front of Studio & All Projects"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border-2 border-amber-500/60 bg-black flex-shrink-0 shadow-lg shadow-amber-500/25 p-0 flex items-center justify-center transition hover:scale-105 hover:border-amber-400 cursor-pointer"
          >
            <img
              src={ARISE_LOGO_BASE64}
              alt="Arise Productions"
              className="w-full h-full object-cover rounded-xl"
            />
          </button>

          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
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

          {/* Quick Front of Studio / New Production / Rooms Menu Buttons */}
          <div className="flex items-center space-x-1 pl-1.5 sm:pl-2 border-l border-amber-500/30 relative flex-shrink-0">
            <button
              type="button"
              onClick={onChangeProject}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold transition flex items-center gap-1 shadow-sm whitespace-nowrap cursor-pointer"
              title="Return to Front of Studio & All Projects"
            >
              <Home size={13} />
              <span className="hidden xl:inline">Front</span>
            </button>

            {/* Quick Projects Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowProjectDropdown((prev) => !prev);
                  setShowRoomDropdown(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm ${
                  showProjectDropdown
                    ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black border border-amber-300'
                    : 'bg-[#150a2e] hover:bg-[#200f45] text-amber-200 border border-amber-500/50'
                }`}
                title="Switch Active Production"
              >
                <Film size={13} className={showProjectDropdown ? 'text-black' : 'text-amber-400'} />
                <span className="truncate max-w-[110px] sm:max-w-[160px] font-bold">{projectName}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${showProjectDropdown ? 'rotate-180 text-black' : 'text-amber-400/80'}`} />
              </button>

              {showProjectDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProjectDropdown(false)}
                  />
                  <div
                    className="absolute left-0 mt-2 w-80 top-full bg-[#0d0722]/98 border-2 border-amber-500/60 rounded-2xl shadow-2xl backdrop-blur-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                    style={{ boxShadow: '0 16px 48px rgba(0, 0, 0, 0.95), 0 0 24px rgba(245, 158, 11, 0.4)' }}
                  >
                    <div className="flex items-center justify-between px-2 py-1.5 border-b border-amber-500/30 mb-2">
                      <span className="text-[10px] uppercase font-mono font-black tracking-widest text-amber-400">
                        Select Active Production
                      </span>
                      <span className="text-[9px] font-mono text-amber-300/80 font-bold">{availableProjects.length} Titles</span>
                    </div>

                    <div className="space-y-1 max-h-72 overflow-y-auto custom-scrollbar text-[11px] font-mono">
                      {availableProjects.map((p) => {
                        const isCurrent = p.id === effectiveProjectId;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              if (onSelectProject) onSelectProject(p.id, p.name);
                              setShowProjectDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer ${
                              isCurrent
                                ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/30'
                                : 'hover:bg-amber-500/20 text-slate-200 hover:text-amber-200 border border-transparent hover:border-amber-500/40'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <div className="font-bold truncate">{p.name}</div>
                              {p.genre && <div className="text-[9px] opacity-70 truncate">{p.genre}</div>}
                            </div>
                            <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${
                              isCurrent ? 'bg-black/20 text-black' : 'bg-purple-950/80 text-amber-300 border border-purple-700/50'
                            }`}>
                              {p.format === 'episodic_tv' ? 'TV' : 'Film'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Rooms Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowRoomDropdown((prev) => !prev);
                  setShowProjectDropdown(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm ${
                  showRoomDropdown
                    ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black border border-amber-300'
                    : 'bg-[#1f133f] hover:bg-[#2d1b5a] text-amber-300 border border-amber-500/50'
                }`}
                title="Open Studio Rooms & Stages Menu"
              >
                <Menu size={13} className={showRoomDropdown ? 'text-black' : 'text-amber-400'} />
                <span>Rooms</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${showRoomDropdown ? 'rotate-180 text-black' : 'text-amber-400/80'}`} />
              </button>

              {showRoomDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowRoomDropdown(false)}
                  />
                  <div
                    className="absolute left-0 mt-2 w-80 top-full bg-[#0d0722]/98 border-2 border-amber-500/60 rounded-2xl shadow-2xl backdrop-blur-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                    style={{ boxShadow: '0 16px 48px rgba(0, 0, 0, 0.95), 0 0 24px rgba(245, 158, 11, 0.4)' }}
                  >
                    <div className="flex items-center justify-between px-2 py-1.5 border-b border-amber-500/30 mb-2">
                      <span className="text-[10px] uppercase font-mono font-black tracking-widest text-amber-400">
                        Studio Navigation Menu
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                      {[
                        { id: 'agents', name: 'Command Center', icon: '🏛️' },
                        { id: 'stage', name: '3D Soundstage', icon: '🎬' },
                        { id: 'ideas', name: '00: Ideas', icon: '💡' },
                        { id: 'plot', name: '01: Plot Room', icon: '📖' },
                        { id: 'characters', name: '02: Cast Room', icon: '🎭' },
                        { id: 'acts', name: '03: Acts Room', icon: '📑' },
                        { id: 'beats', name: '04: Beats Room', icon: '⚡' },
                        { id: 'architecture', name: '3D Campus', icon: '🏢' },
                        { id: 'screening', name: 'Screening Room', icon: '📽️' },
                        { id: 'suites', name: 'Original Suites', icon: '🎛️' },
                        { id: 'vault', name: 'Memory Vault', icon: '🗄️' },
                        { id: 'distribution', name: '05: Distribution', icon: '🌐' },
                        { id: 'theater', name: 'Arise Cinema', icon: '🍿' },
                      ].map((room) => (
                        <button
                          key={room.id}
                          type="button"
                          onClick={() => {
                            setMainView(room.id as any);
                            setShowRoomDropdown(false);
                          }}
                          className={`flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer ${
                            mainView === room.id
                              ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/30'
                              : 'hover:bg-amber-500/20 text-slate-200 hover:text-amber-200 border border-transparent hover:border-amber-500/40'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-sm">{room.icon}</span>
                            <span className="truncate text-[10.5px] font-semibold">{room.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center Mode Switcher & Navigation with Left/Right Scroll Arrows & Clean Container */}
        <div className="flex items-center space-x-1 flex-1 min-w-0 px-1 overflow-hidden">
          <button
            type="button"
            onClick={() => scrollNav('left')}
            className="p-1 rounded-xl bg-[#140e2e] hover:bg-[#201548] text-amber-400 border border-amber-500/30 flex-shrink-0 transition shadow-sm hover:border-amber-400 cursor-pointer active:scale-95"
            title="Scroll Navigation Left"
          >
            <ChevronLeft size={13} />
          </button>

          <div
            ref={navScrollRef}
            className="flex items-center space-x-1 enterprise-nav-scrollbar no-scrollbar scroll-smooth flex-1 min-w-0"
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

              {/* 3. 3D Spatial Architecture */}
              <button
                onClick={() => setMainView('architecture')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  mainView === 'architecture'
                    ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-amber-500/20'
                    : 'text-amber-200/80 hover:text-white hover:bg-amber-950/40'
                }`}
              >
                <Building2 size={12} />
                <span>Campus</span>
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
            className="p-1 rounded-xl bg-[#140e2e] hover:bg-[#201548] text-amber-400 border border-amber-500/30 flex-shrink-0 transition shadow-sm hover:border-amber-400 cursor-pointer active:scale-95"
            title="Scroll Navigation Right"
          >
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Right Tools & Active Project HUD */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {/* Master Studio Video Tour Modal Trigger */}
          <button
            onClick={() => setShowVideoTourModal(true)}
            className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono transition shadow-sm font-bold flex-shrink-0 cursor-pointer"
            title="Watch Master Live Action Studio Video Tour"
          >
            <Film size={12} className="text-amber-400" />
            <span className="hidden 2xl:inline">Tour</span>
          </button>

          {/* Hollywood Pitch Bible Button */}
          <button
            onClick={() => setShowPitchBibleModal(true)}
            className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono transition shadow-sm font-bold flex-shrink-0 cursor-pointer"
            title="Open Hollywood Pitch & Story Bible"
          >
            <FileText size={12} className="text-amber-400" />
            <span className="hidden xl:inline">Bible</span>
          </button>

          {/* Studio Desk Morning / Evening Briefing Buttons */}
          <button
            onClick={() => setBriefingType('morning')}
            className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono transition shadow-sm font-bold flex-shrink-0 cursor-pointer"
            title="Open Morning Briefing from Studio Desk"
          >
            <span>☀️</span>
            <span className="hidden xl:inline">Briefing</span>
          </button>

          <button
            onClick={() => setBriefingType('evening')}
            className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 text-[11px] font-mono transition shadow-sm flex-shrink-0 cursor-pointer"
            title="End of Day Wrap from Studio Desk"
          >
            <span>🌙</span>
            <span className="hidden xl:inline">Wrap</span>
          </button>

          {/* NVIDIA NIM Free Tier Button */}
          <button
            onClick={() => setShowNvidiaModal(true)}
            className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 text-[11px] font-mono transition shadow-sm flex-shrink-0 cursor-pointer"
            title="NVIDIA NIM AI Configuration"
          >
            <Cpu size={12} className="text-purple-400" />
            <span className="font-bold truncate max-w-[70px] hidden sm:inline">{defaultModel.split('/')[1] || 'Llama'}</span>
          </button>

          {/* External DCC Bridges Button (Unreal Engine 5 & ComfyUI) */}
          <button
            onClick={() => setShowDCCModal(true)}
            className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-[#150a2e] hover:bg-[#220f4b] text-amber-300 border border-amber-500/40 text-[11px] font-mono transition shadow-sm font-bold flex-shrink-0 cursor-pointer"
            title="External DCC Bridges: Unreal Engine 5 & ComfyUI"
          >
            <Layers size={12} className="text-amber-400" />
            <span className="hidden xl:inline">DCC Bridges</span>
          </button>

          {/* Active Enterprise Tier License Badge */}
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-black border border-amber-300 text-[11px] font-mono transition shadow-lg shadow-amber-500/25 cursor-pointer active:scale-95 flex-shrink-0"
            title="Arise Studio Enterprise ($299/mo) Active"
          >
            <Crown size={12} fill="currentColor" />
            <span className="uppercase tracking-wider hidden lg:inline">
              {studioTier === 'enterprise' ? 'Enterprise' : 'Pro'}
            </span>
          </button>

          {/* Performance Mode Toggle */}
          <button
            type="button"
            onClick={() => setPerfMode((v) => !v)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-xl border text-[11px] font-mono font-bold transition flex-shrink-0 cursor-pointer ${
              perfMode
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                : 'bg-[#1a0e36] hover:bg-[#271552] border-purple-800/60 text-amber-200'
            }`}
            title={perfMode ? 'Performance Mode is ON' : 'Turn on Performance Mode'}
          >
            <Gauge size={12} className={perfMode ? 'text-sky-400' : 'text-amber-400'} />
            <span className="hidden 2xl:inline">{perfMode ? 'Lite' : 'Full'}</span>
          </button>

          {/* Studio Bridge Connection Status */}
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-xl border text-[11px] font-mono font-bold transition flex-shrink-0 ${
              isConnected
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/15 border-red-500/50 text-red-300 animate-pulse'
            }`}
            title={isConnected ? 'Bridge Online' : lastError || 'Bridge Offline'}
          >
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                isConnected ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]'
              }`}
            />
            <span className="hidden xl:inline">{isConnected ? 'Online' : 'Offline'}</span>
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
                onHandoff={(targetStageId) => {
                  if (onStageSelect) {
                    onStageSelect(targetStageId);
                  }
                }}
              />
            )}

            {mainView === 'ideas' && (
              <IdeaRoom
                onPromoteToProject={(newPid, newName) => {
                  if (onSelectProject) {
                    onSelectProject(newPid, newName);
                  }
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
                  if (['plot', 'characters', 'acts', 'beats', 'screening', 'architecture', 'suites', 'vault', 'distribution', 'ideas', 'agents', 'theater'].includes(roomKey)) {
                    setMainView(roomKey as any);
                  } else {
                    setMainView('stage');
                    onStageSelect(roomKey);
                  }
                }}
              />
            )}

            {mainView === 'theater' && (
              <AudienceTheaterPortal
                initialProjectId={effectiveProjectId}
                onSwitchToStudio={() => setMainView('stage')}
              />
            )}
            {/* Translucent Arise Productions Watermark Seal */}
            <div className="absolute bottom-3 right-4 z-20 pointer-events-none">
              <StudioWatermark variant="subtle" showCopyright={true} />
            </div>
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
            <span className="text-slate-700">•</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-950/70 border border-purple-800/50 text-purple-300 font-bold flex items-center gap-1 shadow-sm" title="Live Build & Commit Stamp">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>BUILD: {((import.meta as any).env?.VITE_COMMIT_SHA || 'dev').toUpperCase()} • {(import.meta as any).env?.VITE_BUILD_TIME || 'live'}</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Studio Desk Chief of Staff Morning / Evening Briefing Modal */}
      {briefingType && (
        <StudioDeskBriefing
          projectId={effectiveProjectId}
          type={briefingType}
          onClose={() => setBriefingType(null)}
        />
      )}

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
                {availableModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectModel(m.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      defaultModel === m.id
                        ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{m.name}</div>
                      {m.description && <div className="text-[10px] text-slate-400 font-sans mt-0.5">{m.description}</div>}
                    </div>
                    {defaultModel === m.id && <Check size={14} className="text-emerald-400 flex-shrink-0" />}
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
      {/* Studio Video Tour Modal */}
      <StudioVideoTourModal
        isOpen={showVideoTourModal}
        onClose={() => setShowVideoTourModal(false)}
      />

      {/* External DCC Bridges Telemetry & Live Link Modal */}
      <DCCBridgesModal
        isOpen={showDCCModal}
        onClose={() => setShowDCCModal(false)}
      />
    </div>
  );
};

export default ShellLayout;
