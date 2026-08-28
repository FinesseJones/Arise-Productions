"use client";

import React, { useState, useEffect, useRef } from 'react';
import { StageKey } from '../types/types';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  RotateCcw,
  CheckCircle,
  Copy,
  Trash2,
  Paperclip,
  FileText,
  X,
  UploadCloud,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { sendChatMessage } from '../services/aiService';
import { getAPIBaseURL } from '../lib/api';

interface RoomAIChatProps {
  stageId: StageKey;
  roomName: string;
  projectName: string;
  shotNumber: number;
  onHandoff?: (targetStageId: string, contextSummary?: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  model?: string;
  actions?: Array<{ id?: string; tool: string; args: any; result: any }>;
  attachedFile?: { name: string; size: string };
}

const ROOM_ROLES: Record<string, { role: string; intro: string; quickPrompts: string[] }> = {
  script: {
    role: 'Lead Screenwriter & Narrative Architect AI',
    intro: 'Welcome to the Screenplay Room. I break down Hollywood Fountain scripts, refine character arcs, and format scene sluglines.',
    quickPrompts: [
      'Generate Hollywood Fountain screenplay for this shot',
      'Refine dialogue for higher emotional stakes',
      'Format action lines to standard Hollywood length',
      'Generate character motivation and voice model tags',
    ],
  },
  structure: {
    role: 'Showrunner & 3-Act Structure Supervisor AI',
    intro: 'Welcome to the Narrative Structure & Index Wall. I map 3-act pacing, midpoint shifts, and emotional climax beats.',
    quickPrompts: [
      'Analyze 3-act tension curve for Scene 1',
      'Insert an inciting incident plot twist',
      'Optimize pacing between opening beat and climax',
      'Generate index wall cards for all 3 acts',
    ],
  },
  plan: {
    role: 'Production Designer & 3D Art Director AI',
    intro: 'Welcome to the 3D Master Canvas & Moodboard. I lock ACEScg color palettes, PBR material roughness, and spatial aesthetics.',
    quickPrompts: [
      'Define Royal Amethyst & Rose Gold color palette',
      'Lock PBR roughness and metallic properties',
      'Generate moodboard prompt matrix for Unreal 5.4',
      'Set cinematic atmospheric mist parameters',
    ],
  },
  previs: {
    role: 'Virtual Cinematographer & DP AI',
    intro: 'Welcome to the Soundstage Previs Lab. I calculate Unreal CineCamera focal lengths, camera orbits, and multi-cam blocking.',
    quickPrompts: [
      'Set CineCamera to 35mm Anamorphic Prime',
      'Calculate dolly track orbit around lead actor',
      'Export 60 FPS camera matrix JSON track',
      'Configure golden hour 3-point key lighting',
    ],
  },
  motion: {
    role: 'Mocap Specialist & Kinematics AI',
    intro: 'Welcome to the 52-Point Mocap Volume. I solve optical skeletal tracking, optical motion vectors, and 60 FPS physics.',
    quickPrompts: [
      'Solve 52-point skeletal tracking for hero run',
      'Synthesize 60 FPS keyframe motion curves',
      'Apply ragdoll secondary dynamics to cloth/hair',
      'Sync body kinematics with virtual camera dolly',
    ],
  },
  boards: {
    role: 'Lead Storyboard Artist & Animatic Director AI',
    intro: 'Welcome to the Storyboard & 2.39:1 Animatic Lab. I compose wide/close-up panels, visual pacing, and key poses.',
    quickPrompts: [
      'Generate 2.39:1 anamorphic wide establishing board',
      'Compose tight close-up on lead character eyes',
      'Assemble 4-panel storyboard animatic sequence',
      'Match lens aspect ratio across all panels',
    ],
  },
  prompt: {
    role: 'Lead Prompt Engineer & Model Tuner AI',
    intro: 'Welcome to the Neural Style & Diffusion Lab. I construct IP-Adapter character likeness seeds, FLUX/SDXL prompt slates, and ControlNet depth weights.',
    quickPrompts: [
      'Generate FLUX.1 Dev prompt with photorealistic lighting',
      'Add negative prompt for zero artifact hands/faces',
      'Configure ControlNet Depth pass weight (0.85)',
      'Lock character facial consistency with IP-Adapter',
    ],
  },
  dailies: {
    role: 'Dailies Supervisor & Quality QC AI',
    intro: 'Welcome to the Screening & Circle Take Suite. I analyze generated render passes, flag continuity glitches, and automate reshoot loops.',
    quickPrompts: [
      'Score current take for framing & lighting quality',
      'Flag spatial continuity inconsistencies with Shot 1',
      'Approve Circle Take #1 for Editorial Conform',
      'Queue automated reshoot with tighter camera framing',
    ],
  },
  sound: {
    role: 'Sound Supervisor & Orchestral Composer AI',
    intro: 'Welcome to the 5.1 Atmos Sound & Scoring Stage. I mix dialogue stems, design spatial Foley acoustics, and compose dynamic film scores.',
    quickPrompts: [
      'Generate 5.1 spatial Foley mix for ambient room tone',
      'Isolate & denoise dialogue center channel',
      'Synthesize ElevenLabs vocal stem for Lead Character',
      'Generate orchestral tension score scratch track',
    ],
  },
  audio: {
    role: 'Sound Supervisor & Orchestral Composer AI',
    intro: 'Welcome to the 5.1 Atmos Sound & Scoring Stage. I mix dialogue stems, design spatial Foley acoustics, and compose dynamic film scores.',
    quickPrompts: [
      'Generate 5.1 spatial Foley mix for ambient room tone',
      'Isolate & denoise dialogue center channel',
      'Synthesize ElevenLabs vocal stem for Lead Character',
      'Generate orchestral tension score scratch track',
    ],
  },
  edit: {
    role: 'Master Colorist & Finishing Editor AI',
    intro: 'Welcome to the DaVinci Finishing Suite. I assemble EDL cuts, apply ACEScc color grading decision lists (CDL), and master final exports.',
    quickPrompts: [
      'Generate EDL timeline conform list for DaVinci',
      'Apply Cinematic Teal & Orange ACEScc Color LUT',
      'Assemble rough cut sequence at 24.000 FPS',
      'Export broadcast-ready ProRes 4444 XQ master',
    ],
  },
};

export const RoomAIChat: React.FC<RoomAIChatProps> = ({
  stageId,
  roomName,
  projectName,
  shotNumber,
  onHandoff,
}) => {
  const roleConfig = ROOM_ROLES[stageId] || ROOM_ROLES.script;
  const cleanProject = projectName.replace(/[^a-zA-Z0-9]/g, '_');
  const storageKey = `arise_chat_${cleanProject}_${stageId}`;
  const apiBase = getAPIBaseURL();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; content: string; size: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chat on stage or project change with Server-Side Sync & Handoff Ingestion
  useEffect(() => {
    let isMounted = true;

    const loadHistoryAndHandoff = async () => {
      // 1. Check for incoming cross-room handoff context
      const handoffKey = `arise_handoff_${cleanProject}_${stageId}`;
      const pendingHandoff = localStorage.getItem(handoffKey);
      let incomingHandoffMsg: Message | null = null;

      if (pendingHandoff) {
        try {
          const parsed = JSON.parse(pendingHandoff);
          if (parsed && parsed.summary) {
            incomingHandoffMsg = {
              id: `handoff-${Date.now()}`,
              sender: 'ai',
              text: `🔄 **Incoming Handoff from ${parsed.fromRoom || parsed.fromStage}:**\n"${parsed.summary}"\n\nI have received the handoff context and am ready to execute our department workflow. How shall we proceed?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              model: 'Arise-Handoff-Bridge',
            };
            localStorage.removeItem(handoffKey);
          }
        } catch {}
      }

      // 2. Fetch server-side synced chat history (Single Source of Truth)
      try {
        const res = await fetch(
          `${apiBase}/api/v1/projects/chat?projectId=${encodeURIComponent(projectName)}&stageId=${stageId}`
        );
        const data = await res.json();
        if (data && data.success && Array.isArray(data.messages) && data.messages.length > 0) {
          const serverHistory: Message[] = data.messages.map((m: any, idx: number) => ({
            id: m.id || `srv-${idx}-${Date.now()}`,
            sender: (m.role === 'user' || m.sender === 'user') ? 'user' : 'ai',
            text: m.content || m.text || '',
            timestamp: m.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            model: m.model || 'NVIDIA-Llama-3.1-70B',
            actions: m.actions,
          }));

          if (incomingHandoffMsg) {
            serverHistory.push(incomingHandoffMsg);
          }

          if (isMounted) {
            setMessages(serverHistory);
            try {
              localStorage.setItem(storageKey, JSON.stringify(serverHistory));
            } catch {}
          }
          return;
        }
      } catch (err) {
        console.warn('[RoomAIChat] Server chat history unreachable, checking local cache:', err);
      }

      // 3. Fallback to local storage cache if server history was empty or unreachable
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (incomingHandoffMsg) {
              parsed.push(incomingHandoffMsg);
              try {
                localStorage.setItem(storageKey, JSON.stringify(parsed));
              } catch {}
            }
            if (isMounted) setMessages(parsed);

            // Auto-migrate local history to server DB
            try {
              fetch(`${apiBase}/api/v1/projects/chat/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  projectId: projectName,
                  stageId,
                  messages: parsed.map((m: any) => ({
                    role: (m.sender === 'user' || m.role === 'user') ? 'user' : 'assistant',
                    content: m.text || m.content || '',
                    timestamp: m.timestamp,
                    model: m.model,
                    actions: m.actions,
                  })),
                }),
              }).catch(() => {});
            } catch {}

            return;
          }
        }
      } catch {}

