"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  DEPARTMENT_AGENTS,
  DepartmentAgent,
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
  onNavigateToRoom?: (roomKey: string) => void;
}

import { FloatingAriseLogo3D } from '../3d/FloatingAriseLogo3D';

// 3D Interactive Holographic Agent Pedestal with Floating 3D Arise Logo
const AgentHologram3D: React.FC<{ agent: DepartmentAgent }> = ({ agent }) => {
  return (
    <group position={[0, -0.2, 0]}>
      {/* 3D Golden Pedestal Base */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[2.2, 2.5, 0.4, 32]} />
        <meshStandardMaterial color="#0d0822" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 3D Dynamic Floating & Rotating Arise Productions Logo */}
      <React.Suspense fallback={null}>
        <FloatingAriseLogo3D
          position={[0, 0.35, 0]}
          scale={0.82}
          showText={true}
          textTitle={agent.name.toUpperCase()}
          textSubtitle={agent.role.toUpperCase()}
        />
      </React.Suspense>
    </group>
  );
};

export const DepartmentAgentsHub: React.FC<DepartmentAgentsHubProps> = ({
  projectName,
  projectId = 'default',
  onNavigateToRoom,
}) => {
  const apiBase = getAPIBaseURL();
  const [selectedAgentId, setSelectedAgentId] = useState<string>('assistant');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMemoryVault, setShowMemoryVault] = useState<boolean>(false);
  const [show3DHologram, setShow3DHologram] = useState<boolean>(true);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load chat history when switching agent or project
  const loadChatHistory = async (agentId: string) => {
    try {
      const res = await fetch(`${apiBase}/api/v1/agents/history/${agentId}?projectId=${projectId}`).then((r) => r.json());
      if (res.success && Array.isArray(res.history)) {
        setMessages(res.history);
      } else {
        setMessages([]);
      }
    } catch (e) {
      setMessages([]);
    }
  };

  // Load persistent studio memories
  const loadMemories = async () => {
    try {
      const res = await fetch(`${apiBase}/api/v1/studio/memory`).then((r) => r.json());
      if (res.success && Array.isArray(res.memories)) {
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
      id: `temp-${Date.now()}`,
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
      }).then((r) => r.json());

      if (res.success && res.assistantMessage) {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
          return [...filtered, res.userMessage, res.assistantMessage];
        });
      } else {
        toast.error(res.error || 'Failed to get agent response');
      }
    } catch (err: any) {
      toast.error('Network error communicating with agent');
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
      <div className="flex items-center justify-between px-6 py-3 bg-[#0d0722]/95 border-b border-amber-500/30 backdrop-blur-md flex-shrink-0 z-10 shadow-lg">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400 bg-black flex-shrink-0 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <img src={ARISE_LOGO_BASE64} alt="Arise Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase font-serif">
                ARISE EXECUTIVE BOARDROOM
              </h2>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/50 font-mono font-bold">
                10 TRAINED LEADS
              </span>
            </div>
            <p className="text-[10px] text-amber-200/70 font-mono tracking-wider">
              PROJECT CONTEXT: <strong className="text-amber-300">{projectName.toUpperCase()}</strong> • 3D SPATIAL & PERSISTENT MEMORY SYNCED
            </p>
          </div>
        </div>

        {/* Right Tools: 3D Hologram Toggle & Memory Vault */}
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setShow3DHologram((prev) => !prev)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition ${
              show3DHologram
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md shadow-amber-500/20'
                : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40 hover:text-white'
            }`}
          >
            {show3DHologram ? <Eye size={13} className="text-amber-400" /> : <EyeOff size={13} className="text-purple-400" />}
            <span>3D Hologram {show3DHologram ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowMemoryVault((prev) => !prev)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition shadow-sm ${
              showMemoryVault
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-amber-500/20'
                : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40 hover:text-white'
            }`}
          >
            <Brain size={13} className={showMemoryVault ? 'text-amber-400' : 'text-purple-400'} />
            <span>Studio Memory Vault ({memories.length})</span>
          </button>
        </div>
      </div>

      {/* Main Boardroom Workspace */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Left: Department Agent Roster */}
        <aside className="w-72 xl:w-80 flex-shrink-0 border-r border-amber-500/20 bg-[#080418]/95 flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b border-amber-500/20">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-amber-400" />
              <input
                type="text"
                placeholder="Search department leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#12082b] border border-amber-500/30 rounded-xl text-xs text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {/* Agents List */}
          <div className="flex-grow overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
            {filteredAgents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all duration-150 flex items-start space-x-3 ${
                    isSelected
                      ? `bg-gradient-to-r from-amber-500/20 to-purple-900/40 border-amber-400 shadow-lg shadow-amber-500/10`
                      : `bg-[#0f0727]/60 border-amber-500/10 hover:bg-[#160a36] hover:border-amber-500/30`
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-base flex-shrink-0 shadow-md border border-white/20`}>
                    {agent.avatar}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-amber-100'}`}>
                        {agent.name}
                      </h4>
                      <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                        {agent.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-200/60 truncate font-sans">{agent.role}</p>
                    <div className="flex items-center gap-1 mt-1 text-[9px] font-mono text-purple-400/70">
                      <span>{agent.department}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Council Mode Banner */}
          <div className="p-3 border-t border-amber-500/20 bg-[#0d0722]">
            <button
              onClick={() => setSelectedAgentId('roundtable')}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono font-bold transition ${
                selectedAgentId === 'roundtable'
                  ? 'bg-gradient-to-r from-amber-500/30 via-purple-600/30 to-yellow-500/30 border-amber-400 text-amber-200 shadow-md'
                  : 'bg-purple-950/50 border-amber-500/30 text-amber-200 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>🏛️</span>
                <span>Council Round Table</span>
              </div>
              <ChevronRight size={14} className="text-amber-400" />
            </button>
          </div>
        </aside>

        {/* Center: Live Chat & 3D Interactive Stage */}
        <main className="flex-grow flex flex-col bg-[#05030c] overflow-hidden min-h-0">
          {/* Agent Header */}
          <div className="px-6 py-3 bg-[#0d0722]/95 border-b border-amber-500/20 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3.5">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${currentAgent.color} flex items-center justify-center text-xl shadow-lg border border-amber-400/40`}>
                {currentAgent.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase font-serif tracking-wide">
                    {currentAgent.name}
                  </h3>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE & MEMORY SYNCED
                  </span>
                </div>
                <p className="text-[11px] text-amber-200/70 font-sans max-w-xl truncate">
                  {currentAgent.role} • {currentAgent.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-1.5 text-purple-400 hover:text-rose-400 hover:bg-purple-950/60 rounded-lg transition"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Optional 3D Holographic Pedestal Canvas */}
          {show3DHologram && (
            <div className="h-44 w-full bg-gradient-to-b from-[#0a051c] to-[#05030c] border-b border-amber-500/20 relative flex-shrink-0">
              <Canvas
                camera={{ position: [0, 0.8, 3.8], fov: 45 }}
                className="w-full h-full"
              >
                <ambientLight intensity={0.6} color="#fde047" />
                <pointLight position={[3, 4, 3]} intensity={2.0} color="#fbbf24" />
                <pointLight position={[-3, 2, 2]} intensity={1.2} color="#a855f7" />
                <AgentHologram3D agent={currentAgent} />
              </Canvas>
              <div className="absolute top-2 right-3 pointer-events-none text-[9px] font-mono text-amber-400/80 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
                3D HOLOGRAPHIC STAGE
              </div>
            </div>
          )}

          {/* Quick Prompt Pills */}
          <div className="px-6 py-2 bg-[#090416] border-b border-amber-500/20 flex items-center space-x-2 overflow-x-auto no-scrollbar flex-shrink-0">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1 flex-shrink-0">
              <Zap size={11} /> Quick Directives:
            </span>
            {currentAgent.quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-[#150a30] hover:bg-[#200f48] border border-amber-500/30 text-[10px] text-amber-200 whitespace-nowrap transition flex-shrink-0 hover:border-amber-400"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-grow p-6 overflow-y-auto space-y-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-3 opacity-90">
                <div className={`w-14 h-14 rounded-3xl bg-gradient-to-br ${currentAgent.color} flex items-center justify-center text-3xl shadow-xl border border-amber-400/40`}>
                  {currentAgent.avatar}
                </div>
                <h4 className="text-base font-bold text-amber-200 font-serif">
                  Consult with {currentAgent.name}
                </h4>
                <p className="text-xs text-amber-100/70 leading-relaxed font-sans">
                  {currentAgent.description} Ask questions, direct scene updates, brainstorm new concepts, or collaborate on your production.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 justify-center">
                  {currentAgent.primaryRooms.map((room, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#160a36] border border-amber-500/30 text-amber-300">
                      📍 {room}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 shadow-md border ${
                        isUser
                          ? 'bg-gradient-to-br from-amber-600 to-yellow-600 border-amber-400/60'
                          : `bg-gradient-to-br ${currentAgent.color} border-amber-400/40`
                      }`}
                    >
                      {isUser ? '👤' : currentAgent.avatar}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[78%] rounded-2xl p-4 space-y-1.5 shadow-lg select-text ${
                        isUser
                          ? 'bg-[#221245] border border-amber-500/40 text-amber-100'
                          : 'bg-[#12082b]/95 border border-amber-500/30 text-slate-100 backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-1">
                        <span className={`text-[10px] font-mono font-bold ${isUser ? 'text-amber-300' : 'text-amber-400'}`}>
                          {isUser ? 'Producer (You)' : (msg.agentName || currentAgent.name)}
                        </span>
                        <span className="text-[9px] font-mono text-purple-400/60">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Content with whitespace preservation */}
                      <div className="text-xs font-sans leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>

                      {/* Assistant Actions (Save to Memory Vault) */}
                      {!isUser && (
                        <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[10px] font-mono text-amber-400/80">
                          <button
                            onClick={() => handleSaveToMemory(msg.content)}
                            className="flex items-center space-x-1 hover:text-amber-300 transition"
                          >
                            <BookmarkPlus size={11} />
                            <span>Bookmark to Studio Memory</span>
                          </button>

                          {msg.metadata?.model && (
                            <span className="text-[9px] text-purple-400">
                              ⚡ {msg.metadata.model.split('/')[1] || msg.metadata.model}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${currentAgent.color} flex items-center justify-center text-sm flex-shrink-0 animate-pulse`}>
                  {currentAgent.avatar}
                </div>
                <div className="p-3.5 rounded-2xl bg-[#12082b] border border-amber-500/40 text-xs font-mono text-amber-300 flex items-center space-x-2">
                  <RefreshCw className="animate-spin w-3.5 h-3.5 text-amber-400" />
                  <span>{currentAgent.name} is formulating production direction...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-4 bg-[#0d0722]/95 border-t border-amber-500/30 flex-shrink-0">
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
                  className="w-full px-4 py-2.5 bg-[#150a30] border border-amber-500/40 rounded-2xl text-xs text-slate-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 resize-none font-sans select-text shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:opacity-40 text-black font-bold rounded-2xl transition shadow-lg shadow-amber-500/20 flex items-center space-x-2 text-xs uppercase tracking-wider flex-shrink-0"
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
