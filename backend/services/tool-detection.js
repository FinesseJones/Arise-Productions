// ==============================================================================
// ARISE PRODUCTION - TOOL DETECTION SERVICE
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Tool detection service with configurable fallback hierarchy
 * Priority: User config > Environment variable > Platform defaults > PATH
 */
export class ToolDetectionService {
  constructor() {
    this.platform = os.platform();
    this.userConfigPath = path.join(os.homedir(), '.arise', 'config.json');
    this.detectedTools = new Map();
    this.toolConfig = this._loadToolConfig();
  }

  _loadToolConfig() {
    // Load user config if exists
    if (fs.existsSync(this.userConfigPath)) {
      try {
        const userConfig = JSON.parse(fs.readFileSync(this.userConfigPath, 'utf-8'));
        return userConfig.tools || {};
      } catch (err) {
        console.warn(`[ToolDetection] Failed to load user config: ${err.message}`);
      }
    }
    return {};
  }

  /**
   * Platform-specific default paths for tools
   */
  getToolDefaults(toolName) {
    const defaults = {
      unrealEngine: {
        darwin: [
          '/Volumes/FinesseJones1 External 1/Director Finesse Jones/Film Making/UnrealEditor.app',
          '/Applications/Film Making/UnrealEditor.app',
          '~/UnrealEngine/UE_5.5/Engine/Binaries/Mac/UnrealEditor',
          '/Applications/UnrealEditor.app'
        ],
        win32: [
          'C:/Program Files/Epic Games/UE_5.5/Engine/Binaries/Win64/UnrealEditor.exe',
          'C:/UnrealEngine/UE_5.5/Engine/Binaries/Win64/UnrealEditor.exe',
          'C:/Program Files/Epic Games/UE_5.4/Engine/Binaries/Win64/UnrealEditor.exe'
        ],
        linux: [
          '~/UnrealEngine/UE_5.5/Engine/Binaries/Linux/UnrealEditor',
          '/opt/unreal-engine/UE_5.5/Engine/Binaries/Linux/UnrealEditor'
        ],
        android: null,
        ios: null
      },
      ffmpeg: {
        darwin: ['/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg', '/usr/bin/ffmpeg'],
        win32: ['ffmpeg.exe', 'C:/ffmpeg/bin/ffmpeg.exe'],
        linux: ['/usr/bin/ffmpeg', '/usr/local/bin/ffmpeg'],
        android: null,
        ios: null
      },
      ffprobe: {
        darwin: ['/opt/homebrew/bin/ffprobe', '/usr/local/bin/ffprobe', '/usr/bin/ffprobe'],
        win32: ['ffprobe.exe', 'C:/ffmpeg/bin/ffprobe.exe'],
        linux: ['/usr/bin/ffprobe', '/usr/local/bin/ffprobe'],
        android: null,
        ios: null
      },
      remotion: {
        darwin: ['remotion', 'npx remotion', './node_modules/.bin/remotion'],
        win32: ['remotion.cmd', 'npx remotion', './node_modules/.bin/remotion.cmd'],
        linux: ['remotion', 'npx remotion', './node_modules/.bin/remotion'],
        android: null,
        ios: null
      },
      comfyMCP: {
        darwin: ['/Users/finessejones1/dyad-apps/unified-3-d-production-studio/backend/comfy-mcp-env/bin/comfy-mcp'],
        win32: null,
        linux: null,
        android: null,
        ios: null
      },
      openmontageMCP: {
        darwin: ['/Users/finessejones1/OpenMontage/.venv/bin/python'],
        win32: null,
        linux: null,
        android: null,
        ios: null
      },
      hyperframes: {
        darwin: ['/Users/finessejones1/.hyperframes'],
        win32: null,
        linux: null,
        android: null,
        ios: null
      },
      davinciResolve: {
        darwin: ['/Applications/DaVinci Resolve.app', '/Applications/DaVinci Resolve Studio.app'],
        win32: ['C:/Program Files/Blackmagic Design/DaVinci Resolve/Resolve.exe'],
        linux: null,
        android: null,
        ios: null
      }
    };

    return defaults[toolName]?.[this.platform] || [];
  }

  /**
   * Get environment variable name for a tool
   */
  getEnvVarName(toolName) {
    const envVars = {
      unrealEngine: 'ARISE_UNREAL_PATH',
      ffmpeg: 'ARISE_FFMPEG_PATH',
      ffprobe: 'ARISE_FFPROBE_PATH',
      remotion: 'ARISE_REMOTION_PATH',
      comfyMCP: 'ARISE_COMFY_MCP_PATH',
      openmontageMCP: 'ARISE_OPENMONTAGE_MCP_PATH',
      hyperframes: 'ARISE_HYPERFRAMES_PATH',
      davinciResolve: 'ARISE_DAVINCI_PATH'
    };
    return envVars[toolName];
  }

  /**
   * Expand tilde (~) in paths to home directory
   */
  expandPath(filePath) {
    if (filePath && filePath.startsWith('~')) {
      return path.join(os.homedir(), filePath.slice(1));
    }
    return filePath;
  }

  /**
   * Check if a path exists and is accessible
   */
  async pathExists(filePath) {
    if (!filePath) return false;
    const expandedPath = this.expandPath(filePath);
    try {
      return fs.existsSync(expandedPath);
    } catch (err) {
      return false;
    }
  }

