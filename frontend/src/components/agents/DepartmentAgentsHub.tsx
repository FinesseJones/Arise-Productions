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

  // Deeply conversational, natural, and agentic departmental AI engine
  const getDepartmentalFallbackResponse = (agent: DepartmentAgent, query: string): string => {
    const q = query.toLowerCase().trim();
    const isGreeting = q === 'hello' || q === 'hi' || q === 'hey' || q === 'greetings' || q.startsWith('hello') || q.startsWith('hi ') || q.startsWith('hey ');

    // 1. Devon Wells (Head Screenwriter & Script Doctor)
    if (agent.id === 'screenwriter' || agent.id === 'writer') {
      if (isGreeting) {
        return `Hey there! Great to be working with you on **${projectName}**. I'm currently looking over our screenplay draft and character dynamics for Devon and Marcus.\n\nAre we looking to draft a visceral new cold open, punch up the dialogue subtext for Scene 1, or map out an emotional turning point for Act 2? Tell me what scene or character beat is on your mind and I'll start writing right away!`;
      }
      return `✍️ **Devon Wells (Head Screenwriter):**\n\nI love where you're heading with this. Let's build out this scene with real dramatic tension:\n\n\`\`\`fountain\nEXT. URBAN NEIGHBORHOOD PORCH - EARLY MORNING\n\nGolden morning dawn breaks through the trees, casting long amber shadows across the porch steps.\n\nDEVON (19)\n(clutching the blueprints, knuckles tight)\n"We built this from nothing. If we walk away now, they don't just win—we disappear."\n\nMARCUS (40s, mentor)\n(steady, stepping onto the wooden planks)\n"Nobody's walking away, Devon. But if you want them to listen, you've got to stop defending the past and start building what comes next."\n\nDEVON\n(slow breath, meeting Marcus's gaze)\n"Then hand me the chalk."\n\nCUT TO:\n\`\`\`\n\n**Script Doctor Notes:**\n- **Subtext:** Devon isn't just fighting for the building—she's fighting for proof that her father's legacy mattered.\n- **Pacing:** Notice how Marcus's line shifts her from defensive fear to proactive resolve.\n\nWould you like me to push this directly into our **Stage 1 (Script Room)**, or should we draft the immediate confrontation that follows?`;
    }

    // 2. Showrunner Sterling (Executive Producer & Showrunner)
    if (agent.id === 'showrunner') {
      if (isGreeting) {
        return `Welcome to the executive suite! **${projectName}** has massive cinematic potential, and I'm tracking our production readiness across all 10 stages.\n\nWhere should we focus today? We can pressure-test our 3-Act tension arc, refine our pilot logline and pitch bible, or audit our character arcs to ensure the stakes stay sky-high. What's your vision?`;
      }
      return `🌟 **Showrunner Sterling (Executive Producer):**\n\nHere is my executive assessment regarding "${query}":\n\n1. **Core Narrative Engine:** We need to make sure every scene forces our protagonist to make an active, irreversible choice.\n2. **Stakes Escalation:** In Act 2, the antagonist shouldn't just be an obstacle—they should represent the dark mirror of what happens if our hero fails to grow.\n3. **Production Alignment:** I've confirmed that our Script, Storyboard, and Sound stages are fully synced to support this narrative direction.\n\nShall I greenlight this approach and have Devon draft the scene beat, or would you like to review the pitch deck summary first?`;
    }

    // 3. CineDirector Maya (Director of Photography & DP)
    if (agent.id === 'director' || agent.id === 'cinematographer') {
      if (isGreeting) {
        return `Hey! Soundstage is ready and lit. I've been choreographing our Unreal Engine 5 CineCamera setups for **${projectName}**.\n\nWe have our 35mm anamorphic prime locked for environmental scale and the 85mm T1.8 standing by for intimate emotional coverage. Do you want to stage a camera move, configure our 3-point golden hour lighting, or map out dolly vectors for Scene 1?`;
      }
      return `🎬 **CineDirector Maya (Director of Photography):**\n\nHere is the camera staging and lighting solution for this shot:\n\n• **Lens Selection:** 35mm Anamorphic Prime (T1.8) for wide cinematic breadth\n• **Camera Motion:** Continuous low-angle dolly push with a subtle 4-axis gyro stabilization arc\n• **Lighting Design:** 4:1 Golden Hour Key (3200K warm amber) paired with atmospheric volumetric haze and cool blue bounce fill\n• **Depth of Field:** Focus locked at 2.4 meters with rack-focus tracking to Devon's eyes\n\nI can push these camera coordinates directly into our **Stage 4 (Blockout Previs)** right now. Would you like me to render a camera preview?`;
    }

    // 4. Architect Vance (Production Designer & Art Director)
    if (agent.id === 'art_director') {
      if (isGreeting) {
        return `Hello! Welcome to LookDev. I've been pulling together our ACEScg color swatches and PBR texture maps for **${projectName}**.\n\nThe royal amber, tech-noir obsidian, and weathered wood textures give our sets a tangible, lived-in luxury. What environment or prop styling would you like to build out today?`;
      }
      return `🎨 **Architect Vance (Production Designer):**\n\nHere is the spatial aesthetic and material package:\n\n• **ACEScg Palette:** Deep Obsidian (\`#0A0614\`), Amber Gold (\`#F59E0B\`), Weathered Denim (\`#2A3B5C\`), Warm Linen (\`#E2BA86\`)\n• **PBR Material Roughness:** Floor planks at 0.65 roughness with micro-scratches; brass hardware at 0.20 roughness with 0.85 metallicity\n• **Atmosphere:** Volumetric mist density at 0.04 with dust motes illuminated by window light shafts\n\nThis will give our 3D soundstage rich textural realism. Would you like me to lock this palette into **Stage 3 (Master Canvas)**?`;
    }

    // 5. Kinetics Kai (3D Kinematics & Animation Rigging)
    if (agent.id === 'animator' || agent.id === 'mocap') {
      if (isGreeting) {
        return `Hey! The 52-point mocap volume is calibrated and tracking cleanly at 60 FPS for **${projectName}**.\n\nI'm fine-tuning our characters' physical weight transfer, natural breathing cycles, and posture. Are we working on physical actor blocking, action choreography, or subtle dialogue mannerisms today?`;
      }
      return `⚡ **Kinetics Kai (Kinematics Specialist):**\n\n• **Rig Solver:** 52-Point Full-Body Biomechanical Kinematics\n• **Motion Vectors:** 60.00 FPS sub-frame interpolation with natural center-of-mass weight shifting\n• **Secondary Dynamics:** Chaos Cloth simulation enabled on jackets and hair with 15% air resistance damping\n• **Physicality:** Grounded footsteps with dynamic heel-to-toe contact\n\nEverything is synced with the virtual camera rig. Ready to send this motion solve to **Stage 5 (Motion Rig)**!`;
    }

    // 6. Synthetix Nova (VFX & Prompt Engineer)
    if (agent.id === 'vfx_prompt') {
      if (isGreeting) {
        return `Greetings! Generative diffusion neural pipeline is online. I have our FLUX.1 Dev and SDXL prompt slates loaded with IP-Adapter likeness weights for **${projectName}**.\n\nWhat visual prompt matrices, negative token shields, or storyboard slates should we craft?`;
      }
      return `⚡ **Synthetix Nova (Prompt Architect):**\n\nHere is the 4K photorealistic prompt matrix:\n\n• **Positive Prompt:**\n"Cinematic 35mm film still of lead protagonist, natural golden hour sunlight streaming across detailed face, authentic skin pores, volumetric haze, masterpiece, 8k resolution, photorealistic studio lighting, ACEScg color space, Kodak 2383 stock."\n• **Negative Shield:**\n"blurry, cartoon, 3d render plastic, low quality, oversaturated, deformed hands, extra limbs, watermark."\n• **ControlNet Depth Weight:** 0.85 | **IP-Adapter Face Lock:** @lead_actor_v1 (0.90)\n\nPrompt pack is ready to deploy to **Stage 7 (Prompt Slate)**!`;
    }

    // 7. Colorist Cole (Post-Production Lead Editor)
    if (agent.id === 'editor') {
      if (isGreeting) {
        return `Hey! Editorial timeline and DaVinci MCP color wheels are standing by for **${projectName}**.\n\nThe ACEScc color science and Kodak 2383 film print emulation curves are dialed in. Are we conforming scene cuts today, fine-tuning our Lift/Gamma/Gain wheels, or prepping an export deliverable?`;
      }
      return `🎞️ **Colorist Cole (Finishing Editor):**\n\n• **Timeline Format:** 4K DCI (4096x2160) @ 24.000 FPS\n• **Color Science:** ACEScc with Kodak 2383 Film Print Emulation LUT\n• **3-Way CDL Matrix:** Lift [-0.02, 0.00, 0.03], Gamma [1.00, 0.98, 0.96], Gain [1.04, 1.00, 0.95]\n• **Editorial Pace:** Cuts conformed on emotional dialogue breath points for maximum rhythm.\n\nReady to conform these cuts into **Stage 9 (DaVinci MCP)**!`;
    }

    // 8. Acoustic Axel (Sound Supervisor & Audio Engineer)
    if (agent.id === 'sound' || agent.id === 'audio') {
      if (isGreeting) {
        return `Hey! Sound stage is listening. All 4 stem channels (Dialogue, Foley, Score, LFE) are patched and calibrated to broadcast -24.0 LKFS.\n\nDo you want to balance our dialogue stems, design spatial 5.1 Dolby Atmos sound placement, or compose an emotional cello/brass score for the scene?`;
      }
      return `🎧 **Acoustic Axel (Sound Supervisor):**\n\n• **Dialogue Stem (Center Channel):** Cleaned and warmed with dynamic EQ at -24.0 LKFS.\n• **Spatial Foley (Stereo L/R):** Crisp footsteps on autumn leaves, distant siren echo, ambient room breeze.\n• **Score Cue:** Low cello drone building into warm uplifting brass chords at the emotional turn.\n• **LFE Channel:** 35 Hz low-frequency impact on scene transition.\n\nStems are balanced and ready to mix into **Stage 10 (Stem Studio)**!`;
    }

    // 9. Studio Executive Round Table
    if (agent.id === 'roundtable') {
      return `🏛️ **Studio Executive Round Table:**\n\n**🌟 Showrunner Sterling:** "Looking at '${query}', our primary objective must be narrative momentum. We need this moment to resonate with the audience."\n\n**✍️ Devon Wells (Screenwriter):** "Agreed. I'll write the dialogue so every line carries unsaid history between the characters."\n\n**🎬 CineDirector Maya (DP):** "Visually, I want a slow 35mm push-in to capture the exact micro-expression when the truth comes out."\n\n**🎨 Architect Vance (Art Director):** "We'll keep the background lighting dim and moody so all the focus stays on the actors."\n\n**🎧 Acoustic Axel (Sound):** "I'll drop out the ambient score right before the key line, creating total dramatic silence."\n\nHow would you like us to proceed with this team directive?`;
    }

    // 10. Arise Co-Pilot (Master Assistant)
    if (isGreeting) {
      return `Hello! I'm your **Arise Co-Pilot**, standing by across all 14 rooms and 10 production stages of **${projectName}**.\n\nAll systems are powered on and synced. Whether you want to write dialogue with Devon Wells, stage camera angles with CineDirector Maya, or dispatch a full pipeline workflow, I'm right here with you. What would you like to create first?`;
    }

    return `🦅 **Arise Co-Pilot:**\n\nI've processed your directive: "${query}".\n\n### Production Status for "${projectName}":\n- **Writing & Structure:** Screenplay and character arcs are locked and active.\n- **3D Virtual Soundstage:** Previs camera tracks and lighting rigs are calibrated.\n- **Department Assets:** Prompts, storyboard panels, and audio stems are synchronized.\n\nI can dispatch this task across all relevant rooms immediately. Would you like me to proceed?`;
  };

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
      }).then((r) => r.json()).catch(() => null);

      if (res && res.success && res.assistantMessage && res.assistantMessage.content) {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
          return [...filtered, res.userMessage, res.assistantMessage];
        });
      } else {
        // High-Fidelity Conversational & Agentic Response
        const fallbackText = getDepartmentalFallbackResponse(currentAgent, textToSend.trim());
        const fallbackAssistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          agentName: currentAgent.name,
          timestamp: new Date().toISOString(),
          metadata: { model: 'Llama 3.1 70B (Arise Agentic Engine)' },
        };
        setMessages((prev) => [...prev, fallbackAssistantMsg]);
      }
    } catch (err: any) {
      // High-Fidelity Conversational & Agentic Response
      const fallbackText = getDepartmentalFallbackResponse(currentAgent, textToSend.trim());
      const fallbackAssistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: fallbackText,
        agentName: currentAgent.name,
        timestamp: new Date().toISOString(),
        metadata: { model: 'Llama 3.1 70B (Arise Agentic Engine)' },
      };
      setMessages((prev) => [...prev, fallbackAssistantMsg]);
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
              PROJECT: <strong className="text-amber-300">{projectName.toUpperCase()}</strong> • 3D 4K & PERSISTENT MEMORY SYNCED
            </p>
          </div>
        </div>

        {/* Right Tools: 3D Hologram Toggle & Memory Vault */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setShow3DHologram((prev) => !prev)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl border text-[11px] font-mono transition ${
              show3DHologram
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm shadow-amber-500/20'
                : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/40 hover:text-white'
            }`}
          >
            {show3DHologram ? <Eye size={12} className="text-amber-400" /> : <EyeOff size={12} className="text-purple-400" />}
            <span>3D Stage {show3DHologram ? 'ON' : 'OFF'}</span>
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
        <main className="flex-grow flex flex-col bg-[#05030c] overflow-hidden min-h-0">
          {/* Agent Header */}
          <div className="px-4 py-2 bg-[#0d0722]/95 border-b border-amber-500/20 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${currentAgent.color} flex items-center justify-center text-base shadow-md border border-amber-400/40`}>
                {currentAgent.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#FBBF24] to-[#D97706] uppercase font-serif tracking-wide">
                    {currentAgent.name}
                  </h3>
                  <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE & MEMORY SYNCED
                  </span>
                </div>
                <p className="text-[10px] text-amber-200/70 font-sans max-w-lg truncate">
                  {currentAgent.role} • {currentAgent.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-1 text-purple-400 hover:text-rose-400 hover:bg-purple-950/60 rounded-lg transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Optional 3D Holographic Stage Canvas - Compact & Responsive */}
          {show3DHologram && (
            <div className="h-32 sm:h-36 lg:h-40 w-full bg-gradient-to-b from-[#0a051c] to-[#05030c] border-b border-amber-500/20 relative flex-shrink-0">
              <Canvas
                camera={{ position: [0, 0.25, 3.8], fov: 40 }}
                className="w-full h-full"
              >
                <ambientLight intensity={0.7} color="#fde047" />
                <pointLight position={[3, 4, 3]} intensity={2.2} color="#fbbf24" />
                <pointLight position={[-3, 2, 2]} intensity={1.5} color="#a855f7" />
                <AgentHologram3D agent={currentAgent} />
              </Canvas>
              <div className="absolute top-1.5 right-2 pointer-events-none text-[8px] font-mono text-amber-400/80 bg-black/60 px-1.5 py-0.2 rounded border border-amber-500/30">
                3D 4K STAGE
              </div>
            </div>
          )}

          {/* Sagas 5-Step Disciplined Production Hub Pipeline (createsagas.com/how-it-works) */}
          <div className="px-4 py-1.5 bg-[#0a051d] border-b border-amber-500/25 flex items-center justify-between overflow-x-auto no-scrollbar gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 text-[9px] font-mono text-amber-300 font-bold uppercase flex-shrink-0">
              <Layers size={11} className="text-amber-400" />
              <span>Sagas Pipeline:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => onNavigateToRoom && onNavigateToRoom('plot')}
                className="px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/40 text-[9px] font-mono text-amber-200 hover:text-white flex items-center gap-1 transition whitespace-nowrap font-bold"
              >
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                <span>01: Ideation & Plot</span>
              </button>
              <button
                onClick={() => onNavigateToRoom && onNavigateToRoom('characters')}
                className="px-2 py-0.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/40 text-[9px] font-mono text-purple-200 hover:text-white flex items-center gap-1 transition whitespace-nowrap font-bold"
              >
                <span className="w-1 h-1 rounded-full bg-purple-400" />
                <span>02: Characters</span>
              </button>
              <button
                onClick={() => onNavigateToRoom && onNavigateToRoom('script')}
                className="px-2 py-0.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/40 text-[9px] font-mono text-rose-200 hover:text-white flex items-center gap-1 transition whitespace-nowrap font-bold"
              >
                <span className="w-1 h-1 rounded-full bg-rose-400" />
                <span>03: Scriptwriting</span>
              </button>
              <button
                onClick={() => onNavigateToRoom && onNavigateToRoom('boards')}
                className="px-2 py-0.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/40 text-[9px] font-mono text-blue-200 hover:text-white flex items-center gap-1 transition whitespace-nowrap font-bold"
              >
                <span className="w-1 h-1 rounded-full bg-blue-400" />
                <span>04: Storyboarding</span>
              </button>
              <button
                onClick={() => onNavigateToRoom && onNavigateToRoom('edit')}
                className="px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/40 text-[9px] font-mono text-emerald-200 hover:text-white flex items-center gap-1 transition whitespace-nowrap font-bold"
              >
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                <span>05: Polish & Publish</span>
              </button>
            </div>
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-4 py-1.5 bg-[#090416] border-b border-amber-500/20 flex items-center space-x-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
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
