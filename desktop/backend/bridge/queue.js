// ==============================================================================
// WASSERMAN STUDIO SHELL - RESILIENT MCP JOB QUEUE
// ==============================================================================

import EventEmitter from 'events';
import { db } from '../db/client.js';
import { mcpWorkers } from '../workers/mcp-workers.js';

export class MCPJobQueue extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.activeJobs = new Map();
    this.isProcessing = false;
    this.concurrency = 4;
  }

  // Push job to queue
  async enqueue(jobData) {
    const job = await db.recordJob(jobData);
    this.queue.push(job);
    this.emit('job_enqueued', job);
    console.log(`[JobQueue] Enqueued Job ${job.id} for stage '${job.stageId}'`);
    this._processNext();
    return job;
  }

  async _processNext() {
    if (this.activeJobs.size >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const job = this.queue.shift();
    this.activeJobs.set(job.id, job);

    await db.updateJob(job.id, { status: 'RUNNING', progress: 10 });
    this.emit('job_started', job);

    // Worker lookup
    const worker = mcpWorkers[job.stageId];
    if (!worker) {
      const errorMsg = `No worker registered for stage: ${job.stageId}`;
      await db.updateJob(job.id, { status: 'FAILED', error: errorMsg });
      this.activeJobs.delete(job.id);
      this.emit('job_failed', { job, error: errorMsg });
      this._processNext();
      return;
    }

    // Execute worker asynchronously
    (async () => {
      try {
        const result = await worker.executeJob(job, async (progress, message) => {
          await db.updateJob(job.id, { progress, lastMessage: message });
          this.emit('job_progress', { jobId: job.id, stageId: job.stageId, progress, message });
        });

        await db.updateJob(job.id, { status: 'COMPLETED', progress: 100, outputResult: result });
        this.emit('job_completed', { jobId: job.id, stageId: job.stageId, result });
      } catch (err) {
        console.error(`[JobQueue] Error in worker ${worker.name}:`, err);
        await db.updateJob(job.id, { status: 'FAILED', error: err.message });
        this.emit('job_failed', { jobId: job.id, stageId: job.stageId, error: err.message });
      } finally {
        this.activeJobs.delete(job.id);
        this._processNext();
      }
    })();
  }
}

export const jobQueue = new MCPJobQueue();
export default jobQueue;
