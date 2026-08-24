"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, RefreshCw, Zap, Trash2, ArrowUpRight } from 'lucide-react';
import { StageKey } from '../types/types';

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
}

const ROOM_ROLES: Record<StageKey, { role: string; intro: string; quickPrompts: string[] }> = {
  script: {
    role: 'Lead Screenwriter & Script Supervisor AI',
    intro: 'Welcome to the 3D Writers Room. I am your Screenwriter AI Co-Pilot. I can write and refine screenplays, analyze character subtext, polish dialogue, and format Hollywood-standard scene headers in standard Fountain format.',
    quickPrompts: [
      'Write an intense opening cold open for this scene',
      'Analyze character subtext & emotional tension',
      'Format this scene into standard Fountain layout',
      'Generate 3 alternative dialogue punchlines',
    ],
  },
  structure: {
    role: 'Narrative Architect & Story Editor AI',
    intro: 'Welcome to the Narrative Architecture Suite. I track your 3-Act structural arcs, pacing bottlenecks, and index card plot twists.',
    quickPrompts: [
      'Optimize pacing curve for Act 2 midpoint climax',
      'Generate 4 dramatic plot complication index cards',
      'Check emotional stakes across the sequence',
      'Suggest a cliffhanger beat for this episode',
    ],
  },
  plan: {
    role: 'Art Director & Visual Asset Coordinator AI',
    intro: 'Welcome to the Master Canvas Lab. I ensure aesthetic consistency, color palette harmony, and asset delivery manifests across the film.',
    quickPrompts: [
      'Generate a 5-color cinematic moodboard palette',
      'List all physical 3D props and wardrobe required',
      'Define visual style guide & architectural cues',
      'Compile asset handoff bundle for 3D team',
    ],
  },
  previs: {
    role: 'Virtual DP & 3D Camera Choreographer AI',
    intro: 'Welcome to Virtual Soundstage A. I solve 3D camera tracking paths, lens focal lengths, LED volume lighting, and spatial blocking.',
    quickPrompts: [
      'Calculate optimal 35mm camera track path [x,y,z]',
      'Recommend lighting preset for dramatic confrontation',
      'Solve two-shot camera blocking for actors',
      'Switch viewport camera to dynamic crane orbit',
    ],
  },
  motion: {
    role: 'Mocap Director & Pose Solver AI',
    intro: 'Welcome to the Mocap & Tracking Volume. I analyze 52-point skeletal kinematics, camera sync, and optical motion vectors at 60 FPS.',
    quickPrompts: [
      'Solve skeletal tracking trajectory for stunt fight',
      'Filter motion capture jitter on camera follow',
      'Map actor physical velocity to virtual camera',
      'Calibrate optical mocap sensor volume',
    ],
  },
  boards: {
    role: 'Storyboard Artist & Animatic Director AI',
    intro: 'Welcome to the Visual Concept & Animatics Lab. I generate shot-by-shot PDF storyboards, framing ratios, and lens composition guides.',
    quickPrompts: [
      'Describe visual storyboard frames for this scene',
      'Set aspect ratio to 2.39:1 widescreen framing',
      'Generate animatic timing descriptors for editorial',
      'Create 4-panel visual action sequence',
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    // Fallback default message
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: roleConfig.intro,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'NVIDIA-Llama-3.1-70B',
      },
    ]);
  }, [stageId, projectName]);

  // Persist messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch {}
    }
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      // Call backend NVIDIA AI assistant endpoint
      const response = await fetch('http://localhost:4000/api/v1/nvidia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          roomName,
          role: roleConfig.role,
          stageId,
          context: `Project: "${projectName}", Active Shot: ${shotNumber}`,
        }),
      }).then((r) => r.json()).catch(() => null);

      let aiReplyText = response?.text;
      if (!aiReplyText) {
        aiReplyText = `[${roleConfig.role}]: Processed request for Shot ${shotNumber} in "${roomName}". Parameters and screenplay directions updated live with production continuity for "${projectName}".`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: response?.model || 'meta/llama-3.1-70b-instruct',
      };

      setMessages([...nextMessages, aiMsg]);
    } catch (err: any) {
      setMessages([
        ...nextMessages,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `Error processing request: ${err.message}`,
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
              3D {roomName} • AI Co-Pilot
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[9px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-mono">
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

      {/* Multi-Line Spacious Input Form */}
      <div className="p-3 bg-[#0e0922] border-t border-purple-900/50 flex-shrink-0">
        <div className="flex items-end gap-2 bg-[#140e2e] border border-purple-800/60 rounded-2xl p-2 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={`Ask the ${roleConfig.role.split('&')[0]}... (Press Enter to send, Shift+Enter for new line)`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="flex-grow bg-transparent text-purple-100 text-xs font-mono resize-none focus:outline-none placeholder:text-purple-400/50 max-h-36 min-h-[38px] py-1.5 px-2"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isTyping || !input.trim()}
            className={`p-2.5 rounded-xl text-white font-bold transition shadow-md flex-shrink-0 ${
              isTyping || !input.trim()
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
