// ==============================================================================
// ARISE PRODUCTION - MOBILE COMPANION MODE SERVICE
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { WebSocketServer, WebSocket } from 'ws';
import { toolDetection } from './tool-detection.js';
import { remotionConnector } from './remotion-connector.js';

/**
 * Companion mode allows mobile apps to connect to desktop instance
 * for tool access and rendering. Mobile devices cannot run FFmpeg,
 * Remotion, Unreal Engine, or Wasserman apps locally.
 */
export class CompanionModeService {
  constructor() {
    this.wss = null;
    this.port = 30100;
    this.clients = new Map();
    this.platform = this._detectPlatform();
    this.isCompanionMode = !this.platform.supportsLocalTools;
  }

  _detectPlatform() {
    const platform = process.platform;
    return {
      platform,
      isDesktop: ['darwin', 'win32', 'linux'].includes(platform),
      isMobile: ['android', 'ios'].includes(platform),
      supportsLocalTools: ['darwin', 'win32', 'linux'].includes(platform),
    };
  }

  /**
   * Start companion mode server
   */
  async start(port = 30100) {
    if (this.isCompanionMode) {
      throw new Error('Companion mode server runs on desktop only. Mobile clients connect to desktop.');
    }

    this.port = port;
    this.wss = new WebSocketServer({ port: this.port });

    this.wss.on('connection', (ws, req) => {
      const clientId = this._generateClientId();
      this.clients.set(clientId, {
        ws,
        connectedAt: Date.now(),
        platform: req.headers['user-agent'] || 'unknown',
      });

      console.log(`[Companion] Client connected: ${clientId}`);

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this._handleMessage(clientId, message, ws);
        } catch (err) {
          ws.send(JSON.stringify({
            type: 'error',
            error: err.message,
          }));
        }
      });

      ws.on('close', () => {
        console.log(`[Companion] Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });

      // Send initial status
      ws.send(JSON.stringify({
        type: 'connected',
        clientId,
        platform: this.platform,
        mode: 'companion-server',
      }));
    });

    console.log(`[Companion] Server started on port ${this.port}`);
    return { success: true, port: this.port };
  }

  /**
   * Stop companion mode server
   */
  stop() {
    if (this.wss) {
      this.wss.close();
      this.wss = null;
      console.log('[Companion] Server stopped');
    }
  }

  /**
   * Handle messages from mobile clients
   */
  async _handleMessage(clientId, message, ws) {
    const { type, id, payload } = message;

    console.log(`[Companion] ${clientId}: ${type}`);

    switch (type) {
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', id }));
        break;

      case 'detect-tools':
        const tools = await toolDetection.detectAllTools();
        ws.send(JSON.stringify({ type: 'tools-detected', id, payload: tools }));
        break;

      case 'render-remotion':
        try {
          const result = await remotionConnector.renderRemotionComposition(
            payload.compositionId,
            payload.options
          );
          ws.send(JSON.stringify({ type: 'render-complete', id, payload: result }));
        } catch (err) {
          ws.send(JSON.stringify({ type: 'render-error', id, error: err.message }));
        }
        break;

      case 'render-ffmpeg':
        try {
          const result = await remotionConnector.renderCinematicVideoCard(payload.options);
          ws.send(JSON.stringify({ type: 'render-complete', id, payload: result }));
        } catch (err) {
          ws.send(JSON.stringify({ type: 'render-error', id, error: err.message }));
        }
        break;

      case 'stitch-sequence':
        try {
          const result = await remotionConnector.stitchImageSequenceToVideo(payload.options);
          ws.send(JSON.stringify({ type: 'render-complete', id, payload: result }));
        } catch (err) {
          ws.send(JSON.stringify({ type: 'render-error', id, error: err.message }));
        }
        break;

      case 'get-status':
        const status = await remotionConnector.getStatus();
        ws.send(JSON.stringify({ type: 'status', id, payload: status }));
        break;

      default:
        ws.send(JSON.stringify({
          type: 'error',
          id,
          error: `Unknown message type: ${type}`,
        }));
    }
  }

  /**
   * Generate unique client ID
   */
  _generateClientId() {
    return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get companion mode status
   */
  getStatus() {
    return {
      platform: this.platform,
      isCompanionMode: this.isCompanionMode,
      serverRunning: this.wss !== null,
      serverPort: this.port,
      connectedClients: this.clients.size,
      clientIds: Array.from(this.clients.keys()),
    };
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcast(type, payload) {
    const message = JSON.stringify({ type, payload });
    for (const [clientId, client] of this.clients) {
      try {
        client.ws.send(message);
      } catch (err) {
        console.error(`[Companion] Failed to send to ${clientId}: ${err.message}`);
      }
    }
  }
}

export const companionMode = new CompanionModeService();
export default companionMode;
