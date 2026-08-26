// ==============================================================================
// ARISE PRODUCTION - NATIVE DESKTOP SHELL (ELECTRON RUNTIME)
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { app, BrowserWindow, Menu, shell, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let backendProcess = null;

const PORT = 4000;

// 1. Launch local backend service in background
function startBackendServer() {
  let unpackedDir = __dirname.replace('app.asar', 'app.asar.unpacked');
  let serverPath = path.join(unpackedDir, 'server.js');
  let cwd = unpackedDir;

  if (!fs.existsSync(serverPath)) {
    serverPath = path.resolve(__dirname, '../server.js');
    cwd = path.resolve(__dirname, '..');
  }

  console.log('[AriseDesktop] 🎬 Spawning Arise Production backend server:', serverPath);

  try {
    // Use Electron's embedded node runtime if global node is not on GUI PATH
    backendProcess = spawn(process.execPath, [serverPath], {
      cwd,
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: '1',
        PORT: '4000',
      },
      stdio: 'inherit',
    });

    backendProcess.on('error', (err) => {
      console.warn('[AriseDesktop] Embedded node runner notice, trying fallback spawn:', err.message);
      try {
        backendProcess = spawn('node', [serverPath], { cwd, stdio: 'inherit' });
      } catch (e) {}
    });
  } catch (err) {
    console.warn('[AriseDesktop] Backend launch warning:', err);
  }
}

// 2. Create Native Application Window
function createMainWindow() {
  const iconPath = path.join(__dirname, 'build/icon.png');

  if (process.platform === 'darwin' && app.dock && fs.existsSync(iconPath)) {
    try {
      app.dock.setIcon(iconPath);
    } catch (e) {}
  }

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Arise Production - A Product of THE AI CONTENT FOUNDRY, LLC',
    titleBarStyle: 'hiddenInset', // macOS native titlebar styling
    backgroundColor: '#020617', // slate-950
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  // Clear any cached assets to ensure fresh UI renders
  mainWindow.webContents.session.clearCache();

  // Resolve compiled Arise Production Studio index.html
  let distIndex = path.join(__dirname, 'ui/index.html');
  if (!fs.existsSync(distIndex)) {
    distIndex = path.resolve(__dirname, '../frontend/dist/index.html');
  }
  if (!fs.existsSync(distIndex)) {
    distIndex = path.join(app.getAppPath(), 'ui/index.html');
  }

  console.log('[AriseDesktop] 🎬 Loading Arise Production UI from:', distIndex);
  mainWindow.loadFile(distIndex);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('[AriseDesktop] 🎬 Arise Production Studio Window is ready.');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Set Native Application Menu
  setupNativeMenu();
}

// 3. Native macOS / Windows Menu
function setupNativeMenu() {
  const template = [
    {
      label: 'Arise Production',
      submenu: [
        { role: 'about', label: 'About Arise Production' },
        { type: 'separator' },
        {
          label: 'Open Project Directory...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openDirectory'],
            });
            if (!result.canceled && result.filePaths.length > 0) {
              mainWindow.webContents.send('project-directory-selected', result.filePaths[0]);
            }
          },
        },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Pipeline',
      submenu: [
        {
          label: 'Run Full Pipeline (board scene 1)',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            mainWindow.webContents.send('trigger-agent-command', 'board scene 1');
          },
        },
        {
          label: 'Compile Generative Prompts',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            mainWindow.webContents.send('trigger-agent-command', 'compile prompts');
          },
        },
        {
          label: 'Trigger Reshoot Loop Review',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.send('trigger-agent-command', 'review reshoots');
          },
        },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 4. Native IPC Handlers
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  return result.filePaths[0] || null;
});

// App Lifecycle
app.whenReady().then(() => {
  startBackendServer();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
