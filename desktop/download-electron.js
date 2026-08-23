// ==============================================================================
// PERMANENT FIX: STANDALONE DIRECT ELECTRON DOWNLOADER FOR MACOS/WIN/LINUX
// ==============================================================================

import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELECTRON_VERSION = '34.0.0';
const platform = process.platform;
const arch = process.arch === 'arm64' ? 'arm64' : 'x64';

const electronDir = path.join(__dirname, 'node_modules', 'electron');
const distDir = path.join(electronDir, 'dist');
const zipPath = path.join(electronDir, `electron-v${ELECTRON_VERSION}-${platform}-${arch}.zip`);

const downloadUrl = `https://github.com/electron/electron/releases/download/v${ELECTRON_VERSION}/electron-v${ELECTRON_VERSION}-${platform}-${arch}.zip`;

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`[Downloader] Fetching: ${url}`);
    
    function get(currentUrl) {
      https.get(currentUrl, (res) => {
        // Handle Redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(res.headers.location);
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download: Status Code ${res.statusCode}`));
          return;
        }

        const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
        let downloadedBytes = 0;
        const file = fs.createWriteStream(dest);

        res.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          if (totalBytes) {
            const pct = Math.round((downloadedBytes / totalBytes) * 100);
            process.stdout.write(`\r[Downloader] Progress: ${pct}% (${(downloadedBytes / 1024 / 1024).toFixed(1)}MB / ${(totalBytes / 1024 / 1024).toFixed(1)}MB)`);
          }
        });

        res.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log('\n[Downloader] Download completed successfully.');
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }

    get(url);
  });
}

async function install() {
  console.log(`\n📦 Installing Electron v${ELECTRON_VERSION} for ${platform}-${arch}...`);

  if (!fs.existsSync(electronDir)) {
    fs.mkdirSync(electronDir, { recursive: true });
  }
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 1. Download zip
  await downloadFile(downloadUrl, zipPath);

  // 2. Unzip into dist directory
  console.log('[Downloader] Extracting Electron archive...');
  if (platform === 'darwin' || platform === 'linux') {
    execSync(`unzip -q -o "${zipPath}" -d "${distDir}"`);
  } else {
    // Windows PowerShell unzip
    execSync(`powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${distDir}' -Force"`);
  }

  // 3. Clean up zip
  fs.unlinkSync(zipPath);

  // 4. Write path.txt
  let relExe = '';
  if (platform === 'darwin') {
    relExe = 'Electron.app/Contents/MacOS/Electron';
    // Ensure binary has executable permission
    try {
      execSync(`chmod +x "${path.join(distDir, relExe)}"`);
    } catch (e) {}
  } else if (platform === 'win32') {
    relExe = 'electron.exe';
  } else {
    relExe = 'electron';
  }

  fs.writeFileSync(path.join(electronDir, 'path.txt'), relExe, 'utf8');
  console.log(`[Downloader] ✅ Written path.txt -> ${relExe}`);
  console.log(`\n🎉 Electron is now fully installed and ready to run!\n`);
}

install().catch((err) => {
  console.error('\n❌ Installation failed:', err.message);
  process.exit(1);
});
