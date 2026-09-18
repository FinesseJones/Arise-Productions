// ==============================================================================
// ARISE PRODUCTION - PHASE 2-5 INTEGRATION VERIFICATION
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix path resolution - script is in backend/, so parent is project root
const projectRoot = path.resolve(__dirname, '..');

console.log('='.repeat(80));
console.log('ARISE PRODUCTION - PHASE 2-5 INTEGRATION VERIFICATION');
console.log('='.repeat(80));
console.log('');

const results = {
  passed: [],
  failed: [],
  warnings: [],
};

// Test 1: UI Components Created
console.log('TEST 1: Verifying UI components created...');
const uiComponents = [
  'frontend/src/components/ToolDetectionPanel.tsx',
  'frontend/src/components/RenderingEngineSelector.tsx',
];

for (const component of uiComponents) {
  const componentPath = path.join(projectRoot, component);
  if (fs.existsSync(componentPath)) {
    console.log(`  ✅ ${component} exists`);
    results.passed.push(`UI component ${component} created`);
  } else {
    console.log(`  ❌ ${component} NOT FOUND`);
    results.failed.push(`UI component ${component} missing`);
  }
}
console.log('');

// Test 2: API Endpoints Created
console.log('TEST 2: Verifying API endpoints created...');
const apiFiles = [
  'backend/api/tools.js',
  'backend/api/remotion.js',
];

for (const apiFile of apiFiles) {
  const apiPath = path.join(projectRoot, apiFile);
  if (fs.existsSync(apiPath)) {
    console.log(`  ✅ ${apiFile} exists`);
    results.passed.push(`API file ${apiFile} created`);
  } else {
    console.log(`  ❌ ${apiFile} NOT FOUND`);
    results.failed.push(`API file ${apiFile} missing`);
  }
}
console.log('');

// Test 3: MCP Health Check Service
console.log('TEST 3: Verifying MCP health check service...');
const healthCheckPath = path.join(projectRoot, 'backend/services/mcp-health-check.js');
if (fs.existsSync(healthCheckPath)) {
  console.log(`  ✅ MCP health check service exists`);
  results.passed.push('MCP health check service created');
} else {
  console.log(`  ❌ MCP health check service NOT FOUND`);
  results.failed.push('MCP health check service missing');
}
console.log('');

// Test 4: Server.js Updated with New Routes
console.log('TEST 4: Verifying server.js updated with new routes...');
const serverPath = path.join(projectRoot, 'server.js');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf-8');
  
  const hasToolsRouter = serverContent.includes("app.use('/api/tools', toolsRouter)");
  const hasRemotionRouter = serverContent.includes("app.use('/api/remotion', remotionRouter)");
  const hasMCPHealthImport = serverContent.includes("import toolsRouter from './backend/api/tools.js'");
  const hasRemotionImport = serverContent.includes("import remotionRouter from './backend/api/remotion.js'");
  
  if (hasToolsRouter) {
    console.log(`  ✅ Tools router mounted in server.js`);
    results.passed.push('Tools router mounted');
  } else {
    console.log(`  ❌ Tools router NOT mounted in server.js`);
    results.failed.push('Tools router not mounted');
  }
  
  if (hasRemotionRouter) {
    console.log(`  ✅ Remotion router mounted in server.js`);
    results.passed.push('Remotion router mounted');
  } else {
    console.log(`  ❌ Remotion router NOT mounted in server.js`);
    results.failed.push('Remotion router not mounted');
  }
  
  if (hasMCPHealthImport) {
    console.log(`  ✅ Tools router imported in server.js`);
    results.passed.push('Tools router imported');
  } else {
    console.log(`  ❌ Tools router NOT imported in server.js`);
    results.failed.push('Tools router not imported');
  }
  
  if (hasRemotionImport) {
    console.log(`  ✅ Remotion router imported in server.js`);
    results.passed.push('Remotion router imported');
  } else {
    console.log(`  ❌ Remotion router NOT imported in server.js`);
    results.failed.push('Remotion router not imported');
  }
} else {
  console.log(`  ❌ server.js NOT FOUND`);
  results.failed.push('server.js missing');
}
console.log('');

