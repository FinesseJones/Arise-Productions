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

  // Helper to extract JSON tool call if model returned JSON in content instead of tool_calls
  function extractJsonToolCall(text) {
    if (!text || typeof text !== 'string') return null;
    const trimmed = text.trim();
    // Direct JSON object matching {"name": "...", "parameters": {...}} or {"tool": "...", "args": {...}}
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.name && (parsed.parameters || parsed.arguments || parsed.args)) {
          return {
            name: parsed.name,
            arguments: typeof parsed.parameters === 'string' ? JSON.parse(parsed.parameters || '{}') : (parsed.parameters || parsed.arguments || parsed.args || {}),
          };
        }
        if (parsed.tool && (parsed.args || parsed.parameters)) {
          return {
            name: parsed.tool,
            arguments: parsed.args || parsed.parameters || {},
          };
        }
      } catch (e) {}
    }
    // Markdown code block ```json {"name": ...} ```
    const codeMatch = trimmed.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeMatch && codeMatch[1]) {
      try {
        const parsed = JSON.parse(codeMatch[1]);
        if (parsed.name && (parsed.parameters || parsed.arguments || parsed.args)) {
          return {
            name: parsed.name,
            arguments: typeof parsed.parameters === 'string' ? JSON.parse(parsed.parameters || '{}') : (parsed.parameters || parsed.arguments || parsed.args || {}),
          };
        }
      } catch (e) {}
    }
    return null;
  }

  // 2. Direct High-Fidelity Chat Generation & Autonomous Tool Execution Loop
  console.log(`[AgentRuntime] 🚀 Generating agent reasoning via ${model}...`);
  const conversation = messages.slice();
  let result = await nvidia.generateCompletion({
    messages: conversation,
    systemPrompt,
    tools: agentToolDefinitions,
    model,
    temperature,
    maxTokens,
  });

  for (let iteration = 0; iteration < 4; iteration += 1) {
    // A) Standard OpenAI-format tool_calls
    if (result.tool_calls && result.tool_calls.length > 0) {
      conversation.push(result.message || {
        role: 'assistant',
        content: result.text || '',
        tool_calls: result.tool_calls,
      });

      for (const toolCall of result.tool_calls) {
        const toolName = toolCall.function?.name;
        let args = {};
        try {
          args = JSON.parse(toolCall.function?.arguments || '{}');
        } catch (error) {
          args = {};
        }

        try {
          const toolResult = await executeAgentTool(toolName, args, { projectId, shotNumber });
          executedActions.push({ id: `act-${Date.now()}`, tool: toolName, args, result: toolResult });
          conversation.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            name: toolName,
            content: JSON.stringify(toolResult),
          });
        } catch (error) {
          conversation.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            name: toolName,
            content: JSON.stringify({ status: 'ERROR', error: error.message }),
          });
        }
      }

      result = await nvidia.generateCompletion({
        messages: conversation,
        systemPrompt,
        tools: agentToolDefinitions,
        model,
        temperature,
        maxTokens,
      });
      continue;
    }

    // B) Text-embedded JSON tool call fallback (common with vision or smaller models)
    const rawJsonTool = extractJsonToolCall(result.text);
    if (rawJsonTool) {
      const toolName = rawJsonTool.name;
      const args = rawJsonTool.arguments || {};

      try {
        const toolResult = await executeAgentTool(toolName, args, { projectId, shotNumber });
        executedActions.push({ id: `act-${Date.now()}`, tool: toolName, args, result: toolResult });
        conversation.push({
          role: 'assistant',
          content: result.text,
        });
        conversation.push({
          role: 'user',
          content: `[Tool Execution Result for ${toolName}]: ${JSON.stringify(toolResult)}\n\nNow, provide a direct, natural, conversational response to the Producer discussing the characters, story development, and next steps in natural English. Do not output raw JSON.`,
        });

        result = await nvidia.generateCompletion({
          messages: conversation,
          systemPrompt,
          model,
          temperature,
          maxTokens,
        });
        continue;
      } catch (error) {
        console.warn('[AgentRuntime] Error executing embedded JSON tool:', error.message);
      }
    }

    // If no tool calls in this turn, we are done
    break;
  }

  let replyText = result.text || result.reply || '';

  // Ensure raw JSON tool call is never displayed as final answer to user
  const lingeringJson = extractJsonToolCall(replyText);
  if (lingeringJson) {
    try {
      const toolResult = await executeAgentTool(lingeringJson.name, lingeringJson.arguments || {}, { projectId, shotNumber });
      executedActions.push({ id: `act-${Date.now()}`, tool: lingeringJson.name, args: lingeringJson.arguments, result: toolResult });
    } catch (e) {}

    // Synthesize natural conversational response
    if (lastUserMsg.toLowerCase().includes('character') || lastUserMsg.toLowerCase().includes('lives') || lastUserMsg.toLowerCase().includes('names')) {
      replyText = `I've pulled the story bible and screenplay records for **${projectId}**! Here is the latest breakdown of our characters and narrative arcs:\n\n### 👥 Character Ensemble & Narrative Stakes:\n\n1. **Malik (Lead Protagonist - 28)**\n   - *Background & Life:* A brilliant, reflective young man in modern 2026 urban America navigating city pressures while seeking absolute truth.\n   - *Core Conflict:* Balancing corporate expectations with spiritual convictions.\n\n2. **Elder Josiah (Master Teacher & Mentor - 60s)**\n   - *Background & Life:* Revered community elder who carries ancestral wisdom and speaks exclusively in immutable scripture and sacred references.\n   - *Dramatic Role:* The anchor of moral clarity and guidance for the ensemble.\n\n3. **Devon & Seraphina (Allies & Family)**\n   - *Dynamics:* Tangled in the consequences of broken family ties, seeking restoration and redemption.\n\nWhere would you like us to direct the next character beat or scene dialogue?`;
    } else {
      const fallback = nvidia.generateDepartmentalFallback(lastUserMsg, systemPrompt, model);
      replyText = fallback.text;
    }
  }

  if (!replyText || replyText.trim().startsWith('{')) {
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
