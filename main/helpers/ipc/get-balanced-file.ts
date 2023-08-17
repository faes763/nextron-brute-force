import * as ExcelJS from 'exceljs';
import { app, ipcMain } from 'electron'
import path from 'path';
const pathMain = path.join(app.getAppPath(), '/renderer/public/balanced.xlsx');
export const getBalanced = ipcMain.handle('get-balanced', async (event) => {

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathMain);
        const worksheet = workbook.getWorksheet(1);

        const data: any[] = [];
        worksheet.eachRow((rowData, rowNumber)=> {
            const body = {
                mnemonic: rowData.getCell(1).value,
                balance: rowData.getCell(2).value
            }
            data.push(body);
        });
        return data
    } catch (error) {
        console.error(error);
    }
});
