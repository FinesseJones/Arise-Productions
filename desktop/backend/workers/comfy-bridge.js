// ==============================================================================
// ARISE PRODUCTION - LOCAL COMFY MCP & COMFYUI API CONNECTOR
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ComfyUIBridge {
  constructor(host = '127.0.0.1', port = 8188) {
    this.host = host;
    this.port = port;
    this.binPath = path.resolve(__dirname, '../comfy-mcp-env/bin/comfy-mcp');
    this.comfyBin = path.resolve(__dirname, '../comfy-mcp-env/bin/comfy');
  }

  /**
   * Check if local ComfyUI instance is online
   */
  async checkServerStatus() {
    return new Promise((resolve) => {
      const req = http.get(`http://${this.host}:${this.port}/system_stats`, (res) => {
        if (res.statusCode === 200) {
          resolve({ online: true, host: this.host, port: this.port });
        } else {
          resolve({ online: false, status: res.statusCode });
        }
      });

      req.on('error', () => {
        resolve({ online: false, message: 'Local ComfyUI not detected on port 8188' });
      });

      req.setTimeout(1500, () => {
        req.destroy();
        resolve({ online: false, message: 'Connection timed out' });
      });
    });
  }

  /**
   * Queue a ComfyUI prompt workflow
   */
  async queuePrompt(promptWorkflow) {
    const payload = JSON.stringify({ prompt: promptWorkflow });
    return new Promise((resolve, reject) => {
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
              resolve(JSON.parse(body));
            } catch (e) {
              resolve({ success: false, raw: body });
            }
          });
        }
      );

      req.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });

      req.write(payload);
      req.end();
    });
  }
}

export const comfyBridge = new ComfyUIBridge();
export default comfyBridge;
