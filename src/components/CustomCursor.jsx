import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const SMOOTH = 0.12

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const ref = useRef({ x: 0, y: 0 })
  const raf = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    const handleMove = (e) => {
      if (!ref.current) return
      ref.current.targetX = e.clientX
      ref.current.targetY = e.clientY
      if (!visible) setVisible(true)
      const target = document.elementFromPoint(e.clientX, e.clientY)
      setIsPointer(!!target?.closest('a, button, [role="button"]'))
    }

    const loop = () => {
      const r = ref.current
      if (!r || r.targetX == null) {
        raf.current = requestAnimationFrame(loop)
        return
      }
      r.x += (r.targetX - r.x) * SMOOTH
      r.y += (r.targetY - r.y) * SMOOTH
      setPos({ x: r.x, y: r.y })
      raf.current = requestAnimationFrame(loop)
    }

    const handleLeave = () => setVisible(false)
    const handleEnter = () => setVisible(true)

    ref.current = { x: 0, y: 0, targetX: 0, targetY: 0 }
    window.addEventListener('mousemove', handleMove)
    document.body.addEventListener('mouseleave', handleLeave)
    document.body.addEventListener('mouseenter', handleEnter)
    raf.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.body.removeEventListener('mouseleave', handleLeave)
      document.body.removeEventListener('mouseenter', handleEnter)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [visible])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouch && visible) {
      document.body.style.cursor = 'none'
      return () => { document.body.style.cursor = '' }
    }
  }, [visible])

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null

  return (
    <motion.div
      className="custom-cursor"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.span
        className="cursor-dot"
        animate={{ scale: isPointer ? 1.8 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        ❤️
      </motion.span>
      <motion.span
        className="cursor-ring"
        animate={{ scale: isPointer ? 1.4 : 1, opacity: isPointer ? 0.4 : 0.7 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
    </motion.div>
  )
}
