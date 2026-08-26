// ==============================================================================
// ARISE PRODUCTION - AGENT TOOL DEFINITIONS & EXECUTOR MAP
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { db } from '../db/client.js';
import { mcpWorkers } from '../workers/mcp-workers.js';

/**
 * OpenAI-compatible Tool Definitions for NVIDIA NIM (Llama 3.3 70B Instruct)
 */
export const agentToolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'get_episode_script',
      description: 'Retrieve the actual stored Hollywood screenplay script for a specific project and shot/scene number from the production database.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The unique ID of the project (default: "proj-fatherless-child")',
          },
          shotNumber: {
            type: 'integer',
            description: 'The shot/scene number to retrieve (e.g. 1, 2, 3)',
          },
        },
        required: ['shotNumber'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_story_bible',
      description: 'Retrieve the complete production manifest and story bible for a project, including all shot titles, descriptions, format metadata, and current 10-stage completion statuses.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The unique ID of the project (default: "proj-fatherless-child")',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'save_script',
      description: 'Save and persist a revised or newly written Hollywood Fountain screenplay into the production database for a specific shot.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The unique ID of the project (default: "proj-fatherless-child")',
          },
          shotNumber: {
            type: 'integer',
            description: 'The shot number to save the script for (e.g. 1, 2, 3)',
          },
          content: {
            type: 'string',
            description: 'The full Fountain screenplay text to persist',
          },
        },
        required: ['shotNumber', 'content'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'run_stage',
      description: 'Execute one of the 10 production MCP stages (script, structure, plan, previs, motion, boards, prompt, dailies, sound, edit) on a specific shot, generating real domain assets and updating the manifest.',
      parameters: {
        type: 'object',
        properties: {
          stageId: {
            type: 'string',
            enum: ['script', 'structure', 'plan', 'previs', 'motion', 'boards', 'prompt', 'dailies', 'sound', 'edit'],
            description: 'The specific stage worker to execute',
          },
          projectId: {
            type: 'string',
            description: 'The project ID (default: "proj-fatherless-child")',
          },
          shotNumber: {
            type: 'integer',
            description: 'The target shot number to execute the stage on (default: 1)',
          },
          payload: {
            type: 'object',
            description: 'Optional additional input payload parameters for the stage worker',
          },
        },
        required: ['stageId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'handoff_to_agent',
      description: 'Hand off the creative flow and active room focus to another specialized department agent or virtual stage.',
      parameters: {
        type: 'object',
        properties: {
          stageId: {
            type: 'string',
            enum: ['script', 'structure', 'plan', 'previs', 'motion', 'boards', 'prompt', 'dailies', 'sound', 'edit'],
            description: 'The target department stage/room to transition to',
          },
          reason: {
            type: 'string',
            description: 'The rationale or briefing for why the handoff is occurring',
          },
        },
        required: ['stageId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'dispatch_director_command',
      description: 'Dispatch an executive director command across the central API bridge and MCP worker pipeline.',
      parameters: {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            description: 'The raw director instruction (e.g. "board scene 1", "compile prompts", "review reshoots")',
          },
          stageId: {
            type: 'string',
            description: 'The target stage ID if applicable',
          },
          shotNumber: {
            type: 'integer',
            description: 'The target shot number if applicable',
          },
        },
        required: ['command'],
      },
    },
  },
];

/**
 * Tool Executor Map calling real studio backend functions
 */