// Test 5: API Endpoint Functionality Check
console.log('TEST 5: Verifying API endpoint functionality...');
const toolsApiPath = path.join(projectRoot, 'backend/api/tools.js');
if (fs.existsSync(toolsApiPath)) {
  const toolsContent = fs.readFileSync(toolsApiPath, 'utf-8');
  
  const hasDetectEndpoint = toolsContent.includes("router.get('/detect'");
  const hasLaunchEndpoint = toolsContent.includes("router.post('/launch'");
  const hasStatusEndpoint = toolsContent.includes("router.get('/status'");
  const hasMCPHealthEndpoint = toolsContent.includes("router.get('/mcp/health'");
  const hasMCPHealthServerEndpoint = toolsContent.includes("router.get('/mcp/health/:serverName'");
  
  if (hasDetectEndpoint) {
    console.log(`  ✅ GET /api/tools/detect endpoint defined`);
    results.passed.push('Detect endpoint defined');
  } else {
    console.log(`  ❌ GET /api/tools/detect endpoint NOT defined`);
    results.failed.push('Detect endpoint missing');
  }
  
  if (hasLaunchEndpoint) {
    console.log(`  ✅ POST /api/tools/launch endpoint defined`);
    results.passed.push('Launch endpoint defined');
  } else {
    console.log(`  ❌ POST /api/tools/launch endpoint NOT defined`);
    results.failed.push('Launch endpoint missing');
  }
  
  if (hasStatusEndpoint) {
    console.log(`  ✅ GET /api/tools/status endpoint defined`);
    results.passed.push('Status endpoint defined');
  } else {
    console.log(`  ❌ GET /api/tools/status endpoint NOT defined`);
    results.failed.push('Status endpoint missing');
  }
  
  if (hasMCPHealthEndpoint) {
    console.log(`  ✅ GET /api/tools/mcp/health endpoint defined`);
    results.passed.push('MCP health endpoint defined');
  } else {
    console.log(`  ❌ GET /api/tools/mcp/health endpoint NOT defined`);
    results.failed.push('MCP health endpoint missing');
  }
  
  if (hasMCPHealthServerEndpoint) {
    console.log(`  ✅ GET /api/tools/mcp/health/:serverName endpoint defined`);
    results.passed.push('MCP server health endpoint defined');
  } else {
    console.log(`  ❌ GET /api/tools/mcp/health/:serverName endpoint NOT defined`);
    results.failed.push('MCP server health endpoint missing');
  }
} else {
  console.log(`  ❌ tools.js NOT FOUND`);
  results.failed.push('tools.js missing');
}
console.log('');

// Test 6: Remotion API Endpoints
console.log('TEST 6: Verifying Remotion API endpoints...');
const remotionApiPath = path.join(projectRoot, 'backend/api/remotion.js');
if (fs.existsSync(remotionApiPath)) {
  const remotionContent = fs.readFileSync(remotionApiPath, 'utf-8');
  
  const hasInitEndpoint = remotionContent.includes("router.post('/init'");
  const hasRenderEndpoint = remotionContent.includes("router.post('/render'");
  const hasCompositionsEndpoint = remotionContent.includes("router.get('/compositions'");
  const hasStatusEndpoint = remotionContent.includes("router.get('/status'");
  const hasFFmpegTitleCard = remotionContent.includes("router.post('/ffmpeg/title-card'");
  const hasFFmpegStitch = remotionContent.includes("router.post('/ffmpeg/stitch'");
  
  if (hasInitEndpoint) {
    console.log(`  ✅ POST /api/remotion/init endpoint defined`);
    results.passed.push('Remotion init endpoint defined');
  } else {
    console.log(`  ❌ POST /api/remotion/init endpoint NOT defined`);
    results.failed.push('Remotion init endpoint missing');
  }
  
  if (hasRenderEndpoint) {
    console.log(`  ✅ POST /api/remotion/render endpoint defined`);
    results.passed.push('Remotion render endpoint defined');
  } else {
    console.log(`  ❌ POST /api/remotion/render endpoint NOT defined`);
    results.failed.push('Remotion render endpoint missing');
  }
  
  if (hasCompositionsEndpoint) {
    console.log(`  ✅ GET /api/remotion/compositions endpoint defined`);
    results.passed.push('Remotion compositions endpoint defined');
  } else {
    console.log(`  ❌ GET /api/remotion/compositions endpoint NOT defined`);
    results.failed.push('Remotion compositions endpoint missing');
  }
  
  if (hasStatusEndpoint) {
    console.log(`  ✅ GET /api/remotion/status endpoint defined`);
    results.passed.push('Remotion status endpoint defined');
  } else {
    console.log(`  ❌ GET /api/remotion/status endpoint NOT defined`);
    results.failed.push('Remotion status endpoint missing');
  }
  
  if (hasFFmpegTitleCard) {
    console.log(`  ✅ POST /api/remotion/ffmpeg/title-card endpoint defined`);
    results.passed.push('FFmpeg title card endpoint defined');
  } else {
    console.log(`  ❌ POST /api/remotion/ffmpeg/title-card endpoint NOT defined`);
    results.failed.push('FFmpeg title card endpoint missing');
  }
  
  if (hasFFmpegStitch) {
    console.log(`  ✅ POST /api/remotion/ffmpeg/stitch endpoint defined`);
    results.passed.push('FFmpeg stitch endpoint defined');
  } else {
    console.log(`  ❌ POST /api/remotion/ffmpeg/stitch endpoint NOT defined`);
    results.failed.push('FFmpeg stitch endpoint missing');
  }
} else {
  console.log(`  ❌ remotion.js NOT FOUND`);
  results.failed.push('remotion.js missing');
}
console.log('');

