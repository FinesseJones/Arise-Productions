// ==============================================================================
// ARISE PRODUCTION - 10 PIPELINE STAGE WORKERS (WITH NVIDIA NIM AI INFERENCE)
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { db } from '../db/client.js';
import { nvidia } from '../ai/nvidia-client.js';
import { unrealConnector } from '../services/unreal-connector.js';
import { openMontageConnector } from '../services/openmontage-connector.js';
import { hyperframesConnector } from '../services/hyperframes-connector.js';
import { remotionConnector } from '../services/remotion-connector.js';
import { audioEngine } from '../services/audio-engine.js';
import { comfyBridge } from './comfy-bridge.js';

/**
 * Strict JSON generation helper with automatic schema validation and 1-shot repair retry.
 * Fail-closed: Never returns fake or canned fallback data.
 */
async function generateAndValidateJson({ prompt, systemPrompt, validator, maxTokens = 1200 }) {
  if (!nvidia.hasApiKey()) {
    return {
      success: false,
      error: 'NVIDIA_API_KEY is not configured or missing on the server.',
      model: null,
    };
  }

  // Attempt 1: Standard structured generation
  let resp = await nvidia.generateCompletion({
    prompt,
    systemPrompt: `${systemPrompt}\nIMPORTANT: You must respond ONLY with raw, valid JSON matching the requested schema. Do not output markdown fences (\`\`\`json), explanations, or trailing commentary.`,
    temperature: 0.3,
    maxTokens,
  });

  let parsed = null;
  if (resp.success && resp.text) {
    try {
      const match = resp.text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) parsed = JSON.parse(match[0]);
    } catch (e) {}
  }

  // Attempt 2: 1-shot repair retry if unparseable or validation failed
  if (!resp.success || !parsed || (validator && !validator(parsed))) {
    const repairPrompt = `The previous response failed schema validation or was malformed JSON.\nPrevious output:\n${resp.text?.slice(0, 400) || 'None'}\n\nRegenerate strictly adhering to the schema. Output raw JSON only:`;
    resp = await nvidia.generateCompletion({
      prompt: repairPrompt,
      systemPrompt,
      temperature: 0.1,
      maxTokens,
    });

    if (resp.success && resp.text) {
      try {
        const match = resp.text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (match) parsed = JSON.parse(match[0]);
      } catch (e) {}
    }
  }

  // Fail-closed validation check
  if (!resp.success || !parsed || (validator && !validator(parsed))) {
    return {
      success: false,
      error: resp.error || 'AI generation failed: Model returned unparseable or invalid schema JSON.',
      model: resp.model || null,
    };
  }

  return {
    success: true,
    data: parsed,
    model: resp.model,
  };
}

export class BaseStageWorker {
  constructor(stageId, name, endpoint) {
    this.stageId = stageId;
    this.name = name;
    this.endpoint = endpoint;
  }

  async executeJob(job, onProgress = null) {
    console.log(`[StageWorker:${this.name}] Starting execution for Job ${job.id} (Shot ${job.shotNumber || 1})`);
    
    // 1. Mark status as IN_PROGRESS (🟡)
    if (job.shotNumber) {
      await db.updateShotStageAtomic(job.projectId, job.shotNumber, this.stageId, '🟡', {
        jobId: job.id,
        worker: this.name,
      });
    }

    if (onProgress) onProgress(25, `Initializing ${this.name} pipeline stage...`);

    // 2. Perform domain processing (Real AI + Real connectors)
    if (onProgress) onProgress(60, `Executing stage intelligence in ${this.name}...`);
    let result;
    try {
      result = await this.process(job.inputPayload || {}, job);
    } catch (err) {
      result = { success: false, error: err.message, model: null };
    }

    const isSuccess = Boolean(result && result.success !== false);

    // 3. Mark status: 🟢 ONLY if validated success, otherwise 🔴 (FAILED)
    if (job.shotNumber) {
      await db.updateShotStageAtomic(job.projectId, job.shotNumber, this.stageId, isSuccess ? '🟢' : '🔴', {
        jobId: job.id,
        worker: this.name,
        completedAt: isSuccess ? new Date().toISOString() : null,
        failedAt: isSuccess ? null : new Date().toISOString(),
        outputSummary: isSuccess ? (result.summary || 'Stage completed') : (result.error || 'Stage failed'),
        aiModel: result?.aiModel || result?.model || null,
        error: isSuccess ? null : (result.error || 'Execution failed'),
      });
    }

    if (onProgress) onProgress(100, isSuccess ? `Completed ${this.name} successfully.` : `Stage ${this.name} failed.`);
    return result;
  }