export async function executeAgentTool(toolName, args = {}, context = {}) {
  const projectId = args.projectId || context.projectId || 'proj-fatherless-child';
  const shotNumber = Number(args.shotNumber || context.shotNumber || 1);

  console.log(`[AgentTools] ⚡ Executing Tool: "${toolName}" with args:`, JSON.stringify(args));

  switch (toolName) {
    case 'create_story_idea': {
      const idea = db.saveIdea({
        title: args.title,
        format: args.format || 'feature_film',
        logline: args.logline || '',
        hook: args.hook || '',
        thematicEngine: args.thematicEngine || '',
        structureBlueprint: args.structureBlueprint || '',
        targetAudience: args.targetAudience || 'Indie & Studio Audience',
        marketComps: args.marketComps || '',
        tags: args.tags || [args.format],
        status: 'concept',
        author: 'Orion Vance',
        note: 'Concept generated and saved via autonomous agent tool.',
      });
      return {
        status: 'SUCCESS',
        message: `Successfully created and saved idea "${idea.title}" (${idea.format}) into Idea Vault!`,
        idea,
      };
    }

    case 'list_story_ideas': {
      const format = args.format === 'all' ? null : args.format;
      const ideas = db.listIdeas(format);
      return {
        status: 'SUCCESS',
        count: ideas.length,
        format: args.format || 'all',
        ideas: ideas.map((i) => ({
          id: i.id,
          title: i.title,
          format: i.format,
          logline: i.logline,
          status: i.status,
          tags: i.tags,
        })),
      };
    }

    case 'promote_idea_to_project': {
      const ideaId = args.ideaId;
      try {
        const result = await db.promoteIdeaToProject(ideaId);
        return {
          status: 'SUCCESS',
          message: `Idea "${result.idea.title}" promoted to active project "${result.project.id}"! 10-stage manifest initialized.`,
          project: result.project,
          idea: result.idea,
        };
      } catch (err) {
        return {
          status: 'ERROR',
          error: err.message,
        };
      }
    }

    case 'get_episode_script': {
      const script = db.getProjectScript(projectId, shotNumber);
      if (script && script.trim()) {
        return {
          status: 'SUCCESS',
          projectId,
          shotNumber,
          scriptContent: script,
        };
      }
      return {
        status: 'EMPTY',
        projectId,
        shotNumber,
        message: `No screenplay script found for Project "${projectId}", Shot ${shotNumber}.`,
      };
    }

    case 'get_story_bible': {
      const manifest = await db.getProjectManifest(projectId);
      if (manifest) {
        return {
          status: 'SUCCESS',
          projectId,
          projectName: manifest.projectName,
          format: manifest.format,
          version: manifest.version,
          shots: manifest.shots,
        };
      }
      return {
        status: 'ERROR',
        projectId,
        error: `Project "${projectId}" not found in studio database.`,
      };
    }

    case 'save_script': {
      const content = args.content || '';
      const saved = db.saveProjectScript(projectId, shotNumber, content);
      return {
        status: 'SUCCESS',
        projectId,
        shotNumber,
        message: `Screenplay for Shot ${shotNumber} saved and persisted successfully (${content.length} characters).`,
        saved,
      };
    }

    case 'run_stage': {
      const stageId = args.stageId || args.stage;
      const worker = mcpWorkers[stageId];
      if (!worker) {
        return {
          status: 'ERROR',
          error: `Invalid stageId: "${stageId}". Must be one of: script, structure, plan, previs, motion, boards, prompt, dailies, sound, edit.`,
        };
      }

      const job = {
        id: `job-${stageId}-${Date.now()}`,
        projectId,
        shotNumber,
        inputPayload: args.payload || {},
      };

      const result = await worker.executeJob(job);
      return {
        status: 'SUCCESS',
        stageId,
        shotNumber,
        worker: worker.name,
        result,
      };
    }

    case 'handoff_to_agent': {
      const stageId = args.stageId;
      const reason = args.reason || 'Workflow stage transition requested.';
      return {
        status: 'SUCCESS',
        action: 'HANDOFF',
        targetStageId: stageId,
        reason,
      };
    }

    case 'dispatch_director_command': {
      const cmd = args.command || '';
      const stage = args.stageId || 'script';
      const worker = mcpWorkers[stage] || mcpWorkers.script;
      
      const job = {
        id: `dir-job-${Date.now()}`,
        projectId,
        shotNumber,
        inputPayload: { command: cmd },
      };

      const result = await worker.executeJob(job);
      return {
        status: 'SUCCESS',
        command: cmd,
        dispatchedStage: stage,
        result,
      };
    }

    default:
      return {
        status: 'ERROR',
        error: `Unknown tool: "${toolName}".`,
      };
  }
}
