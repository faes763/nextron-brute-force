import { app, ipcMain } from "electron";
import path from "path";
import fs from 'fs/promises';
const pathMain = path.join(app.getAppPath(), '/renderer/public/images/JPG');
export const getImages = ipcMain.handle('get-images', async () =>  {
    try {
        const files = await fs.readdir(pathMain);
        const images = files.map(file => path.join('/images/JPG', file));
        let resultArray = [];

        for (let i = 0; i < images.length; i += 10) {
            let chunk = images.slice(i, i+10);
            resultArray.push(chunk);
}
        return resultArray;
      } catch (err) {
        console.error('Could not list the directory.', err);
      }
});

