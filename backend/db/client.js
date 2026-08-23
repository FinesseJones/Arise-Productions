// ==============================================================================
// WASSERMAN STUDIO SHELL - TRANSACTIONAL DATABASE CLIENT & MANIFEST REPOSITORY
// ==============================================================================

import EventEmitter from 'events';

// In-Memory Transactional Store (Zero-config local mode & PostgreSQL replica)
class StudioDatabase extends EventEmitter {
  constructor() {
    super();
    this.projects = new Map();
    this.shots = new Map();
    this.statuses = new Map(); // key: `${shotId}:${stageId}`
    this.jobs = new Map();
    this.auditLogs = [];
    
    // Seed initial project data
    this._seedInitialData();
  }

  _seedInitialData() {
    const defaultProjects = [
      { id: 'proj-titanic', name: 'Titanic - Found Footage', slug: 'titanic-found-footage', version: 1 },
      { id: 'proj-alien', name: 'Alien - Hive Mind', slug: 'alien-hive-mind', version: 1 },
      { id: 'proj-space', name: 'Deep Space Journey', slug: 'deep-space-journey', version: 1 },
    ];

    for (const proj of defaultProjects) {
      this.projects.set(proj.id, {
        ...proj,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Seed 3 default shots per project
      const shotsList = [
        { shotNumber: 1, title: 'Opening Monologue - Dawn' },
        { shotNumber: 2, title: 'Corridor Chase & Encounter' },
        { shotNumber: 3, title: 'Final Resolution - Sunset' },
      ];

      const stages = ['script', 'structure', 'plan', 'previs', 'motion', 'boards', 'prompt', 'dailies', 'sound', 'edit'];

      shotsList.forEach((s) => {
        const shotId = `${proj.id}-shot-${s.shotNumber}`;
        this.shots.set(shotId, {
          id: shotId,
          projectId: proj.id,
          shotNumber: s.shotNumber,
          title: s.title,
          durationFrames: 120,
          created_at: new Date().toISOString(),
        });

        stages.forEach((stageId) => {
          const key = `${shotId}:${stageId}`;
          // Default initial state
          let statusChar = '?';
          let state = 'UNSTARTED';

          // Pre-seed some realistic states for Shot 1 and Shot 2
          if (s.shotNumber === 1 && (stageId === 'script' || stageId === 'structure')) {
            statusChar = '🟢';
            state = 'COMPLETE';
          } else if (s.shotNumber === 1 && stageId === 'plan') {
            statusChar = '🟡';
            state = 'IN_PROGRESS';
          } else if (s.shotNumber === 2 && stageId === 'script') {
            statusChar = '🟢';
            state = 'COMPLETE';
          } else if (s.shotNumber === 2 && stageId === 'sound') {
            statusChar = '🟡';
            state = 'IN_PROGRESS';
          }

          this.statuses.set(key, {
            id: key,
            shotId,
            stageId,
            statusChar,
            state,
            progress: state === 'COMPLETE' ? 100 : state === 'IN_PROGRESS' ? 50 : 0,
            metadata: {},
            updated_at: new Date().toISOString(),
            version: 1,
          });
        });
      });
    }
  }

  // Get list of all projects
  async listProjects() {
    return Array.from(this.projects.values());
  }

  // Get project by ID or slug
  async getProject(projectIdOrName) {
    let proj = this.projects.get(projectIdOrName);
    if (!proj) {
      proj = Array.from(this.projects.values()).find(
        (p) => p.name.toLowerCase() === projectIdOrName.toLowerCase() || p.slug === projectIdOrName.toLowerCase()
      );
    }
    return proj || null;
  }

  // Get full ProjectStatus manifest (The single source of truth)
  async getProjectManifest(projectIdOrName) {
    const project = await this.getProject(projectIdOrName);
    if (!project) return null;

    const projectShots = Array.from(this.shots.values())
      .filter((s) => s.projectId === project.id)
      .sort((a, b) => a.shotNumber - b.shotNumber);

    const stages = ['script', 'structure', 'plan', 'previs', 'motion', 'boards', 'prompt', 'dailies', 'sound', 'edit'];

    const manifestShots = projectShots.map((shot) => {
      const statusObj = {};
      stages.forEach((stageId) => {
        const key = `${shot.id}:${stageId}`;
        const record = this.statuses.get(key);
        statusObj[stageId] = {
          statusChar: record ? record.statusChar : '?',
          state: record ? record.state : 'UNSTARTED',
          progress: record ? record.progress : 0,
          updated_at: record ? record.updated_at : null,
        };
      });

      return {
        shotNumber: shot.shotNumber,
        title: shot.title,
        status: statusObj,
      };
    });

    return {
      projectId: project.id,
      projectName: project.name,
      slug: project.slug,
      version: project.version,
      updated_at: project.updated_at,
      shots: manifestShots,
    };
  }

  // Atomic ACID status update for a shot stage
  async updateShotStageAtomic(projectId, shotNumber, stageId, statusChar, metadata = {}) {
    const project = await this.getProject(projectId);
    if (!project) throw new Error(`Project ${projectId} not found`);

    const shotId = `${project.id}-shot-${shotNumber}`;
    const statusKey = `${shotId}:${stageId}`;

    const stateMap = {
      '🟢': 'COMPLETE',
      '🟡': 'IN_PROGRESS',
      '🔴': 'FAILED',
      '⚪': 'BLOCKED',
      '?': 'UNSTARTED',
    };

    const currentRecord = this.statuses.get(statusKey) || {
      id: statusKey,
      shotId,
      stageId,
      metadata: {},
      version: 0,
    };

    const updatedRecord = {
      ...currentRecord,
      statusChar,
      state: stateMap[statusChar] || 'IN_PROGRESS',
      progress: statusChar === '🟢' ? 100 : statusChar === '🟡' ? 50 : 0,
      metadata: { ...currentRecord.metadata, ...metadata },
      updated_at: new Date().toISOString(),
      version: currentRecord.version + 1,
    };

    this.statuses.set(statusKey, updatedRecord);

    // Update project version & timestamp
    project.version += 1;
    project.updated_at = new Date().toISOString();
    this.projects.set(project.id, project);

    // Audit log
    this.auditLogs.push({
      id: `audit-${Date.now()}`,
      projectId: project.id,
      shotNumber,
      stageId,
      statusChar,
      timestamp: new Date().toISOString(),
    });

    const manifest = await this.getProjectManifest(project.id);
    this.emit('manifest_updated', { projectId: project.id, manifest, stageId, shotNumber, statusChar });
    return manifest;
  }

  // Record an asynchronous pipeline job
  async recordJob(jobData) {
    const job = {
      id: jobData.id || `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      projectId: jobData.projectId,
      shotNumber: jobData.shotNumber,
      stageId: jobData.stageId,
      action: jobData.action,
      idempotencyKey: jobData.idempotencyKey || null,
      status: jobData.status || 'QUEUED',
      progress: jobData.progress || 0,
      inputPayload: jobData.inputPayload || {},
      outputResult: null,
      error: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.jobs.set(job.id, job);
    return job;
  }

  // Update job progress and completion
  async updateJob(jobId, updates) {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);

    const updated = {
      ...job,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    this.jobs.set(jobId, updated);
    this.emit('job_updated', updated);
    return updated;
  }
}

export const db = new StudioDatabase();
export default db;
