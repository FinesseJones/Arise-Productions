// ==============================================================================
// ARISE PRODUCTION - NATIVE DESKTOP SHELL (ELECTRON RUNTIME)
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { app, BrowserWindow, Menu, shell, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let backendProcess = null;

const PORT = 4000;
const FRONTEND_DEV_URL = 'http://localhost:5002';

// 1. Launch local backend service in background
function startBackendServer() {
  const serverPath = path.resolve(__dirname, '../server.js');
  console.log('[AriseDesktop] Spawning local backend server:', serverPath);

  backendProcess = spawn('node', [serverPath], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
  });

  backendProcess.on('error', (err) => {
    console.error('[AriseDesktop] Failed to start backend server:', err);
  });
}

// 2. Create Native Application Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Arise Production - A Product of THE AI CONTENT FOUNDRY, LLC',
    titleBarStyle: 'hiddenInset', // macOS native titlebar styling
    backgroundColor: '#020617', // slate-950
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  // Load compiled production dist or live dev server
  const distIndex = path.resolve(__dirname, '../frontend/dist/index.html');
  
  // Try connecting to live server, otherwise load built dist file
  mainWindow.loadURL(FRONTEND_DEV_URL).catch(() => {
    mainWindow.loadFile(distIndex);
  });

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
