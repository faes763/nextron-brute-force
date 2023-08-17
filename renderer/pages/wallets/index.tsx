import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import Main, { walletsType } from "../../components/wallet-card/main";
import Pagination from "../../components/pagination/pagination";
import { checkedBalance, initializedWeb3Instances, web3ProviderToCheckedKey } from "../../utils/web3";

interface WalletTypes {
    mnemonic: string,
    wallets: walletsType[]
}

export default function Wallets() {
    const [wallets,setWallets] = useState([{mnemonic: "", wallets:[]}]);
    const [walletGroups, setWalletGroups] = useState([]);
    const [page,setPage] = useState(1);
    useEffect(() => {
        ipcRenderer.send('stop-find-wallet');
        const handleBackgroundTaskResponse = (event, data: WalletTypes) => {
            data.wallets.forEach((wallet, walletIndex) => {
                const address = wallet.address;
                initializedWeb3Instances.forEach(async (web3Array, web3ArrayIndex) => {
                    const web3Instance = web3Array[walletIndex % web3Array.length];
                    const isChecked = await checkedBalance(address, web3Instance, data.mnemonic);
                    const providerKey = web3ProviderToCheckedKey[web3ArrayIndex];
                    if (providerKey && wallet.checked) {
                        wallet.checked[providerKey] = isChecked;
                    }
                });
            });
            setWallets(prevState => [...prevState, { mnemonic: data.mnemonic, wallets: data.wallets }]);
        };
    
        ipcRenderer.send('start-find-wallet');
        ipcRenderer.on('background-task-response', handleBackgroundTaskResponse);
    
        return () => {
            ipcRenderer.removeListener('background-task-response', handleBackgroundTaskResponse);
            ipcRenderer.send('stop-find-wallet');
        };
    }, []);

    useEffect(()=>{;
        if (wallets.length === 9) {
            setWalletGroups(prevState => [...prevState, wallets]);
            setWallets([]);
        }
    },[wallets]);

    return (
        <main className="z-10 flex flex-col gap-5 concurrent">
            {walletGroups.length > 0 && walletGroups[page-1].map((wallet,index)=>{
                if(wallet.mnemonic != "") return (
                    <Main id={index} key={wallet.mnemonic} mnemonic={wallet.mnemonic} wallets={wallet.wallets}/>
                );                
            })}
            <Pagination 
                totalPageCount={walletGroups.length} 
                onPageChange={setPage} 
                currentPage={page}
            />
        </main>
    )
}