// ==============================================================================
// ARISE PRODUCTION - UNREAL ENGINE 5 NATIVE CONNECTOR & LIVE LINK BRIDGE
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { exec } from 'child_process';
import http from 'http';

export class UnrealEngineConnector {
  constructor(port = 30010) {
    this.port = port;
    this.appPath = '/Applications/Film Making/UnrealEditor.app';
    this.sharedEnginePath = '/Users/Shared/UnrealEngine';
  }

  /**
   * Check if Unreal Engine 5 Remote Control Web Server is active
   */
  async checkEngineStatus() {
    return new Promise((resolve) => {
      const req = http.get(`http://127.0.0.1:${this.port}/remote/info`, (res) => {
        if (res.statusCode === 200) {
          resolve({ active: true, port: this.port, engine: 'Unreal Engine 5' });
        } else {
          resolve({ active: false, statusCode: res.statusCode });
        }
      });

      req.on('error', () => {
        resolve({ active: false, appPath: this.appPath, message: 'UE5 Remote Control offline' });
      });

      req.setTimeout(1200, () => {
        req.destroy();
        resolve({ active: false, appPath: this.appPath, message: 'Connection timed out' });
      });
    });
  }

  /**
   * Launch Unreal Engine 5 Editor on macOS
   */
  async launchEditor(projectPath = '') {
    const cmd = projectPath
      ? `open -a "${this.appPath}" --args "${projectPath}"`
      : `open -a "${this.appPath}"`;

    return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) resolve({ success: false, error: err.message });
        else resolve({ success: true, message: 'Unreal Engine 5 launching...' });
      });
    });
  }

  /**
   * Send Camera Transform & Focal Length to CineCameraActor in UE5
   */
  async setCameraParameters(cameraName = 'CineCameraActor1', focalLength = 35, transform = { x: 0, y: 0, z: 100 }) {
    const payload = JSON.stringify({
      objectPath: `/Game/Cinematics/${cameraName}.${cameraName}`,
      functionName: 'SetCurrentFocalLength',
      parameters: { NewFocalLength: focalLength },
    });

    return new Promise((resolve) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
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
          res.on('end', () => resolve({ success: true, data }));
        }
      );

      req.on('error', (err) => {
        resolve({ success: false, error: err.message, fallback: 'Spatial solver simulated' });
      });

      req.write(payload);
      req.end();
    });
  }
}

export const unrealConnector = new UnrealEngineConnector();
export default unrealConnector;
