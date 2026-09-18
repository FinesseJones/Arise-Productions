// ==============================================================================
// ARISE PRODUCTION - MCP SERVER HEALTH CHECK SERVICE
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * MCP Server Health Check Service
 * Verifies MCP servers are running and responsive
 */
export class MCPHealthCheckService {
  constructor() {
    this.serverStatus = new Map();
    this.checkInterval = 30000; // 30 seconds
    this.checkTimer = null;
  }

  /**
   * Check if a binary exists and is executable
   */
  async checkBinaryExists(binaryPath) {
    try {
      return fs.existsSync(binaryPath);
    } catch (err) {
      return false;
    }
  }

  /**
   * Check if a script file exists
   */
  async checkScriptExists(scriptPath) {
    try {
      const fullPath = path.join(__dirname, scriptPath);
      return fs.existsSync(fullPath);
    } catch (err) {
      return false;
    }
  }

  /**
   * Attempt to start an MCP server and check if it responds
   */
  async checkServerResponsive(serverConfig, timeout = 5000) {
    const { command, args = [], env = {} } = serverConfig;

    return new Promise((resolve) => {
      let serverProcess;
      let output = '';
      let responded = false;

      const timer = setTimeout(() => {
        if (serverProcess) {
          serverProcess.kill();
        }
        if (!responded) {
          resolve({
            responsive: false,
            error: 'Timeout - server did not respond within timeout',
            output: output.slice(0, 500),
          });
        }
      }, timeout);

      try {
        serverProcess = spawn(command, args, {
          env: { ...process.env, ...env },
          stdio: ['ignore', 'pipe', 'pipe'],
        });

        serverProcess.stdout.on('data', (data) => {
          output += data.toString();
          // Look for MCP initialization patterns
          if (output.includes('MCP') || output.includes('server') || output.includes('initialized')) {
            responded = true;
            clearTimeout(timer);
            serverProcess.kill();
            resolve({
              responsive: true,
              output: output.slice(0, 500),
            });
          }
        });

        serverProcess.stderr.on('data', (data) => {
          output += data.toString();
        });

        serverProcess.on('error', (err) => {
          clearTimeout(timer);
          resolve({
            responsive: false,
            error: err.message,
            output: output.slice(0, 500),
          });
        });

        serverProcess.on('exit', (code, signal) => {
          clearTimeout(timer);
          if (!responded) {
            resolve({
              responsive: false,
              error: `Server exited with code ${code} (signal: ${signal})`,
              output: output.slice(0, 500),
            });
          }
        });
      } catch (err) {
        clearTimeout(timer);
        resolve({
          responsive: false,
          error: err.message,
        });
      }
    });
  }

  /**
   * Check health of a single MCP server
   */
  async checkServerHealth(serverName, serverConfig) {
    const startTime = Date.now();

    // Check binary/script exists
    const binaryExists = await this.checkBinaryExists(serverConfig.command);
    if (!binaryExists) {
      // If command is a system command (like "node"), check the script
      if (serverConfig.args && serverConfig.args.length > 0) {
        const scriptExists = await this.checkScriptExists(serverConfig.args[0]);
        if (!scriptExists) {
          return {
            serverName,
            status: 'missing',
            binaryExists: false,
            scriptExists: false,
            responsive: false,
            error: 'Binary and script not found',
            checkTime: Date.now() - startTime,
          };
        }
      } else {
        return {
          serverName,
          status: 'missing',
          binaryExists: false,
          responsive: false,
          error: 'Binary not found',
          checkTime: Date.now() - startTime,
        };
      }
    }

    // Try to check if server is responsive
    const responsiveCheck = await this.checkServerResponsive(serverConfig);

    return {
      serverName,
      status: responsiveCheck.responsive ? 'healthy' : 'unhealthy',
      binaryExists: true,
      responsive: responsiveCheck.responsive,
      error: responsiveCheck.error,
      output: responsiveCheck.output,
      checkTime: Date.now() - startTime,
    };
  }

  /**
   * Check health of all configured MCP servers
   */
  async checkAllServers(mcpConfig) {
    const results = {};
    const servers = mcpConfig.mcpServers || {};

    for (const [serverName, serverConfig] of Object.entries(servers)) {
      try {
        const health = await this.checkServerHealth(serverName, serverConfig);
        results[serverName] = health;
        this.serverStatus.set(serverName, health);
      } catch (err) {
        results[serverName] = {
          serverName,
          status: 'error',
          error: err.message,
          checkTime: Date.now() - Date.now(),
        };
      }
    }

    return results;
  }

  /**
   * Start periodic health checks
   */
  startPeriodicChecks(mcpConfig, callback) {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
    }

    const checkAndNotify = async () => {
      const results = await this.checkAllServers(mcpConfig);
      if (callback) {
        callback(results);
      }
    };

    // Initial check
    checkAndNotify();

    // Periodic checks
    this.checkTimer = setInterval(checkAndNotify, this.checkInterval);
  }

  /**
   * Stop periodic health checks
   */
  stopPeriodicChecks() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
  }

  /**
   * Get cached server status
   */
  getServerStatus(serverName) {
    return this.serverStatus.get(serverName);
  }

  /**
   * Get all cached server statuses
   */
  getAllServerStatuses() {
    return Object.fromEntries(this.serverStatus);
  }
}

export const mcpHealthCheck = new MCPHealthCheckService();
export default mcpHealthCheck;
