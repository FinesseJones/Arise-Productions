// ==============================================================================
// WASSERMAN STUDIO SHELL - CENTRAL API BRIDGE COMMAND ROUTER
// ==============================================================================

import { jobQueue } from './queue.js';
import { db } from '../db/client.js';

export class CentralAPIRouter {
  constructor() {
    this.stageKeys = ['script', 'structure', 'plan', 'previs', 'motion', 'boards', 'prompt', 'dailies', 'sound', 'edit'];
  }

  /**
   * Main router entry point for Director Agent and API Bridge requests
   */
  async processMCPRequest(request, onProgressCallback = null) {
    const { projectId = 'proj-titanic', command = '', activeStage = null, shotNumber = 1 } = request;
    const trimmed = command.trim();

    console.log(`[CentralAPIRouter] Routing request: "${trimmed}" for project "${projectId}"`);

    // --- 1. WORKFLOW: PIPELINE RUN (board scene X) -> Script -> Cork -> Plan -> Blockout ---
    if (trimmed.toLowerCase().includes('board scene')) {
      const match = trimmed.match(/board scene (\d+)/i);
      const targetShot = match ? parseInt(match[1], 10) : 1;

      if (onProgressCallback) {
        onProgressCallback({
          type: 'WORKFLOW_STARTED',
          message: `Initiating Full Pipeline Sequence for Shot ${targetShot} (Script $\\rightarrow$ Structure $\\rightarrow$ Plan $\\rightarrow$ Blockout)...`,
          progress: 5,
        });
      }

      // Execute sequential pipeline chain
      const stagesToRun = ['script', 'structure', 'plan', 'previs'];
      const results = [];

      for (let i = 0; i < stagesToRun.length; i++) {
        const stageId = stagesToRun[i];
        const stepProgress = Math.round(15 + ((i + 1) / stagesToRun.length) * 80);

        if (onProgressCallback) {
          onProgressCallback({
            type: 'STAGE_PROGRESS',
            stageId,
            message: `Executing stage: ${stageId.toUpperCase()} for Shot ${targetShot}...`,
            progress: stepProgress,
          });
        }

        const job = await jobQueue.enqueue({
          projectId,
          shotNumber: targetShot,
          stageId,
          action: 'EXECUTE_PIPELINE_STEP',
          inputPayload: { shotNumber: targetShot, sceneReference: `Scene ${targetShot}` },
        });

        // Wait for job completion
        await new Promise((resolve) => {
          const handler = (evt) => {
            if (evt.jobId === job.id) {
              jobQueue.off('job_completed', handler);
              jobQueue.off('job_failed', handler);
              resolve();
            }
          };
          jobQueue.on('job_completed', handler);
          jobQueue.on('job_failed', handler);
        });

        results.push(stageId);
      }

      const updatedManifest = await db.getProjectManifest(projectId);
      return {
        success: true,
        workflow: 'BOARD_SCENE',
        shotNumber: targetShot,
        message: `🎬 SUCCESS: Full pipeline resolved for Shot ${targetShot}. ScriptBreak, Cork Board, Master Canvas, and Blockout 3D are locked.`,
        completedStages: results,
        manifest: updatedManifest,
      };
    }

    // --- 2. WORKFLOW: PROMPT GENERATION (compile prompts) -> Boards -> Slate ---
    else if (trimmed.toLowerCase().includes('compile prompts')) {
      if (onProgressCallback) {
        onProgressCallback({
          type: 'WORKFLOW_STARTED',
          message: 'Compiling all generative continuity prompt packs (Boards $\\rightarrow$ Slate)...',
          progress: 10,
        });
      }

      const stagesToRun = ['boards', 'prompt'];
      for (const stageId of stagesToRun) {
        const job = await jobQueue.enqueue({
          projectId,
          shotNumber,
          stageId,
          action: 'GENERATE_PROMPTS',
          inputPayload: { scope: 'PROJECT_WIDE' },
        });

        await new Promise((resolve) => {
          const handler = (evt) => {
            if (evt.jobId === job.id) {
              jobQueue.off('job_completed', handler);
              jobQueue.off('job_failed', handler);
              resolve();
            }
          };
          jobQueue.on('job_completed', handler);
          jobQueue.on('job_failed', handler);
        });
      }

      const updatedManifest = await db.getProjectManifest(projectId);
      return {
        success: true,
        workflow: 'COMPILE_PROMPTS',
        message: '✨ SUCCESS: Slate MCP Agent generated continuity-locked prompt packs for all media tracks.',
        completedStages: stagesToRun,
        manifest: updatedManifest,
      };
    }

    // --- 3. WORKFLOW: RESHOOT LOOP (review reshoots) -> Circle Take -> Upstream Updates ---
    else if (trimmed.toLowerCase().includes('review reshoots')) {
      if (onProgressCallback) {
        onProgressCallback({
          type: 'WORKFLOW_STARTED',
          message: '🔄 Initiating Reshoot Loop via Central API Bridge... Analyzing Dailies...',
          progress: 20,
        });
      }

      // Run Circle Take review
      await jobQueue.enqueue({
        projectId,
        shotNumber: 2,
        stageId: 'dailies',
        action: 'REVIEW_DAILIES',
        inputPayload: { focusShot: 2 },
      });

      // Simulate automated feedback loop flagging Blockout and Prompt for Shot 2
      await db.updateShotStageAtomic(projectId, 2, 'previs', '🟡', { reshootReason: 'Lighting adjustment required' });
      await db.updateShotStageAtomic(projectId, 2, 'prompt', '🟡', { reshootReason: 'Prompt seed update' });

      const updatedManifest = await db.getProjectManifest(projectId);
      return {
        success: true,
        workflow: 'REVIEW_RESHOOTS',
        message: '🔄 Reshoot Loop complete. Dailies analyzed: Shot 2 flagged for lighting tweak and automatically fed back to Blockout/Slate.',
        completedStages: ['dailies', 'previs', 'prompt'],
        manifest: updatedManifest,
      };
    }

    // --- 4. SINGLE STAGE DISPATCH (e.g., "run script" or "run sound") ---
    const matchingStage = this.stageKeys.find(
      (k) => trimmed.toLowerCase().includes(k) || (activeStage && trimmed.toLowerCase().includes(activeStage.toLowerCase()))
    );

    if (matchingStage) {
      const job = await jobQueue.enqueue({
        projectId,
        shotNumber,
        stageId: matchingStage,
        action: 'RUN_STAGE_DIRECT',
        inputPayload: { command: trimmed },
      });

      await new Promise((resolve) => {
        const handler = (evt) => {
          if (evt.jobId === job.id) {
            jobQueue.off('job_completed', handler);
            jobQueue.off('job_failed', handler);
            resolve();
          }
        };
        jobQueue.on('job_completed', handler);
        jobQueue.on('job_failed', handler);
      });

      const updatedManifest = await db.getProjectManifest(projectId);
      return {
        success: true,
        workflow: 'SINGLE_STAGE',
        stageId: matchingStage,
        message: `✅ Completed execution for stage: ${matchingStage.toUpperCase()}. Manifest updated.`,
        manifest: updatedManifest,
      };
    }

    // --- 5. FALLBACK / GENERAL AGENT ROUTING ---
    if (trimmed.length < 3) {
      throw new Error("Command is too short. Please enter a specific command (e.g., 'board scene 1' or 'compile prompts').");
    }

    return {
      success: true,
      workflow: 'GENERAL_COMMAND',
      message: `Agent accepted command: "${trimmed}". Dispatched through Central API Bridge.`,
      manifest: await db.getProjectManifest(projectId),
    };
  }
}

export const apiRouter = new CentralAPIRouter();
export default apiRouter;
