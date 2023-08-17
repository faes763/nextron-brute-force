import { useQuery } from 'react-query'
import { LoadingButton } from '../../loading';
import { DockCard } from '../DockCard';

const loadImage = async (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(src);
    img.onerror = reject;
  });
};

interface CardProps {
  src: string
}




export const Card = ({ src }: CardProps) => {
  const { data: imageUrl, status } = useQuery(['fetchImage', src], () => loadImage(src));

  if (status === 'loading' || !imageUrl) {
    return <LoadingButton  
      btnClasses="flex justify-center w-full px-3.5 py-2.5 uppercase font-semibold text-white text-lg  rounded-[40px] cursor-default"
      svgClasses="animate-spin w-5 h-5"
    />
  }

  return (
    <DockCard src={src}>
      <span className={`relative flex justify-center items-center overflow-hidden w-full h-full`}>
        <img className={`absolute z-10 opacity-40 blur-md transform translate-y-10 scale-125`} src={imageUrl as string} alt="" />
        <img className={`w-1/2 h-1/2 rounded-full`} src={imageUrl as string} alt="" />
      </span>
    </DockCard>
    
  );
};