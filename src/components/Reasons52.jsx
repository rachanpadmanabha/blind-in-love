import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Hand } from 'lucide-react'
import { REASONS_20 } from '../config'

const reasons = Array.isArray(REASONS_20) ? REASONS_20 : []

export default function Reasons52() {
  const [flipped, setFlipped] = useState({})

  const toggle = (i) => {
    setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  return (
    <section className="reasons52-section section">
      <p className="section-label">
        <Heart size={22} className="section-label-icon" aria-hidden /> 20 reasons
      </p>
      <h2 className="section-title">
        <Heart size={26} className="section-title-icon" aria-hidden /> Why I love you
      </h2>
      <p className="reasons52-hint">
        <Hand size={18} className="reasons52-hint-icon" aria-hidden /> Tap a card to reveal
      </p>
      <div className="reasons52-list">
        {reasons.map((reason, i) => (
          <motion.div
            key={i}
            className={`reason-item ${flipped[i] ? 'reason-item-revealed' : ''}`}
            onClick={() => toggle(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggle(i)}
            initial={false}
            animate={{
              scale: flipped[i] ? 1.02 : 1,
              boxShadow: flipped[i]
                ? '0 12px 40px rgba(255, 45, 106, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                : '0 4px 20px rgba(0, 0, 0, 0.15)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="reason-num">{i + 1}</span>
            <div className="reason-content">
              <AnimatePresence mode="wait">
                {flipped[i] ? (
                  <motion.p
                    key="text"
                    className="reason-text"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    {reason}
                  </motion.p>
                ) : (
                  <motion.span
                    key="hint"
                    className="reason-tap-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Tap to reveal
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
