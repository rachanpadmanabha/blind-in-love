import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Heart } from 'lucide-react'
import { LOVE_LETTER } from '../config'

const TYPE_DELAY = 35
const LINE_PAUSE = 400

export default function LoveLetter() {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return
    const lines = LOVE_LETTER.split('\n')
    let lineIndex = 0
    let charIndex = 0
    let timeoutId

    const typeNext = () => {
      if (lineIndex >= lines.length) {
        setDone(true)
        return
      }
      const line = lines[lineIndex]
      if (charIndex <= line.length) {
        const segment = lines.slice(0, lineIndex).join('\n') + '\n' + line.slice(0, charIndex)
        setDisplayed(segment)
        if (charIndex < line.length) {
          charIndex++
          timeoutId = setTimeout(typeNext, TYPE_DELAY)
        } else {
          lineIndex++
          charIndex = 0
          timeoutId = setTimeout(typeNext, LINE_PAUSE)
        }
      }
    }

    const start = setTimeout(typeNext, 400)
    return () => {
      clearTimeout(start)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [started])

  return (
    <motion.section
      className="letter-section section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <p className="section-label">
        <Mail size={22} className="section-label-icon" aria-hidden /> A letter for you
      </p>
      <h2 className="section-title">
        <Heart size={26} className="section-title-icon" aria-hidden /> From me, with love
      </h2>
      <motion.div
        className="note"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        onViewportEnter={() => setStarted((s) => s || true)}
      >
        <div className="note_content">
          <p className="letter-text">
            {displayed}
            {!done && <span className="letter-caret">|</span>}
          </p>
        </div>
      </motion.div>
    </motion.section>
  )
}
