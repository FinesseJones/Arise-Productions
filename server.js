// ==============================================================================
// WASSERMAN STUDIO SHELL - UNIFIED BACKEND SERVER & CENTRAL API BRIDGE
// ==============================================================================

import express from 'express';
import cors from 'cors';
import http from 'http';
import { db } from './backend/db/client.js';
import { wsGateway } from './backend/bridge/gateway.js';
import { apiRouter } from './backend/bridge/router.js';
import { fileWatcher } from './backend/services/file-watcher.js';
import { CICDQualityGate } from './backend/services/cicd-gate.js';
import { mcpWorkers } from './backend/workers/mcp-workers.js';
import { MediaIngestionEngine } from './backend/services/media-ingest.js';

const app = express();
const PORT = 4000;

// Create HTTP server for both Express REST and WebSocket upgrades
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Attach WebSocket Gateway
wsGateway.attachToServer(server);

// Start File System Watcher Daemon
fileWatcher.start();

// ==============================================================================
// 1. CENTRAL API BRIDGE & MANIFEST REST ENDPOINTS
// ==============================================================================

// POST /api/v1/projects/create - Create Long, Short, or Episodic TV production
app.post('/api/v1/projects/create', async (req, res) => {
  try {
    const project = await MediaIngestionEngine.createProject(req.body);
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/ingest/link - Ingest from YouTube or social media link
app.post('/api/v1/ingest/link', async (req, res) => {
  try {
    const { url, format = 'long_form', title = 'Imported Media Production' } = req.body;
    const project = await MediaIngestionEngine.createProject({
      title,
      format,
      sourceType: url.includes('youtube') ? 'youtube_link' : 'social_link',
      sourceUrl: url,
    });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/manifest - Retrieve current ProjectStatus manifest
app.get('/api/v1/manifest', async (req, res) => {
  const projectId = req.query.projectId || 'proj-titanic';
  const manifest = await db.getProjectManifest(projectId);
  if (!manifest) return res.status(404).json({ success: false, error: 'Project not found' });
  res.json({ success: true, manifest });
});

// GET /api/v1/projects - List all projects
app.get('/api/v1/projects', async (req, res) => {
  const projects = await db.listProjects();
  res.json({ success: true, projects });
});

// POST /api/v1/dispatch - Execute Director Agent Command
app.post('/api/v1/dispatch', async (req, res) => {
  const { projectId = 'proj-titanic', command = '', activeStage, shotNumber } = req.body;
  try {
    const result = await apiRouter.processMCPRequest({ projectId, command, activeStage, shotNumber });
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/v1/cicd/gate - Run Automated Quality Gate
app.post('/api/v1/cicd/gate', async (req, res) => {
  const projectId = req.body.projectId || 'proj-titanic';
  try {
    const report = await CICDQualityGate.runQualityGate(projectId);
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 2. 10 DIRECT MCP STAGE WORKER ENDPOINTS (/mcp/*)
// ==============================================================================

const stageRoutes = [
  { path: '/mcp/script', stage: 'script' },
  { path: '/mcp/structure', stage: 'structure' },
  { path: '/mcp/plan', stage: 'plan' },
  { path: '/mcp/previs', stage: 'previs' },
  { path: '/mcp/motion', stage: 'motion' },
  { path: '/mcp/boards', stage: 'boards' },
  { path: '/mcp/prompt', stage: 'prompt' },
  { path: '/mcp/dailies', stage: 'dailies' },
  { path: '/mcp/sound', stage: 'sound' },
  { path: '/mcp/edit', stage: 'edit' },
];

stageRoutes.forEach(({ path: routePath, stage }) => {
  app.post(routePath, async (req, res) => {
    const { projectId = 'proj-titanic', shotNumber = 1, payload = {} } = req.body;
    const worker = mcpWorkers[stage];
    if (!worker) return res.status(404).json({ success: false, error: `Stage worker ${stage} not found` });

    try {
      const mockJob = { id: `direct-${Date.now()}`, projectId, shotNumber, stageId: stage, inputPayload: payload };
      const output = await worker.executeJob(mockJob);
      const manifest = await db.getProjectManifest(projectId);
      res.json({ success: true, stage, output, manifest });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
});

// ==============================================================================
// 3. CASTING, SCRIPT, LOCATION, & PRODUCTION STUDIO ENDPOINTS
// ==============================================================================

app.post('/casting/analyze', (req, res) => {
  const { character_name, project_type, budget_range, analysis_type } = req.body;
  const mockResults = {
    casting: {
      character_name: character_name || 'Hero Protagonist',
      age_range: '28-35',
      physical_description: "Athletic build, 5'8\"-6'2\", expressive eyes",
      personality_traits: ['Determined', 'Intelligent', 'Resourceful', 'Charismatic'],
      key_scenes: ['Opening monologue', 'Confrontation scene', 'Final resolution'],
      suggested_actors: ['Actor A (TV experience)', 'Actor B (Theater background)', 'Actor C (Film veteran)'],
      casting_notes: 'Look for someone with strong improvisational skills and combat training background.',
    },
    budget: {
      total_estimated_cost: '$2.3M',
      breakdown: { cast: '35%', crew: '26%', equipment: '17%', post_production: '15%', miscellaneous: '7%' },
    },
    schedule: {
      total_production_days: 45,
      pre_production: '8 weeks',
      principal_photography: '6 weeks',
      post_production: '12 weeks',
    },
  };

  res.json({
    success: true,
    data: mockResults[analysis_type] || mockResults.casting,
    ai_powered: false,
  });
});

app.post('/casting/profiles', (req, res) => {
  res.json({ success: true, data: { id: Date.now().toString(), created_at: new Date().toISOString(), profile: req.body.profile } });
});

app.get('/casting/profiles', (req, res) => {
  res.json({ success: true, data: [] });
});

app.post('/script/analyze', (req, res) => {
  res.json({
    success: true,
    data: {
      overview: { total_scenes: 24, total_pages: 98, estimated_runtime: '102 minutes', tone: 'Dramatic thriller' },
      scenes: [{ scene_number: 1, location: 'Downtown Office - Day', characters: ['Sarah', 'Marcus'] }],
    },
  });
});

app.post('/locations/search', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'loc_001', name: 'Modern Downtown Loft', address: '245 Market Street, San Francisco, CA', suitability_score: 92, cost_per_day: '$3,500' },
      { id: 'loc_002', name: 'Industrial Warehouse', address: '1890 Bay Street, Oakland, CA', suitability_score: 88, cost_per_day: '$2,800' },
    ],
  });
});

app.post('/storyboard/generate', (req, res) => {
  res.json({
    success: true,
    data: {
      scene_title: 'Scene Analysis',
      total_shots: 6,
      shots: Array.from({ length: 6 }, (_, i) => ({ shot_number: i + 1, type: 'Wide', movement: 'Pan' })),
    },
  });
});

app.post('/callsheet/generate', (req, res) => {
  res.json({
    success: true,
    data: { production_name: req.body.production_name || 'Untitled Production', call_time: '6:00 AM' },
  });
});

app.get('/equipment/inventory', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'eq_001', name: 'ARRI Alexa Mini LF', category: 'Camera', status: 'Available', daily_rate: '$1,200' },
      { id: 'eq_002', name: 'ARRI SkyPanel S60-C', category: 'Lighting', status: 'Available', daily_rate: '$150' },
      { id: 'eq_003', name: 'DJI Ronin 2', category: 'Stabilization', status: 'Available', daily_rate: '$250' },
    ],
  });
});

app.post('/equipment/book', (req, res) => {
  res.json({ success: true, data: { booking_id: `book_${Date.now()}`, status: 'Confirmed' } });
});

// ==============================================================================
// 4. START SERVER WITH WEBSOCKET UPGRADE SUPPORT
// ==============================================================================

server.listen(PORT, () => {
  console.log(`
╔═════════════════════════════════════════════════════════════════════╗
║  🎬 Arise Production - A Product of THE AI CONTENT FOUNDRY, LLC     ║
║                                                                     ║
║  ✅ REST API Server:   http://localhost:${PORT}                      ║
║  ✅ WebSocket Gateway: ws://localhost:${PORT}/ws                      ║
║  ✅ 10 MCP Workers:    /mcp/script ... /mcp/edit                     ║
║  ✅ File Watcher:      Active on ./storage/watch_folder             ║
║  ✅ Persistence:       Transactional Database Client Online          ║
║  ✅ Copyright:         © 2026 Arise Production                       ║
║                                                                     ║
║  Frontend Interface:   http://localhost:5002                        ║
╚═════════════════════════════════════════════════════════════════════╝
  `);
});
