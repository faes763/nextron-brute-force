import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useHeader } from '../../store/useHeader'
import { Card } from "../animation/dock/Card";
import { ipcRenderer } from 'electron';
import Pagination from '../pagination/pagination';
import { Dock } from '../animation/dock/Dock';
import { DockDivider } from '../animation/dock/DockDivider';



export default function Modal() {
  const {isOpen,close} = useHeader();
  const [gradients,setGradients] = useState([[]]);
  const [page,setPage] = useState(1);
  const test = async()=>{
    const data = await ipcRenderer.invoke('get-images');    
    setGradients(data)
  }
  useEffect(()=>{
    test();
  },[])
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" w-full transform overflow-hidden rounded-2x  transition-all">
                    <Dock>
                        {gradients[page-1].map((src, index) =>
                        src ? (
                          <Card src={src} key={src}/>
                        ) : (
                          <DockDivider key={index} />
                        )
                        )}
                    </Dock>
                    <Pagination
                        totalPageCount={gradients.length} 
                        onPageChange={setPage} 
                        currentPage={page}
                    />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
