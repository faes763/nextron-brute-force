import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

const AnimatedText = ({ text,styles }:  {text:string, styles?:string}) => {
  const textRef = useRef<HTMLDivElement>();
  const [onPointed,setPointed] = useState(false);
  const animationRef = useRef(null);

  useEffect(()=>{
    const letters = textRef.current.childNodes;
    const animation = anime.timeline({
      targets: letters,
      delay: anime.stagger(100, {
        grid: [letters.length, 1],
        from: "center"
      }),
      loop: true
    });
    animation
    .add({
      scale: 1.1
    })
    .add({
      scale: 0.8,
      translateY: [-25, 0],
      easing: 'easeOutBounce',
      duration: 1200,
      delay: anime.stagger(100)
    })
    .add({
      letterSpacing: "0.5rem"
    })
    .add({
      scale: 1
    })
    .add({
      letterSpacing: "0.2rem"
    });
  
    animationRef.current = animation;
  },[])


  useEffect(() => {
    if(animationRef.current) {
      if(onPointed) {
        animationRef.current.reset();
        animationRef.current.pause();
      } else {
        animationRef.current.play();
      }
    }
  }, [text,onPointed]);

  return (
    <div onMouseEnter={()=>setPointed(true)} onMouseLeave={()=>setPointed(false)} ref={textRef} className={`animate-me flex tracking-[.2rem]`}>
      {text.split('').map((letter, index) => (
        <span className={`block`} key={index}>{letter}</span>
      ))}
    </div>
  );
};

export default AnimatedText;