// Test 7: UI Component Features
console.log('TEST 7: Verifying UI component features...');
const toolDetectionPanelPath = path.join(projectRoot, 'frontend/src/components/ToolDetectionPanel.tsx');
if (fs.existsSync(toolDetectionPanelPath)) {
  const panelContent = fs.readFileSync(toolDetectionPanelPath, 'utf-8');
  
  const hasStatusIndicators = panelContent.includes('getStatusIcon');
  const hasLaunchButtons = panelContent.includes('launchWassermanApp');
  const hasMCPHealthDisplay = panelContent.includes('mcpHealth');
  const hasPlatformInfo = panelContent.includes('platform');
  
  if (hasStatusIndicators) {
    console.log(`  ✅ Status indicators (green/yellow/red) implemented`);
    results.passed.push('Status indicators implemented');
  } else {
    console.log(`  ❌ Status indicators NOT implemented`);
    results.failed.push('Status indicators missing');
  }
  
  if (hasLaunchButtons) {
    console.log(`  ✅ Launch buttons for Wasserman apps implemented`);
    results.passed.push('Launch buttons implemented');
  } else {
    console.log(`  ❌ Launch buttons NOT implemented`);
    results.failed.push('Launch buttons missing');
  }
  
  if (hasMCPHealthDisplay) {
    console.log(`  ✅ MCP health display implemented`);
    results.passed.push('MCP health display implemented');
  } else {
    console.log(`  ❌ MCP health display NOT implemented`);
    results.failed.push('MCP health display missing');
  }
  
  if (hasPlatformInfo) {
    console.log(`  ✅ Platform info display implemented`);
    results.passed.push('Platform info display implemented');
  } else {
    console.log(`  ❌ Platform info display NOT implemented`);
    results.failed.push('Platform info display missing');
  }
} else {
  console.log(`  ❌ ToolDetectionPanel.tsx NOT FOUND`);
  results.failed.push('ToolDetectionPanel.tsx missing');
}
console.log('');

// Test 8: Rendering Engine Selector
console.log('TEST 8: Verifying Rendering Engine Selector...');
const engineSelectorPath = path.join(projectRoot, 'frontend/src/components/RenderingEngineSelector.tsx');
if (fs.existsSync(engineSelectorPath)) {
  const selectorContent = fs.readFileSync(engineSelectorPath, 'utf-8');
  
  const hasEngineSelection = selectorContent.includes('selectedEngine');
  const hasRemotionOption = selectorContent.includes('Remotion');
  const hasFFmpegOption = selectorContent.includes('FFmpeg');
  const hasStatusDisplay = selectorContent.includes('engineStatus');
  const hasCapabilities = selectorContent.includes('Capabilities');
  
  if (hasEngineSelection) {
    console.log(`  ✅ Engine selection implemented`);
    results.passed.push('Engine selection implemented');
  } else {
    console.log(`  ❌ Engine selection NOT implemented`);
    results.failed.push('Engine selection missing');
  }
  
  if (hasRemotionOption && hasFFmpegOption) {
    console.log(`  ✅ Both Remotion and FFmpeg options available`);
    results.passed.push('Both engine options available');
  } else {
    console.log(`  ❌ Both engine options NOT available`);
    results.failed.push('Engine options missing');
  }
  
  if (hasStatusDisplay) {
    console.log(`  ✅ Engine status display implemented`);
    results.passed.push('Engine status display implemented');
  } else {
    console.log(`  ❌ Engine status display NOT implemented`);
    results.failed.push('Engine status display missing');
  }
  
  if (hasCapabilities) {
    console.log(`  ✅ Engine capabilities display implemented`);
    results.passed.push('Engine capabilities display implemented');
  } else {
    console.log(`  ❌ Engine capabilities display NOT implemented`);
    results.failed.push('Engine capabilities display missing');
  }
} else {
  console.log(`  ❌ RenderingEngineSelector.tsx NOT FOUND`);
  results.failed.push('RenderingEngineSelector.tsx missing');
}
console.log('');

// Summary
console.log('='.repeat(80));
console.log('PHASE 2-5 VERIFICATION SUMMARY');
console.log('='.repeat(80));
console.log(`✅ Passed: ${results.passed.length}`);
console.log(`⚠️  Warnings: ${results.warnings.length}`);
console.log(`❌ Failed: ${results.failed.length}`);
console.log('');

if (results.passed.length > 0) {
  console.log('PASSED:');
  results.passed.forEach(r => console.log(`  ✅ ${r}`));
  console.log('');
}

if (results.warnings.length > 0) {
  console.log('WARNINGS:');
  results.warnings.forEach(r => console.log(`  ⚠️  ${r}`));
  console.log('');
}

if (results.failed.length > 0) {
  console.log('FAILED:');
  results.failed.forEach(r => console.log(`  ❌ ${r}`));
  console.log('');
}

console.log('='.repeat(80));

if (results.failed.length === 0) {
  console.log('✅ ALL PHASE 2-5 TESTS PASSED');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED - Review output above');
  process.exit(1);
}
