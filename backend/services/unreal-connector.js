// ==============================================================================
// ARISE PRODUCTION - UNREAL ENGINE 5 NATIVE CONNECTOR & LIVE LINK BRIDGE
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { exec } from 'child_process';
import http from 'http';

export class UnrealEngineConnector {
  constructor() {
    this.host = process.env.UNREAL_HOST || '127.0.0.1';
    this.port = Number(process.env.UNREAL_PORT || 30010);
    this.appPath = process.env.UNREAL_EDITOR_PATH || '/Applications/Film Making/UnrealEditor.app';
    this.sharedEnginePath = '/Users/Shared/UnrealEngine';
    this.lastStatus = { active: false, lastChecked: null };
    this.isPolling = false;

    // Start background health monitor
    this.startHeartbeat(15000);
  }

  setConfig({ host, port, appPath } = {}) {
    if (host) this.host = host;
    if (port) this.port = Number(port);
    if (appPath) this.appPath = appPath;
    console.log(`[UE5 Connector] Config updated: ${this.host}:${this.port} (app: ${this.appPath})`);
    return { host: this.host, port: this.port, appPath: this.appPath };
  }

  startHeartbeat(intervalMs = 15000) {
    if (this.isPolling) return;
    this.isPolling = true;
    const poll = async () => {
      try {
        const status = await this.checkEngineStatus();
        this.lastStatus = { ...status, lastChecked: new Date().toISOString() };
      } catch {}
      setTimeout(poll, intervalMs);
    };
    poll();
  }

  /**
   * Check if Unreal Engine 5 Remote Control Web Server is active
   */
  async checkEngineStatus() {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const req = http.get(`http://${this.host}:${this.port}/remote/info`, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          const latencyMs = Date.now() - startTime;
          if (res.statusCode === 200) {
            let parsedInfo = {};
            try { parsedInfo = JSON.parse(body); } catch {}
            resolve({
              active: true,
              host: this.host,
              port: this.port,
              engine: 'Unreal Engine 5',
              latencyMs,
              info: parsedInfo,
            });
          } else {
            resolve({ active: false, host: this.host, port: this.port, statusCode: res.statusCode, latencyMs });
          }
        });
      });

      req.on('error', () => {
        resolve({
          active: false,
          host: this.host,
          port: this.port,
          appPath: this.appPath,
          message: `UE5 Remote Control offline on ${this.host}:${this.port}`,
        });
      });

      req.setTimeout(1500, () => {
        req.destroy();
        resolve({
          active: false,
          host: this.host,
          port: this.port,
          appPath: this.appPath,
          message: 'Connection timed out',
        });
      });
    });
  }

  /**
   * Launch Unreal Engine 5 Editor / Epic Games Launcher on macOS
   */
  async launchEditor(projectPath = '') {
    const fs = await import('fs');
    const candidates = [
      this.appPath,
      '/Applications/Epic Games Launcher.app',
      '/Users/Shared/UnrealEngine/Launcher/Unreal Engine.app',
      '/Applications/UnrealEditor.app',
      '/Applications/Unreal Engine.app',
    ];

    let targetApp = '';
    for (const c of candidates) {
      if (c && fs.existsSync(c)) {
        targetApp = c;
        break;
      }
    }

    const cmd = targetApp
      ? (projectPath ? `open -a "${targetApp}" --args "${projectPath}"` : `open -a "${targetApp}"`)
      : `open -a "Epic Games Launcher" || open -a "UnrealEditor" || open -a "Unreal Engine"`;

    return new Promise((resolve) => {
      exec(cmd, (err) => {
        if (err) {
          resolve({ success: false, error: err.message });
        } else {
          resolve({
            success: true,
            message: `Unreal Engine launched successfully (${targetApp || 'Epic Games Launcher'}).`,
            targetApp,
          });
        }
      });
    });
  }

  /**
   * Send Camera Transform, Focal Length, and Aperture to CineCameraActor in UE5
   */
  async setCameraParameters({
    cameraName = 'CineCameraActor1',
    focalLength = 35,
    fstop = 2.8,
    sensorWidth = 36.0,
    sensorHeight = 24.0,
    transform = { x: 0, y: 0, z: 100, pitch: 0, yaw: 0, roll: 0 },
  } = {}) {
    const payload = JSON.stringify({
      objectPath: `/Game/Cinematics/${cameraName}.${cameraName}`,
      functionName: 'SetCurrentFocalLength',
      parameters: {
        NewFocalLength: Number(focalLength),
        CurrentAperture: Number(fstop),
        FilmbackSettings: { SensorWidth: sensorWidth, SensorHeight: sensorHeight },
        RelativeLocation: { X: transform.x, Y: transform.y, Z: transform.z },
        RelativeRotation: { Pitch: transform.pitch, Yaw: transform.yaw, Roll: transform.roll },
      },
    });

    return new Promise((resolve) => {
      const req = http.request(
        {
          hostname: this.host,
          port: this.port,
          path: '/remote/object/call',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
        },
        (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => resolve({ success: true, host: this.host, port: this.port, data }));
        }
      );

      req.on('error', (err) => {
        resolve({
          success: false,
          error: err.message,
          fallback: 'Spatial solver simulated locally',
          focalLength,
          fstop,
          transform,
        });
      });

      req.write(payload);
      req.end();
    });
  }
}

export const unrealConnector = new UnrealEngineConnector();
export default unrealConnector;
