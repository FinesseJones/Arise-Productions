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
            description: 'The unique ID of the target project',
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
      description: 'Retrieve the complete production manifest, story bible, logline, themes, character dossiers, and current 10-stage completion statuses for a project.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The unique ID of the target project',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_story_bible',
      description: 'Save and persist real updates to the project\'s official Story Bible in the database (logline, themes, synopsis, genre, tone, acts, beats, or characters). This immediately updates the production database and UI Pitch Bible in real time.',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'The project ID' },
          title: { type: 'string', description: 'Updated title of the production' },
          logline: { type: 'string', description: 'The official updated logline' },
          themes: { type: 'string', description: 'Thematic core of the series/film' },
          synopsis: { type: 'string', description: 'Expanded story synopsis' },
          genres: { type: 'array', items: { type: 'string' }, description: 'Genres array' },
          tone: { type: 'string', description: 'Tone and aesthetic description' },
          acts: { type: 'array', description: '3-Act structure breakdown' },
          characters: { type: 'array', description: 'Updated character dossiers array' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_characters',
      description: 'Save and persist real updates to the project\'s Principal Character Dossiers in the database. This updates the live casting sheet and Hollywood Pitch Bible in real time.',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'The project ID' },
          characters: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                role: { type: 'string' },
                age: { type: 'number' },
                personality: { type: 'string' },
                archetypes: { type: 'array', items: { type: 'string' } },
                arcType: { type: 'string' },
                backstory: { type: 'string' },
              },
              required: ['name'],
            },
            description: 'Array of character objects with name, role, age, personality, archetypes, and backstory',
          },
        },
        required: ['characters'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'save_beats',
      description: 'Save and persist a list of narrative story beats (beat sheet outline) into the production database and official Story Bible for a project.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The unique ID of the target project',
          },
          beats: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                act: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
              },
              required: ['title', 'description'],
            },
            description: 'Array of beat objects containing act, title, and description',
          },
        },
        required: ['beats'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_beats',
      description: 'Retrieve the saved chronological story beats (beat sheet outline) from the database for a project.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The unique ID of the target project',
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
            description: 'The unique ID of the target project',
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
  {
    type: 'function',
    function: {
      name: 'get_studio_status',
      description: 'Aggregated production status: total shots, per-stage completion across the 10 MCP stages, and any blocked/unstarted stages. Use this to brief the Producer.',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_recent_activity',
      description: 'Recent studio events (stages run, scripts saved, handoffs) to summarize what has happened recently.',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string' },
          limit: { type: 'integer' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_last_briefing',
      description: 'The most recent saved Studio Desk briefing, so you can note what changed since then.',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string' },
          type: { type: 'string', enum: ['morning', 'evening'] },
        },
        required: [],
      },
    },
  },
];

/**
 * Tool Executor Map calling real studio backend functions
 */
export async function executeAgentTool(toolName, args = {}, context = {}) {
  const projectId = args.projectId || context.projectId || db.getSessionState()?.lastActiveProjectId || 'proj-fatherless-child';
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
      const storyBible = await db.getStoryBible(projectId);
      if (manifest) {
        return {
          status: 'SUCCESS',
          projectId,
          projectName: manifest.projectName,
          format: manifest.format,
          title: storyBible.title || manifest.projectName,
          logline: storyBible.logline,
          themes: storyBible.themes,
          genres: storyBible.genres,
          tone: storyBible.tone,
          audience: storyBible.audience,
          characters: storyBible.characters || [],
          acts: storyBible.acts || [],
          totalShots: manifest.shots?.length || 0,
          shots: manifest.shots?.map(s => ({
            shotNumber: s.shotNumber,
            title: s.title,
            description: s.description,
          })) || [],
        };
      }
      return {
        status: 'ERROR',
        projectId,
        error: `Project "${projectId}" not found in studio database.`,
      };
    }

    case 'update_story_bible': {
      const updated = await db.saveStoryBible(projectId, args);
      return {
        status: 'SUCCESS',
        projectId,
        message: `Official Story Bible updated and persisted for "${updated.title || projectId}".`,
        storyBible: updated,
      };
    }

    case 'update_characters': {
      const chars = args.characters || [];
      const updated = await db.saveCharacters(projectId, chars);
      return {
        status: 'SUCCESS',
        projectId,
        message: `Saved ${chars.length} character dossiers directly to the production database.`,
        characters: updated.characters || chars,
      };
    }

    case 'save_beats': {
      const beats = args.beats || [];
      const saved = await db.saveBeats(projectId, beats);
      return {
        status: 'SUCCESS',
        projectId,
        message: `Successfully persisted ${beats.length} beats to the production Story Bible.`,
        beats: saved,
      };
    }

    case 'get_beats': {
      const beats = await db.getBeats(projectId);
      return {
        status: 'SUCCESS',
        projectId,
        count: beats.length,
        beats,
      };
    }

    case 'save_script': {
      const content = args.content || '';
      const saved = db.saveProjectScript(projectId, shotNumber, content);
      if (typeof db.logActivity === 'function') {
        db.logActivity(projectId, { type: 'script_saved', shotNumber, summary: `Saved script for shot ${shotNumber} (${content.length} chars)` });
      }
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
      if (typeof db.logActivity === 'function') {
        db.logActivity(projectId, { type: 'stage_run', stageId, shotNumber, summary: `Ran ${stageId} on shot ${shotNumber}` });
      }
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
      if (typeof db.logActivity === 'function') {
        db.logActivity(projectId, { type: 'handoff', stageId, summary: `Handoff to ${stageId}: ${reason}` });
      }
      return {
        status: 'SUCCESS',
        action: 'HANDOFF',
        targetStageId: stageId,
        reason,
      };
    }

    case 'get_studio_status': {
      const manifest = await db.getProjectManifest(projectId);
      if (!manifest) return { status: 'ERROR', error: `Project "${projectId}" not found.` };
      const STAGES = ['script', 'structure', 'plan', 'previs', 'motion', 'boards', 'prompt', 'dailies', 'sound', 'edit'];
      const shots = manifest.shots || [];
      const stageTally = {};
      STAGES.forEach((s) => { stageTally[s] = { complete: 0, pending: 0 }; });
      const blocked = [];
      for (const shot of shots) {
        for (const s of STAGES) {
          const char = shot.status?.[s]?.statusChar || '⚪';
          if (char === '🟢') stageTally[s].complete++; else stageTally[s].pending++;
          if (char === '🔴') blocked.push({ shot: shot.shotNumber, stage: s });
        }
      }
      return {
        status: 'SUCCESS',
        projectId,
        projectName: manifest.projectName,
        totalShots: shots.length,
        stageCompletion: stageTally,
        blocked,
        shots: shots.map((sh) => ({ shotNumber: sh.shotNumber, title: sh.title })),
      };
    }

    case 'get_recent_activity': {
      const limit = Number(args.limit || 20);
      if (typeof db.getRecentActivity === 'function') {
        return { status: 'SUCCESS', projectId, events: await db.getRecentActivity(projectId, limit) };
      }
      const messages = db.getChatHistory ? db.getChatHistory(projectId, 'script') : [];
      return { status: 'PARTIAL', projectId, note: 'No activity log yet; showing recent chat.', messages: (messages || []).slice(-limit) };
    }

    case 'get_last_briefing': {
      if (typeof db.getLatestBriefing === 'function') {
        const b = await db.getLatestBriefing(projectId, args.type);
        return { status: b ? 'SUCCESS' : 'EMPTY', projectId, briefing: b || null };
      }
      return { status: 'EMPTY', projectId, note: 'Briefing persistence not implemented yet.' };
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
