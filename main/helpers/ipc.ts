import { getBalanced } from './ipc/get-balanced-file';
import { setBalanced } from './ipc/set-balanced-file';
import { startFindWallet, stopFindWallet } from './ipc/wallets';
import { readConfig } from './ipc/read-config';
import { changeConfig } from './ipc/change-config';
import { getImages } from './ipc/get-images';
import { getAppPath } from './ipc/get-app-path';

export const allHandlers = {
    startFindWallet,
    stopFindWallet,
    getImages,
    changeConfig,
    readConfig,
    getAppPath,
    setBalanced,
    getBalanced
}