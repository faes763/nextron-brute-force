import { Fragment, useEffect, useState } from "react";
import { CheckIcon, ChevronUpIcon, ClipboardIcon } from '@heroicons/react/20/solid'
import { Disclosure, Transition } from "@headlessui/react";
import WalletsDisclosure from "./wallets-disclosure";
import { copyText } from "../../utils";

export interface walletsType {
  address:string;
  chainCode:string;
  depth:number;
  fingerprint:string;
  index:number;
  mnemonic : {
      phrase: string, 
      password: string, 
      wordlist: any, 
      entropy: string
  }
  parentFingerprint: string;
  path: string;
  provider: null | any;
  publicKey: string;
  privateKey: string;
  checked: {
    eth: boolean;
    bnb: boolean;
    pol: boolean;
    mum: boolean;
  };
}
interface walletsCard {
    wallets: walletsType[],
    mnemonic: string
    id: number
}
export default function Main({wallets,mnemonic,id}:walletsCard) {
  const [hasCopied,handleCopy] = useState(false);
  const [show,setShow] = useState(false);
  useEffect(()=>{
    setTimeout(()=>{
      setShow(true)
    },30*id)
  },[])

    return (
      <Transition
      as={Fragment}
      show={show}
      appear={true}
      enter="transition duration-200 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-100 ease-in"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Disclosure>
          {({ open }) => (
            <div className="px-5 py-1 border mx-5 rounded-3xl">
              <div className="flex items-center gap-x-2">
                {hasCopied ? 
                  <CheckIcon
                      className="w-5 h-5 cursor-pointer text-[#24BE74]"
                  />
                    : 
                  <ClipboardIcon
                      title="copy"
                      className="w-5 h-5 cursor-pointer" 
                      onClick={async()=>{
                          copyText(mnemonic).then((res)=>{
                              handleCopy(res);
                              setTimeout(()=>{handleCopy(false)},2500)
                          });
                      }}
                  />
                }
                <Disclosure.Button className="py-2 flex items-center gap-4 ">
                    <h1 className=" tracking-widest">{mnemonic}</h1>
                    <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-sky-600 transition-transform duration-[300ms]`}
                    />
                </Disclosure.Button>
              </div>
              <Transition
                enter="ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Disclosure.Panel className={'flex flex-col gap-y-5 justify-start py-2'}>
                  {wallets.map((wallet: walletsType,index) => (<WalletsDisclosure key={index} wallet={wallet}/>))}
                </Disclosure.Panel>   
              </Transition>
              
            </div>
          )}
        </Disclosure>
      </Transition>
    )
}