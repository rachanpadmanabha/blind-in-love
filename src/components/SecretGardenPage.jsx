import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flower2, X, ArrowLeft } from 'lucide-react'
import { PHOTO_CAPTIONS, NAMES } from '../config'
import './SecretGardenPage.css'

// Scattered polaroid layout – like photos dropped on a table (no strict columns).
const POLAROID_LAYOUT = [
  { left: 8, top: 60, rotate: -8, scale: 1 },
  { left: 52, top: 40, rotate: 5, scale: 0.95 },
  { left: 28, top: 320, rotate: 3, scale: 1.08 },
  { left: 68, top: 280, rotate: -6, scale: 0.92 },
  { left: 12, top: 540, rotate: -4, scale: 1.02 },
  { left: 58, top: 500, rotate: 7, scale: 0.98 },
  { left: 38, top: 720, rotate: -2, scale: 1.05 },
  { left: 72, top: 680, rotate: 4, scale: 0.95 },
  { left: 5, top: 920, rotate: 6, scale: 1 },
  { left: 48, top: 880, rotate: -5, scale: 1.06 },
  { left: 22, top: 1120, rotate: 2, scale: 0.97 },
  { left: 62, top: 1080, rotate: -7, scale: 1.03 },
  { left: 35, top: 1320, rotate: 4, scale: 1 },
  { left: 70, top: 1280, rotate: -3, scale: 0.94 },
  { left: 15, top: 1520, rotate: -1, scale: 1.04 },
  { left: 55, top: 1480, rotate: 5, scale: 0.99 },
]

function buildPolaroidLayout(n) {
  return Array.from({ length: n }, (_, i) => ({
    ...POLAROID_LAYOUT[i % POLAROID_LAYOUT.length],
  }))
}

export default function SecretGardenPage({ photos, onBack }) {
  const [lightbox, setLightbox] = useState(null)
  const [scrollY, setScrollY] = useState(0)

  const layout = useMemo(() => buildPolaroidLayout(photos.length), [photos.length])

  const items = useMemo(
    () =>
      photos.map((src, i) => ({
        src,
        caption: PHOTO_CAPTIONS[i] ?? `Memory ${i + 1}`,
        ...layout[i],
        parallax: 0.15 + (i % 5) * 0.08,
      })),
    [photos, layout]
  )

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="secret-garden-page">
      <div className="secret-garden-page-bg" aria-hidden="true" />
      <motion.header
        className="secret-garden-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flower2 size={36} className="secret-garden-page-icon" strokeWidth={1.5} aria-hidden />
        <h1 className="secret-garden-page-title">{NAMES.her}'s Secret Garden</h1>
        <p className="secret-garden-page-sub">Every moment with you, kept here - from {NAMES.his}</p>
        {onBack && (
          <button
            type="button"
            className="secret-garden-back"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft size={18} className="secret-garden-back-icon" aria-hidden /> Back
          </button>
        )}
      </motion.header>

      <div className="secret-garden-polaroids">
        {items.map((item, i) => (
          <div
            key={i}
            className="polaroid-wrap"
            style={{
              left: `${item.left}%`,
              top: item.top,
              transform: `translateY(${-scrollY * item.parallax}px)`,
            }}
            onClick={() => setLightbox(i)}
          >
            <motion.div
              className="polaroid"
              style={{ rotate: item.rotate }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: item.scale }}
              transition={{ delay: i * 0.08, duration: 0.6, type: 'spring', stiffness: 120 }}
            >
              <div className="polaroid-tape" />
              <div className="polaroid-img-wrap">
                <img src={item.src} alt="" loading="lazy" />
              </div>
              <div className="polaroid-caption">{item.caption}</div>
            </motion.div>
          </div>
        ))}
      </div>

      <footer className="secret-garden-footer">
        <p>- For {NAMES.her} only</p>
        <p className="secret-garden-names">{NAMES.his} & {NAMES.her}</p>
      </footer>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="secret-garden-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="secret-garden-lightbox-inner"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="secret-garden-lightbox-close"
                onClick={() => setLightbox(null)}
                aria-label="Close"
              >
                <X size={24} strokeWidth={2} aria-hidden />
              </button>
              <img src={items[lightbox].src} alt="" />
              <p className="secret-garden-lightbox-caption">{items[lightbox].caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
