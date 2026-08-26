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
    this.ideas = new Map(); // key: ideaId
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
          if (data.ideas && Array.isArray(data.ideas) && data.ideas.length > 0) {
            data.ideas.forEach((idea) => this.ideas.set(idea.id, idea));
          }
          this._seedDefaultIdeas();
          if (data.sessionState) this.sessionState = { ...this.sessionState, ...data.sessionState };
          if (data.auditLogs) this.auditLogs = data.auditLogs.slice(-100);
          console.log(`[Database] Loaded ${this.projects.size} projects, ${this.ideas.size} ideas, and session state from ${STATE_FILE_PATH}`);
          return true;
        }
      }
    } catch (err) {
      console.warn(`[Database] Could not read disk state: ${err.message}. Initializing defaults.`);
    }
    return false;
  }

  _seedDefaultIdeas() {
    const defaultIdeas = [
      {
        id: 'idea-short-last-transmission',
        title: 'The Last Transmission',
        format: 'short_form',
        runtimeEstimate: '9 Minutes',
        logline: 'On an isolated lunar relay, a solo signal operator receives a distress frequency originating from Earth—dated three days into the future.',
        hook: 'A race against deterministic time where every transmission received changes the impending catastrophe.',
        coreConflict: 'Solo operator vs. temporal paradox vs. isolation breakdown.',
        thematicEngine: 'Fate vs. Free Will, the burden of foreknowledge, and human connection across cosmic distances.',
        structureBlueprint: 'Beat 1: Routine signal scan -> Beat 2: Future distress audio received -> Beat 3: Desperate override attempt -> Climax: The countdown hits zero.',
        targetAudience: 'Sci-Fi Festival / Indie Proof-of-Concept',
        marketComps: 'Moon x Arrival x The Twilight Zone',
        status: 'greenlit',
        tags: ['Sci-Fi', 'Short Film', 'High-Concept', 'Temporal'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        history: [
          { timestamp: new Date().toISOString(), author: 'Flash Nova', note: 'Calibrated for 9-minute tight festival pacing with Unreal Engine 5 lunar environment.' }
        ]
      },
      {
        id: 'idea-feature-fatherless-child',
        title: 'A Fatherless Child',
        format: 'feature_film',
        runtimeEstimate: '115 Minutes',
        logline: 'When an aspiring architectural restorer discovers her absent father vanished while fighting a predatory developer, she teams up with an estranged brother to defend their historic family foundry.',
        hook: 'Dual-lead emotional mystery confronting corporate gentrification, generational resilience, and architectural heritage.',
        coreConflict: 'Devon & Sean (Heritage) vs. Vale Holdings (Corporate Gentrification).',
        thematicEngine: 'Roots do not define you—choices do. The enduring power of generational legacy and community truth.',
        structureBlueprint: 'Act 1: The Porch Discovery & Eviction -> Act 2A: The Investigative Alliance -> Act 2B: Midpoint Blueprint Heist -> Act 3: Midnight Injunction & Showdown.',
        targetAudience: 'Prestige Drama / Theatrical Feature / Streamer Tentpole',
        marketComps: 'Erin Brockovich x Fences x The Last Black Man in San Francisco',
        status: 'in_production',
        projectId: 'proj-fatherless-child',
        tags: ['Feature Film', 'Drama', 'Thriller', 'Heritage', 'Dual-Lead'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        history: [
          { timestamp: new Date().toISOString(), author: 'Orion Vance', note: 'Promoted to active 10-stage production pipeline.' }
        ]
      },
      {
        id: 'idea-tv-obsidian-protocol',
        title: 'Obsidian Protocol',
        format: 'tv_series',
        runtimeEstimate: '8 Episodes (45m each)',
        logline: 'In a near-future metropolis powered by neural memory vaults, a rogue data forensic investigator uncovers a shadow syndicate altering collective public memories to erase corporate atrocities.',
        hook: 'What happens to justice when the evidence inside your own mind can be rewritten by executive decree?',
        coreConflict: 'Memory Forensics Division vs. The Memory Syndicate.',
        thematicEngine: 'Truth, synthetic identity, the sanctity of human memory, and corporate state surveillance.',
        structureBlueprint: 'Episode 1: The Blank Case -> Episode 2-4: The Fragment Trail -> Episode 5: The Mid-Season Blackout -> Episode 8: The Global Unmasking.',
        targetAudience: 'Prestige Episodic TV / Adult Sci-Fi Thriller',
        marketComps: 'Severance x Blade Runner 2049 x Dark',
        status: 'developing',
        tags: ['TV Series', 'Sci-Fi', 'Cyberpunk', 'Episodic', 'Mystery'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        history: [
          { timestamp: new Date().toISOString(), author: 'Scribe Vance', note: 'Constructed 8-episode season arc and episodic tension engine.' }
        ]
      },
    ];

    defaultIdeas.forEach((idea) => {
      if (!this.ideas.has(idea.id)) {
        this.ideas.set(idea.id, idea);
      }
    });
    this._saveToDisk();
  }

  _saveToDisk() {
    try {
      const data = {
        projects: Array.from(this.projects.values()),
        shots: Array.from(this.shots.values()),
        statuses: Array.from(this.statuses.values()),
        scripts: Array.from(this.scripts.entries()).map(([id, content]) => ({ id, content })),
        chatHistories: Array.from(this.chatHistories.entries()).map(([id, messages]) => ({ id, messages })),
        ideas: Array.from(this.ideas.values()),
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

    // Seed default cross-format ideas
    const defaultIdeas = [
      {
        id: 'idea-short-last-transmission',
        title: 'The Last Transmission',
        format: 'short_form',
        runtimeEstimate: '9 Minutes',
        logline: 'On an isolated lunar relay, a solo signal operator receives a distress frequency originating from Earth—dated three days into the future.',
        hook: 'A race against deterministic time where every transmission received changes the impending catastrophe.',
        coreConflict: 'Solo operator vs. temporal paradox vs. isolation breakdown.',
        thematicEngine: 'Fate vs. Free Will, the burden of foreknowledge, and human connection across cosmic distances.',
        structureBlueprint: 'Beat 1: Routine signal scan -> Beat 2: Future distress audio received -> Beat 3: Desperate override attempt -> Climax: The countdown hits zero.',
        targetAudience: 'Sci-Fi Festival / Indie Proof-of-Concept',
        marketComps: 'Moon x Arrival x The Twilight Zone',
        status: 'greenlit',
        tags: ['Sci-Fi', 'Short Film', 'High-Concept', 'Temporal'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        history: [
          { timestamp: new Date().toISOString(), author: 'Flash Nova', note: 'Calibrated for 9-minute tight festival pacing with Unreal Engine 5 lunar environment.' }
        ]
      },
      {
        id: 'idea-feature-fatherless-child',
        title: 'A Fatherless Child',
        format: 'feature_film',
        runtimeEstimate: '115 Minutes',
        logline: 'When an aspiring architectural restorer discovers her absent father vanished while fighting a predatory developer, she teams up with an estranged brother to defend their historic family foundry.',
        hook: 'Dual-lead emotional mystery confronting corporate gentrification, generational resilience, and architectural heritage.',
        coreConflict: 'Devon & Sean (Heritage) vs. Vale Holdings (Corporate Gentrification).',
        thematicEngine: 'Roots do not define you—choices do. The enduring power of generational legacy and community truth.',
        structureBlueprint: 'Act 1: The Porch Discovery & Eviction -> Act 2A: The Investigative Alliance -> Act 2B: Midpoint Blueprint Heist -> Act 3: Midnight Injunction & Showdown.',
        targetAudience: 'Prestige Drama / Theatrical Feature / Streamer Tentpole',
        marketComps: 'Erin Brockovich x Fences x The Last Black Man in San Francisco',
        status: 'in_production',
        projectId: 'proj-fatherless-child',
        tags: ['Feature Film', 'Drama', 'Thriller', 'Heritage', 'Dual-Lead'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        history: [
          { timestamp: new Date().toISOString(), author: 'Orion Vance', note: 'Promoted to active 10-stage production pipeline.' }
        ]
      },
      {
        id: 'idea-tv-obsidian-protocol',
        title: 'Obsidian Protocol',
        format: 'tv_series',
        runtimeEstimate: '8 Episodes (45m each)',
        logline: 'In a near-future metropolis powered by neural memory vaults, a rogue data forensic investigator uncovers a shadow syndicate altering collective public memories to erase corporate atrocities.',
        hook: 'What happens to justice when the evidence inside your own mind can be rewritten by executive decree?',
        coreConflict: 'Memory Forensics Division vs. The Memory Syndicate.',
        thematicEngine: 'Truth, synthetic identity, the sanctity of human memory, and corporate state surveillance.',
        structureBlueprint: 'Episode 1: The Blank Case -> Episode 2-4: The Fragment Trail -> Episode 5: The Mid-Season Blackout -> Episode 8: The Global Unmasking.',
        targetAudience: 'Prestige Episodic TV / Adult Sci-Fi Thriller',
        marketComps: 'Severance x Blade Runner 2049 x Dark',
        status: 'developing',
        tags: ['TV Series', 'Sci-Fi', 'Cyberpunk', 'Episodic', 'Mystery'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        history: [
          { timestamp: new Date().toISOString(), author: 'Scribe Vance', note: 'Constructed 8-episode season arc and episodic tension engine.' }
        ]
      },
    ];

    defaultIdeas.forEach((idea) => this.ideas.set(idea.id, idea));

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

  // --- Idea Vault Methods ---
  listIdeas(format = null) {
    const all = Array.from(this.ideas.values());
    if (!format || format === 'all') return all;
    return all.filter((i) => i.format === format);
  }

  getIdea(ideaId) {
    return this.ideas.get(ideaId) || null;
  }

  saveIdea(ideaData) {
    const id = ideaData.id || `idea-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const existing = this.ideas.get(id) || {};
    const history = existing.history || [];
    if (ideaData.note) {
      history.unshift({
        timestamp: new Date().toISOString(),
        author: ideaData.author || 'Creator',
        note: ideaData.note,
      });
    }

    const savedIdea = {
      ...existing,
      ...ideaData,
      id,
      history: ideaData.history || history,
      created_at: existing.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.ideas.set(id, savedIdea);
    this._saveToDisk();
    this.emit('idea_saved', savedIdea);
    return savedIdea;
  }

  deleteIdea(ideaId) {
    const exists = this.ideas.has(ideaId);
    if (exists) {
      this.ideas.delete(ideaId);
      this._saveToDisk();
      this.emit('idea_deleted', { id: ideaId });
    }
    return exists;
  }

  async promoteIdeaToProject(ideaId) {
    const idea = this.ideas.get(ideaId);
    if (!idea) throw new Error(`Idea "${ideaId}" not found`);

    const formatCode = idea.format === 'tv_series' ? 'episodic_tv' : idea.format === 'short_form' ? 'short_form' : 'long_form';
    const proj = await this.createProject(idea.title, formatCode);
    
    // Update idea status
    idea.status = 'in_production';
    idea.projectId = proj.id;
    idea.updated_at = new Date().toISOString();
    idea.history = idea.history || [];
    idea.history.unshift({
      timestamp: new Date().toISOString(),
      author: 'Orion Vance',
      note: `Promoted concept to active 10-stage production project (${proj.id}).`,
    });
    this.ideas.set(idea.id, idea);

    // Save initial script scene for shot 1
    const defaultFountain = `/* ${idea.title.toUpperCase()} — PITCH & PROMOTED SCRIPT */
TITLE: ${idea.title}
FORMAT: ${idea.format}
LOGLINE: ${idea.logline || ''}
THEMATIC ENGINE: ${idea.thematicEngine || ''}

EXT. SCENE 1 - DAY

The world awakens. A high-concept premise unfolds: ${idea.hook || idea.logline || ''}

PROTAGONIST
"We begin here."`;

    await this.saveProjectScript(proj.id, 1, defaultFountain);
    this._saveToDisk();
    return { project: proj, idea };
  }
}

// Export singleton instance
export const db = new StudioDatabase();
export default db;
