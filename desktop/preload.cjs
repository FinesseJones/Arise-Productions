// ==============================================================================
// ARISE PRODUCTION - NATIVE DESKTOP PRELOAD SCRIPT
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  onDirectorySelected: (callback) =>
    ipcRenderer.on('project-directory-selected', (_event, value) => callback(value)),
  onTriggerCommand: (callback) =>
    ipcRenderer.on('trigger-agent-command', (_event, value) => callback(value)),
});
