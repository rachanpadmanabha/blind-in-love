import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Key, Unlock } from 'lucide-react'
import { SECRET_CODE } from '../config'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']

export default function SecretSection({ onUnlock }) {
  const [codeInput, setCodeInput] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [konamiIndex, setKonamiIndex] = useState(0)
  const [wrong, setWrong] = useState(false)

  const tryCode = useCallback(() => {
    const normalized = codeInput.trim().toLowerCase()
    if (normalized === SECRET_CODE.toLowerCase()) {
      onUnlock()
      setShowInput(false)
      setCodeInput('')
      setWrong(false)
    } else {
      setWrong(true)
      setTimeout(() => setWrong(false), 800)
    }
  }, [codeInput, onUnlock])

  useEffect(() => {
    const handleOpen = () => setShowInput(true)
    window.addEventListener('openSecretInput', handleOpen)
    return () => window.removeEventListener('openSecretInput', handleOpen)
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === KONAMI[konamiIndex]) {
        if (konamiIndex === KONAMI.length - 1) {
          setShowInput(true)
          setKonamiIndex(0)
        } else {
          setKonamiIndex((i) => i + 1)
        }
      } else {
        setKonamiIndex(0)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [konamiIndex])

  return (
    <>
      <AnimatePresence>
        {showInput && (
          <motion.div
            className="secret-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInput(false)}
          >
            <motion.div
              className="secret-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="secret-modal-title">
                <Key size={28} className="secret-modal-title-icon" aria-hidden /> You found the secret
              </p>
              <p className="secret-modal-hint">
                <Key size={18} className="secret-modal-hint-icon" aria-hidden /> Enter the code
              </p>
              <input
                type="text"
                className={`secret-input ${wrong ? 'wrong' : ''}`}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && tryCode()}
                placeholder="..."
                autoFocus
              />
              <div className="secret-modal-buttons">
                <button type="button" className="btn-secret secondary" onClick={() => setShowInput(false)}>
                  Cancel
                </button>
                <button type="button" className="btn-secret primary" onClick={tryCode}>
                  <Unlock size={18} className="btn-secret-icon" aria-hidden /> Unlock
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
