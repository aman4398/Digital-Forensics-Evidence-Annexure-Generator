const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  isElectron: true,
  saveDossierFile: (options) => ipcRenderer.invoke('save-dossier-file', options),
  openDossierFile: () => ipcRenderer.invoke('open-dossier-file'),
  printToPdf: (options) => ipcRenderer.invoke('print-to-pdf', options),
});
