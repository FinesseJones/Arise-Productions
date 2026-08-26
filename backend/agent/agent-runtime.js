// ==============================================================================
// ARISE PRODUCTION - AUTONOMOUS AGENT RUNTIME & TOOL EXECUTION LOOP
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { nvidia } from '../ai/nvidia-client.js';
import { agentToolDefinitions, executeAgentTool } from './tools.js';

/**
 * Execute an autonomous agent loop with multi-step tool-calling
 */
export async function runAgent(options = {}) {
  const {
    messages = [],
    systemPrompt = 'You are an autonomous AI Agent in Arise Production Studio. When asked to retrieve data, run stages, save scripts, or hand off, call the available tools.',
    tools = agentToolDefinitions,
    projectId = 'proj-fatherless-child',
    shotNumber = 1,
    model = nvidia.defaultModel,
    temperature = 0.6,
    maxIterations = 5,
  } = options;

  let currentMessages = [...messages];
  const executedActions = [];
  let iteration = 0;
  let finalReply = '';
  let finalModel = model;

  while (iteration < maxIterations) {
    iteration++;
    console.log(`[AgentRuntime] 🔄 Agent Loop Turn ${iteration}/${maxIterations} (Model: ${model})...`);

    const result = await nvidia.generateCompletion({
      messages: currentMessages,
      systemPrompt,
      tools,
      toolChoice: 'auto',
      model,
      temperature,
    });

    if (!result.success && !result.tool_calls && !result.text) {
      console.warn('[AgentRuntime] Model generation failed:', result.error);
      return {
        reply: `⚠️ Error during agent reasoning: ${result.error || 'Unknown error'}`,
        actions: executedActions,
        model: result.model || model,
        success: false,
      };
    }

    finalModel = result.model || model;
    const toolCalls = result.tool_calls || result.message?.tool_calls;

    // If no tool calls, this is the final textual answer
    if (!toolCalls || toolCalls.length === 0) {
      finalReply = result.text || '';
      break;
    }

    // Has tool calls: append assistant message with tool_calls
    const assistantMsg = {
      role: 'assistant',
      content: result.text || '',
      tool_calls: toolCalls,
    };
    currentMessages.push(assistantMsg);

    // Execute each tool call in sequence
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function?.name;
      let args = {};
      try {
        args = JSON.parse(toolCall.function?.arguments || '{}');
      } catch (err) {
        console.warn(`[AgentRuntime] Failed to parse args for ${functionName}:`, toolCall.function?.arguments);
        args = {};
      }

      // Execute tool
      let toolOutput = {};
      try {
        toolOutput = await executeAgentTool(functionName, args, { projectId, shotNumber });
      } catch (err) {
        console.error(`[AgentRuntime] Error executing ${functionName}:`, err.message);
        toolOutput = { status: 'ERROR', error: err.message };
      }

      executedActions.push({
        id: toolCall.id,
        tool: functionName,
        args,
        result: toolOutput,
      });

      // Append tool response message according to OpenAI format
      currentMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        name: functionName,
        content: JSON.stringify(toolOutput),
      });
    }
  }

  return {
    reply: finalReply || 'All agent actions completed.',
    actions: executedActions,
    model: finalModel,
    success: true,
  };
}
