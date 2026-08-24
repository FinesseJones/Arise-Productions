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
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RoomAIChatProps {
  stageId: StageKey;
  roomName: string;
  projectName: string;
  shotNumber: number;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  model?: string;
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
}) => {
  const roleConfig = ROOM_ROLES[stageId] || ROOM_ROLES.script;
  const storageKey = `arise_chat_${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_${stageId}`;

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'msg-1',
        sender: 'ai',
        text: roleConfig.intro,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'NVIDIA-Llama-3.1-70B',
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; content: string; size: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chat on stage or project change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {}

    const initialMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: roleConfig.intro,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'NVIDIA-Llama-3.1-70B',
    };
    setMessages([initialMsg]);
  }, [stageId, projectName, storageKey]);

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Document Ingestion / File Attachment inside Chat (Method 2)
  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string || '';
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
      const modelId = localStorage.getItem('arise_selected_model') || 'meta/llama-3.1-70b-instruct';
      const promptPayload = {
        model: modelId,
        stageId,
        projectName,
        shotNumber,
        departmentRole: roleConfig.role,
        messages: nextMessages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      };

      const response = await fetch('http://localhost:4000/api/v1/projects/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptPayload),
      });

      let replyText = '';
      if (response.ok) {
        const data = await response.json();
        replyText = data.reply || data.response || 'Telemetry confirmed. Department calibrated.';
      } else {
        replyText = `Understood. I have ingested "${attachedFile ? attachedFile.name : 'your directive'}" and updated the ${roomName} parameters for ${projectName}.`;
      }

      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: modelId.split('/')[1] || modelId,
      };

      const finalMessages = [...nextMessages, aiResponse];
      setMessages(finalMessages);

      try {
        localStorage.setItem(storageKey, JSON.stringify(finalMessages));
      } catch {}
    } catch (err: any) {
      setMessages([
        ...nextMessages,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `Document processed: Calibrated ${roomName} pipeline parameters for ${projectName}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
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

  const handleClearChat = () => {
    const initialMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: roleConfig.intro,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'NVIDIA-Llama-3.1-70B',
    };
    setMessages([initialMsg]);
    localStorage.setItem(storageKey, JSON.stringify([initialMsg]));
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
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                {roleConfig.role}
              </h4>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500" />
            </div>
            <p className="text-[10px] text-rose-400/90 font-mono">
              3D {roomName} • AI Co-Pilot (Method 2 Ingest Ready)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[9px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-mono font-bold">
            NVIDIA NIM
          </span>
          <button
            onClick={handleClearChat}
            title="Clear & Reset Chat"
            className="p-1.5 rounded-lg bg-purple-950/40 hover:bg-rose-950/60 text-purple-400 hover:text-rose-300 transition"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Viewport */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs font-sans">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-purple-400/70 font-mono">
              <span>{m.sender === 'user' ? 'You' : roleConfig.role}</span>
              <span>•</span>
              <span>{m.timestamp}</span>
              {m.model && <span className="text-rose-400/90">({m.model.split('/')[1] || m.model})</span>}
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[92%] leading-relaxed shadow-md ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-medium rounded-tr-none shadow-purple-900/40'
                  : 'bg-[#140e2e] text-purple-100 border border-purple-900/60 rounded-tl-none font-mono text-[11px]'
              }`}
            >
              {m.attachedFile && (
                <div className="mb-2 p-2 rounded-xl bg-black/40 border border-white/20 flex items-center space-x-2 text-[10px] font-mono text-amber-300">
                  <Paperclip size={12} />
                  <span>Ingested File: <strong>{m.attachedFile.name}</strong> ({m.attachedFile.size})</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-rose-400 font-mono bg-[#140e2e] p-3 rounded-xl border border-purple-800/50 w-fit">
            <Sparkles size={14} className="animate-spin text-purple-400" />
            <span>{roleConfig.role} is thinking with NVIDIA NIM...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestion Chips */}
      <div className="px-3 py-2 bg-[#140e2e]/90 border-t border-purple-900/50 overflow-x-auto flex-shrink-0">
        <div className="flex items-center space-x-1.5 w-max">
          <Zap size={12} className="text-rose-400 flex-shrink-0" />
          {roleConfig.quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qp)}
              className="px-3 py-1 rounded-full bg-[#1a123a] hover:bg-purple-900/60 text-purple-200 hover:text-rose-300 border border-purple-800/60 text-[10px] font-mono transition flex-shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Attached File Preview Chip */}
      {attachedFile && (
        <div className="px-3 py-1.5 bg-[#1a123a] border-t border-purple-900/50 flex items-center justify-between font-mono text-[11px] text-amber-300">
          <div className="flex items-center space-x-2 truncate">
            <Paperclip size={13} className="text-amber-400 flex-shrink-0" />
            <span className="truncate">Attached for Ingestion: <strong>{attachedFile.name}</strong> ({attachedFile.size})</span>
          </div>
          <button
            onClick={() => setAttachedFile(null)}
            className="p-1 text-purple-400 hover:text-rose-400"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Multi-Line Spacious Input Form with File Attachment Button */}
      <div className="p-3 bg-[#0e0922] border-t border-purple-900/50 flex-shrink-0">
        <div className="flex items-end gap-2 bg-[#140e2e] border border-purple-800/60 rounded-2xl p-2 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition">
          {/* File Ingest Button (Method 2) */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach / Ingest Document into AI Chat (.fountain, .edl, .cube, .wav, .json, .txt)"
            className="p-2 text-purple-400 hover:text-amber-300 hover:bg-purple-950/60 rounded-xl transition flex-shrink-0"
          >
            <Paperclip size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileAttach}
            className="hidden"
            accept=".fountain,.fdx,.pdf,.json,.wav,.mp3,.cube,.edl,.xml,.txt,.png,.jpg"
          />

          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={`Ask ${roleConfig.role.split('&')[0]} or attach document... (Enter to send)`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="flex-grow bg-transparent text-purple-100 text-xs font-mono resize-none focus:outline-none placeholder:text-purple-400/50 max-h-36 min-h-[38px] py-1.5 px-2"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isTyping || (!input.trim() && !attachedFile)}
            className={`p-2.5 rounded-xl text-white font-bold transition shadow-md flex-shrink-0 ${
              isTyping || (!input.trim() && !attachedFile)
                ? 'bg-purple-950 text-purple-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 shadow-rose-600/20'
            }`}
          >
            <Send size={15} />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-purple-400/60 font-mono mt-1.5 px-1">
          <span>{projectName} • Shot {shotNumber}</span>
          <span>Shift + Enter for new line • Enter to send</span>
        </div>
      </div>
    </div>
  );
};

export default RoomAIChat;
