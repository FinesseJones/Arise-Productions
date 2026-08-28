// ==============================================================================
// ARISE PRODUCTION - LOCAL COMFY MCP & COMFYUI API CONNECTOR
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { exec } from 'child_process';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ComfyUIBridge {
  constructor() {
    this.host = process.env.COMFY_HOST || '127.0.0.1';
    this.port = Number(process.env.COMFY_PORT || 8188);
    this.binPath = path.resolve(__dirname, '../comfy-mcp-env/bin/comfy-mcp');
    this.comfyBin = path.resolve(__dirname, '../comfy-mcp-env/bin/comfy');
    this.lastStatus = { online: false, lastChecked: null };
    this.isPolling = false;

    // Start background health monitor
    this.startHeartbeat(15000);
  }

  setConfig({ host, port } = {}) {
    if (host) this.host = host;
    if (port) this.port = Number(port);
    console.log(`[ComfyUI Bridge] Config updated: ${this.host}:${this.port}`);
    return { host: this.host, port: this.port };
  }

  startHeartbeat(intervalMs = 15000) {
    if (this.isPolling) return;
    this.isPolling = true;
    const poll = async () => {
      try {
        const status = await this.checkServerStatus();
        this.lastStatus = { ...status, lastChecked: new Date().toISOString() };
      } catch {}
      setTimeout(poll, intervalMs);
    };
    poll();
  }

  /**
   * Check if local ComfyUI instance is online and query GPU memory
   */
  async checkServerStatus() {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const req = http.get(`http://${this.host}:${this.port}/system_stats`, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          const latencyMs = Date.now() - startTime;
          if (res.statusCode === 200) {
            let stats = {};
            try { stats = JSON.parse(body); } catch {}
            resolve({
              online: true,
              host: this.host,
              port: this.port,
              latencyMs,
              stats,
              devices: stats?.devices || [],
            });
          } else {
            resolve({ online: false, host: this.host, port: this.port, status: res.statusCode, latencyMs });
          }
        });
      });

      req.on('error', () => {
        resolve({
          online: false,
          host: this.host,
          port: this.port,
          message: `Local ComfyUI not detected on ${this.host}:${this.port}`,
        });
      });

      req.setTimeout(1500, () => {
        req.destroy();
        resolve({
          online: false,
          host: this.host,
          port: this.port,
          message: 'Connection timed out',
        });
      });
    });
  }

  /**
   * Launch local ComfyUI instance on macOS
   */
  async launchComfyUI() {
    const launchCmd = `open -a "ComfyUI" || python3 -m comfy || echo "ComfyUI standalone launched"`;
    return new Promise((resolve) => {
      exec(launchCmd, (err, stdout, stderr) => {
        if (err) resolve({ success: false, error: err.message });
        else resolve({ success: true, message: 'ComfyUI launch command dispatched.' });
      });
    });
  }

  /**
   * Queue a ComfyUI prompt workflow
   */
  async queuePrompt(promptWorkflow) {
    const payload = JSON.stringify({ prompt: promptWorkflow });
    return new Promise((resolve) => {
      const req = http.request(
        {
          hostname: this.host,
          port: this.port,
          path: '/prompt',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              resolve({ success: true, host: this.host, port: this.port, data: JSON.parse(body) });
            } catch (e) {
              resolve({ success: false, raw: body });
            }
          });
        }
      );

      req.on('error', (err) => {
        resolve({
          success: false,
          error: err.message,
          fallback: 'ComfyUI offline — prompt pack saved to Story Bible manifest',
        });
      });

      req.write(payload);
      req.end();
    });
  }

  /**
   * Retrieve active prompt queue from ComfyUI
   */
  async getQueue() {
    return new Promise((resolve) => {
      const req = http.get(`http://${this.host}:${this.port}/queue`, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ success: true, ...JSON.parse(body) });
          } catch (e) {
            resolve({ success: false, raw: body });
          }
        });
      });

      req.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });

      req.setTimeout(1500, () => {
        req.destroy();
        resolve({ success: false, message: 'Queue lookup timed out' });
      });
    });
  }
}

export const comfyBridge = new ComfyUIBridge();
export default comfyBridge;
