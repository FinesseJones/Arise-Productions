// ==============================================================================
// WASSERMAN STUDIO SHELL - NATIVE DESKTOP PRELOAD SCRIPT
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
