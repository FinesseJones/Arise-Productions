// ==============================================================================
// ARISE PRODUCTION - AUTONOMOUS AGENT RUNTIME & TOOL EXECUTION LOOP
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { nvidia } from '../ai/nvidia-client.js';
import { agentToolDefinitions, executeAgentTool } from './tools.js';
import { db } from '../db/client.js';

/**
 * Execute an autonomous agent loop with direct high-speed neural reasoning
 */
export async function runAgent(options = {}) {
  const {
    messages = [],
    systemPrompt = 'You are an autonomous AI Agent in Arise Production Studio.',
    projectId = options.projectId || db.getSessionState()?.lastActiveProjectId || 'proj-fatherless-child',
    shotNumber = 1,
    model = nvidia.defaultModel,
    temperature = 0.7,
    maxTokens = 2500,
  } = options;

  const executedActions = [];
  const lastUserMsg = messages.slice().reverse().find((m) => m.role === 'user')?.content || '';
  const q = lastUserMsg.toLowerCase();

  // 1. Proactive Tool Intent Analysis
  if (q.includes('save script') || q.includes('save the script')) {
    try {
      const toolRes = await executeAgentTool('save_script', { projectId, shotNumber, content: lastUserMsg }, { projectId, shotNumber });
      executedActions.push({ id: `act-${Date.now()}`, tool: 'save_script', args: { projectId, shotNumber }, result: toolRes });
    } catch (e) {}
  } else if (q.includes('run stage') || q.includes('execute stage')) {
    const stageMatch = q.match(/stage\s+(\w+)/i);
    const stageId = stageMatch ? stageMatch[1] : 'script';
    try {
      const toolRes = await executeAgentTool('run_stage', { stageId, projectId, shotNumber }, { projectId, shotNumber });
      executedActions.push({ id: `act-${Date.now()}`, tool: 'run_stage', args: { stageId, projectId, shotNumber }, result: toolRes });
    } catch (e) {}
  }

  // 2. Direct High-Fidelity Chat Generation
  console.log(`[AgentRuntime] 🚀 Generating agent reasoning via ${model}...`);
  const result = await nvidia.generateCompletion({
    messages,
    systemPrompt,
    model,
    temperature,
    maxTokens,
  });

  let replyText = result.text || result.reply || '';
  if (!replyText) {
    const fallback = nvidia.generateDepartmentalFallback(lastUserMsg, systemPrompt, model);
    replyText = fallback.text;
  }

  return {
    reply: replyText,
    actions: executedActions,
    model: result.model || model,
    success: true,
  };
}
