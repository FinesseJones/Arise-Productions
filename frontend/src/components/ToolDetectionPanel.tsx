"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, ExternalLink, Settings, Smartphone, Monitor } from 'lucide-react';
import { getAPIBaseURL } from '../lib/api';
import toast from 'react-hot-toast';

interface ToolStatus {
  found: boolean;
  path: string | null;
  source: string;
  error?: string;
}

interface DetectionResults {
  unrealEngine: ToolStatus;
  ffmpeg: ToolStatus;
  ffprobe: ToolStatus;
  remotion: ToolStatus;
  comfyMCP: ToolStatus;
  openmontageMCP: ToolStatus;
  hyperframes: ToolStatus;
  davinciResolve: ToolStatus;
}

interface WassermanAppStatus {
  found: boolean;
  path: string | null;
}

interface WassermanApps {
  'ScriptBreak.app': WassermanAppStatus;
  'Cork Board.app': WassermanAppStatus;
  'Master Canvas.app': WassermanAppStatus;
  'Blockout.app': WassermanAppStatus;
  'Motion Previs Studio.app': WassermanAppStatus;
  'Storyboard Reference Studio.app': WassermanAppStatus;
  'Circle Take.app': WassermanAppStatus;
  'Stem Studio.app': WassermanAppStatus;
  'Slate.app': WassermanAppStatus;
  'Call Sheet.app': WassermanAppStatus;
}

interface PlatformInfo {
  platform: string;
  isDesktop: boolean;
  isMobile: boolean;
  supportsLocalTools: boolean;
}

interface DetectionResponse {
  tools: DetectionResults;
  wassermanApps: WassermanApps;
  platform: PlatformInfo;
}

interface MCPServerHealth {
  serverName: string;
  status: 'healthy' | 'unhealthy' | 'missing' | 'error';
  binaryExists: boolean;
  responsive: boolean;
  error?: string;
  output?: string;
  checkTime: number;
}

interface MCPHealthResponse {
  success: boolean;
  servers: Record<string, MCPServerHealth>;
  summary: {
    total: number;
    healthy: number;
    unhealthy: number;
    missing: number;
  };
}

