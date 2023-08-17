import { app, ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'

const pathMain = path.join(app.getAppPath(), '/renderer/state/state.json');
export const changeConfig = ipcMain.handle('change-config', async (event, name, value) => {
  try {
    const state = JSON.parse(fs.readFileSync(pathMain, 'utf-8'));
    state[name] = value;
    fs.writeFileSync(pathMain, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to set cookie:', error)
  }
});

