// ==============================================================================
// ARISE PRODUCTION - NVIDIA NIM FREE AI MODELS CLIENT & CO-PILOT ENGINE
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to auto-read NVIDIA_API_KEY from process.env as single source of truth
function loadEnvKey() {
  if (process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY.trim().startsWith('nvapi-')) {
    return process.env.NVIDIA_API_KEY.trim();
  }
  return '';
}

export class NvidiaNIMClient {
  constructor(apiKey = loadEnvKey()) {
    this.apiKey = apiKey || loadEnvKey();
    this.baseUrl = 'https://integrate.api.nvidia.com';
    this.defaultModel = 'meta/llama-3.2-11b-vision-instruct';
    this.availableModels = [
      { id: 'meta/llama-3.2-11b-vision-instruct', name: 'Llama 3.2 11B Vision Instruct (Active)', description: 'Primary agent instruct model — Verified active on NVIDIA NIM' },
      { id: 'poolside/laguna-xs-2.1', name: 'Poolside Laguna XS 2.1 (Fast Assistant)', description: 'Secondary text model — Verified active on NVIDIA NIM' },
    ];
  }

  setApiKey(key) {
    if (!key || typeof key !== 'string') return;
    const cleanKey = key.trim();
    this.apiKey = cleanKey;
    process.env.NVIDIA_API_KEY = cleanKey;
  }

  setDefaultModel(modelId) {
    this.defaultModel = modelId;
    console.log(`[NvidiaNIM] Default model switched to: ${modelId}`);
  }

  hasApiKey() {
    return Boolean(this.apiKey && typeof this.apiKey === 'string' && this.apiKey.trim().startsWith('nvapi-'));
  }

  getStatus() {
    const hasKey = this.hasApiKey();
    const isCustom = hasKey && !this.apiKey.includes('arise');
    return {
      hasKey,
      isOperational: hasKey,
      maskedKey: hasKey ? (isCustom ? `${this.apiKey.slice(0, 10)}...${this.apiKey.slice(-4)}` : 'configured') : 'None',
      defaultModel: this.defaultModel,
      availableModels: this.availableModels,
    };
  }

  /**
   * Send chat completion request to NVIDIA NIM with full tool-calling support
   */
  async generateCompletion(options = {}) {
    const {
      prompt,
      systemPrompt = 'You are the Chief AI Specialist in Arise Production Studio. Provide high-fidelity, in-character creative direction.',
      messages = null,
      tools = null,
      toolChoice = 'auto',
      model = this.defaultModel,
      temperature = 0.6,
      maxTokens = 1500,
    } = options;

    let userQuery = prompt || '';
    if (!userQuery && Array.isArray(messages) && messages.length > 0) {
      const userMsg = messages.slice().reverse().find((m) => m.role === 'user' || m.role === 'Producer (User)');
      userQuery = userMsg ? userMsg.content || userMsg.text || '' : '';
    }

    if (!this.hasApiKey()) {
      this.apiKey = loadEnvKey();
    }

    if (!this.hasApiKey()) {
      const errMsg = 'No NVIDIA API key configured. Please set your NVIDIA NIM API key (starts with nvapi-) in Settings.';
      console.warn(`[NvidiaNIM] ${errMsg}`);
      return {
        success: false,
        error: errMsg,
      };
    }

    // Build chat conversation array
    let chatMessages = [];
    if (Array.isArray(messages) && messages.length > 0) {
      const hasSystem = messages.some((m) => m.role === 'system');
      if (hasSystem) {
        chatMessages = messages.map((m) => {
          const role = m.role === 'ai' ? 'assistant' : m.role;
          const msgObj = { role, content: m.content || m.text || '' };
          if (m.tool_calls) msgObj.tool_calls = m.tool_calls;
          if (m.tool_call_id) msgObj.tool_call_id = m.tool_call_id;
          if (m.name) msgObj.name = m.name;
          return msgObj;
        });
      } else {
        chatMessages = [
          { role: 'system', content: systemPrompt },
          ...messages.map((m) => {
            const role = m.role === 'ai' ? 'assistant' : m.role;
            const msgObj = { role, content: m.content || m.text || '' };
            if (m.tool_calls) msgObj.tool_calls = m.tool_calls;
            if (m.tool_call_id) msgObj.tool_call_id = m.tool_call_id;
            if (m.name) msgObj.name = m.name;
            return msgObj;
          }),
        ];
      }
    } else {
      chatMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery || 'Execute creative direction.' },
      ];
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const requestBody = {
        model,
        messages: chatMessages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      };

      if (Array.isArray(tools) && tools.length > 0) {
        requestBody.tools = tools;
        requestBody.tool_choice = toolChoice;
      }

      const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let errBody = '';
        try {
          errBody = await res.text();
        } catch (e) {}
        const errorMsg = `NVIDIA NIM API error (HTTP ${res.status} ${res.statusText}): ${errBody || 'Unknown error'}`;
        console.error(`[NvidiaNIM] ${errorMsg}`);
        return {
          success: false,
          error: errorMsg,
          status: res.status,
          statusText: res.statusText,
        };
      }

      const json = await res.json();
      const choice = json.choices?.[0];
      const message = choice?.message || {};
      const content = message.content || '';
      const toolCalls = message.tool_calls || null;

      return {
        success: true,
        message,
        text: content,
        tool_calls: toolCalls,
        model: json.model || model,
        usage: json.usage,
        ai_powered: true,
      };
    } catch (err) {
      console.error('[NvidiaNIM] Request network or timeout error:', err.message);
      return {
        success: false,
        error: `NVIDIA NIM network error: ${err.message}`,
      };
    }
  }
}

// Export singleton instance
export const nvidiaNIM = new NvidiaNIMClient();
export const nvidia = nvidiaNIM;
export default nvidiaNIM;
