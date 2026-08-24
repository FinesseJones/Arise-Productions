// ==============================================================================
// WASSERMAN STUDIO SHELL - TRANSACTIONAL DATABASE CLIENT & MANIFEST REPOSITORY
// WITH AUTOMATIC JSON DISK PERSISTENCE FOR ZERO DATA LOSS
// ==============================================================================

import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATE_FILE_PATH = path.join(__dirname, 'studio_state.json');

// Persistent Transactional Store with file-backed JSON autosave
class StudioDatabase extends EventEmitter {
  constructor() {
    super();
    this.projects = new Map();
    this.shots = new Map();
    this.statuses = new Map(); // key: `${shotId}:${stageId}`
    this.jobs = new Map();
    this.scripts = new Map(); // key: `${projectId}:${shotNumber}`
    this.chatHistories = new Map(); // key: `${projectId}:${stageId}`
    this.auditLogs = [];
    this.sessionState = {
      lastActiveProjectId: 'proj-titanic',
      lastActiveStageId: 'script',
      lastActiveView: 'stage',
      updated_at: new Date().toISOString(),
    };

    // Load from disk or seed initial data
    if (!this._loadFromDisk()) {
      this._seedInitialData();
      this._saveToDisk();
    }
  }

  _loadFromDisk() {
    try {
      if (fs.existsSync(STATE_FILE_PATH)) {
        const raw = fs.readFileSync(STATE_FILE_PATH, 'utf-8');
        const data = JSON.parse(raw);
        if (data && data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          data.projects.forEach((p) => this.projects.set(p.id, p));
          if (data.shots) data.shots.forEach((s) => this.shots.set(s.id, s));
          if (data.statuses) data.statuses.forEach((st) => this.statuses.set(st.id, st));
          if (data.scripts) data.scripts.forEach((sc) => this.scripts.set(sc.id, sc.content));
          if (data.chatHistories) data.chatHistories.forEach((ch) => this.chatHistories.set(ch.id, ch.messages));
          if (data.sessionState) this.sessionState = { ...this.sessionState, ...data.sessionState };
          if (data.auditLogs) this.auditLogs = data.auditLogs.slice(-100);
          console.log(`[Database] Loaded ${this.projects.size} projects and session state from ${STATE_FILE_PATH}`);
          return true;
        }
      }
    } catch (err) {
      console.warn(`[Database] Could not read disk state: ${err.message}. Initializing defaults.`);
    }
    return false;
  }

