"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  DEPARTMENT_AGENTS,
  DepartmentAgent,
  PRODUCTION_CHAIN_RELAY,
} from '../../constants/departmentAgents';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Bookmark,
  BookmarkPlus,
  RefreshCw,
  Layers,
  ArrowRight,
  Database,
  Brain,
  MessageSquare,
  Search,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Cpu,
  CornerDownRight,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAPIBaseURL } from '../../lib/api';
import { ARISE_LOGO_BASE64 } from '../../constants/branding';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agentName?: string;
  timestamp: string;
  metadata?: {
    model?: string;
    stageId?: string;
  };
}

export interface StudioMemory {
  id: string;
  category: string;
  title: string;
  content: string;
  timestamp: string;
}

interface DepartmentAgentsHubProps {
  projectName: string;
  projectId?: string;
  activeStageId?: string;
  onSelectStage?: (stageId: string) => void;
  onNavigateToRoom?: (roomKey: string) => void;
}

import { FloatingAriseLogo3D } from '../3d/FloatingAriseLogo3D';

// 3D Interactive Holographic Stage with Floating 3D Arise Letters
const AgentHologram3D: React.FC<{ agent: DepartmentAgent }> = ({ agent }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* 3D Dynamic Floating Individual Arise Letters with Drop Shadows */}
      <React.Suspense fallback={null}>
        <FloatingAriseLogo3D
          position={[0, 0.1, 0]}
          scale={0.88}
        />
      </React.Suspense>
    </group>
  );
};

