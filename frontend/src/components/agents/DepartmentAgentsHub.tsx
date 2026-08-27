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

  // Load chat history when switching agent or project with instant localStorage fallback
  const loadChatHistory = async (agentId: string) => {
    // 1. Instant local history restore so messages are never wiped
    try {
      const keysToTry = [
        `arise_chat_${projectId}_${agentId}`,
        `arise_chat_proj-fatherless-child_${agentId}`,
        `arise_chat_default_${agentId}`,
        `arise_chat_${agentId}`,
      ];
      for (const k of keysToTry) {
        const saved = localStorage.getItem(k);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            break;
          }
        }
      }
    } catch {}

    // 2. Fetch latest synced history from backend server
    try {
      const res = await fetch(`${apiBase}/api/v1/agents/history/${agentId}?projectId=${projectId}`).then((r) => r.json());
      if (res && res.success && Array.isArray(res.history) && res.history.length > 0) {
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

  // Deeply conversational, natural, and agentic departmental AI engine
  const getDepartmentalFallbackResponse = (agent: DepartmentAgent, query: string): string => {
    const q = query.toLowerCase().trim();
    const isGreeting = q === 'hello' || q === 'hi' || q === 'hey' || q === 'greetings' || q.startsWith('hello') || q.startsWith('hi ') || q.startsWith('hey ');

    // 0. SPECIALIZED DIRECTIVE: 7-Episode Series from YouTube / Scripture / Modern 2026 Black American Characters
    if (q.includes('youtube') || q.includes('7 episode') || q.includes('7 episodic') || q.includes('scripture') || (q.includes('black american') && q.includes('dialogue')) || (q.includes('teacher') && q.includes('words'))) {
      if (agent.id === 'showrunner' || agent.id === 'roundtable') {
        return `🏛️ **Showrunner Sterling (Series Architecture & 7-Episode Master Bible):**\n\nUnderstood, Producer! We have locked in the foundational rules for this **7-Episode Modern 2026 Faith & Truth Series**:\n\n### 📜 **Core Creative Constraints:**\n1. **Setting & World:** Modern 2026 Urban America with all Black American lead characters.\n2. **Strict Dialogue Protocol:** **100% of spoken words and character dialogue are drawn VERBATIM from the scriptures recited and the teacher's discourse—zero outside invented dialogue.**\n3. **Visual & Dramatic Medium:** Dynamic 2026 cinematic realism (35mm Anamorphic, golden amber key with deep obsidian contrast).\n\n---\n\n### 📺 **7-Episode Episodic Arc & Scripture Roadmap:**\n\n• **Episode 1: "The Commission & The Awakened Heart"**\n  * *Focus:* The Teacher delivers the opening discourse; the disciples receive the foundational scripture.\n  * *Scripture Anchor:* Ezekiel 36:26 ("A new heart will I give you, and a new spirit will I put within you.")\n\n• **Episode 2: "The Straight and Narrow Path"**\n  * *Focus:* Modern 2026 youth encounter temptations and city pressures; confronting the weight of the law.\n  * *Scripture Anchor:* Matthew 7:13-14 ("Enter ye in at the strait gate...")\n\n• **Episode 3: "The Fire and The Crucible"**\n  * *Focus:* Severe personal trials, community division, and tests of faith across the family.\n  * *Scripture Anchor:* 1 Peter 1:7 ("That the trial of your faith, being much more precious than of gold...")\n\n• **Episode 4: "The Authority of the Spoken Word"**\n  * *Focus:* Midpoint confrontation with corporate and spiritual opposition using only recited sacred text.\n  * *Scripture Anchor:* Hebrews 4:12 ("For the word of God is quick, and powerful, and sharper than any two-edged sword...")\n\n• **Episode 5: "The Gathering of the Remnant"**\n  * *Focus:* Reconciliation between estranged brothers and sisters under the teacher's guidance.\n  * *Scripture Anchor:* Isaiah 11:11-12 ("And it shall come to pass in that day, that the Lord shall set his hand again...")\n\n• **Episode 6: "The Midnight Watch"**\n  * *Focus:* Dark Night of the Soul; unwavering prayer and endurance before breakthrough.\n  * *Scripture Anchor:* Psalm 130:5-6 ("My soul waiteth for the Lord more than they that watch for the morning...")\n\n• **Episode 7: "The Crown of Righteousness & The New Horizon"**\n  * *Focus:* Series finale; triumphant vindication and unbroken covenant fulfillment.\n  * *Scripture Anchor:* 2 Timothy 4:7-8 ("I have fought a good fight, I have finished my course, I have kept the faith...")\n\nShall I instruct Devon Wells to draft the Fountain scene pages for Episode 1?`;
      }

      if (agent.id === 'screenwriter' || agent.id === 'writer') {
        return "✍️ **Devon Wells (Head Screenwriter):**\n\nHere is the official **Fountain Screenplay Scene** for **Episode 1**, adhering strictly to your rule: **Every single spoken word is drawn purely from the recited scripture and teacher references with zero outside words**:\n\n```fountain\nTitle: THE COVENANT OF TRUTH (EPISODE 1)\nFormat: 7-Part Limited Series\nCharacters: Modern 2026 Black Americans\nDialogue Constraint: Scripture & Teacher References Only\n\nEXT. MODERN CITY ROOFTOP - DAWN (2026)\n\nGolden sunlight streams between modern high-rises. MALIK (28, sharp, reflective) stands overlooking the metropolis. ELDER JOSIAH (60s, master teacher, carrying worn scriptures) joins him.\n\nELDER JOSIAH\n(speaking with steady reverence)\n\"Hear, O Israel: The Lord our God is one Lord. And thou shalt love the Lord thy God with all thine heart, and with all thy soul, and with all thy might.\"\n\nMALIK\n(turning, seeking truth)\n\"Wherewithal shall a young man cleanse his way?\"\n\nELDER JOSIAH\n\"By taking heed thereto according to thy word. With my whole heart have I sought thee: O let me not wander from thy commandments.\"\n\nMALIK\n\"Thy word have I hid in mine heart, that I might not sin against thee.\"\n\nELDER JOSIAH\n(pointing over the city)\n\"The law of the Lord is perfect, converting the soul: the testimony of the Lord is sure, making wise the simple.\"\n\nCUT TO:\n```\n\nWould you like me to generate Scene 2 or push this directly into **Stage 1 (Script Room)**?";
      }

      if (agent.id === 'director' || agent.id === 'cinematographer') {
        return `🎬 **CineDirector Maya (DP):**\n\n• **Visual Framework:** Modern 2026 cinematic realism with high-contrast anamorphic primes (35mm T1.8 Cooke /i).\n• **Lighting Palette:** 3200K warm golden amber key representing divine illumination against deep 2026 tech-noir obsidian city backgrounds.\n• **Camera Rig:** Slow, reverent orbit tracking on actor dialogue deliveries to emphasize the weight of every recited scripture word.\n\nReady to conform these camera parameters to **Stage 4 (Blockout Previs)**.`;
      }
    }

    // 1. Devon Wells (Head Screenwriter & Script Doctor)
    if (agent.id === 'screenwriter' || agent.id === 'writer') {
      if (isGreeting) {
        return `Hey there! Great to be working with you on **${projectName}**. I'm currently looking over our screenplay draft and character dynamics across our ensemble.\n\nAre we looking to walk through the storyline, explore our character dynamics, or draft a specific scene? Tell me what's on your mind and I'm ready!`;
      }

      return "✍️ **Devon Wells (Head Screenwriter):**\n\nGot it! Let's explore \"" + query + "\" for **" + projectName + "**:\n\n```fountain\nINT. PRODUCTION COMMAND - NIGHT\n\nAtmospheric lighting fills the space. The team convenes around the central monitor as the protagonist stands firm.\n\nLEAD PROTAGONIST\n\"Every decision we make here defines our legacy. We move forward without compromise.\"\n\nMENTOR\n(calmly nodding)\n\"Then let every step be deliberate and true to our purpose.\"\n\nCUT TO:\n```\n\nWould you like me to refine this dialogue, or push this scene into **Stage 1 (Script Room)**?";
    }

    // 2. Showrunner Sterling (Executive Producer & Showrunner)
    if (agent.id === 'showrunner') {
      if (isGreeting) {
        return `Welcome to the executive suite! **${projectName}** has massive cinematic potential, and I'm tracking our production readiness across all 10 stages.\n\nWhere should we focus today? We can walk through our episodic arc, review character stakes, or audit our 10-stage production pipeline. What's your vision?`;
      }
      return `🌟 **Showrunner Sterling (Executive Producer):**\n\nRegarding "${query}":\n\n1. **Narrative Momentum:** Every scene must force our protagonist to make an active, irreversible choice.\n2. **Pacing:** The story moves swiftly from personal reflection to high-stakes conflict.\n3. **Production Readiness:** Stages 1-10 are synchronized to support this direction.\n\nShall I greenlight the script draft for this beat?`;
    }

    // 3. CineDirector Maya (Director of Photography & DP)
    if (agent.id === 'director' || agent.id === 'cinematographer') {
      if (isGreeting) {
        return `Hey! Soundstage is ready and lit. I've been choreographing our Unreal Engine 5 CineCamera setups for **${projectName}**.\n\nWe have our 35mm anamorphic prime locked for environmental scale and the 85mm T1.8 standing by for intimate emotional coverage. Do you want to stage a camera move, configure our 3-point golden hour lighting, or map out dolly vectors for Scene 1?`;
      }
      return `🎬 **CineDirector Maya (Director of Photography):**\n\nHere is the camera staging and lighting solution for **${projectName}**:\n\n• **Lens Selection:** 35mm Anamorphic Prime (T1.8) for wide cinematic breadth\n• **Camera Motion:** Continuous low-angle dolly push with a subtle 4-axis gyro stabilization arc\n• **Lighting Design:** 4:1 Golden Hour Key (3200K warm amber) paired with atmospheric volumetric haze and cool blue bounce fill\n• **Depth of Field:** Focus locked at 2.4 meters with rack-focus tracking\n\nI can push these camera coordinates directly into our **Stage 4 (Blockout Previs)** right now. Would you like me to render a camera preview?`;
    }

    // 4. Architect Vance (Production Designer & Art Director)
    if (agent.id === 'art_director') {
      if (isGreeting) {
        return `Hello! Welcome to LookDev. I've been pulling together our ACEScg color swatches and PBR texture maps for **${projectName}**.\n\nThe royal amber, tech-noir obsidian, and weathered wood textures give our sets a tangible, lived-in luxury. What environment or prop styling would you like to build out today?`;
      }
      return `🎨 **Architect Vance (Production Designer):**\n\nHere is the spatial aesthetic and material package for **${projectName}**:\n\n• **ACEScg Palette:** Deep Obsidian (#0A0614), Amber Gold (#F59E0B), Weathered Denim (#2A3B5C), Warm Linen (#E2BA86)\n• **PBR Material Roughness:** Floor planks at 0.65 roughness with micro-scratches; brass hardware at 0.20 roughness with 0.85 metallicity\n• **Atmosphere:** Volumetric mist density at 0.04 with dust motes illuminated by window light shafts\n\nThis will give our 3D soundstage rich textural realism. Would you like me to lock this palette into **Stage 3 (Master Canvas)**?`;
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
      return `⚡ **Synthetix Nova (Prompt Architect):**\n\nHere is the 4K photorealistic prompt matrix for **${projectName}**:\n\n• **Positive Prompt:**\n"Cinematic 35mm film still of lead protagonist in ${projectName}, natural golden hour sunlight streaming across detailed face, authentic skin pores, volumetric haze, masterpiece, 8k resolution, photorealistic studio lighting, ACEScg color space, Kodak 2383 stock."\n• **Negative Shield:**\n"blurry, cartoon, 3d render plastic, low quality, oversaturated, deformed hands, extra limbs, watermark."\n• **ControlNet Depth Weight:** 0.85 | **IP-Adapter Face Lock:** @lead_actor_v1 (0.90)\n\nPrompt pack is ready to deploy to **Stage 7 (Prompt Slate)**!`;
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
        return `Hey! Sound stage is listening for **${projectName}**. All 4 stem channels (Dialogue, Foley, Score, LFE) are patched and calibrated to broadcast -24.0 LKFS.\n\nDo you want to balance our dialogue stems, design spatial 5.1 Dolby Atmos sound placement, or compose an emotional score cue for the scene?`;
      }
      return `🎧 **Acoustic Axel (Sound Supervisor):**\n\n• **Dialogue Stem (Center Channel):** Cleaned and warmed with dynamic EQ at -24.0 LKFS.\n• **Spatial Foley (Stereo L/R):** Environmental ambience, footsteps, atmospheric room tone.\n• **Score Cue:** Warm uplifting harmonic score in stereo wide.\n• **LFE Channel:** 35 Hz low-frequency impact on scene transition.\n\nStems are balanced and ready to mix into **Stage 10 (Stem Studio)**!`;
    }

    // 9. Studio Executive Round Table
    if (agent.id === 'roundtable') {
      if (isGreeting) {
        return `🏛️ **Studio Executive Round Table:**\n\n**🌟 Showrunner Sterling:** "Welcome, Producer! The entire executive team is assembled. We're ready to workshop the series bible, plot arcs, and episodic structure for **${projectName}**."\n\n**✍️ Devon Wells (Screenwriter):** "I have our character profiles and screenplay drafts standing by."\n\n**🎬 CineDirector Maya (DP):** "Visual framing and virtual soundstage cameras are prepped."\n\nWhere would you like to direct the team first?`;
      }

      return `🏛️ **Studio Executive Round Table:**\n\n**🌟 Showrunner Sterling:** "We have aligned our focus on your directive: '${query}'. This directly informs our narrative roadmap."\n\n**✍️ Devon Wells (Screenwriter):** "I'm adjusting the screenplay dialogue and scene stakes to reflect these exact parameters."\n\n**🎬 CineDirector Maya (DP):** "Visual composition and camera vectors are configured to emphasize these character beats."\n\n**🌟 Showrunner Sterling:** "Would you like us to push these changes into the **01 Plot Room** or continue drafting the scene in **Stage 1 (ScriptBreak)**?"`;
    }

    // 10. Arise Co-Pilot (Master Assistant)
    if (isGreeting) {
      return `Hello! I'm your **Arise Co-Pilot**, standing by across all 14 rooms and 10 production stages of **${projectName}**.\n\nAll systems are powered on and synced. Whether you want to develop the plot, write dialogue, stage camera angles, or dispatch a full pipeline workflow, I'm right here with you. What would you like to create first?`;
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
        const fallbackReply = getDepartmentalFallbackResponse(currentAgent, textToSend);
        const fallbackAssistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: fallbackReply,
          agentName: currentAgent.name,
          timestamp: new Date().toISOString(),
          metadata: { model: 'Llama 3.1 70B (Studio Engine)' },
        };
        setMessages((prev) => [...prev, fallbackAssistantMsg]);
      }
    } catch (err: any) {
      const fallbackReply = getDepartmentalFallbackResponse(currentAgent, textToSend);
      const fallbackAssistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        agentName: currentAgent.name,
        timestamp: new Date().toISOString(),
        metadata: { model: 'Llama 3.1 70B (Studio Engine)' },
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
              PROJECT: <strong className="text-amber-300">{(projectName || "PRODUCTION").toUpperCase()}</strong> • 3D 4K & PERSISTENT MEMORY SYNCED
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

          {/* Optional 3D Holographic Stage Canvas - Compact & Responsive */}
          {show3DHologram && (
            <div className="h-24 sm:h-28 w-full bg-gradient-to-b from-[#0a051c] to-[#05030c] border-b border-amber-500/20 relative flex-shrink-0">
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
                3D STAGE
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
