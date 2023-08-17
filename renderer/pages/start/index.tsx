import { useRouter } from 'next/router';
import { Suspense, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spring from '../../components/background/spring';
import { motion } from 'framer-motion';
import { StarIcon } from '../../components/animation/start/starIcon';
import clsx from 'clsx';
export default function Start() {
    const [toastId, setToastId] = useState(null);
    const [isHover, setIsHover] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const router = useRouter();
    const notify = () => {
        if (!toast.isActive(toastId)) {
            setToastId(toast.success("Ready!", { autoClose: 1600, pauseOnHover: false, onClose: startApp}));
        }
    };

    const startApp = ()=>{
        router.push('/wallets');
    }
    return (
        <div className='w-full h-full fixed flex justify-center items-center pb-28 '>
            <Spring/>
            <motion.button
                onHoverStart={() => setIsHover(true)}
                onHoverEnd={() => setIsHover(false)}
                onClick={() => {    
                    setIsLiked(true);
                    notify();
                }} 
                className={clsx(
                    'z-[9999] flex concurrent border concurrent-border  pl-4 gap-2 rounded-3xl uppercase tracking-widest',
                    !isLiked && 'py-2 pr-6',
                    isLiked && "pr-12 py-2"
                )}
            >
                <Suspense>
                    <StarIcon isLiked={isLiked} isHover={isHover}/>
                </Suspense>
                Start
            </motion.button>
            <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} pauseOnHover={false} newestOnTop={true} />
        </div>
    )
}