  _saveToDisk() {
    try {
      const data = {
        projects: Array.from(this.projects.values()),
        shots: Array.from(this.shots.values()),
        statuses: Array.from(this.statuses.values()),
        scripts: Array.from(this.scripts.entries()).map(([id, content]) => ({ id, content })),
        chatHistories: Array.from(this.chatHistories.entries()).map(([id, messages]) => ({ id, messages })),
        sessionState: this.sessionState,
        auditLogs: this.auditLogs.slice(-100),
        saved_at: new Date().toISOString(),
      };
      fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`[Database] Error saving state to disk: ${err.message}`);
    }
  }

  _seedInitialData() {
    const defaultProjects = [
      { id: 'proj-titanic', name: 'Titanic - Found Footage', slug: 'titanic-found-footage', format: 'long_form', version: 1 },
      { id: 'proj-alien', name: 'Alien - Hive Mind', slug: 'alien-hive-mind', format: 'episodic', version: 1 },
      { id: 'proj-space', name: 'Deep Space Journey', slug: 'deep-space-journey', format: 'short_form', version: 1 },
    ];

    for (const proj of defaultProjects) {
      this.projects.set(proj.id, {
        ...proj,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Seed 3 default shots per project
      const shotsList = [
        { shotNumber: 1, title: 'Opening Monologue - Dawn', description: 'Expedition vessel drifts through ocean mist.' },
        { shotNumber: 2, title: 'Corridor Chase & Encounter', description: 'Intense handheld tracking shot along the flooding bulkhead.' },
        { shotNumber: 3, title: 'Final Resolution - Sunset', description: 'Wide cinematic crane pulling away into the horizon.' },
      ];

      const stages = ['script', 'structure', 'plan', 'previs', 'motion', 'boards', 'prompt', 'dailies', 'sound', 'edit'];

      shotsList.forEach((s) => {
        const shotId = `${proj.id}-shot-${s.shotNumber}`;
        this.shots.set(shotId, {
          id: shotId,
          projectId: proj.id,
          shotNumber: s.shotNumber,
          title: s.title,
          description: s.description,
          durationFrames: 120,
          created_at: new Date().toISOString(),
        });

        stages.forEach((stageId) => {
          const key = `${shotId}:${stageId}`;
          let statusChar = '?';
          let state = 'UNSTARTED';

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

  // Register newly created project dynamically & persist
  registerProject(projectRecord) {
    const { id, name, slug = id, format = 'long_form', shots = [], logline = '', characterBible = [] } = projectRecord;
    this.projects.set(id, {
      id,
      name,
      slug,
      format,
      logline,
      characterBible,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const stages = ['script', 'structure', 'plan', 'previs', 'motion', 'boards', 'prompt', 'dailies', 'sound', 'edit'];

    shots.forEach((s) => {
      const shotId = `${id}-shot-${s.shotNumber}`;
      this.shots.set(shotId, {
        id: shotId,
        projectId: id,
        shotNumber: s.shotNumber,
        title: s.title,
        description: s.description,
        durationFrames: 120,
        created_at: new Date().toISOString(),
      });

      stages.forEach((stageId) => {
        const key = `${shotId}:${stageId}`;
        const stageStatus = s.status?.[stageId] || {};
        this.statuses.set(key, {
          id: key,
          shotId,
          stageId,
          statusChar: stageStatus.statusChar || '?',
          state: stageStatus.statusChar === '🟢' ? 'COMPLETE' : stageStatus.statusChar === '🟡' ? 'IN_PROGRESS' : 'UNSTARTED',
          progress: stageStatus.statusChar === '🟢' ? 100 : stageStatus.statusChar === '🟡' ? 50 : 0,
          metadata: { outputSummary: stageStatus.outputSummary || '' },
          updated_at: new Date().toISOString(),
          version: 1,
        });
      });
    });

    // Update active session
    this.sessionState.lastActiveProjectId = id;
    this.sessionState.updated_at = new Date().toISOString();

    this._saveToDisk();
    console.log(`[Database] Registered and persisted project "${name}" (${id}) with ${shots.length} shots.`);
    return this.getProjectManifest(id);
  }

  // Save session state (where user left off)
  saveSessionState(stateUpdates) {
    this.sessionState = {
      ...this.sessionState,
      ...stateUpdates,
      updated_at: new Date().toISOString(),
    };
    this._saveToDisk();
    return this.sessionState;
  }

  getSessionState() {
    return this.sessionState;
  }

  // Save / Retrieve Screenplay for a specific project & shot
  saveProjectScript(projectId, shotNumber, scriptContent) {
    const key = `${projectId}:${shotNumber}`;
    this.scripts.set(key, scriptContent);
    this._saveToDisk();
    return { success: true, key, scriptContent };
  }

  getProjectScript(projectId, shotNumber) {
    const key = `${projectId}:${shotNumber}`;
    return this.scripts.get(key) || null;
  }

  // Save / Retrieve Chat History for a specific project & room
  saveChatHistory(projectId, stageId, messages) {
    const key = `${projectId}:${stageId}`;
    this.chatHistories.set(key, messages);
    this._saveToDisk();
    return { success: true, key };
  }

  getChatHistory(projectId, stageId) {
    const key = `${projectId}:${stageId}`;
    return this.chatHistories.get(key) || [];
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
        description: shot.description || '',
        status: statusObj,
      };
    });

    return {
      projectId: project.id,
      projectName: project.name,
      slug: project.slug,
      format: project.format || 'long_form',
      logline: project.logline || '',
      characterBible: project.characterBible || [],
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

    this._saveToDisk();

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