      // 4. Default fresh room welcome message
      const defaultIntro: Message = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: roleConfig.intro,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'NVIDIA-Llama-3.1-70B',
      };

      const initialList = incomingHandoffMsg ? [defaultIntro, incomingHandoffMsg] : [defaultIntro];
      if (isMounted) {
        setMessages(initialList);
        try {
          localStorage.setItem(storageKey, JSON.stringify(initialList));
        } catch {}
      }
    };

    loadHistoryAndHandoff();

    return () => {
      isMounted = false;
    };
  }, [stageId, projectName, storageKey, apiBase, cleanProject]);

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Document Ingestion / File Attachment inside Chat
  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      setAttachedFile({
        name: file.name,
        content: content.slice(0, 10000), // Cap preview at 10k chars
        size: sizeStr,
      });
      toast.success(`📎 Attached "${file.name}" to AI Co-Pilot!`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if ((!textToSend.trim() && !attachedFile) || isTyping) return;

    let fullPrompt = textToSend.trim();
    let fileMetadata: { name: string; size: string } | undefined;

    if (attachedFile) {
      fileMetadata = { name: attachedFile.name, size: attachedFile.size };
      fullPrompt = `[INGESTED DOCUMENT: ${attachedFile.name} (${attachedFile.size})]\n${attachedFile.content}\n\n---\nUSER DIRECTIVE:\n${textToSend || 'Analyze this document and calibrate the department parameters.'}`;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: fullPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedFile: fileMetadata,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setAttachedFile(null);
    setIsTyping(true);

    try {
      localStorage.setItem(storageKey, JSON.stringify(nextMessages));
    } catch {}

    try {
      const modelId = localStorage.getItem('arise_selected_model') || 'nvidia/nemotron-3-super-120b-a12b';
      const aiResult = await sendChatMessage({
        stageId,
        roomName,
        projectName,
        shotNumber,
        departmentRole: roleConfig.role,
        model: modelId,
        messages: nextMessages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      });

      // Process any tool execution actions (including REAL Handoff Navigation)
      if (aiResult.actions && aiResult.actions.length > 0) {
        aiResult.actions.forEach((act) => {
          if (act.tool === 'run_stage') {
            toast.success(`🟢 Executed Stage: ${act.args?.stageId || stageId} (Shot ${act.args?.shotNumber || shotNumber})`, { icon: '🎬' });
          } else if (act.tool === 'save_script') {
            toast.success(`💾 Screenplay for Shot ${act.args?.shotNumber || shotNumber} saved to database!`, { icon: '✍️' });
          } else if (act.tool === 'get_episode_script') {
            toast.success(`📖 Retrieved stored screenplay for Shot ${act.args?.shotNumber || shotNumber}`, { icon: '📜' });
          } else if (act.tool === 'get_story_bible') {
            toast.success(`🏛️ Loaded project manifest & story bible!`, { icon: '📂' });
          } else if (act.tool === 'handoff_to_agent') {
            const rawTarget = act.args?.stageId || act.args?.targetStage || act.args?.targetStageId || 'structure';
            const targetStageId = String(rawTarget).toLowerCase().trim();
            const handoffReason = act.args?.reason || `Completed work in ${roomName} (${stageId}) for ${projectName} (Shot ${shotNumber}). Ready for ${targetStageId.toUpperCase()}.`;

            // Store pending handoff in target room's context storage
            const targetHandoffKey = `arise_handoff_${cleanProject}_${targetStageId}`;
            try {
              localStorage.setItem(targetHandoffKey, JSON.stringify({
                fromStage: stageId,
                fromRoom: roomName,
                summary: handoffReason,
                timestamp: new Date().toISOString(),
              }));
            } catch {}

            toast.success(`🚀 Handoff to ${targetStageId.toUpperCase()}: Navigating now...`, { icon: '🔄', duration: 2500 });

            // Perform real room navigation
            if (onHandoff) {
              setTimeout(() => {
                onHandoff(targetStageId, handoffReason);
              }, 700);
            }
          }
        });
      }

      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: aiResult.model.split('/')[1] || aiResult.model,
        actions: aiResult.actions,
      };

      const finalMessages = [...nextMessages, aiResponse];
      setMessages(finalMessages);

      try {
        localStorage.setItem(storageKey, JSON.stringify(finalMessages));
      } catch {}
    } catch (err: any) {
      console.error('[RoomAIChat] Chat generation error:', err);
      const fallbackResponse: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ Agent Error: ${err.message || 'Failed to connect to agent runtime.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'Studio-AI-Error',
      };
      const finalMessages = [...nextMessages, fallbackResponse];
      setMessages(finalMessages);
      try {
        localStorage.setItem(storageKey, JSON.stringify(finalMessages));
      } catch {}
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    const initialMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: roleConfig.intro,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'NVIDIA-Llama-3.1-70B',
    };
    setMessages([initialMsg]);
    try {
      localStorage.setItem(storageKey, JSON.stringify([initialMsg]));
    } catch {}
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0922] border border-purple-900/50 rounded-2xl overflow-hidden shadow-2xl">
      {/* Room AI Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#140e2e] border-b border-purple-900/50 flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/30 flex-shrink-0">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-rose-200 to-amber-200 uppercase font-mono tracking-wider">
                {roleConfig.role}
              </h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                AUTONOMOUS
              </span>
            </div>
            <p className="text-[10px] text-purple-300/70 font-mono">
              Stage: <strong className="text-rose-300 uppercase">{stageId}</strong> • Shot {shotNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-purple-400 hover:text-rose-400 hover:bg-purple-900/30 transition text-xs"
            title="Reset Room Chat"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Quick Prompt Carousel Pills */}
      <div className="px-3 py-2 bg-[#0a0618] border-b border-purple-900/30 flex items-center space-x-2 overflow-x-auto no-scrollbar flex-shrink-0">
        <span className="text-[10px] text-purple-400/60 font-mono uppercase whitespace-nowrap flex items-center gap-1">
          <Zap size={10} className="text-amber-400" /> Co-Pilot:
        </span>
        {roleConfig.quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            disabled={isTyping}
            className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-800/40 hover:border-purple-600 text-[10px] font-mono whitespace-nowrap transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Messages Log Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-gradient-to-b from-[#0e0922] via-[#090518] to-[#0e0922]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs font-sans leading-relaxed shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-700 to-rose-700 text-white rounded-br-none border border-purple-500/40'
                  : msg.text.startsWith('🔄 **Incoming Handoff')
                  ? 'bg-[#1e1038] text-amber-200 border border-amber-500/50 shadow-amber-500/10'
                  : 'bg-[#150e2e] text-purple-100 rounded-bl-none border border-purple-900/60'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between gap-3 text-[10px] font-mono opacity-75 mb-1.5 pb-1 border-b border-white/10">
                <span className="font-bold flex items-center gap-1">
                  {msg.sender === 'user' ? <User size={11} /> : <Bot size={11} />}
                  {msg.sender === 'user' ? 'Producer' : roleConfig.role.split(' ')[0]}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Ingested File Tag */}
              {msg.attachedFile && (
                <div className="mb-2 p-2 rounded-lg bg-black/40 border border-purple-400/40 flex items-center space-x-2 text-[10px] font-mono text-purple-200">
                  <FileText size={13} className="text-amber-400 flex-shrink-0" />
                  <span className="truncate">{msg.attachedFile.name}</span>
                  <span className="text-purple-400/60">({msg.attachedFile.size})</span>
                </div>
              )}

              {/* Main Message Text */}
              <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                {msg.text}
              </div>

              {/* Action Badges */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-purple-900/60 space-y-1">
                  {msg.actions.map((act, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      <CheckCircle size={10} />
                      <span>{act.tool}</span>
                      <span className="text-emerald-500/60">({JSON.stringify(act.args || {})})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-300/80 p-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>{roleConfig.role.split(' ')[0]} AI is computing directives & tools...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File Ingestion Drawer Preview */}
      {attachedFile && (
        <div className="px-4 py-2 bg-[#120a2a] border-t border-purple-900/40 flex items-center justify-between text-xs font-mono text-purple-200">
          <div className="flex items-center space-x-2 truncate">
            <FileText size={14} className="text-amber-400 flex-shrink-0" />
            <span className="truncate font-semibold">{attachedFile.name}</span>
            <span className="text-purple-400/70">({attachedFile.size})</span>
          </div>
          <button
            onClick={() => setAttachedFile(null)}
            className="p-1 rounded hover:bg-purple-900/40 text-purple-400 hover:text-rose-400 transition"
            title="Remove attachment"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input Composer */}
      <div className="p-3 bg-[#140e2e] border-t border-purple-900/50 flex-shrink-0">
        <div className="flex items-center space-x-2">
          {/* File Ingestion Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileAttach}
            accept=".txt,.fountain,.md,.json,.pdf,.csv"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/40 hover:border-purple-600 transition text-xs flex-shrink-0 cursor-pointer"
            title="Ingest screenplay, character sheet, or technical brief (.fountain, .txt, .md)"
          >
            <Paperclip size={15} />
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${roleConfig.role.split(' ')[0]} AI or type directive... (Press Enter to send)`}
            className="flex-1 bg-[#090518] text-purple-100 placeholder-purple-400/40 rounded-xl px-3.5 py-2 text-xs font-sans border border-purple-900/60 focus:border-rose-500/60 focus:outline-none resize-none min-h-[36px] max-h-24 custom-scrollbar"
            disabled={isTyping}
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isTyping || (!input.trim() && !attachedFile)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold transition shadow-lg shadow-rose-600/30 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer"
            title="Send Directive"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomAIChat;