  async process(payload, job) {
    throw new Error('process() must be implemented by worker subclass');
  }
}

// 1. ScriptBreak Stage Worker (/mcp/script)
export class ScriptBreakWorker extends BaseStageWorker {
  constructor() { super('script', 'ScriptBreak', '/mcp/script'); }
  async process(payload, job) {
    const projectId = job?.projectId || payload?.projectId;
    const shotNumber = job?.shotNumber || payload?.shotNumber || 1;
    const scriptText = (payload.scriptText || db.getProjectScript(projectId, shotNumber) || '').trim();

    if (!scriptText) {
      return { success: false, error: 'No script text found for project to break down.' };
    }

    const gen = await generateAndValidateJson({
      prompt: `Perform a professional script breakdown for virtual production based on this screenplay text:\n\n${scriptText.slice(0, 3000)}`,
      systemPrompt: 'You are the ScriptBreak AI Worker. Return a JSON object with: { "scenes": number, "characters": string[], "locations": string[], "sluglines": string[], "summary": string }',
      validator: (d) => typeof d.scenes === 'number' && Array.isArray(d.characters) && typeof d.summary === 'string',
    });

    if (!gen.success) return gen;

    return {
      success: true,
      stage: 'script',
      summary: gen.data.summary,
      sceneBible: {
        scenes: gen.data.scenes,
        characters: gen.data.characters,
        locations: gen.data.locations || [],
        sluglines: gen.data.sluglines || [],
      },
      aiModel: gen.model,
    };
  }
}

// 2. Cork Board Stage Worker (/mcp/structure)
export class CorkBoardWorker extends BaseStageWorker {
  constructor() { super('structure', 'Cork Board', '/mcp/structure'); }
  async process(payload, job) {
    const projectId = job?.projectId || payload?.projectId;
    const shotNumber = job?.shotNumber || payload?.shotNumber || 1;
    const scriptText = db.getProjectScript(projectId, shotNumber) || '';
    const storyBible = await db.getStoryBible(projectId);
    const context = `Project: ${projectId}. Bible summary: ${JSON.stringify(storyBible?.logline || storyBible?.synopsis || '')}. Script excerpt: ${scriptText.slice(0, 1500)}`;

    const gen = await generateAndValidateJson({
      prompt: `Generate a 3-act narrative index card structure with dramatic stakes for this production:\n\n${context}`,
      systemPrompt: 'You are the Cork Board Narrative Worker. Return a JSON object with: { "summary": string, "indexCards": [ { "act": number, "title": string, "dramatic_beat": string } ] }',
      validator: (d) => Array.isArray(d.indexCards) && d.indexCards.length > 0 && typeof d.summary === 'string',
    });

    if (!gen.success) return gen;

    return {
      success: true,
      stage: 'structure',
      summary: gen.data.summary,
      indexCards: gen.data.indexCards,
      aiModel: gen.model,
    };
  }
}