export const DepartmentAgentsHub: React.FC<DepartmentAgentsHubProps> = ({
  projectName,
  projectId = 'default',
  activeStageId = 'script',
  onSelectStage,
  onNavigateToRoom,
}) => {
  const apiBase = getAPIBaseURL();
  const [selectedAgentId, setSelectedAgentId] = useState<string>('assistant');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMemoryVault, setShowMemoryVault] = useState<boolean>(false);
  const [show3DHologram, setShow3DHologram] = useState<boolean>(false);
  const [memories, setMemories] = useState<StudioMemory[]>([]);
  const [newMemCategory, setNewMemCategory] = useState<string>('Creative Note');
  const [newMemTitle, setNewMemTitle] = useState<string>('');
  const [newMemContent, setNewMemContent] = useState<string>('');
  const [isSavingMem, setIsSavingMem] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAgent = DEPARTMENT_AGENTS.find((a) => a.id === selectedAgentId) || DEPARTMENT_AGENTS[0];

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history when switching agent or project with strict agent thread isolation
  const loadChatHistory = async (agentId: string) => {
    // 1. Immediately reset messages to avoid displaying previous agent's messages
    setMessages([]);

    // 2. Load agent-specific local history for this project
    try {
      const saved = localStorage.getItem(`arise_chat_${projectId}_${agentId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {}

    // 3. Fetch latest synced history from backend server
    try {
      const res = await fetch(`${apiBase}/api/v1/agents/history/${agentId}?projectId=${projectId}`).then((r) => r.json());
      if (res && res.success && Array.isArray(res.history)) {
        setMessages(res.history);
        try {
          localStorage.setItem(`arise_chat_${projectId}_${agentId}`, JSON.stringify(res.history));
        } catch {}
      }
    } catch (e) {}
  };

  // Load persistent studio memories
  const loadMemories = async () => {
    try {
      const res = await fetch(`${apiBase}/api/v1/studio/memory`).then((r) => r.json());
      if (res && res.success && Array.isArray(res.memories)) {
        setMemories(res.memories);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadChatHistory(selectedAgentId);
    loadMemories();
  }, [selectedAgentId, projectId, apiBase]);

  // Send message to Agent
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    setInputMessage('');
    setIsLoading(true);

    const tempUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      agentName: 'Producer (You)',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch(`${apiBase}/api/v1/agents/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: currentAgent.id,
          agentName: currentAgent.name,
          role: currentAgent.role,
          message: textToSend.trim(),
          systemPrompt: currentAgent.systemPrompt,
          projectId,
        }),
      }).then((r) => r.json()).catch((e) => ({ success: false, error: e.message || 'Fetch failed' }));

      if (res && res.success && res.assistantMessage && res.assistantMessage.content) {
        if (res.actions && res.actions.length > 0) {
          res.actions.forEach((act: any) => {
            if (act.tool === 'run_stage') {
              toast.success(`🟢 Executed Stage: ${act.args?.stageId} on Shot ${act.args?.shotNumber || 1}`, { icon: '🎬' });
            } else if (act.tool === 'save_script') {
              toast.success(`💾 Screenplay saved for Shot ${act.args?.shotNumber || 1}!`, { icon: '✍️' });
            } else if (act.tool === 'get_episode_script') {
              toast.success(`📖 Retrieved stored screenplay for Shot ${act.args?.shotNumber || 1}`, { icon: '📜' });
            } else if (act.tool === 'get_story_bible') {
              toast.success(`🏛️ Loaded project manifest & story bible!`, { icon: '📂' });
            } else if (act.tool === 'handoff_to_agent') {
              toast(`🔄 Handoff to ${act.args?.stageId}: ${act.args?.reason || 'Stage transition'}`, { icon: '🚀' });
            }
          });
        }

        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
          return [...filtered, res.userMessage, res.assistantMessage];
        });
      } else {
        const errorContent = res?.error || res?.assistantMessage?.content || 'Unable to get response from AI agent. Please check your NVIDIA NIM connection in Settings.';
        const errorAssistantMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **AI Agent Notice:** ${errorContent}`,
          agentName: currentAgent.name,
          timestamp: new Date().toISOString(),
          metadata: { model: 'API Notice' },
        };
        setMessages((prev) => [...prev, errorAssistantMsg]);
      }
    } catch (err: any) {
      const errorAssistantMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Network Error:** ${err.message || 'Failed to reach Arise backend.'}`,
        agentName: currentAgent.name,
        timestamp: new Date().toISOString(),
        metadata: { model: 'Network Error' },
      };
      setMessages((prev) => [...prev, errorAssistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear agent conversation
  const handleClearHistory = async () => {
    if (!confirm(`Are you sure you want to clear chat history with ${currentAgent.name}?`)) return;
    try {
      const res = await fetch(`${apiBase}/api/v1/agents/history/${currentAgent.id}?projectId=${projectId}`, {
        method: 'DELETE',
      }).then((r) => r.json());

      if (res.success) {
        setMessages([]);
        toast.success(`Cleared history for ${currentAgent.name}`);
      }
    } catch (e) {
      toast.error('Failed to clear history');
    }
  };

  // Bookmark a chat snippet into permanent Studio Memory
  const handleSaveToMemory = async (content: string, title = 'Key Decision') => {
    try {
      const res = await fetch(`${apiBase}/api/v1/studio/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: currentAgent.department,
          title: `${currentAgent.name}: ${title}`,
          content: content.slice(0, 600),
        }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success('🧠 Added to Permanent Studio Memory Vault!');
        loadMemories();
      }
    } catch (e) {
      toast.error('Failed to save memory');
    }
  };

  // Create custom memory note
  const handleCreateMemoryNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemContent.trim()) return;
    setIsSavingMem(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/studio/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newMemCategory,
          title: newMemTitle.trim() || 'Studio Note',
          content: newMemContent.trim(),
        }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success('Note saved to Studio Memory');
        setNewMemTitle('');
        setNewMemContent('');
        loadMemories();
      }
    } catch (e) {
      toast.error('Error saving memory note');
    } finally {
      setIsSavingMem(false);
    }
  };

  // Delete memory note
  const handleDeleteMemory = async (id: string) => {
    try {
      const res = await fetch(`${apiBase}/api/v1/studio/memory/${id}`, {
        method: 'DELETE',
      }).then((r) => r.json());
      if (res.success) {
        toast.success('Memory deleted');
        loadMemories();
      }
    } catch (e) {
      toast.error('Failed to delete memory');
    }
  };

  const filteredAgents = DEPARTMENT_AGENTS.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#05030c] text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Hub Telemetry & Title Bar - Styled to Arise Productions Logo */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d0722]/95 border-b border-amber-500/30 backdrop-blur-md flex-shrink-0 z-10 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-400 bg-black flex-shrink-0 flex items-center justify-center shadow-md shadow-amber-500/20">
            <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase font-serif">
                ARISE COMMAND CENTER
              </h2>
              <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-500/50 font-mono font-bold">
                10 LEADS
              </span>
            </div>
            <p className="text-[9px] text-amber-200/70 font-mono tracking-wider truncate max-w-xs sm:max-w-md">
              PROJECT: <strong className="text-amber-300">{(projectName || "PRODUCTION").toUpperCase()}</strong> • 3D 4K & PERSISTENT MEMORY SYNCED
            </p>
          </div>
        </div>

        {/* Right Tools: 3D Soundstage Jump, 3D Hologram Toggle & Memory Vault */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => onNavigateToRoom && onNavigateToRoom(activeStageId || 'script')}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-black font-black text-[11px] font-mono transition shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
            title="Launch 3D Soundstage Spatial Workspace"
          >
            <span>🎬</span>
            <span>3D Soundstage</span>
          </button>

          <button
            onClick={() => setShow3DHologram((prev) => !prev)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl border text-[11px] font-mono transition ${
              show3DHologram
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm shadow-amber-500/20'
                : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40 hover:text-white'
            }`}
          >
            {show3DHologram ? <Eye size={12} className="text-amber-400" /> : <EyeOff size={12} className="text-purple-400" />}
            <span>Hologram {show3DHologram ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowMemoryVault((prev) => !prev)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl border text-[11px] font-mono transition shadow-sm ${
              showMemoryVault
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-amber-500/20'
                : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40 hover:text-white'
            }`}
          >
            <Brain size={12} className={showMemoryVault ? 'text-amber-400' : 'text-purple-400'} />
            <span>Memory Vault ({memories.length})</span>
          </button>
        </div>
      </div>

      {/* Main Boardroom Workspace */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Left: Department Agent Roster */}
        <aside className="w-64 xl:w-72 flex-shrink-0 border-r border-amber-500/20 bg-[#080418]/95 flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-2.5 border-b border-amber-500/20">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3 h-3 text-amber-400" />
              <input
                type="text"
                placeholder="Search department leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1 bg-[#12082b] border border-amber-500/30 rounded-xl text-[11px] text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {/* Agents List */}
          <div className="flex-grow overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredAgents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`w-full text-left p-2 rounded-xl border transition-all duration-150 flex items-start space-x-2.5 ${
                    isSelected
                      ? `bg-gradient-to-r from-amber-500/20 to-purple-900/40 border-amber-400 shadow-md shadow-amber-500/10`
                      : `bg-[#0f0727]/60 border-amber-500/10 hover:bg-[#160a36] hover:border-amber-500/30`
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-sm flex-shrink-0 shadow-sm border border-white/20`}>
                    {agent.avatar}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-[11px] font-bold truncate ${isSelected ? 'text-amber-300' : 'text-amber-100'}`}>
                        {agent.name}
                      </h4>
                      <span className="text-[7px] font-mono px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                        {agent.badge}
                      </span>
                    </div>
                    <p className="text-[9px] text-amber-200/60 truncate font-sans">{agent.role}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Council Mode Banner */}
          <div className="p-2 border-t border-amber-500/20 bg-[#0d0722]">
            <button
              onClick={() => setSelectedAgentId('roundtable')}
              className={`w-full p-2 rounded-xl border flex items-center justify-between text-[11px] font-mono font-bold transition ${
                selectedAgentId === 'roundtable'
                  ? 'bg-gradient-to-r from-amber-500/30 via-purple-600/30 to-yellow-500/30 border-amber-400 text-amber-200 shadow-md'
                  : 'bg-purple-950/50 border-amber-500/30 text-amber-200 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <span>🏛️</span>
                <span>Council Round Table</span>
              </div>
              <ChevronRight size={13} className="text-amber-400" />
            </button>
          </div>
        </aside>

        {/* Center: Live Chat & 3D Interactive Stage */}
        <main className="flex-1 flex flex-col bg-[#05030c] overflow-hidden min-h-0 relative">
          {/* Agent Header */}
          <div className="px-4 py-2.5 bg-[#0d0722]/95 border-b border-amber-500/20 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${currentAgent.color} flex items-center justify-center text-lg shadow-md border border-amber-400/40 flex-shrink-0`}>
                {currentAgent.avatar}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase font-serif tracking-wide truncate">
                    {currentAgent.name}
                  </h3>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE & MEMORY SYNCED
                  </span>
                </div>
                <p className="text-[11px] text-amber-200/70 font-sans truncate max-w-xl">
                  {currentAgent.role} • {currentAgent.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-1.5 text-purple-400 hover:text-rose-400 hover:bg-purple-950/60 rounded-lg transition"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Hologram Toggle Indicator */}
          {show3DHologram && (
            <div className="h-24 sm:h-28 w-full bg-gradient-to-b from-[#0a051c] to-[#05030c] border-b border-amber-500/20 relative flex-shrink-0 flex items-center justify-center">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span>HOLOGRAPHIC QUANTUM LINK ACTIVE</span>
              </div>
              <div className="absolute top-1.5 right-2 pointer-events-none text-[8px] font-mono text-amber-400/80 bg-black/60 px-1.5 py-0.2 rounded border border-amber-500/30">
                AI TELEMETRY
              </div>
            </div>
          )}

          {/* Compact Pipeline & Quick Directive Strip */}
          <div className="px-4 py-1.5 bg-[#090418] border-b border-amber-500/20 flex items-center justify-between overflow-x-auto no-scrollbar gap-3 flex-shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
              <span className="text-[10px] font-mono text-amber-300 font-bold uppercase flex items-center gap-1">
                <Layers size={11} className="text-amber-400" /> Pipeline:
              </span>
              <button
                onClick={() => onNavigateToRoom && onNavigateToRoom('plot')}
                className="px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/40 text-[9px] font-mono text-amber-200 hover:text-white flex items-center gap-1 transition whitespace-nowrap font-bold"
              >
                <span>01 Plot</span>
              </button>
              <button
                onClick={() => onNavigateToRoom && onNavigateToRoom('characters')}
                className="px-2 py-0.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/40 text-[9px] font-mono text-purple-200 hover:text-white flex items-center gap-1 transition whitespace-nowrap font-bold"
              >
                <span>02 Chars</span>
              </button>
              <button
                onClick={() => onNavigateToRoom && onNavigateToRoom('script')}
                className="px-2 py-0.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/40 text-[9px] font-mono text-rose-200 hover:text-white flex items-center gap-1 transition whitespace-nowrap font-bold"
              >
                <span>03 Script</span>
              </button>
              <button
                onClick={() => onNavigateToRoom && onNavigateToRoom('boards')}
                className="px-2 py-0.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/40 text-[9px] font-mono text-blue-200 hover:text-white flex items-center gap-1 transition whitespace-nowrap font-bold"
              >
                <span>04 Boards</span>
              </button>
              <button
                onClick={() => onNavigateToRoom && onNavigateToRoom('edit')}
                className="px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/40 text-[9px] font-mono text-emerald-200 hover:text-white flex items-center gap-1 transition whitespace-nowrap font-bold"
              >
                <span>05 Edit</span>
              </button>
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                <Zap size={11} /> Directives:
              </span>
              {currentAgent.quickPrompts.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-0.5 rounded-full bg-[#150a30] hover:bg-[#200f48] border border-amber-500/30 text-[10px] text-amber-200 whitespace-nowrap transition hover:border-amber-400"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Spacious Messages Stream */}
          <div className="flex-1 min-h-0 p-4 sm:p-6 md:p-8 overflow-y-auto space-y-5 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6 bg-[#0e0724]/70 border border-amber-500/30 rounded-3xl space-y-3.5 shadow-2xl my-auto">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentAgent.color} flex items-center justify-center text-3xl shadow-xl border border-amber-400/40`}>
                  {currentAgent.avatar}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-amber-200 font-serif">
                  Consult with {currentAgent.name}
                </h4>
                <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed font-sans">
                  {currentAgent.description} Ask questions, direct scene updates, brainstorm new concepts, or coordinate your production.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 justify-center">
                  {currentAgent.quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-[11px] font-mono px-3 py-1 rounded-xl bg-[#160a36] hover:bg-[#220e50] border border-amber-500/40 text-amber-300 transition text-left cursor-pointer"
                    >
                      💬 {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3.5 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 shadow-md border ${
                        isUser
                          ? 'bg-gradient-to-br from-amber-600 to-yellow-600 border-amber-400/60'
                          : `bg-gradient-to-br ${currentAgent.color} border-amber-400/40`
                      }`}
                    >
                      {isUser ? '👤' : currentAgent.avatar}
                    </div>

                    {/* Message Bubble - Generously Sized & Readable */}
                    <div
                      className={`max-w-[94%] sm:max-w-[90%] md:max-w-[85%] rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-xl select-text ${
                        isUser
                          ? 'bg-[#221245] border border-amber-500/50 text-amber-100'
                          : 'bg-[#12082b]/95 border border-amber-500/40 text-slate-100 backdrop-blur-md'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5">
                        <span className={`text-xs font-mono font-bold ${isUser ? 'text-amber-300' : 'text-amber-400'}`}>
                          {isUser ? 'Producer (You)' : (msg.agentName || currentAgent.name)}
                        </span>
                        <span className="text-[10px] font-mono text-purple-400/70">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Content with whitespace preservation and rich typography */}
                      <div className="text-sm sm:text-[15px] font-sans leading-relaxed whitespace-pre-wrap selection:bg-amber-500/30">
                        {msg.content}
                      </div>

                      {/* Assistant Actions & Proactive Stage Transitions */}
                      {!isUser && (
                        <div className="pt-2 border-t border-purple-900/40 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-amber-400/90 flex-wrap gap-2">
                            <button
                              onClick={() => handleSaveToMemory(msg.content)}
                              className="flex items-center space-x-1 hover:text-amber-300 transition"
                            >
                              <BookmarkPlus size={12} />
                              <span>Bookmark to Studio Memory</span>
                            </button>

                            {msg.metadata?.model && (
                              <span className="text-[10px] text-purple-400">
                                ⚡ {msg.metadata.model.split('/')[1] || msg.metadata.model}
                              </span>
                            )}
                          </div>

                          {/* Autonomous Tool Actions Executed */}
                          {msg.metadata?.actions && msg.metadata.actions.length > 0 && (
                            <div className="p-2 rounded-xl bg-black/40 border border-purple-800/60 space-y-1 text-[10px] font-mono">
                              <div className="text-amber-400 font-bold flex items-center gap-1">
                                <Zap size={11} className="text-amber-400 animate-pulse" />
                                <span>Autonomous Studio Actions Executed ({msg.metadata.actions.length}):</span>
                              </div>
                              {msg.metadata.actions.map((act: any, actIdx: number) => (
                                <div key={actIdx} className="flex items-center justify-between text-purple-200">
                                  <span className="text-emerald-400 font-bold">⚡ {act.tool}</span>
                                  <span className="text-slate-400 truncate max-w-[200px]">{JSON.stringify(act.args)}</span>
                                  <span className="text-emerald-300">✓ Complete</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Proactive Stage Handoff Chips */}
                          {onNavigateToRoom && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-white/5">
                              <span className="text-[9px] font-mono text-purple-300/60 uppercase">
                                Proactive Handoff:
                              </span>
                              {selectedAgentId === 'idea_architect' && (
                                <>
                                  <button
                                    onClick={() => onNavigateToRoom('ideas')}
                                    className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold transition flex items-center gap-1"
                                  >
                                    <span>💡 00 Idea Lab</span>
                                  </button>
                                  <button
                                    onClick={() => onNavigateToRoom('plot')}
                                    className="px-2 py-0.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/40 text-[10px] font-mono font-bold transition"
                                  >
                                    <span>💡 01 Plot Room</span>
                                  </button>
                                </>
                              )}

                              {selectedAgentId === 'tv_architect' && (
                                <>
                                  <button
                                    onClick={() => onNavigateToRoom('ideas')}
                                    className="px-2 py-0.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold transition"
                                  >
                                    <span>📺 00 Series Vault</span>
                                  </button>
                                  <button
                                    onClick={() => onNavigateToRoom('plot')}
                                    className="px-2 py-0.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/40 text-[10px] font-mono font-bold transition"
                                  >
                                    <span>💡 01 Plot Room</span>
                                  </button>
                                </>
                              )}

                              {selectedAgentId === 'short_form_lead' && (
                                <>
                                  <button
                                    onClick={() => onNavigateToRoom('ideas')}
                                    className="px-2 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold transition"
                                  >
                                    <span>⚡ 00 Short Film Lab</span>
                                  </button>
                                  <button
                                    onClick={() => onNavigateToRoom('previs')}
                                    className="px-2 py-0.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 text-[10px] font-mono font-bold transition"
                                  >
                                    <span>🎥 Stage 4: Previs</span>
                                  </button>
                                </>
                              )}

                              {selectedAgentId === 'screenwriter' && (
                                <>
                                  <button
                                    onClick={() => onNavigateToRoom('script')}
                                    className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold transition flex items-center gap-1"
                                  >
                                    <span>🎬 Stage 1: ScriptBreak</span>
                                  </button>
                                  <button
                                    onClick={() => onNavigateToRoom('characters')}
                                    className="px-2 py-0.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/40 text-[10px] font-mono font-bold transition"
                                  >
                                    <span>👥 02 Characters</span>
                                  </button>
                                </>
                              )}

                              {selectedAgentId === 'cinematographer' && (
                                <button
                                  onClick={() => onNavigateToRoom('previs')}
                                  className="px-2 py-0.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold transition flex items-center gap-1"
                                >
                                  <span>🎥 Stage 4: Previs Live</span>
                                </button>
                              )}

                              {selectedAgentId === 'prompt_engineer' && (
                                <>
                                  <button
                                    onClick={() => onNavigateToRoom('prompt')}
                                    className="px-2 py-0.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-[10px] font-mono font-bold transition"
                                  >
                                    <span>⚡ Stage 7: Prompt Slate</span>
                                  </button>
                                  <button
                                    onClick={() => onNavigateToRoom('boards')}
                                    className="px-2 py-0.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/40 text-[10px] font-mono font-bold transition"
                                  >
                                    <span>🎨 04 Storyboard Lab</span>
                                  </button>
                                </>
                              )}

                              {selectedAgentId === 'editor' && (
                                <button
                                  onClick={() => onNavigateToRoom('edit')}
                                  className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold transition flex items-center gap-1"
                                >
                                  <span>✂️ Stage 10: DaVinci Polish</span>
                                </button>
                              )}

                              {selectedAgentId === 'showrunner' && (
                                <>
                                  <button
                                    onClick={() => onNavigateToRoom('plot')}
                                    className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold transition"
                                  >
                                    <span>💡 01 Plot Room</span>
                                  </button>
                                  <button
                                    onClick={() => onNavigateToRoom('structure')}
                                    className="px-2 py-0.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/40 text-[10px] font-mono font-bold transition"
                                  >
                                    <span>📊 Stage 2: Structure</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="flex items-start space-x-3.5">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${currentAgent.color} flex items-center justify-center text-sm flex-shrink-0 animate-pulse`}>
                  {currentAgent.avatar}
                </div>
                <div className="p-4 rounded-2xl bg-[#12082b] border border-amber-500/40 text-xs font-mono text-amber-300 flex items-center space-x-2.5">
                  <RefreshCw className="animate-spin w-4 h-4 text-amber-400" />
                  <span>{currentAgent.name} is formulating production direction...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar & Sequential Chain-of-Custody Baton Relay */}
          <div className="p-3 sm:p-4 bg-[#0d0722]/95 border-t border-amber-500/30 flex-shrink-0">
            {PRODUCTION_CHAIN_RELAY[selectedAgentId] && (
              <div className="mb-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#170a35] via-[#281156] to-[#170a35] border border-amber-500/40 flex items-center justify-between gap-2 text-xs flex-wrap shadow-md">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-amber-400 font-bold font-mono text-[10px] uppercase flex items-center gap-1 flex-shrink-0">
                    <span>⚡</span>
                    <span>Next Relay:</span>
                  </span>
                  <span className="text-slate-200 text-xs font-medium truncate">
                    <strong className="text-amber-300">{PRODUCTION_CHAIN_RELAY[selectedAgentId].nextAgentName}</strong> ({PRODUCTION_CHAIN_RELAY[selectedAgentId].nextRole})
                  </span>
                  <span className="text-[10px] font-mono text-purple-300/80 bg-purple-950/80 px-2 py-0.2 rounded border border-purple-800/50 flex-shrink-0">
                    {PRODUCTION_CHAIN_RELAY[selectedAgentId].targetRoom}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const relay = PRODUCTION_CHAIN_RELAY[selectedAgentId];
                    setSelectedAgentId(relay.nextAgentId);
                    setInputMessage(relay.promptSuggestion);
                    toast.success(`🎯 Passed baton to ${relay.nextAgentName}! Prompt primed.`, { icon: '🎬' });
                  }}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 flex-shrink-0"
                >
                  <span>👉 Hand off to {PRODUCTION_CHAIN_RELAY[selectedAgentId].nextAgentName}</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-3"
            >
              <div className="flex-grow relative">
                <textarea
                  rows={2}
                  placeholder={`Instruct ${currentAgent.name} (or ask for specific scene/shot direction)...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="w-full px-4 py-3 bg-[#150a30] border border-amber-500/40 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 resize-none font-sans select-text shadow-inner min-h-[52px]"
                />
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 text-black font-black rounded-2xl transition flex items-center justify-center gap-1.5 flex-shrink-0 shadow-lg shadow-amber-500/25 uppercase font-mono text-xs tracking-wider cursor-pointer active:scale-95 min-h-[52px]"
              >
                <span>Send</span>
                <Send size={13} />
              </button>
            </form>
          </div>
        </main>

        {/* Right Drawer: Permanent Studio Memory Vault */}
        {showMemoryVault && (
          <aside className="w-80 xl:w-96 flex-shrink-0 border-l border-amber-500/30 bg-[#0d0722]/95 flex flex-col overflow-hidden z-20 backdrop-blur-md animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="text-amber-400 w-4 h-4" />
                <h4 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] to-[#FBBF24] uppercase font-serif">
                  Studio Memory Vault
                </h4>
              </div>
              <button
                onClick={() => setShowMemoryVault(false)}
                className="text-amber-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Add Memory Form */}
            <form onSubmit={handleCreateMemoryNote} className="p-3 border-b border-amber-500/30 space-y-2 bg-[#12082b]/70">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Note Title (e.g. Hero Arc)"
                  value={newMemTitle}
                  onChange={(e) => setNewMemTitle(e.target.value)}
                  className="flex-grow px-2.5 py-1.5 bg-[#180d38] border border-amber-500/40 rounded-xl text-[11px] text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 select-text font-mono"
                />
                <select
                  value={newMemCategory}
                  onChange={(e) => setNewMemCategory(e.target.value)}
                  className="px-2 py-1 bg-[#180d38] border border-amber-500/40 rounded-xl text-[10px] text-amber-200 focus:outline-none select-text"
                >
                  <option value="Creative Note">Creative</option>
                  <option value="Character Lore">Character</option>
                  <option value="Visual Style">Visual</option>
                  <option value="Audio Directive">Audio</option>
                </select>
              </div>

              <textarea
                rows={2}
                placeholder="Key story decision or production rule for all agents to remember..."
                value={newMemContent}
                onChange={(e) => setNewMemContent(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#180d38] border border-amber-500/40 rounded-xl text-[11px] text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 resize-none select-text"
              />

              <button
                type="submit"
                disabled={!newMemContent.trim() || isSavingMem}
                className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:opacity-40 text-black font-bold rounded-xl text-[10px] uppercase font-mono tracking-wider transition shadow-md"
              >
                + Commit to Studio Memory
              </button>
            </form>

            {/* Memory List */}
            <div className="flex-grow overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
              {memories.length === 0 ? (
                <div className="text-center p-6 text-amber-400/70 text-xs font-mono">
                  No memories stored yet. Notes saved here are remembered by all agents across all rooms.
                </div>
              ) : (
                memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3 rounded-2xl bg-[#140b33] border border-amber-500/30 space-y-1.5 text-xs relative group select-text"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                        {mem.category}
                      </span>
                      <button
                        onClick={() => handleDeleteMemory(mem.id)}
                        className="text-amber-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <h5 className="font-bold text-amber-200 text-xs">{mem.title}</h5>
                    <p className="text-[11px] text-amber-100/80 leading-relaxed font-sans">
                      {mem.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default DepartmentAgentsHub;
