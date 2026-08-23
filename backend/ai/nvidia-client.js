// ==============================================================================
// WASSERMAN STUDIO SHELL - NVIDIA NIM FREE AI MODELS CLIENT
// ==============================================================================

import https from 'https';

export class NvidiaNIMClient {
  constructor(apiKey = process.env.NVIDIA_API_KEY) {
    this.apiKey = apiKey || process.env.NVIDIA_API_KEY || '';
    this.baseUrl = 'integrate.api.nvidia.com';
    this.defaultModel = 'meta/llama-3.1-70b-instruct';
  }

  setApiKey(key) {
    this.apiKey = key.trim();
  }

  hasApiKey() {
    return !!this.apiKey && this.apiKey.startsWith('nvapi-');
  }

  /**
   * Send chat completion request to NVIDIA NIM
   */
  async generateCompletion(options = {}) {
    const {
      prompt,
      systemPrompt = 'You are the Chief AI Director of the Wasserman Digital Production Studio. Generate concise, cinematic, and professional output.',
      model = this.defaultModel,
      temperature = 0.6,
      maxTokens = 1024,
    } = options;

    if (!this.apiKey) {
      console.warn('[NvidiaNIM] No NVIDIA_API_KEY configured. Using local deterministic fallback.');
      return {
        success: true,
        text: `[Local Engine]: ${prompt}`,
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
    const prompt = `Analyze this scene for our virtual production pipeline:\n\n${scriptText}\n\nReturn a JSON breakdown with: 1. Scene Setting 2. Characters Present 3. 3D Props needed 4. Camera & Lighting recommendation.`;
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
