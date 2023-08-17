import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { ethers } from 'ethers';
import path from 'path';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();
  
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    icon: path.join(app.getAppPath(), '/resources/icon.ico')
  });

  if (isProd) {
    mainWindow.setMenu(null);
    mainWindow.maximize();
    mainWindow.setFullScreen(false);
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
    // mainWindow.setMenu(null);
    mainWindow.maximize();
    mainWindow.setFullScreen(false);
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
