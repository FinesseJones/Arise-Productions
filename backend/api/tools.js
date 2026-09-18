// ==============================================================================
// ARISE PRODUCTION - TOOLS API ENDPOINTS
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import express from 'express';
import { toolDetection } from '../services/tool-detection.js';
import { mcpHealthCheck } from '../services/mcp-health-check.js';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const router = express.Router();

/**
 * GET /api/tools/detect
 * Detect all available tools and return their status
 */
router.get('/detect', async (req, res) => {
  try {
    const tools = await toolDetection.detectAllTools();
    const wassermanApps = await toolDetection.detectWassermanApps();
    const platform = toolDetection.getPlatformInfo();

    res.json({
      tools,
      wassermanApps,
      platform,
    });
  } catch (err) {
    console.error('[Tools API] Detection error:', err);
    res.status(500).json({
      error: 'Failed to detect tools',
      message: err.message,
    });
  }
});

/**
 * POST /api/tools/launch
 * Launch a Wasserman app by name
 */
router.post('/launch', async (req, res) => {
  try {
    const { appName } = req.body;

    if (!appName) {
      return res.status(400).json({
        error: 'Missing required parameter: appName',
      });
    }

    const appPath = `/Applications/${appName}`;

    // Verify app exists
    const wassermanApps = await toolDetection.detectWassermanApps();
    const appStatus = wassermanApps[appName];

    if (!appStatus || !appStatus.found) {
      return res.status(404).json({
        error: 'App not found',
        message: `${appName} is not installed`,
      });
    }

    // Launch the app
    exec(`open "${appPath}"`, (err) => {
      if (err) {
        console.error(`[Tools API] Failed to launch ${appName}:`, err);
        return res.status(500).json({
          error: 'Failed to launch app',
          message: err.message,
        });
      }

      res.json({
        success: true,
        appName,
        message: `Launched ${appName}`,
      });
    });
  } catch (err) {
    console.error('[Tools API] Launch error:', err);
    res.status(500).json({
      error: 'Failed to launch app',
      message: err.message,
    });
  }
});

/**
 * GET /api/tools/status
 * Get platform and tool detection status summary
 */
router.get('/status', async (req, res) => {
  try {
    const platform = toolDetection.getPlatformInfo();
    const toolStatus = await toolDetection.detectAllTools();

    const summary = {
      platform,
      totalTools: Object.keys(toolStatus).length,
      foundTools: Object.values(toolStatus).filter(t => t.found).length,
      missingTools: Object.values(toolStatus).filter(t => !t.found).length,
      tools: toolStatus,
    };

    res.json(summary);
  } catch (err) {
    console.error('[Tools API] Status error:', err);
    res.status(500).json({
      error: 'Failed to get status',
      message: err.message,
    });
  }
});

/**
 * GET /api/tools/mcp/health
 * Check health of all MCP servers
 */
router.get('/mcp/health', async (req, res) => {
  try {
    const mcpConfigPath = path.join(process.cwd(), '.mcp.json');
    if (!fs.existsSync(mcpConfigPath)) {
      return res.status(404).json({
        error: 'MCP config not found',
        message: '.mcp.json file does not exist',
      });
    }

    const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf-8'));
    const healthResults = await mcpHealthCheck.checkAllServers(mcpConfig);

    res.json({
      success: true,
      servers: healthResults,
      summary: {
        total: Object.keys(healthResults).length,
        healthy: Object.values(healthResults).filter(s => s.status === 'healthy').length,
        unhealthy: Object.values(healthResults).filter(s => s.status === 'unhealthy').length,
        missing: Object.values(healthResults).filter(s => s.status === 'missing').length,
      },
    });
  } catch (err) {
    console.error('[Tools API] MCP health check error:', err);
    res.status(500).json({
      error: 'Failed to check MCP health',
      message: err.message,
    });
  }
});

/**
 * GET /api/tools/mcp/health/:serverName
 * Check health of a specific MCP server
 */
router.get('/mcp/health/:serverName', async (req, res) => {
  try {
    const { serverName } = req.params;
    const mcpConfigPath = path.join(process.cwd(), '.mcp.json');
    
    if (!fs.existsSync(mcpConfigPath)) {
      return res.status(404).json({
        error: 'MCP config not found',
        message: '.mcp.json file does not exist',
      });
    }

    const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf-8'));
    const serverConfig = mcpConfig.mcpServers[serverName];

    if (!serverConfig) {
      return res.status(404).json({
        error: 'Server not found',
        message: `MCP server "${serverName}" not found in configuration`,
      });
    }

    const health = await mcpHealthCheck.checkServerHealth(serverName, serverConfig);
    res.json({ success: true, serverName, health });
  } catch (err) {
    console.error('[Tools API] MCP server health check error:', err);
    res.status(500).json({
      error: 'Failed to check MCP server health',
      message: err.message,
    });
  }
});

export default router;
