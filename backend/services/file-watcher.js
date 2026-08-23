// ==============================================================================
// WASSERMAN STUDIO SHELL - LIVE FILE SYSTEM WATCHER DAEMON
// ==============================================================================

import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';
import { db } from '../db/client.js';

export class LiveFileSystemWatcher extends EventEmitter {
  constructor(watchDir = './storage/watch_folder') {
    super();
    this.watchDir = path.resolve(watchDir);
    this.isWatching = false;
    this.watchInterval = null;
    this.knownFiles = new Set();
  }

  start() {
    // Ensure directory exists
    try {
      if (!fs.existsSync(this.watchDir)) {
        fs.mkdirSync(this.watchDir, { recursive: true });
      }
    } catch (e) {
      console.warn(`[FileWatcher] Could not create watch directory: ${e.message}`);
    }

    console.log(`[FileWatcher] Live File System Watcher active on: ${this.watchDir}`);
    this.isWatching = true;

    // Scan initial files
    this._scan();

    // Active polling daemon every 5 seconds
    this.watchInterval = setInterval(() => {
      this._scan();
    }, 5000);
  }

  _scan() {
    try {
      if (!fs.existsSync(this.watchDir)) return;
      const files = fs.readdirSync(this.watchDir);

      files.forEach(async (file) => {
        if (!this.knownFiles.has(file)) {
          this.knownFiles.add(file);
          console.log(`[FileWatcher] 📁 Detected new external file: ${file}`);
          await this._handleExternalFileEvent(file);
        }
      });
    } catch (err) {
      // Ignore scan errors
    }
  }

  async _handleExternalFileEvent(fileName) {
    const lower = fileName.toLowerCase();
    
    // 1. Audio Stem File -> Updates Sound stage for Shot 2
    if (lower.includes('stem') || lower.includes('.wav') || lower.includes('audio')) {
      console.log(`[FileWatcher] Auto-triggering Sound Stage update for Shot 2 from file '${fileName}'`);
      await db.updateShotStageAtomic('proj-titanic', 2, 'sound', '🟢', {
        autoDetectedFile: fileName,
        detectedAt: new Date().toISOString(),
      });
    }

    // 2. Dailies / Take File -> Updates Dailies stage
    else if (lower.includes('take') || lower.includes('.mov') || lower.includes('.mp4')) {
      console.log(`[FileWatcher] Auto-triggering Dailies Stage update for Shot 1 from file '${fileName}'`);
      await db.updateShotStageAtomic('proj-titanic', 1, 'dailies', '🟢', {
        autoDetectedFile: fileName,
        detectedAt: new Date().toISOString(),
      });
    }

    // 3. Screenplay / Fountain File -> Updates Script stage
    else if (lower.includes('script') || lower.includes('.fountain')) {
      console.log(`[FileWatcher] Auto-triggering Script Stage update from file '${fileName}'`);
      await db.updateShotStageAtomic('proj-titanic', 1, 'script', '🟢', {
        autoDetectedFile: fileName,
        detectedAt: new Date().toISOString(),
      });
    }
  }

  stop() {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
      this.isWatching = false;
      console.log('[FileWatcher] File System Watcher stopped.');
    }
  }
}

export const fileWatcher = new LiveFileSystemWatcher();
export default fileWatcher;
