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

const DEFAULT_MODEL = 'nvidia/nemotron-3-super-120b-a12b';

export function getActiveApiKey(): string {
  try {
    const saved = localStorage.getItem('arise_nvidia_api_key');
    if (saved && saved.startsWith('nvapi-')) return saved.trim();
  } catch {}
  return '';
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

