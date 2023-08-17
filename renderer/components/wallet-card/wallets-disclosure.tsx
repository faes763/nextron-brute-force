import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon,ClipboardIcon, CheckIcon,XMarkIcon,ArrowPathIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { copyText } from "../../utils";
import { walletsType } from "./main";
import clsx from "clsx";
import { initializedWeb3Instances, web3ProviderToCheckedKey, checkedBalance } from "../../utils/web3";

export default function WalletsDisclosure({wallet}:{wallet:walletsType}) {
    const [hasCopied,handleCopy] = useState(false);
    const [isHover,setIsHover] = useState(false);
    const [checked,setChecked] = useState(wallet.checked);
    const checkAddress = async(index:number)=>{
        const web3Instance = initializedWeb3Instances[index][3 % initializedWeb3Instances[index].length]
        const check = await checkedBalance(wallet.address,web3Instance,wallet.privateKey);
        const providerKey = web3ProviderToCheckedKey[index];
        if (providerKey) setChecked(prev => ({ ...prev, [providerKey]: check }));
    }

    return (
        <Disclosure>
            {({ open }) => (
            <div className=" border rounded-3xl">
                <div className={clsx(
                    "flex items-center gap-x-2 bg-white/20 px-5",
                    open && "rounded-t-3xl",
                    !open && "rounded-3xl"

                )}>
                    {hasCopied ? 
                        <CheckIcon
                            className="w-5 h-5 cursor-pointer text-[#24BE74]"
                        />
                    : 
                        <ClipboardIcon
                            title="copy"
                            className="w-5 h-5 cursor-pointer" 
                            onClick={async()=>{
                                copyText(wallet.privateKey).then((res)=>{
                                    console.log(res);
                                    handleCopy(res);
                                    setTimeout(()=>{handleCopy(false)},2500)
                                });
                            }}
                        />
                    }
                    
                    
                    <Disclosure.Button className="py-2 flex justify-center items-center gap-4 ">
                        
                        <h1 title="private key">
                            {wallet.privateKey}  
                        </h1>
                        <ChevronUpIcon
                            className={`
                                ${open ? 'rotate-180 transform' : ' '} 
                                h-5 w-5 text-purple-500 transition-transform duration-[300ms]`
                            }
                        />
                        {checked && Object.values(checked).map((check,index)=>{
                            if(check) {
                                return (
                                    <CheckIcon
                                        key={check+""+index}
                                        className="w-5 h-5 cursor-pointer text-[#24BE74]"
                                    />
                                )
                            }
                            else {
                                return (
                                    <div 
                                        key={check+""+index} 
                                        onMouseEnter={()=>setIsHover(true)}
                                        onMouseLeave={()=>{setIsHover(false)}} 
                                        className="h-6 w-6"
                                    >
                                        {isHover ? 
                                        <ArrowPathIcon onClick={()=>{checkAddress(index)}} className="h-5 w-5"/> 
                                        : 
                                        <XMarkIcon  className="h-6 w-6 text-red-500" />} 
                                    </div>
                                )
                            }
                        })}
                        {/* {checked ? <CheckIcon
                            className="w-5 h-5 cursor-pointer text-[#24BE74]"
                        /> : <div onMouseEnter={()=>setIsHover(true)} onMouseLeave={()=>{setIsHover(false)}} className="h-6 w-6">
                                {isHover ? 
                                <ArrowPathIcon onClick={checkAddress} className="h-5 w-5"/> 
                                : 
                                <XMarkIcon  className="h-6 w-6 text-red-500" />}
                                
                                
                            </div>} */}
                    </Disclosure.Button>
                </div>
                <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-100 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Disclosure.Panel className="pb-3 px-5">
                        {Object.entries(wallet).map((element,index1)=> (
                            <div key={index1} className="flex gap-4">
                                {element.map((values,index2)=> (
                                    <div key={index1+index2}>
                                        {values == "mnemonic" && <></>}
                                        {values == "checked" && <></>}
                                        {values == null && <h1>{values + ""}</h1>}
                                        {typeof values != 'object' && <h1>{values}</h1>}
                                </div>
                                ))}
                            </div>
                        ))}
                    </Disclosure.Panel>
                </Transition>
            </div>
            )}
        </Disclosure>
    )
}