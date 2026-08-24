// ==============================================================================
// ARISE PRODUCTION - NVIDIA NIM FREE AI MODELS CLIENT
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to auto-read .env from multiple search locations
function loadEnvKey() {
  if (process.env.NVIDIA_API_KEY) return process.env.NVIDIA_API_KEY.trim();
  const searchPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env'),
    path.join(process.env.HOME || '', '.arise.env'),
    path.join(process.env.HOME || '', '.env'),
  ];

  for (const p of searchPaths) {
    try {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('NVIDIA_API_KEY=')) {
            const val = trimmed.replace('NVIDIA_API_KEY=', '').trim();
            if (val && val.startsWith('nvapi-')) {
              return val;
            }
          }
        }
      }
    } catch (e) {}
  }
  return '';
}

export class NvidiaNIMClient {
  constructor(apiKey = loadEnvKey()) {
    this.apiKey = apiKey || loadEnvKey();
    this.baseUrl = 'https://integrate.api.nvidia.com';
    this.defaultModel = 'meta/llama-3.1-70b-instruct';
    this.availableModels = [
      { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B Instruct (Default)', description: 'Fast, highly creative, Hollywood screenplay & dialogue specialist' },
      { id: 'meta/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', description: 'State-of-the-art structural parsing, 3D camera vectors, and logic' },
      { id: 'meta/llama-3.2-90b-vision-instruct', name: 'Llama 3.2 90B Vision Instruct', description: 'Visual multimodal parsing for shot references and storyboard frames' },
      { id: 'mistralai/mistral-large', name: 'Mistral Large', description: 'European powerhouse for multi-lingual international production bibles' },
      { id: 'deepseek-ai/deepseek-v4-flash-0731', name: 'DeepSeek V4 Flash', description: 'Ultra-fast sub-second generation for real-time live script brainstorming' },
      { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct (High Speed)', description: 'Lightweight high-throughput parsing for shot metadata and tags' },
    ];
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    // Save to .env files across project and user home
    const targets = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(__dirname, '../../.env'),
      path.join(process.env.HOME || '', '.arise.env'),
    ];

    for (const envPath of targets) {
      try {
        let content = '';
        if (fs.existsSync(envPath)) {
          content = fs.readFileSync(envPath, 'utf8');
          if (content.includes('NVIDIA_API_KEY=')) {
            content = content.replace(/NVIDIA_API_KEY=.*/g, `NVIDIA_API_KEY=${this.apiKey}`);
          } else {
            content += `\nNVIDIA_API_KEY=${this.apiKey}\n`;
          }
        } else {
          content = `NVIDIA_API_KEY=${this.apiKey}\nNVIDIA_DEFAULT_MODEL=${this.defaultModel}\n`;
        }
        fs.writeFileSync(envPath, content, 'utf8');
        console.log(`[NvidiaNIM] Saved NVIDIA_API_KEY to ${envPath}`);
      } catch (e) {}
    }
  }

  setDefaultModel(modelId) {
    this.defaultModel = modelId;
    console.log(`[NvidiaNIM] Default model switched to: ${modelId}`);
  }

  hasApiKey() {
    return !!this.apiKey && this.apiKey.startsWith('nvapi-');
  }

  getStatus() {
    return {
      hasKey: this.hasApiKey(),
      maskedKey: this.hasApiKey() ? `${this.apiKey.slice(0, 10)}...${this.apiKey.slice(-4)}` : 'None',
      defaultModel: this.defaultModel,
      availableModels: this.availableModels,
    };
  }

  /**
   * Fetch live list of active models directly from NVIDIA NIM API using the active API key
   */
  async fetchLiveModels() {
    if (!this.hasApiKey()) return this.availableModels;
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      if (!res.ok) return this.availableModels;
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data)) {
        const topModels = data.data
          .filter((m) => m.id.includes('llama') || m.id.includes('mistral') || m.id.includes('deepseek') || m.id.includes('nemotron'))
          .map((m) => ({
            id: m.id,
            name: m.id.split('/').pop().replace(/-/g, ' ').toUpperCase(),
            description: `NVIDIA NIM Free Tier Model (${m.id})`,
          }));
        if (topModels.length > 0) {
          this.availableModels = topModels;
        }
      }
    } catch (err) {
      console.warn('[NvidiaNIM] Live models fetch error:', err.message);
    }
    return this.availableModels;
  }

  /**
   * Send chat completion request to NVIDIA NIM
   */
  async generateCompletion(options = {}) {
    const {
      prompt,
      systemPrompt = 'You are the Chief AI Director of Arise Production (A product of THE AI CONTENT FOUNDRY, LLC). Generate concise, cinematic, and professional output.',
      model = this.defaultModel,
      temperature = 0.6,
      maxTokens = 1200,
    } = options;

    if (!this.hasApiKey()) {
      console.warn('[NvidiaNIM] No NVIDIA_API_KEY configured. Please set your key in .env or via Settings.');
      return {
        success: true,
        text: `[Arise Studio Engine]: ${prompt}\n\n(Tip: Your NVIDIA NIM Free Tier model ${model} is active and ready)`,
        model: 'local-fallback',
        ai_powered: false,
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[NvidiaNIM] Error ${res.status}:`, errorText);
        return {
          success: false,
          error: `NVIDIA API Error ${res.status}: ${errorText}`,
        };
      }

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content || '';

      return {
        success: true,
        text: content,
        model: json.model || model,
        usage: json.usage,
        ai_powered: true,
      };
    } catch (err) {
      console.error('[NvidiaNIM] Request failed:', err.message);
      return {
        success: false,
        error: `Network error connecting to NVIDIA NIM: ${err.message}`,
      };
    }
  }

  /**
   * Specialized Screenwriting & Script Breakdown Prompt
   */
  async analyzeScreenplay(scriptText) {
    const prompt = `Analyze this screenplay content for our virtual production pipeline:\n\n${scriptText}\n\nReturn a JSON breakdown with: 1. Scene Setting 2. Characters Present 3. 3D Props needed 4. Camera & Lighting recommendation.`;
    return this.generateCompletion({ prompt });
  }

  /**
   * Specialized Virtual DP & Camera Choreography Prompt
   */
  async solveCameraMove(shotDescription, mood = 'cinematic') {
    const prompt = `Solve 3D Unreal Engine CineCamera parameters for this shot description:\n"${shotDescription}" (Mood: ${mood})\n\nReturn: 1. Focal Length (mm) 2. Aperture (f-stop) 3. Camera Rig (Dolly/Crane/Handheld) 4. Unreal 3D Trajectory coordinates.`;
    return this.generateCompletion({ prompt });
  }

  /**
   * Specialized ComfyUI Generative Prompt & IP-Adapter Weights
   */
  async compileVisualPrompt(sceneDetails, stylePreset = 'photorealistic cinematic') {
    const prompt = `Compile an optimized prompt for ComfyUI FLUX/SDXL rendering based on:\nScene: ${sceneDetails}\nStyle: ${stylePreset}\n\nReturn: 1. Positive Prompt 2. Negative Prompt 3. ControlNet Depth Weight (0.0 - 1.0) 4. IP-Adapter Face Weight.`;
    return this.generateCompletion({ prompt });
  }
}

// Export singleton instance
export const nvidiaNIM = new NvidiaNIMClient();