export const ToolDetectionPanel: React.FC = () => {
  const [detectionResults, setDetectionResults] = useState<DetectionResponse | null>(null);
  const [mcpHealth, setMcpHealth] = useState<MCPHealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [mcpLoading, setMcpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectTools = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${getAPIBaseURL()}/api/tools/detect`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setDetectionResults(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to detect tools';
      // Check if it's a connection error (backend not running)
      if (errorMsg.includes('fetch') || errorMsg.includes('ECONNREFUSED') || errorMsg.includes('Failed to fetch')) {
        setError('Backend server not running. Please restart the application.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkMCPHealth = async () => {
    setMcpLoading(true);
    try {
      const response = await fetch(`${getAPIBaseURL()}/api/tools/mcp/health`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setMcpHealth(data);
    } catch (err) {
      console.error('MCP health check failed:', err);
    } finally {
      setMcpLoading(false);
    }
  };

  useEffect(() => {
    detectTools();
    checkMCPHealth();
  }, []);

  const launchWassermanApp = async (appName: string) => {
    try {
      const response = await fetch(`${getAPIBaseURL()}/api/tools/launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName }),
      });
      if (!response.ok) {
        throw new Error(`Failed to launch ${appName}`);
      }
      const result = await response.json();
      if (result.success) {
        toast.success(`Launched ${appName}`);
      } else {
        throw new Error(result.error || 'Launch failed');
      }
    } catch (err) {
      toast.error(`Failed to launch ${appName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const getStatusIcon = (status: ToolStatus | WassermanAppStatus) => {
    if (status.found) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (found: boolean) => {
    return found ? 'text-green-500' : 'text-red-500';
  };

  const toolLabels: Record<keyof DetectionResults, string> = {
    unrealEngine: 'Unreal Engine',
    ffmpeg: 'FFmpeg',
    ffprobe: 'FFprobe',
    remotion: 'Remotion',
    comfyMCP: 'ComfyUI MCP',
    openmontageMCP: 'OpenMontage MCP',
    hyperframes: 'Hyperframes',
    davinciResolve: 'DaVinci Resolve',
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-yellow-500" />
          <span className="text-gray-300">Detecting tools...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 rounded-lg border border-red-700">
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-300">Error: {error}</span>
          <button
            onClick={detectTools}
            className="ml-auto px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-white text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!detectionResults) {
    return null;
  }

  const { tools, wassermanApps, platform } = detectionResults;

  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          {platform.isDesktop ? (
            <Monitor className="w-5 h-5 text-blue-400" />
          ) : (
            <Smartphone className="w-5 h-5 text-purple-400" />
          )}
          <h3 className="text-lg font-semibold text-white">Platform</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-400">Platform:</div>
          <div className="text-white">{platform.platform}</div>
          <div className="text-gray-400">Mode:</div>
          <div className="text-white">
            {platform.isDesktop ? 'Desktop (Full Tool Access)' : 'Mobile (Companion Mode)'}
          </div>
          <div className="text-gray-400">Local Tools:</div>
          <div className={platform.supportsLocalTools ? 'text-green-400' : 'text-yellow-400'}>
            {platform.supportsLocalTools ? 'Supported' : 'Limited'}
          </div>
        </div>
      </div>

      {/* Core Tools */}
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Core Tools</h3>
          </div>
          <button
            onClick={detectTools}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Refresh detection"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="space-y-3">
          {Object.entries(tools).map(([key, status]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(status)}
                <span className="text-gray-300">{toolLabels[key as keyof DetectionResults]}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {status.path && (
                  <span className="text-gray-500 truncate max-w-xs" title={status.path}>
                    {status.path}
                  </span>
                )}
                <span className={`text-xs px-2 py-1 rounded ${
                  status.source === 'user-config' ? 'bg-blue-900/50 text-blue-300' :
                  status.source === 'environment-variable' ? 'bg-purple-900/50 text-purple-300' :
                  status.source === 'platform-default' ? 'bg-green-900/50 text-green-300' :
                  status.source === 'PATH' ? 'bg-yellow-900/50 text-yellow-300' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {status.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MCP Server Health */}
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">MCP Server Health</h3>
          </div>
          <button
            onClick={checkMCPHealth}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Refresh health check"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${mcpLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {mcpLoading ? (
          <div className="flex items-center gap-3 text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Checking MCP servers...</span>
          </div>
        ) : mcpHealth ? (
          <>
            <div className="grid grid-cols-4 gap-2 mb-4 text-sm">
              <div className="text-gray-400">Total:</div>
              <div className="text-white">{mcpHealth.summary.total}</div>
              <div className="text-gray-400">Healthy:</div>
              <div className="text-green-400">{mcpHealth.summary.healthy}</div>
              <div className="text-gray-400">Unhealthy:</div>
              <div className="text-yellow-400">{mcpHealth.summary.unhealthy}</div>
              <div className="text-gray-400">Missing:</div>
              <div className="text-red-400">{mcpHealth.summary.missing}</div>
            </div>
            <div className="space-y-3">
              {Object.entries(mcpHealth.servers).map(([serverName, health]) => (
                <div key={serverName} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {health.status === 'healthy' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : health.status === 'unhealthy' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-gray-300">{serverName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`text-xs px-2 py-1 rounded ${
                      health.status === 'healthy' ? 'bg-green-900/50 text-green-300' :
                      health.status === 'unhealthy' ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-red-900/50 text-red-300'
                    }`}>
                      {health.status}
                    </span>
                    {health.checkTime && (
                      <span className="text-gray-500">{health.checkTime}ms</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-sm">Click refresh to check MCP server health</div>
        )}
      </div>

      {/* Wasserman Apps */}
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <ExternalLink className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Wasserman Filmmaker Suite</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(wassermanApps).map(([appName, status]) => (
            <div key={appName} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(status)}
                <span className="text-gray-300">{appName.replace('.app', '')}</span>
              </div>
              {status.found && status.path && (
                <button
                  onClick={() => launchWassermanApp(appName)}
                  className="px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-white text-sm flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Launch
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Companion Mode Status */}
      {!platform.supportsLocalTools && (
        <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-700">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <div>
              <h4 className="text-yellow-300 font-semibold">Companion Mode Active</h4>
              <p className="text-yellow-200/70 text-sm">
                Mobile devices connect to desktop instance for tool access. Ensure desktop companion server is running.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
