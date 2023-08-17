import { ethers } from "ethers";
import { app, ipcMain } from 'electron';

let intervalId;
const path = "m/44'/60'/0'/0/";
export const startFindWallet = ipcMain.on('start-find-wallet',(event,args)=>{
  if (intervalId) {
    clearInterval(intervalId);
  }
  console.log('start-find-wallet');
  intervalId = setInterval(()=>{
    const wallets = [];
    const generateWallet = ethers.Wallet.createRandom();
    const mnemonic = generateWallet.mnemonic.phrase;
    wallets.push({...generateWallet,privateKey: generateWallet.privateKey,checked: {
      eth: false,
      bnb: false,
      pol: false,
    }});
    for(let i = 0; i < 10; i++) {
        const walletWithPath = generateWallet.derivePath(path+i);
        wallets.push({...walletWithPath,privateKey: walletWithPath.privateKey,checked: {
          eth: false,
          bnb: false,
          pol: false,
        }});
    }
    
    const dataObj = {
        mnemonic: mnemonic,
        wallets: wallets
    }

    event.reply('background-task-response', dataObj);
  },150)
})

export const stopFindWallet = ipcMain.on('stop-find-wallet', () => {
    if (intervalId) {
      clearInterval(intervalId);
      console.log('stop-find-wallet');
    }
});