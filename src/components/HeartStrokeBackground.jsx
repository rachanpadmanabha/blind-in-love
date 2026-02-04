import { useMemo } from 'react'
import './HeartStrokeBackground.css'

const N = 8
const W = 400
const H = 300
const DA = 1180
const HEART_PATH = 'M-50 156c369-94 309-406 72-203c42-218-391-53-89 195'
const MASK_PATH = 'M-50 156c349-101 289-386 62-183c42-205-346-83-79 175'

function useHeartItems() {
  return useMemo(() => {
    const items = []
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const x = i * 1.25 * W
        const y = j * 1.25 * H
        const rot = Math.floor(Math.random() * 50 - 30)
        const f = Math.pow(-1, i + j) * Math.random() * 0.25 + 1
        const skew = Math.floor(Math.random() * 50 - 30)
        const t = (5 + 0.1 * Math.random() * 100) * 1000
        const delay = -0.01 * Math.random() * 100 * t
        const hue = 330 + Math.floor(Math.random() * 25)
        const sat = 70 + Math.floor(Math.random() * 26)
        const light = 47 + Math.floor(Math.random() * 26)
        items.push({
          key: `${i}-${j}`,
          transform: `translate(${x}, ${y}) rotate(${rot}) scale(${f} ${f}) skewX(${skew})`,
          stroke: `hsl(${hue}, ${sat}%, ${light}%)`,
          duration: `${t}ms`,
          delay: `${delay}ms`,
        })
      }
    }
    return items
  }, [])
}

export default function HeartStrokeBackground() {
  const items = useHeartItems()
  const viewBox = [-0.5 * W, -0.5 * H, 10 * W, 10 * H].join(' ')

  return (
    <div className="heart-stroke-bg" aria-hidden="true">
      <svg
        className="heart-stroke-svg"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <clipPath id="heart-stroke-clip">
            <path id="heart-stroke-path" d={HEART_PATH} />
          </clipPath>
          <mask id="heart-stroke-mask" maskUnits="userSpaceOnUse">
            <rect x="-200" y="-150" width="410" height="310" fill="#fff" />
            <path d={MASK_PATH} />
          </mask>
        </defs>
        {items.map((item) => (
          <use
            key={item.key}
            href="#heart-stroke-path"
            transform={item.transform}
            style={{
              stroke: item.stroke,
              animationDuration: item.duration,
              animationDelay: item.delay,
            }}
          />
        ))}
      </svg>
    </div>
  )
}