// 3. Master Canvas Stage Worker (/mcp/plan)
export class MasterCanvasWorker extends BaseStageWorker {
  constructor() { super('plan', 'Master Canvas', '/mcp/plan'); }
  async process(payload, job) {
    const projectId = job?.projectId || payload?.projectId;
    const shotNumber = job?.shotNumber || payload?.shotNumber || 1;
    const scriptText = db.getProjectScript(projectId, shotNumber) || '';
    const storyBible = await db.getStoryBible(projectId);

    const gen = await generateAndValidateJson({
      prompt: `Compile a master visual production plan and aesthetic color palette for virtual production.\nContext: ${JSON.stringify(storyBible?.aesthetic || storyBible?.themes || '')}\nScene: ${scriptText.slice(0, 1500)}`,
      systemPrompt: 'You are the Master Canvas Planning Worker. Return a JSON object with: { "summary": string, "handoffBundle": { "colorPalette": string[], "requiredAssets": string[], "visualStyle": string } }',
      validator: (d) => d.handoffBundle && Array.isArray(d.handoffBundle.colorPalette) && typeof d.summary === 'string',
    });

    if (!gen.success) return gen;

    return {
      success: true,
      stage: 'plan',
      summary: gen.data.summary,
      handoffBundle: gen.data.handoffBundle,
      aiModel: gen.model,
    };
  }
}

// 4. Blockout 3D Stage Worker (/mcp/previs)
export class BlockoutWorker extends BaseStageWorker {
  constructor() { super('previs', 'Blockout 3D', '/mcp/previs'); }
  async process(payload, job) {
    const projectId = job?.projectId || payload?.projectId;
    const shotNumber = job?.shotNumber || payload?.shotNumber || 1;
    const scriptText = db.getProjectScript(projectId, shotNumber) || '';

    const gen = await generateAndValidateJson({
      prompt: `Solve the 3D spatial camera setup, focal length, and lighting vectors for Shot ${shotNumber}:\n${scriptText.slice(0, 1500)}`,
      systemPrompt: 'You are the Virtual DP Previs Worker. Return a JSON object with: { "summary": string, "spatialCoordinates": { "cameraFocalLength": string, "cameraAngle": string, "lightSetup": string } }',
      validator: (d) => d.spatialCoordinates && typeof d.spatialCoordinates.cameraFocalLength === 'string' && typeof d.summary === 'string',
    });

    if (!gen.success) return gen;

    // Honest DCC connection status
    const ueStatus = await unrealConnector.checkEngineStatus();
    if (ueStatus.active) {
      const focalNum = parseInt(gen.data.spatialCoordinates.cameraFocalLength, 10) || 35;
      await unrealConnector.setCameraParameters('CineCameraActor1', focalNum);
    }

    return {
      success: true,
      stage: 'previs',
      summary: gen.data.summary + (ueStatus.active ? ' [Unreal Engine 5 Connected]' : ' [Unreal Engine 5 Offline]'),
      spatialCoordinates: gen.data.spatialCoordinates,
      unrealConnected: ueStatus.active,
      aiModel: gen.model,
    };
  }
}

// 5. Motion Previs Stage Worker (/mcp/motion)
export class MotionPrevisWorker extends BaseStageWorker {
  constructor() { super('motion', 'Motion Previs Studio', '/mcp/motion'); }
  async process(payload, job) {
    const projectId = job?.projectId || payload?.projectId;
    const shotNumber = job?.shotNumber || payload?.shotNumber || 1;
    const scriptText = db.getProjectScript(projectId, shotNumber) || '';

    const gen = await generateAndValidateJson({
      prompt: `Generate character motion trajectory, choreography pacing, and camera blocking dynamics for Shot ${shotNumber}:\n${scriptText.slice(0, 1500)}`,
      systemPrompt: 'You are the Motion Previs Worker. Return a JSON object with: { "summary": string, "motionPlan": { "characterChoreography": string, "tempo": string, "trajectoryNotes": string } }',
      validator: (d) => d.motionPlan && typeof d.summary === 'string',
    });

    if (!gen.success) return gen;

    // Real connector execution
    const hyperResult = await hyperframesConnector.composeKeyframeSequence({
      shotNumber,
      blockType: 'transitions-3d',
      fps: 24,
    });

    return {
      success: true,
      stage: 'motion',
      summary: gen.data.summary,
      motionPlan: gen.data.motionPlan,
      hyperframes: hyperResult,
      aiModel: gen.model,
    };
  }
}

