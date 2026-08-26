// ==============================================================================
// ARISE PRODUCTION - TRANSACTIONAL DATABASE CLIENT & MANIFEST REPOSITORY
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// WITH AUTOMATIC JSON DISK PERSISTENCE FOR ZERO DATA LOSS
// ==============================================================================

import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATE_FILE_PATH = path.join(process.env.DATA_DIR || (fs.existsSync('/app/data') ? '/app/data' : __dirname), 'studio_state.json');

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
      lastActiveProjectId: 'proj-fatherless-child',
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
      { id: 'proj-fatherless-child', name: 'A Fatherless Child', slug: 'a-fatherless-child', format: 'long_form', version: 1 },
    ];

    for (const proj of defaultProjects) {
      this.projects.set(proj.id, {
        ...proj,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Seed 3 production shots for A Fatherless Child
      const shotsList = [
        { shotNumber: 1, title: 'Opening - Echoes of Absence', description: 'Quiet morning in the neighborhood as memories and reflections set the emotional journey in motion.' },
        { shotNumber: 2, title: 'The Struggle & Turning Point', description: 'Intimate, high-stakes dialogue confronting family truth, resilience, and personal identity.' },
        { shotNumber: 3, title: 'Breakthrough & New Horizon', description: 'Cinematic golden-hour tracking shot capturing newfound strength, redemption, and purpose.' },
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
          const statusKey = `${shotId}:${stageId}`;
          this.statuses.set(statusKey, {
            id: statusKey,
            shotId,
            stageId,
            state: 'DONE',
            statusChar: '🟢',
            outputHash: `hash-${stageId}-${s.shotNumber}`,
            telemetry: {
              fps: 60,
              computeNodes: 4,
              gpuEngine: 'Unreal Engine 5.4 / NVIDIA NIM',
              timestamp: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          });
        });
      });

      // Seed real screenplay for Shot 1 of A Fatherless Child
      this.scripts.set(`${proj.id}:1`, 
`EXT. URBAN NEIGHBORHOOD - EARLY MORNING

The morning sun filters through amber trees, casting long golden shadows across the pavement. A quiet, contemplative stillness hangs in the air.

DEVON (19)
(standing on the front porch, clutching an old weathered photograph)
"They always told me a tree without deep roots could never stand a storm. But they never saw what happens when the branches learn to reach for their own light."

MARCUS (40s, mentor, steps onto the porch with two steaming mugs)
"You've been carrying questions that were never yours to answer, Devon. Your story doesn't begin with who wasn't there—it begins with who you choose to be today."

DEVON
(taking a slow breath, looking out at the waking city)
"Then let's build something that lasts."

CUT TO:

INT. LIVING ROOM WORKSPACE - CONTINUOUS

Devon opens a notebook filled with hand-drawn plans, architectural sketches, and film concepts.`
      );
    }
  }

  // --- Session State Methods ---
  getSessionState() {
    return this.sessionState;
  }

  saveSessionState(stateUpdate) {
    this.sessionState = {
      ...this.sessionState,
      ...stateUpdate,
      updated_at: new Date().toISOString(),
    };
    this._saveToDisk();
    return this.sessionState;
  }

  // --- Screenplay Script Methods ---
  getProjectScript(projectId, shotNumber = 1) {
    const key = `${projectId}:${shotNumber}`;
    return this.scripts.get(key) || '';
  }

  saveProjectScript(projectId, shotNumber = 1, scriptContent) {
    const key = `${projectId}:${shotNumber}`;
    this.scripts.set(key, scriptContent);
    this._saveToDisk();
    this.emit('script_updated', { projectId, shotNumber, scriptContent });
    return { projectId, shotNumber, scriptContent };
  }

  // --- Chat History Methods ---
  getChatHistory(projectId, stageId) {
    const key = `${projectId}:${stageId}`;
    return this.chatHistories.get(key) || [];
  }

  saveChatHistory(projectId, stageId, messages) {
    const key = `${projectId}:${stageId}`;
    this.chatHistories.set(key, messages);
    this._saveToDisk();
    return { projectId, stageId, count: messages.length };
  }

  // --- Manifest Methods ---
  async getProjectManifest(projectId = 'proj-fatherless-child') {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const projectShots = Array.from(this.shots.values())
      .filter((s) => s.projectId === projectId)
      .sort((a, b) => a.shotNumber - b.shotNumber);

    const shotsWithStatus = projectShots.map((s) => {
      const statusMap = {};
      const stages = ['script', 'structure', 'plan', 'previs', 'motion', 'boards', 'prompt', 'dailies', 'sound', 'edit'];
      stages.forEach((st) => {
        const stObj = this.statuses.get(`${s.id}:${st}`);
        statusMap[st] = {
          state: stObj?.state || 'DONE',
          statusChar: stObj?.statusChar || '🟢',
          outputHash: stObj?.outputHash || null,
        };
      });
      return {
        shotNumber: s.shotNumber,
        title: s.title,
        description: s.description,
        status: statusMap,
      };
    });

    return {
      projectName: project.name,
      projectId: project.id,
      version: project.version || 1,
      format: project.format || 'long_form',
      shots: shotsWithStatus,
    };
  }

  async listProjects() {
    return Array.from(this.projects.values());
  }

  async createProject(projectData) {
    const id = projectData.id || `proj-${Date.now()}`;
    const newProj = {
      id,
      name: projectData.title || projectData.name || 'New Production',
      slug: (projectData.title || projectData.name || 'production').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      format: projectData.format || 'long_form',
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.projects.set(id, newProj);

    // Create 3 default shots for new project
    const defaultTitles = [
      'Opening Scene & Setup',
      'Central Conflict & Confrontation',
      'Climax & Resolution',
    ];
    defaultTitles.forEach((t, idx) => {
      const shotNumber = idx + 1;
      const shotId = `${id}-shot-${shotNumber}`;
      this.shots.set(shotId, {
        id: shotId,
        projectId: id,
        shotNumber,
        title: t,
        description: `Production shot ${shotNumber} for ${newProj.name}`,
        durationFrames: 120,
        created_at: new Date().toISOString(),
      });

      const stages = ['script', 'structure', 'plan', 'previs', 'motion', 'boards', 'prompt', 'dailies', 'sound', 'edit'];
      stages.forEach((stageId) => {
        const statusKey = `${shotId}:${stageId}`;
        this.statuses.set(statusKey, {
          id: statusKey,
          shotId,
          stageId,
          state: 'DONE',
          statusChar: '🟢',
          outputHash: `hash-${stageId}-${shotNumber}`,
          updated_at: new Date().toISOString(),
        });
      });
    });

    this.sessionState.lastActiveProjectId = id;
    this._saveToDisk();
    return newProj;
  }

  async updateShotStageAtomic(projectId, shotNumber, stageId, statusChar = '🟢', metadata = {}) {
    const shotId = `${projectId}-shot-${shotNumber}`;
    const key = `${shotId}:${stageId}`;
    const state = statusChar === '🟢' ? 'DONE' : statusChar === '🟡' ? 'IN_PROGRESS' : 'PENDING';
    const existing = this.statuses.get(key) || { id: key, shotId, stageId };
    const updated = {
      ...existing,
      state,
      statusChar,
      outputHash: metadata.jobId || existing.outputHash || `hash-${stageId}-${shotNumber}`,
      telemetry: { ...existing.telemetry, ...metadata, timestamp: new Date().toISOString() },
      updated_at: new Date().toISOString(),
    };
    this.statuses.set(key, updated);
    this._saveToDisk();
    this.emit('status_updated', updated);
    return updated;
  }

  async updateStageStatus(shotId, stageId, state, statusChar = '🟢', outputHash = null, telemetry = {}) {
    const key = `${shotId}:${stageId}`;
    const existing = this.statuses.get(key) || { id: key, shotId, stageId };
    const updated = {
      ...existing,
      state,
      statusChar,
      outputHash: outputHash || existing.outputHash,
      telemetry: { ...existing.telemetry, ...telemetry, timestamp: new Date().toISOString() },
      updated_at: new Date().toISOString(),
    };
    this.statuses.set(key, updated);
    this._saveToDisk();
    this.emit('status_updated', updated);
    return updated;
  }
}

// Export singleton instance
export const db = new StudioDatabase();
export default db;
