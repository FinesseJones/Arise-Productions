import { getAPIBaseURL } from '../lib/api';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sender?: 'user' | 'ai';
  text?: string;
  timestamp?: string;
  model?: string;
  actions?: Array<{ tool: string; args: any; result: any }>;
  attachedFile?: { name: string; size: string };
}

export interface ChatCompletionOptions {
  stageId: string;
  roomName: string;
  projectName: string;
  shotNumber: number;
  departmentRole: string;
  model?: string;
  messages: ChatMessage[];
}

export interface AgentAction {
  id?: string;
  tool: string;
  args: any;
  result: any;
}

export interface ChatResponse {
  text: string;
  model: string;
  actions?: AgentAction[];
}

const DEFAULT_NVIDIA_KEY = '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';
const DEFAULT_MODEL = 'meta/llama-3.3-70b-instruct';

export function getActiveApiKey(): string {
  try {
    const saved = localStorage.getItem('arise_nvidia_api_key');
    if (saved && saved.startsWith('nvapi-')) return saved.trim();
  } catch {}
  return DEFAULT_NVIDIA_KEY;
}

export function getActiveModel(): string {
  try {
    const saved = localStorage.getItem('arise_selected_model');
    if (saved) return saved.trim();
  } catch {}
  return DEFAULT_MODEL;
}

/**
 * Send request to backend Autonomous Agent Runtime with tool-calling support
 */