// 6. Storyboard Reference Stage Worker (/mcp/boards)
export class StoryboardWorker extends BaseStageWorker {
  constructor() { super('boards', 'Storyboard Reference Studio', '/mcp/boards'); }
  async process(payload, job) {
    const projectId = job?.projectId || payload?.projectId;
    const shotNumber = job?.shotNumber || payload?.shotNumber || 1;
    const scriptText = db.getProjectScript(projectId, shotNumber) || '';

    const gen = await generateAndValidateJson({
      prompt: `Generate visual storyboard frame descriptions and camera compositions for Shot ${shotNumber}:\n${scriptText.slice(0, 1500)}`,
      systemPrompt: 'You are the Storyboard Director Worker. Return a JSON object with: { "summary": string, "boardFrames": [ { "frame": number, "angle": string, "framing": string, "description": string } ] }',
      validator: (d) => Array.isArray(d.boardFrames) && d.boardFrames.length > 0 && typeof d.summary === 'string',
    });

    if (!gen.success) return gen;

    return {
      success: true,
      stage: 'boards',
      summary: gen.data.summary,
      boardFrames: gen.data.boardFrames,
      aiModel: gen.model,
    };
  }
}

// 7. Slate Prompt Stage Worker (/mcp/prompt)
export class SlatePromptWorker extends BaseStageWorker {
  constructor() { super('prompt', 'Slate Prompt', '/mcp/prompt'); }
  async process(payload, job) {
    const projectId = job?.projectId || payload?.projectId;
    const shotNumber = job?.shotNumber || payload?.shotNumber || 1;
    const scriptText = db.getProjectScript(projectId, shotNumber) || '';

    const gen = await generateAndValidateJson({
      prompt: `Generate diffusion generative prompts (video, audio, negative) for Shot ${shotNumber}:\n${scriptText.slice(0, 1500)}`,
      systemPrompt: 'You are the Slate Prompt Worker. Return a JSON object with: { "summary": string, "promptPack": { "videoPrompt": string, "audioPrompt": string, "negativePrompt": string } }',
      validator: (d) => d.promptPack && typeof d.promptPack.videoPrompt === 'string' && typeof d.summary === 'string',
    });

    if (!gen.success) return gen;

    // Honest ComfyUI status check
    const comfyStatus = await comfyBridge.checkServerStatus();

    return {
      success: true,
      stage: 'prompt',
      summary: gen.data.summary + (comfyStatus.online ? ' [ComfyUI Connected]' : ' [ComfyUI Offline]'),
      promptPack: gen.data.promptPack,
      comfyConnected: comfyStatus.online,
      aiModel: gen.model,
    };
  }
}

// 8. Circle Take Stage Worker (/mcp/dailies)
export class CircleTakeWorker extends BaseStageWorker {
  constructor() { super('dailies', 'Circle Take', '/mcp/dailies'); }
  async process(payload, job) {
    const projectId = job?.projectId || payload?.projectId;
    const shotNumber = job?.shotNumber || payload?.shotNumber || 1;
    const project = await db.getProject(projectId);
    const projectName = project?.title || project?.name || 'Untitled Project';
    const scriptText = db.getProjectScript(projectId, shotNumber) || '';

    const gen = await generateAndValidateJson({
      prompt: `Review and evaluate the dailies for Shot ${shotNumber} of "${projectName}". Context:\n${scriptText.slice(0, 1500)}`,
      systemPrompt: 'You are the Circle Take Director Worker. Return a JSON object with: { "summary": string, "reviewNotes": string, "selectedTake": number, "directorialVerdict": string }',
      validator: (d) => typeof d.summary === 'string' && typeof d.directorialVerdict === 'string',
    });

    if (!gen.success) return gen;

    // Real video card rendering via Remotion/FFmpeg
    const videoRender = await remotionConnector.renderCinematicVideoCard({
      title: projectName,
      subtitle: `Shot ${shotNumber} • Circle Take Dailies`,
      aspectRatio: '16:9',
      durationSeconds: 4,
      fps: 24,
      outputFilename: `dailies_shot_${shotNumber}_${Date.now()}.mp4`,
    });

    return {
      success: true,
      stage: 'dailies',
      summary: gen.data.summary,
      reviewNotes: gen.data.reviewNotes,
      directorialVerdict: gen.data.directorialVerdict,
      selectedTake: gen.data.selectedTake || 1,
      videoRender: {
        outputFile: videoRender.outputFile || null,
        outputUrl: videoRender.outputUrl || null,
        duration: videoRender.duration || 4,
        rendered: Boolean(videoRender.outputFile),
      },
      aiModel: gen.model,
    };
  }
}

