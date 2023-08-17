import { ChangeEvent, Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from "react";
import { DOTS, usePagination } from "./use-pagination";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";

interface PaginationType {
    onPageChange: (page: number) => void
    currentPage: number,
    totalPageCount: number,
    siblingCount?: number,
    classes?: string
}
export default function Pagination({onPageChange, currentPage, totalPageCount, siblingCount = 1, classes = ''}: PaginationType) {
    const [isOpen, setPopup] = useState<boolean>(false)
    const paginationRange: (string | number)[] = usePagination({
        currentPage,
        totalPageCount,
        siblingCount
    }) || [];
    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }
    const onPrevious = (): void => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };
    const onNext = (): void => {
        if (currentPage < totalPageCount) onPageChange(currentPage + 1);
    };
    return (
        <>
            <ul
                className={(classes ? `${classes} ` : '') + "group justify-center flex space-x-2 pb-5 concurrent font-medium text-lg"}
            >
                <li
                    onClick={onPrevious}
                    className={clsx("w-10 h-10 flex items-center justify-center rounded-lg border border-solid border-[#D1D5DB]", {
                        'opacity-50 cursor-not-allowed': currentPage === 1,
                        'cursor-pointer': currentPage > 1
                    })}
                >
                    <span className="leading-[0.6]">{"<"}</span>
                </li>
                {paginationRange.map((pageNumber, i) => {
                    if (pageNumber === DOTS) {
                        return (
                            <li
                                key={pageNumber + i}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-solid border-[#D1D5DB] cursor-pointer"
                                onClick={() => setPopup(true)}
                            >
                                {DOTS}
                            </li>
                        )
                    }

                    return (
                        <li
                            key={pageNumber}
                            className={clsx("w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer", {
                                'bg-[#1F2937] text-white': currentPage === pageNumber,
                                'border border-solid border-[#D1D5DB]':  currentPage !== pageNumber
                            })}
                            onClick={() => onPageChange(pageNumber as number)}
                        >
                            {pageNumber}
                        </li>
                    )
                })}
                <li
                    onClick={onNext}
                    className={clsx("w-10 h-10 flex items-center justify-center rounded-lg border border-solid border-[#D1D5DB]", {
                        'opacity-50 cursor-not-allowed': currentPage === totalPageCount,
                        'cursor-pointer': currentPage < totalPageCount
                    })}
                >
                    <span className="leading-[0.6]">{">"}</span>
                </li>
            </ul>
            <PopupChangePage
                onPageChange={onPageChange}
                isOpen={isOpen}
                setPopup={setPopup}
                totalPageCount={totalPageCount}
            />
        </>
    )
}


interface PopupChangePageProps {
    isOpen: boolean,
    setPopup: Dispatch<SetStateAction<boolean>>
    onPageChange: (page: number) => void,
    totalPageCount: number
}
function PopupChangePage({isOpen, setPopup, onPageChange, totalPageCount}: PopupChangePageProps): JSX.Element {
    const [value, setValue] = useState<string>('');
    let initialFocus = useRef<HTMLInputElement | null>(null);

    const changeValue = (e: ChangeEvent<HTMLInputElement>): void => {
        const inputValue: string = e.target.value;
        if (/^(?!0)\d*$/.test(inputValue)) setValue(inputValue);
    }
    const sendValue = (): void => {
       console.log(initialFocus.current.value);
        if(+initialFocus.current.value < 1 || initialFocus.current.value == "") {
            onPageChange(1)
        } 
        else if (+initialFocus.current.value > totalPageCount) {
            console.log(totalPageCount);
            onPageChange(totalPageCount)
        }
        else {
            onPageChange(+initialFocus.current.value);
        }
        // else if()




        setPopup(false);

        // if (+initialFocus.current.value < 1) {
        //     console.log('1');
        
        // } else if (+initialFocus.current.value > totalPageCount) {
        //     console.log(totalPageCount);
        //     onPageChange(totalPageCount)
        //     setPopup(false)
        // } else {
        //     console.log('3');
        //     onPageChange(+value)
        //     setPopup(false)
        // }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
          if (event.key === 'Enter') sendValue();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

    return (
        <Transition
            show={isOpen}
            as={Fragment}
            afterLeave={() => {
                setValue('')
            }}
        >
            <Dialog as="div" initialFocus={initialFocus} className={"relative z-50 "} onClose={() => setPopup(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out transition-[opacity] duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in transition-[opacity] duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed improve-performance inset-0 bg-black/[0.50] backdrop-blur" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out transition-[opacity,transform] duration-150"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in transition-[opacity,transform] duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative w-full max-w-[460px] overflow-hidden rounded-3xl bg-white py-10 px-4 shadow-xl">
                                <button onClick={() => setPopup(false)} className="absolute cursor-pointer top-5 right-5">
                                    {/* <Icon name="close" className="w-4 h-4"/> */}
                                </button>
                                <Dialog.Title
                                    as="h2"
                                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                                >
                                    Введите страницу
                                </Dialog.Title>
                                <input
                                    ref={initialFocus}
                                    value={value}
                                    onChange={changeValue}
                                    type="text"
                                    className="border border-solid border-[#D1D5DB] rounded-md px-4 py-2"
                                />
                                <div className="mt-6">
                                    <button
                                        className="bg-[#111827] rounded-md px-8 py-2 text-white duration-200 ease-out hover:bg-[#374151]"
                                        onClick={sendValue}
                                    >
                                        Принять
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}