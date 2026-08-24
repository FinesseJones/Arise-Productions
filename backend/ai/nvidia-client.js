// ==============================================================================
// ARISE PRODUCTION - NVIDIA NIM FREE AI MODELS CLIENT
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to auto-read .env if present
function loadEnvKey() {
  if (process.env.NVIDIA_API_KEY) return process.env.NVIDIA_API_KEY.trim();
  try {
    const envPath = path.resolve(__dirname, '../../.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/NVIDIA_API_KEY=(.+)/);
      if (match && match[1]) return match[1].trim();
    }
  } catch (e) {}
  return '';
}

export class NvidiaNIMClient {
  constructor(apiKey = loadEnvKey()) {
    this.apiKey = apiKey || loadEnvKey();
    this.baseUrl = 'integrate.api.nvidia.com';
    this.defaultModel = 'meta/llama-3.1-70b-instruct';
    this.availableModels = [
      { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B Instruct (Default)', description: 'Fast, highly creative, Hollywood screenplay & dialogue specialist' },
      { id: 'meta/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', description: 'State-of-the-art structural parsing, 3D camera vectors, and logic' },
      { id: 'nvidia/nemotron-4-340b-instruct', name: 'Nemotron-4 340B Instruct', description: '340B parameter massive model for multi-department continuity & bibles' },
      { id: 'meta/llama-3.1-405b-instruct', name: 'Llama 3.1 405B Instruct', description: 'Maximum depth reasoning powerhouse for intricate story arcs' },
    ];
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    // Save to .env
    try {
      const envPath = path.resolve(__dirname, '../../.env');
      let content = '';
      if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
        if (content.includes('NVIDIA_API_KEY=')) {
          content = content.replace(/NVIDIA_API_KEY=.*/, `NVIDIA_API_KEY=${this.apiKey}`);
        } else {
          content += `\nNVIDIA_API_KEY=${this.apiKey}\n`;
        }
      } else {
        content = `NVIDIA_API_KEY=${this.apiKey}\nNVIDIA_DEFAULT_MODEL=${this.defaultModel}\n`;
      }
      fs.writeFileSync(envPath, content, 'utf8');
      console.log('[NvidiaNIM] Saved NVIDIA_API_KEY to .env successfully.');
    } catch (e) {
      console.warn('[NvidiaNIM] Failed to write .env:', e.message);
    }
  }

  setDefaultModel(modelId) {
    if (this.availableModels.some((m) => m.id === modelId)) {
      this.defaultModel = modelId;
      console.log(`[NvidiaNIM] Default model switched to: ${modelId}`);
    }
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

    if (!this.apiKey) {
      console.warn('[NvidiaNIM] No NVIDIA_API_KEY configured. Please set your key in .env or via Settings.');
      return {
        success: true,
        text: `[Arise Studio Fallback Engine]: ${prompt}\n\n(Tip: Add your free NVIDIA API Key to activate Llama 3.1 70B NIM)`,
        model: 'local-fallback',
        ai_powered: false,
      };
    }

    const payload = JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature,
      max_tokens: maxTokens,
      stream: false,
    });

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: this.baseUrl,
          path: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Length': Buffer.byteLength(payload),
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              if (res.statusCode !== 200) {
                console.error(`[NvidiaNIM] Error ${res.statusCode}:`, body);
                resolve({
                  success: false,
                  error: `NVIDIA API Error ${res.statusCode}: ${body}`,
                });
                return;
              }

              const json = JSON.parse(body);
              const content = json.choices?.[0]?.message?.content || '';
              resolve({
                success: true,
                text: content,
                model: json.model || model,
                usage: json.usage,
                ai_powered: true,
              });
            } catch (e) {
              reject(new Error(`Failed to parse NVIDIA response: ${e.message}`));
            }
          });
        }
      );

      req.on('error', (err) => {
        console.error('[NvidiaNIM] Request failed:', err.message);
        resolve({
          success: false,
          error: `Network error connecting to NVIDIA NIM: ${err.message}`,
        });
      });

      req.write(payload);
      req.end();
    });
  }

  /**
   * Specialized Screenwriting & Script Breakdown Prompt
   */
  async analyzeScreenplay(scriptText) {
    const prompt = `Analyze this screenplay content for our virtual production pipeline:\n\n${scriptText}\n\nReturn a JSON breakdown with: 1. Scene Setting 2. Characters Present 3. 3D Props needed 4. Camera & Lighting recommendation.`;
    return this.generateCompletion({ prompt });
  }

  /**
   * Specialized 3D Previs Camera Choreography Prompt
   */
  async solve3DCamera(sceneDescription) {
    const prompt = `Given the following scene: "${sceneDescription}", specify the 3D cinematic camera movement (Focal length mm, camera track vector [x,y,z], shot angle, and key lighting mood).`;
    return this.generateCompletion({ prompt });
  }

  /**
   * Specialized Generative Prompt Lock Generator
   */
  async generateSlatePrompts(sceneContext) {
    const prompt = `Generate a continuity-locked generative prompt pack for video, audio, and visual references for: "${sceneContext}". Include exact lighting, camera lens, and negative prompt keywords.`;
    return this.generateCompletion({ prompt });
  }
}

export const nvidia = new NvidiaNIMClient();
export default nvidia;