// 9. Stem Studio Stage Worker (/mcp/sound)
export class StemStudioWorker extends BaseStageWorker {
  constructor() { super('sound', 'Stem Studio', '/mcp/sound'); }
  async process(payload, job) {
    const projectId = job?.projectId || payload?.projectId;
    const shotNumber = job?.shotNumber || payload?.shotNumber || 1;
    const scriptText = db.getProjectScript(projectId, shotNumber) || '';

    const gen = await generateAndValidateJson({
      prompt: `Create a sound design and spatial audio mixing plan for Shot ${shotNumber}:\n${scriptText.slice(0, 1500)}`,
      systemPrompt: 'You are the Sound Design Supervisor. Return a JSON object with: { "summary": string, "soundPlan": [ { "stem": string, "channel": string, "acousticDescription": string, "estimatedGain": string } ] }',
      validator: (d) => Array.isArray(d.soundPlan) && d.soundPlan.length > 0 && typeof d.summary === 'string',
    });

    if (!gen.success) return gen;

    const status = audioEngine.getEngineStatus();

    return {
      success: true,
      stage: 'sound',
      mode: 'plan',
      summary: gen.data.summary,
      soundPlan: gen.data.soundPlan,
      audioEngine: status,
      aiModel: gen.model,
    };
  }
}

// 10. DaVinci Stage Worker (/mcp/edit)
export class DaVinciWorker extends BaseStageWorker {
  constructor() { super('edit', 'DaVinci Timeline', '/mcp/edit'); }
  async process(payload, job) {
    const projectId = job?.projectId || payload?.projectId;
    const shotNumber = job?.shotNumber || payload?.shotNumber || 1;
    const project = await db.getProject(projectId);
    const projectName = project?.title || project?.name || 'Untitled Project';

    const gen = await generateAndValidateJson({
      prompt: `Generate an editorial assembly and color conform plan for Shot ${shotNumber} of "${projectName}".`,
      systemPrompt: 'You are the Lead Editor & Colorist Worker. Return a JSON object with: { "summary": string, "editorialNotes": { "pacing": string, "transitionStyle": string, "colorGradingAesthetic": string } }',
      validator: (d) => d.editorialNotes && typeof d.summary === 'string',
    });

    if (!gen.success) return gen;

    // Real OpenMontage timeline build
    const montageResult = await openMontageConnector.buildMontageTimeline(
      payload?.shots || [{ shotNumber }],
      'cinematic-montage'
    );

    return {
      success: true,
      stage: 'edit',
      summary: gen.data.summary,
      editorialNotes: gen.data.editorialNotes,
      timeline: {
        openMontage: montageResult,
        edlBuilt: Boolean(montageResult?.edlPath),
      },
      aiModel: gen.model,
    };
  }
}

export const stageWorkers = {
  script: new ScriptBreakWorker(),
  structure: new CorkBoardWorker(),
  plan: new MasterCanvasWorker(),
  previs: new BlockoutWorker(),
  motion: new MotionPrevisWorker(),
  boards: new StoryboardWorker(),
  prompt: new SlatePromptWorker(),
  dailies: new CircleTakeWorker(),
  sound: new StemStudioWorker(),
  edit: new DaVinciWorker(),
};

// Backward-compatible alias
export const mcpWorkers = stageWorkers;

export default stageWorkers;
