import { animated, useIsomorphicLayoutEffect, useSpringValue } from '@react-spring/web'
import { useMousePosition } from '../hooks/useMousePosition'
import { useWindowResize } from '../hooks/useWindowResize'
import { useDock } from '../Dock/DockContext'
import { useEffect, useRef, useState } from 'react'
import { changeRoot } from '../../../../utils'

interface DockCardProps {
  children: React.ReactNode
  src: string
}

const INITIAL_WIDTH = 48
const coolBackBall = [97, 98, 99];

export const  DockCard = ({ children, src }: DockCardProps) => {
  const cardRef = useRef<HTMLButtonElement>(null!);
  const [elCenterX, setElCenterX] = useState<number>(0);
  const size = useSpringValue(INITIAL_WIDTH, {
    config: {
      mass: 0.1,
      tension: 320,
    },
  })

  const opacity = useSpringValue(0)
  const y = useSpringValue(0, {
    config: {
      friction: 29,
      tension: 238,
    },
  })

  const dock = useDock()
  
  useMousePosition(
    {
      onChange: ({ value }) => {
        const mouseX = value.x

        if (dock.width > 0) {
          const transformedValue =
            INITIAL_WIDTH + 36 * Math.cos((((mouseX - elCenterX) / dock.width) * Math.PI) / 2) ** 12

          if (dock.hovered) {
            size.start(transformedValue)
          }
        }
      },
    },
    [elCenterX, dock]
  )

  useIsomorphicLayoutEffect(() => {
    if (!dock.hovered) {
      size.start(INITIAL_WIDTH)
    }
  }, [dock.hovered])

  useWindowResize(() => {
    const { x } = cardRef.current.getBoundingClientRect()

    setElCenterX(x + INITIAL_WIDTH / 2)
  })

  const timesLooped = useRef(0)
  const timeoutRef = useRef<any>()
  const isAnimating = useRef(false)


  const handleClick = () => {
    changeRoot('background-main',`url('${src.replace(/\\/g, '/')}')`)
    if(coolBackBall.includes(+src.match(/\d+/)[0])) {
      changeRoot('background-ball',`url('${src.replace(/\\/g, '/')}')`)
    }
      // changeRoot('background-ball',`url(${src}`)
      // body.style.setProperty('--', );
        // body.style.setProperty('--background-ball', src);
    if (!isAnimating.current) {
      isAnimating.current = true
      opacity.start(0.5)

      timesLooped.current = 0

      y.start(-INITIAL_WIDTH / 2, {
        loop: () => {
          return { reverse: true }
        },
      })
    } else {
      clearTimeout(timeoutRef.current)
      opacity.start(0)
      y.start(0)
      isAnimating.current = false
    }
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return (
    <div className={`
    flex flex-col items-center gap-1  
    filter saturate-[.9] brightness-90 
    transition duration-200 hover:saturate-100
    hover:brightness-[1.12] cursor-pointer
    `}>
      <animated.button
        ref={cardRef}
        className={` border border-solid border-white rounded-xl will-change-[height,width]`}
        onClick={handleClick}
        style={{
          width: size,
          height: size,
          y,
        }}>
        {children}
      </animated.button>
      <animated.div className={`w-[6px] h-[6px] rounded-full bg-white will-change-[opacity]`} style={{ opacity }} />
    </div>
  )
}
