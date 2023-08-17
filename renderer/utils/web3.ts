import Web3 from "web3";
import { walletsType } from "../components/wallet-card/main";
import { ipcRenderer } from "electron";

const ethWeb3Rpc = [
    "https://eth.llamarpc.com",
    "https://eth-rpc.gateway.pokt.network",
    "https://rpc.mevblocker.io",
    "https://eth.drpc.org",
    "https://ethereum.blockpi.network/v1/rpc/public",
    "https://core.gashawk.io/rpc",
    "https://ethereum.publicnode.com",
    
]
const bnbWeb3Rpc = [
    "https://bsc.publicnode.com",
    "https://bsc.publicnode.com",
    "https://bsc.blockpi.network/v1/rpc/public",
    "https://bsc-dataseed1.binance.org",
    "https://binance.nodereal.io",
    "https://rpc-bsc.48.club",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed2.binance.org",
    "https://bsc-dataseed3.binance.org",
    "https://bsc-dataseed4.binance.org",    
]
const polWeb3Rpc = [
    "https://polygon.llamarpc.com",
    "https://poly-rpc.gateway.pokt.network",
    "https://poly-rpc.gateway.pokt.network",
    "https://polygon-bor.publicnode.com",   
    "https://polygon.meowrpc.com",

]

const mumWeb3Rpc = [
    "https://polygon-mumbai.gateway.tenderly.co",
    "https://gateway.tenderly.co/public/polygon-mumbai",
    "https://rpc-mumbai.maticvigil.com",
    "https://polygon-testnet.public.blastapi.io",
    "https://endpoints.omniatech.io/v1/matic/mumbai/public",
    "https://polygon-mumbai-bor.publicnode.com",
    "https://matic-mumbai.chainstacklabs.com",
]

const web3Rpc = [
    ethWeb3Rpc,
    bnbWeb3Rpc,
    polWeb3Rpc,
    mumWeb3Rpc
]

export const initializedWeb3Instances = web3Rpc.map(rpcArray => 
    rpcArray.map(rpcUrl => new Web3(rpcUrl))
);

export const web3ProviderToCheckedKey: Record<number, keyof walletsType['checked']> = {
    0: 'eth',
    1: 'bnb',
    2: 'pol',
    3: 'mum'
};

export const checkedBalance = async(address: string, web3Instance: Web3,mnemonic:string)=>{
    try {
        const balanceWei = await web3Instance.eth.getBalance(address);
        const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
        if(+balanceEth > 0) {
            ipcRenderer.invoke('set-balanced', mnemonic, balanceEth);
        } 
        return true;
    } catch (error) {
        console.log(web3Instance.currentProvider);
        console.error(error); 
        return false;
    }
    
}