export async function sendChatMessage(options: ChatCompletionOptions): Promise<ChatResponse> {
  const { stageId, roomName, projectName, shotNumber, departmentRole, messages } = options;
  const model = options.model || getActiveModel();
  const apiBase = getAPIBaseURL();

  try {
    const res = await fetch(`${apiBase}/api/v1/projects/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stageId,
        projectName,
        shotNumber,
        departmentRole,
        messages: messages.map((m) => ({
          role: (m.role === 'assistant' || m.sender === 'ai') ? 'assistant' : 'user',
          content: m.content || m.text || '',
        })),
      }),
    });

    if (res.ok) {
      const json = await res.json();
      const text = json.reply || json.text || json.response;
      if (text && text.trim()) {
        return {
          text: text.trim(),
          model: json.model || model,
          actions: json.actions || [],
        };
      }
    } else {
      const errorJson = await res.json().catch(() => ({}));
      const errorMsg = errorJson.error || `HTTP ${res.status} Error`;
      return {
        text: `⚠️ Agent Error: ${errorMsg}`,
        model,
        actions: [],
      };
    }
  } catch (err: any) {
    console.warn('[AICoPilotService] Backend call failed:', err);
    return {
      text: `⚠️ Network Connection Error: Could not connect to Arise Agent Runtime at ${apiBase}. Ensure the backend server is running.`,
      model,
      actions: [],
    };
  }

  return {
    text: '⚠️ Agent returned an empty response.',
    model,
    actions: [],
  };
}

/**
 * High-quality dynamic conversational response generator for all departments
 */
function generateDynamicAssistantResponse(prompt: string, stageId: string, projectName: string, shotNumber: number): string {
  const p = prompt.toLowerCase();

  // Screenwriting Room
  if (stageId === 'script') {
    if (p.includes('dialogue') || p.includes('scene') || p.includes('script') || p.includes('write')) {
      return `Here is a cinematic scene tailored for **${projectName}** (Shot ${shotNumber}):\n\n` +
        `EXT. URBAN NEIGHBORHOOD PORCH - EARLY MORNING\n\n` +
        `Golden morning light breaks through the amber trees, catching the dust motes in the brisk autumn air. A heavy silence settles over the quiet street.\n\n` +
        `DEVON (19)\n` +
        `(clutching a worn, faded photograph of a man he never knew)\n` +
        `"Every time I look in the mirror, I keep trying to find a face I never met. People tell me I move like him, talk like him... but how do you carry the weight of a shadow?"\n\n` +
        `MARCUS (40s, mentor, placing a warm hand on Devon's shoulder)\n` +
        `"Because you're not his ghost, Devon. You're the man who gets to decide what this family's name means from here on out. The absence didn't define you—your perseverance did."\n\n` +
        `Devon stares out at the waking city horizon, letting the words sink in. He slowly lowers the photograph.\n\n` +
        `DEVON\n` +
        `"Then let's make sure they remember what we build today."\n\n` +
        `CUT TO:\n\n` +
        `*Would you like me to develop the next dialogue exchange, explore Devon's backstory beat, or structure the following scene?*`;
    }
    return `As your Lead Screenwriter for **${projectName}**, here are my creative recommendations for Shot ${shotNumber}:\n\n` +
      `1. **Core Conflict & Stakes:** Ensure every character entering this scene has an opposing immediate goal to generate instant tension.\n` +
      `2. **Visual Action Subtext:** Replace exposition with physical behavior—have characters interact with environment props while speaking.\n` +
      `3. **Pacing:** Keep action lines under 2-3 lines to maintain rapid reading momentum for the director and DP.\n\n` +
      `Tell me what specific scene or character arc you want to brainstorm or write next!`;
  }

  // Cinematography / Previs
  if (stageId === 'previs') {
    return `Here is the Virtual Cinematography & Camera Breakdown for **${projectName}** (Shot ${shotNumber}):\n\n` +
      `• **Focal Length:** 35mm Anamorphic Prime (T1.8) for expansive depth and subtle edge distortion.\n` +
      `• **Camera Motion:** Slow forward dolly tracking with a 15° rotational orbit at eye-level.\n` +
      `• **Lighting Setup:** 3-Point Cinematic Key (Golden Amber 3200K at 45°), Soft Cyan Ambient Fill, and sharp Rim Light.\n` +
      `• **Depth of Field:** Focus distance set to 2.4 meters with f/2.0 aperture to isolate the subject.\n\n` +
      `Let me know if you'd like to adjust the lens focal length, crane height, or orbit speed!`;
  }

  // Generative Prompt Lab
  if (stageId === 'prompt') {
    return `Here is your optimized generative prompt matrix for **${projectName}** (Shot ${shotNumber}):\n\n` +
      `**Positive Prompt:**\n` +
      `\`\`\`\n` +
      `Cinematic 35mm anamorphic film still from "${projectName}", shot ${shotNumber}, dramatic volumetric amber lighting, photorealistic textures, atmospheric haze, 8k resolution, masterpiece, ACEScg color grade, award-winning cinematography.\n` +
      `\`\`\`\n\n` +
      `**Negative Prompt:**\n` +
      `\`\`\`\n` +
      `blurry, oversaturated, deformed hands, cartoonish, low resolution, 3d render plastic, watermark, text.\n` +
      `\`\`\`\n\n` +
      `• **ControlNet Depth Weight:** 0.85\n` +
      `• **IP-Adapter Likeness Weight:** 0.90 (@lead_actor_v1)\n\n` +
      `Ready to compile and dispatch to ComfyUI!`;
  }

  // Sound Design
  if (stageId === 'sound') {
    return `Here is the Dolby Atmos 5.1 Audio Bed & Mix Setup for **${projectName}**:\n\n` +
      `1. **Dialogue Stem (A1 - Center):** Master vocal track cleaned and leveled at -24.0 LKFS.\n` +
      `2. **Spatial Foley (A2 - L/R Surround):** Ambient room resonance, footsteps, and physical prop interactions.\n` +
      `3. **Score Bed (A3 - Stereo):** Cinematic strings with deep low-frequency cello swells.\n` +
      `4. **LFE Subwoofer:** Sub-audible 40Hz rumble on major visual transitions.\n\n` +
      `All stems are normalized to broadcast standards. What additional sound effects would you like to layer in?`;
  }

  // Finishing & Editing
  if (stageId === 'edit') {
    return `Here is the DaVinci Resolve Editorial & Color Conform for **${projectName}**:\n\n` +
      `• **Timeline:** 4K DCI (4096x2160) at 24.000 FPS\n` +
      `• **Color Grading:** ACEScc with Kodak 2383 Print Emulation\n` +
      `• **Cut Rhythm:** Fast-paced opening transitions settling into 6-second dramatic master holds.\n` +
      `• **Master Export:** Apple ProRes 4444 XQ with 24-bit 48kHz audio.\n\n` +
      `Let me know if you want to adjust the cut points or apply a custom 3D LUT!`;
  }

  // General Assistant
  return `I am your AI Co-Pilot for the **${(stageId || "STUDIO").toUpperCase()}** department in **${projectName}** (Shot ${shotNumber}).\n\n` +
    `I have analyzed your directive: *"${prompt}"*.\n\n` +
    `Here are the next creative steps we can take:\n` +
    `1. Refine the specific narrative or technical parameters for this shot.\n` +
    `2. Synchronize the output with the active 3D soundstage and viewport.\n` +
    `3. Lock the assets and proceed to the next production department.\n\n` +
    `How would you like to proceed?`;
}
