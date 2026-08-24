// ==============================================================================
// WASSERMAN STUDIO SHELL - CENTRAL API BRIDGE WEBSOCKET GATEWAY
// ==============================================================================

import crypto from 'crypto';
import EventEmitter from 'events';
import { db } from '../db/client.js';
import { apiRouter } from './router.js';
import { jobQueue } from './queue.js';

export class StudioWebSocketGateway extends EventEmitter {
  constructor() {
    super();
    this.clients = new Set();
    this._setupDatabaseListeners();
  }

  attachToServer(httpServer) {
    httpServer.on('upgrade', (req, socket, head) => {
      const pathname = req.url.split('?')[0];
      if (pathname === '/ws' || pathname === '/api/v1/ws') {
        this._handleUpgrade(req, socket, head);
      }
    });
    console.log('[WebSocketGateway] WebSocket Gateway attached to HTTP server (:4000/ws)');
  }

  _handleUpgrade(req, socket, head) {
    const key = req.headers['sec-websocket-key'];
    if (!key) {
      socket.destroy();
      return;
    }

    const digest = crypto
      .createHash('sha1')
      .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${digest}`,
      '',
      '',
    ].join('\r\n');

    socket.write(headers);

    const client = {
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      socket,
      subscribedProject: 'proj-fatherless-child',
      send: (data) => {
        try {
          const payload = typeof data === 'string' ? data : JSON.stringify(data);
          const frame = this._encodeFrame(payload);
          socket.write(frame);
        } catch (e) {
          console.error(`[WebSocketGateway] Error sending to client ${client.id}:`, e.message);
        }
      },
    };

    this.clients.add(client);
    console.log(`[WebSocketGateway] Client connected (${client.id}). Total active clients: ${this.clients.size}`);

    // Send initial manifest and welcome
    (async () => {
      const manifest = await db.getProjectManifest(client.subscribedProject);
      client.send({
        type: 'CONNECTION_ESTABLISHED',
        clientId: client.id,
        manifest,
        message: 'Connected to Wasserman Studio Shell Central API Bridge.',
      });
    })();

    // Handle incoming frames from client
    let buffer = Buffer.alloc(0);
    socket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      buffer = this._processFrames(buffer, client);
    });

    socket.on('close', () => {
      this.clients.delete(client);
      console.log(`[WebSocketGateway] Client disconnected (${client.id}). Active clients: ${this.clients.size}`);
    });

    socket.on('error', (err) => {
      console.error(`[WebSocketGateway] Socket error (${client.id}):`, err.message);
      this.clients.delete(client);
    });
  }

  _processFrames(buffer, client) {
    while (buffer.length >= 2) {
      const firstByte = buffer[0];
      const secondByte = buffer[1];
      const isFinal = (firstByte & 0x80) !== 0;
      const opcode = firstByte & 0x0f;
      const isMasked = (secondByte & 0x80) !== 0;
      let payloadLength = secondByte & 0x7f;
      let offset = 2;

      // Handle close / ping / pong
      if (opcode === 0x8) {
        client.socket.end();
        return Buffer.alloc(0);
      }
      if (opcode === 0x9) {
        // Ping -> Send Pong
        client.socket.write(Buffer.from([0x8a, 0x00]));
        buffer = buffer.slice(2);
        continue;
      }

      if (payloadLength === 126) {
        if (buffer.length < offset + 2) return buffer;
        payloadLength = buffer.readUInt16BE(offset);
        offset += 2;
      } else if (payloadLength === 127) {
        if (buffer.length < offset + 8) return buffer;
        payloadLength = Number(buffer.readBigUInt64BE(offset));
        offset += 8;
      }

      let maskKey = null;
      if (isMasked) {
        if (buffer.length < offset + 4) return buffer;
        maskKey = buffer.slice(offset, offset + 4);
        offset += 4;
      }

      if (buffer.length < offset + payloadLength) {
        return buffer; // Wait for more chunks
      }

      const payload = buffer.slice(offset, offset + payloadLength);
      buffer = buffer.slice(offset + payloadLength);

      // Unmask
      if (isMasked && maskKey) {
        for (let i = 0; i < payload.length; i++) {
          payload[i] ^= maskKey[i % 4];
        }
      }

      if (opcode === 0x1) {
        // Text frame
        const text = payload.toString('utf8');
        this._handleClientMessage(client, text);
      }
    }
    return buffer;
  }

  _encodeFrame(text) {
    const payload = Buffer.from(text, 'utf8');
    const length = payload.length;
    let header;

    if (length < 126) {
      header = Buffer.from([0x81, length]);
    } else if (length <= 65535) {
      header = Buffer.alloc(4);
      header[0] = 0x81;
      header[1] = 126;
      header.writeUInt16BE(length, 2);
    } else {
      header = Buffer.alloc(10);
      header[0] = 0x81;
      header[1] = 127;
      header.writeBigUInt64BE(BigInt(length), 2);
    }

    return Buffer.concat([header, payload]);
  }

  async _handleClientMessage(client, rawText) {
    try {
      const data = JSON.parse(rawText);
      console.log(`[WebSocketGateway] Received action from ${client.id}:`, data.type);

      switch (data.type) {
        case 'SUBSCRIBE_PROJECT':
          client.subscribedProject = data.projectId || 'proj-fatherless-child';
          const manifest = await db.getProjectManifest(client.subscribedProject);
          client.send({ type: 'MANIFEST_SYNC', manifest });
          break;

        case 'EXECUTE_COMMAND':
          try {
            const response = await apiRouter.processMCPRequest(
              {
                projectId: client.subscribedProject,
                command: data.command,
                activeStage: data.activeStage,
                shotNumber: data.shotNumber || 1,
              },
              (progressEvt) => {
                client.send({ type: 'COMMAND_PROGRESS', ...progressEvt });
              }
            );
            client.send({ type: 'COMMAND_SUCCESS', response });
          } catch (err) {
            client.send({ type: 'COMMAND_ERROR', error: err.message });
          }
          break;

        case 'GET_MANIFEST':
          const currentManifest = await db.getProjectManifest(client.subscribedProject);
          client.send({ type: 'MANIFEST_SYNC', manifest: currentManifest });
          break;

        default:
          console.log(`[WebSocketGateway] Unknown client message type: ${data.type}`);
      }
    } catch (err) {
      console.error('[WebSocketGateway] Failed to parse client message:', err.message);
    }
  }

  _setupDatabaseListeners() {
    // Broadcast state updates to subscribed clients
    db.on('manifest_updated', ({ projectId, manifest, stageId, shotNumber, statusChar }) => {
      this.broadcast(projectId, {
        type: 'STAGE_STATUS_CHANGED',
        projectId,
        stageId,
        shotNumber,
        statusChar,
        manifest,
      });
    });

    jobQueue.on('job_progress', ({ jobId, stageId, progress, message }) => {
      this.broadcastAll({
        type: 'JOB_PROGRESS_TELEMETRY',
        jobId,
        stageId,
        progress,
        message,
      });
    });
  }

  broadcast(projectId, payload) {
    for (const client of this.clients) {
      if (client.subscribedProject === projectId) {
        client.send(payload);
      }
    }
  }

  broadcastAll(payload) {
    for (const client of this.clients) {
      client.send(payload);
    }
  }
}

export const wsGateway = new StudioWebSocketGateway();
export default wsGateway;
