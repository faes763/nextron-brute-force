import Link from "next/link";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Switch } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../sprite-icons";
import { useHeader } from "../../store/useHeader";
import Modal from "./modal";
import { changeRoot } from "../../utils";
import { ipcRenderer } from "electron";

const AnimatedText = dynamic(() => import('../animation/AnimatedText'), {
  ssr: false
});


export default function Header() {
    const {open} = useHeader();
    const [enabled, setEnabled] = useState(false);
    const router = useRouter();
    const firstUpdate = useRef(true);
    useEffect(()=>{ 
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        changeRoot('background-main', !enabled ? "linear-gradient(180deg, rgba(86,86,122,1) 20%, rgba(16,84,98,1) 42%, rgba(2,0,33,1) 79%)" : 'linear-gradient(to bottom, #000000, #0f0c36, #2b0e3b, #4d0e3a, #6d0d36, #8b0b2d, #a8071a, #c62100, #e44000, #ff6700)')
        changeRoot('background-ball', enabled ? "linear-gradient(to bottom, #0077be, #0c8dd4, #1ca3e9, #2bb9ff, #3dd4ff, #5feaff, #8bf3ff, #b7faff, #e3ffff)" : 'linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(51, 51, 51, 1) 50%, rgba(102, 102, 102, 1) 100%)')
        changeRoot('shadow-switch', !enabled ? "0,0,0,0.75" : '256,256,256,0.75');
        changeRoot('main-text-color', '256,256,256');
    },[enabled])
    useEffect(()=>{
       ipcRenderer.invoke('read-config').then((state) => {
            Object.entries(state).forEach((element:any[])=>{
                console.log(element);
                changeRoot(element[0], element[1]);   
            });
        });  
    },[])
    return (
        <header className="w-full text-center flex justify-center items-center sticky top-0 z-10">
            <Modal/>
            <nav className="flex justify-evenly px-2 w-full gap-x-5 py-5 relative z-10 concurrent  items-center">
                <div className="flex gap-x-5">
                    <Link href='/balance'>
                        <a className={`header-p ${  router.pathname === '/balance' ? ' after:w-full' : ''}`}>
                            {router.pathname === '/balance' ? <AnimatedText styles={'animate-bounce'} text={'Balanced'}/> : 'Balanced'}
                        </a>
                    </Link>
                    <Link href='/home'>
                        <a className={`header-p ${router.pathname === '/home' ? 'after:w-full' : ''}`}>
                            {router.pathname === '/home' ?  <AnimatedText text={'Main'}/> : 'Main'}
                        </a>
                    </Link>
                    <Link href='/wallets'>
                        <a className={`header-p ${router.pathname === '/wallets' ? 'after:w-full' : ''}`}>
                            {router.pathname === '/wallets' ? <AnimatedText text={'Wallets'}/> : 'Wallets'}
                        </a>
                    </Link>
                </div>
            </nav>
            <Switch.Group>
                <div className="flex items-center absolute right-4 z-10 concurrent">
                    <div className="pr-5">
                        <button onClick={open}>Modal</button>
                    </div>
                    <Switch.Label className="mr-4 cursor-pointer "><Icon name={enabled ? "sun": "moon"} className={"w-5 h-5"}/></Switch.Label>
                    <Switch
                        checked={enabled}
                        onChange={setEnabled}
                        className={`${
                            !enabled ? 'bg-blue-600' : 'bg-red-600'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                    <span
                        className={`${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                    </Switch>
                </div>
            </Switch.Group>
        </header>
        
    )
}