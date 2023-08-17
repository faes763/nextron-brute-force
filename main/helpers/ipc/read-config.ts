import fs from 'fs'
import { app, ipcMain } from 'electron'
import path from 'path';
const pathMain = path.join(app.getAppPath(), '/renderer/state/state.json');
export const readConfig = ipcMain.handle('read-config', async (event) => {
    try {
        const state = JSON.parse(fs.readFileSync(pathMain, 'utf-8'));
        return state;
    } catch (error) {
      console.error('Failed to get cookie:', error)
    }
  });