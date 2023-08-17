'use client'
import { useEffect, useState } from 'react';
import anime from 'animejs';
import { useRouter } from 'next/router';

export const StarrySky = () => {
    const [dimensions, setDimensions] = useState({
      num: 60,
      vw: 0,
      vh: 0,
    });
  
    const getRandomInt = (min:number,max:number)=>{
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const starryNight = () => {
      anime({
        targets: ["#sky .star"],
        opacity: [
          {
            duration: 700,
            value: "0",
          },
          {
            duration: 700,
            value: "1",
          },
        ],
        easing: "linear",
        loop: true,
        delay: (el, i) => 50 * i,
      });
    };
  
    const shootingStars = () => {
      anime({
        targets: ["#shootingstars .wish"],
        easing: "linear",
        loop: true,
        delay: (el, i) => 1000 * i,
        opacity: [
          {
            duration: 700,
            value: "1",
          },
        ],
        width: [
          {
            value: "150px",
          },
          {
            value: "0px",
          },
        ],
        translateX: 350,
      });
    };
  
    const randomRadius = () => {
      return Math.random() * 0.7 + 0.6;
    };
  
    const getRandomX = () => {
      return Math.floor(Math.random() * Math.floor(dimensions.vw)).toString();
    };
  
    const getRandomY = () => {
      return Math.floor(Math.random() * Math.floor(dimensions.vh)).toString();
    };
    function handleResize() {
      setDimensions({
          num: getRandomInt(60, 100),
          vw: window.innerWidth,
          vh: window.innerHeight
      });
    }
    useEffect(() => {
      
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        starryNight();
        shootingStars();

        const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        setDimensions({
            num: getRandomInt(60, 100),
            vw,
            vh
        });


        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }
    }, []);
    const router = useRouter();

    useEffect(() => {
      const skyElement = document.querySelector('#sky');
      if (skyElement) {
          skyElement.classList.add('zoom');
          setTimeout(() => {
              skyElement.classList.remove('zoom');
          }, 2000)
      }
  }, [router.pathname]);

  const [isClientLoaded, setIsClientLoaded] = useState(false); // новый стейт

  useEffect(() => {
      setIsClientLoaded(true);
  }, []);

    return isClientLoaded && (
      <>
        <svg id="sky" className='inset-0 animate-spin-slow  -z-10' >
          {[...Array(dimensions.num)].map((x, y) => (
            <circle
              cx={getRandomX()}
              cy={getRandomY()}
              r={randomRadius()}
              stroke="none"
              strokeWidth="0"
              fill="white"
              key={y}
              className="star"
            />
          ))}
        </svg>
        <div id="shootingstars" className='-z-10'>
          {[...Array(60)].map((x, y) => (
            <div
              key={y}
              className="wish"
              style={{
                left: `${getRandomY()}px`,
                top: `${getRandomX()}px`,
              }}
            />
          ))}
        </div>
      </>
    );
};