  /**
   * Check if a command is available in PATH
   */
  async inPath(command) {
    return new Promise((resolve) => {
      exec(`which ${command}`, (err) => {
        resolve(!err);
      });
    });
  }

  /**
   * Check if a local node_modules binary exists
   */
  async inNodeModules(command) {
    const localBinPath = path.join(process.cwd(), 'node_modules', '.bin', command);
    return fs.existsSync(localBinPath);
  }

  /**
   * Detect a tool with fallback hierarchy
   * Priority: User config > Environment variable > Platform defaults > PATH
   */
  async detectTool(toolName, options = {}) {
    const { required = false, silent = false } = options;

    // Check cache first
    if (this.detectedTools.has(toolName)) {
      return this.detectedTools.get(toolName);
    }

    // 1. Check user config
    const userConfigPath = this.toolConfig[toolName];
    if (userConfigPath && await this.pathExists(userConfigPath)) {
      const expandedPath = this.expandPath(userConfigPath);
      const result = { found: true, path: expandedPath, source: 'user-config' };
      this.detectedTools.set(toolName, result);
      if (!silent) console.log(`[ToolDetection] ${toolName}: found via user config at ${expandedPath}`);
      return result;
    }

    // 2. Check environment variable
    const envVarName = this.getEnvVarName(toolName);
    const envPath = process.env[envVarName];
    if (envPath && await this.pathExists(envPath)) {
      const expandedPath = this.expandPath(envPath);
      const result = { found: true, path: expandedPath, source: 'environment-variable' };
      this.detectedTools.set(toolName, result);
      if (!silent) console.log(`[ToolDetection] ${toolName}: found via ${envVarName} at ${expandedPath}`);
      return result;
    }

    // 3. Check platform defaults
    const defaults = this.getToolDefaults(toolName);
    for (const defaultPath of defaults) {
      if (defaultPath && await this.pathExists(defaultPath)) {
        const expandedPath = this.expandPath(defaultPath);
        const result = { found: true, path: expandedPath, source: 'platform-default' };
        this.detectedTools.set(toolName, result);
        if (!silent) console.log(`[ToolDetection] ${toolName}: found via platform default at ${expandedPath}`);
        return result;
      }
    }

    // 4. Check PATH (for CLI tools)
    if (await this.inPath(toolName)) {
      const result = { found: true, path: toolName, source: 'PATH' };
      this.detectedTools.set(toolName, result);
      if (!silent) console.log(`[ToolDetection] ${toolName}: found in PATH`);
      return result;
    }

    // 5. Check local node_modules (for project-local CLI tools)
    if (await this.inNodeModules(toolName)) {
      const localBinPath = path.join(process.cwd(), 'node_modules', '.bin', toolName);
      const result = { found: true, path: localBinPath, source: 'local-node-modules' };
      this.detectedTools.set(toolName, result);
      if (!silent) console.log(`[ToolDetection] ${toolName}: found in local node_modules`);
      return result;
    }

    // Tool not found
    const result = { found: false, path: null, source: 'not-found' };
    this.detectedTools.set(toolName, result);

    if (required) {
      throw new Error(
        `${toolName} not found. Please configure via:\n` +
        `  1. User config: ${this.userConfigPath}\n` +
        `  2. Environment variable: ${envVarName}\n` +
        `  3. Platform default location`
      );
    }

    if (!silent) console.warn(`[ToolDetection] ${toolName}: not found`);
    return result;
  }

  /**
   * Detect all tools at once
   */
  async detectAllTools(tools = null) {
    const toolsToDetect = tools || [
      'unrealEngine',
      'ffmpeg',
      'ffprobe',
      'remotion',
      'comfyMCP',
      'openmontageMCP',
      'hyperframes',
      'davinciResolve'
    ];

    const results = {};
    for (const tool of toolsToDetect) {
      try {
        results[tool] = await this.detectTool(tool, { silent: true });
      } catch (err) {
        results[tool] = { found: false, error: err.message };
      }
    }

    return results;
  }

  /**
   * Detect Wasserman apps
   */
  async detectWassermanApps() {
    const wassermanApps = [
      'ScriptBreak.app',
      'Cork Board.app',
      'Master Canvas.app',
      'Blockout.app',
      'Motion Previs Studio.app',
      'Storyboard Reference Studio.app',
      'Circle Take.app',
      'Stem Studio.app',
      'Slate.app',
      'Call Sheet.app'
    ];

    const results = {};
    for (const app of wassermanApps) {
      const appPath = path.join('/Applications', app);
      results[app] = {
        found: fs.existsSync(appPath),
        path: fs.existsSync(appPath) ? appPath : null
      };
    }

    return results;
  }

  /**
   * Get platform info
   */
  getPlatformInfo() {
    return {
      platform: this.platform,
      arch: os.arch(),
      isDesktop: ['darwin', 'win32', 'linux'].includes(this.platform),
      isMobile: ['android', 'ios'].includes(this.platform),
      supportsLocalTools: ['darwin', 'win32', 'linux'].includes(this.platform)
    };
  }

  /**
   * Clear detection cache
   */
  clearCache() {
    this.detectedTools.clear();
  }
}

export const toolDetection = new ToolDetectionService();
export default toolDetection;
