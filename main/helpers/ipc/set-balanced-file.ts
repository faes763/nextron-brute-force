import * as ExcelJS from 'exceljs';

import { app, ipcMain } from 'electron'
import path from 'path';

const pathMain = path.join(app.getAppPath(), '/renderer/public/balanced.xlsx');
export const setBalanced = ipcMain.handle('set-balanced', async (event,mnemonic: string, balance: string) => {

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathMain);
        const worksheet = workbook.getWorksheet(1);

        // Определите последнюю строку
        let lastRow = worksheet.lastRow;
        const newRow = worksheet.addRow([]);

        // Если у вас нет строк в листе, создайте первую строку
        if (!lastRow) {
          lastRow = worksheet.addRow([]);
        }
      
        // Добавьте значение в ячейку в последней строке (например, в колонке A)
        newRow.getCell(1).value = mnemonic;
        newRow.getCell(2).value = balance;

        await workbook.xlsx.writeFile(pathMain);
    } catch (error) {
        // console.error(error);
    }
});