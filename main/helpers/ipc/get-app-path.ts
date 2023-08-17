import { app, ipcMain } from 'electron'
import path from 'path'

export const getAppPath = ipcMain.handle('get-app-path', async (event, name) => {
    const pathMain = path.join(app.getAppPath(), `/renderer/${name}`);
    return pathMain
});

