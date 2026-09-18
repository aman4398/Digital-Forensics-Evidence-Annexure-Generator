/**
 * Electron Main Process for Digital Forensics Evidence & Annexure Desktop App
 * Provides offline local file system storage, offline syncing, and native print-to-PDF
 */
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Digital Forensics Evidence & Annexure Generator (LAE Search Operations)',
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'electron-preload.cjs')
    },
    icon: path.join(__dirname, 'public/favicon.ico')
  });

  const startUrl = process.env.ELECTRON_START_URL || 
    (process.env.NODE_ENV === 'production' 
      ? `file://${path.join(__dirname, 'dist/index.html')}` 
      : 'http://localhost:3000');

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers for offline local file system access
ipcMain.handle('save-dossier-file', async (event, { fileName, dataString }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save Forensic Dossier JSON',
    defaultPath: fileName,
    filters: [{ name: 'JSON Dossier', extensions: ['json'] }]
  });

  if (!canceled && filePath) {
    fs.writeFileSync(filePath, dataString, 'utf-8');
    return { success: true, filePath };
  }
  return { success: false, canceled: true };
});

ipcMain.handle('open-dossier-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Field Team Dossier JSON',
    properties: ['openFile'],
    filters: [{ name: 'JSON Dossier', extensions: ['json'] }]
  });

  if (!canceled && filePaths.length > 0) {
    const content = fs.readFileSync(filePaths[0], 'utf-8');
    return { success: true, content, filePath: filePaths[0] };
  }
  return { success: false, canceled: true };
});

ipcMain.handle('print-to-pdf', async (event, { defaultName }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Annexures to PDF',
    defaultPath: defaultName || 'Annexures_BSA63_ChainOfCustody.pdf',
    filters: [{ name: 'PDF Document', extensions: ['pdf'] }]
  });

  if (!canceled && filePath) {
    const pdfData = await mainWindow.webContents.printToPDF({
      pageSize: 'A4',
      printBackground: true,
      margins: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 }
    });
    fs.writeFileSync(filePath, pdfData);
    return { success: true, filePath };
  }
  return { success: false, canceled: true };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
