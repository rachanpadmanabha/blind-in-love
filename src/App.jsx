import { useState, useMemo, useRef } from 'react'
import {  AnimatePresence } from 'framer-motion'
import './App.css'
import { NAMES } from './config'
import { Heart, ArrowDown, Lock, Flower2 } from 'lucide-react'
import CustomCursor from './components/CustomCursor'
import Countdown from './components/Countdown'
import LoveLetter from './components/LoveLetter'
import Reasons52 from './components/Reasons52'
import Quiz from './components/Quiz'
import SecretSection from './components/SecretSection'
import SecretGardenPage from './components/SecretGardenPage'
import ConfettiCanvas from './components/ConfettiCanvas'
import HeartStrokeBackground from './components/HeartStrokeBackground'

// Import your photos from assets (add more imports if you have different filenames)
import photo1 from './assets/photo_2026-02-04 17.30.34.jpeg'
import photo2 from './assets/photo_2026-02-04 17.30.37.jpeg'
import photo3 from './assets/photo_2026-02-04 17.30.38.jpeg'
import photo4 from './assets/photo_2026-02-04 17.30.40.jpeg'
import photo5 from './assets/photo_2026-02-04 17.30.41.jpeg'
import photo6 from './assets/photo_2026-02-04 17.30.42.jpeg'
import photo7 from './assets/photo_2026-02-04 17.30.43.jpeg'
import photo8 from './assets/photo_2026-02-04 17.30.45.jpeg'
import photo9 from './assets/photo_2026-02-04 17.30.46.jpeg'
import photo10 from './assets/photo_2026-02-04 17.30.47.jpeg'
import photo11 from './assets/WhatsApp Image 2026-02-05 at 12.45.42 AM (1).jpeg'
import photo12 from './assets/WhatsApp Image 2026-02-05 at 12.45.42 AM.jpeg'
import photo13 from './assets/WhatsApp Image 2026-02-05 at 12.45.43 AM (1).jpeg'
import photo14 from './assets/WhatsApp Image 2026-02-05 at 12.45.43 AM (2).jpeg'
import photo15 from './assets/WhatsApp Image 2026-02-05 at 12.45.43 AM (3).jpeg'
import photo16 from './assets/WhatsApp Image 2026-02-05 at 12.45.43 AM.jpeg'

const PHOTOS = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10, photo11, photo12, photo13, photo14, photo15, photo16]

const HEART_COLORS = ['#e91e63', '#ff2d6a', '#ff6b6b', '#c71585', '#ff69d2']


function FloatingHearts() {
  const hearts = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: HEART_COLORS[i % HEART_COLORS.length],
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 12 + Math.random() * 10,
    })),
    []
  )
  return (
    <div className="hearts-bg" aria-hidden="true">
      {hearts.map(({ id, color, left, delay, duration }) => (
        <motion.span
          key={id}
          className="heart-float"
          style={{ left: `${left}%`, top: '100%' }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: '-120vh',
            opacity: [0, 0.5, 0.5, 0],
            rotate: 360,
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay: delay,
          }}
        >
          <Heart size={26} color={color} fill={color} strokeWidth={1.5} aria-hidden />
        </motion.span>
      ))}
    </div>
  )
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1 },
}

const YES_STEPS = [
  { label: 'Yes!', scale: 1 },
  { label: 'Really?', scale: 1.22 },
  { label: 'Are you sure?', scale: 1.45 },
  { label: 'Really really?', scale: 1.65 },
  { label: 'One more time...', scale: 1.9 },
]

function YesButton({ step, onPress, pumpTriggerRef, onPumpComplete }) {
  const prevScale = step === 0 ? 1 : YES_STEPS[step - 1].scale
  const nextScale = YES_STEPS[step].scale
  const isPumping = pumpTriggerRef.current === step

  const pumpKeyframes = {
    scale: [prevScale, nextScale * 1.2, nextScale * 0.97, nextScale],
    rotate: [0, -2, 2, -1.5, 1.5, -0.5, 0],
    boxShadow: [
      '0 8px 30px rgba(255, 45, 106, 0.5)',
      '0 0 35px rgba(255, 45, 106, 0.85), 0 0 70px rgba(255, 105, 150, 0.5), 0 24px 60px rgba(255, 45, 106, 0.6)',
      '0 0 25px rgba(255, 45, 106, 0.6), 0 0 50px rgba(255, 105, 150, 0.3), 0 16px 48px rgba(255, 45, 106, 0.5)',
      `0 ${8 + nextScale * 4}px ${28 + nextScale * 12}px rgba(255, 45, 106, 0.5)`,
    ],
  }

  const pumpTransition = {
    duration: 0.85,
    times: [0, 0.2, 0.45, 0.65, 0.8, 0.92, 1],
  }

  return (
    <div className="btn-yes-wrap">
      <motion.button
        className="btn-valentine btn-yes"
        onClick={onPress}
      initial={false}
      animate={
        isPumping
          ? pumpKeyframes
          : {
              scale: nextScale,
              rotate: 0,
              boxShadow: '0 8px 30px rgba(255, 45, 106, 0.5)',
            }
      }
      transition={
        isPumping
          ? pumpTransition
          : { type: 'spring', stiffness: 400, damping: 28 }
      }
      onAnimationComplete={() => {
        if (pumpTriggerRef.current === step) {
          pumpTriggerRef.current = null
          onPumpComplete?.()
        }
      }}
      whileHover={{ scale: nextScale * 1.05 }}
      whileTap={{ scale: nextScale * 0.96 }}
      >
        {YES_STEPS[step].label}
        <Heart size={20} className="btn-yes-icon" strokeWidth={2} aria-hidden />
      </motion.button>
    </div>
  )
}

function App() {
  const [saidYes, setSaidYes] = useState(false)
  const [yesClickCount, setYesClickCount] = useState(0)
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
  const [confetti, setConfetti] = useState(false)
  const [secretUnlocked, setSecretUnlocked] = useState(false)
  const [quizUnlocked, setQuizUnlocked] = useState(false)

  const pumpTriggerRef = useRef(null)
  const [, setPumpDone] = useState(0)

  const handleYes = () => {
    if (yesClickCount < YES_STEPS.length - 1) {
      pumpTriggerRef.current = yesClickCount + 1
      setYesClickCount((c) => c + 1)
      return
    }
    setSaidYes(true)
    setConfetti(true)
  }

  const handleNoMove = () => {
    const maxX = typeof window !== 'undefined' && window.innerWidth < 480 ? 140 : 260
    const maxY = 100
    setNoPosition({
      x: (Math.random() - 0.5) * maxX * 2,
      y: (Math.random() - 0.5) * maxY * 2,
    })
  }

  const heroTapCount = useRef(0)
  const heroTapTimeout = useRef(null)
  const handleHeroTap = () => {
    heroTapCount.current += 1
    if (heroTapTimeout.current) clearTimeout(heroTapTimeout.current)
    if (heroTapCount.current >= 3) {
      window.dispatchEvent(new CustomEvent('openSecretInput'))
      heroTapCount.current = 0
    } else {
      heroTapTimeout.current = setTimeout(() => { heroTapCount.current = 0 }, 600)
    }
  }

  if (secretUnlocked) {
    return (
      <>
        <CustomCursor />
        <SecretGardenPage photos={PHOTOS} onBack={() => setSecretUnlocked(false)} />
      </>
    )
  }

  return (
    <>
      <CustomCursor />
      <HeartStrokeBackground />
      <div className="gradient-bg gradient-bg-subtle" aria-hidden="true" />
      <FloatingHearts />

      <motion.section
        className="hero section"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div
          className="hero-title-wrap"
          variants={item}
          onClick={handleHeroTap}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleHeroTap()}
          style={{ cursor: 'pointer' }}
        >
          <h1 className="hero-title">Blind in Love</h1>
        </motion.div>
        <motion.p className="hero-sub" variants={item}>
          For {NAMES.her}, always - {NAMES.his}
        </motion.p>
        <motion.p className="scroll-hint" variants={item}>
          <ArrowDown size={20} aria-hidden /> scroll down
        </motion.p>
      </motion.section>

      <Reasons52 />
      <Countdown />
      <LoveLetter />

      <Quiz onPerfectScore={() => setQuizUnlocked(true)} />

      <section className="valentine-section section">
        <AnimatePresence mode="wait">
          {!quizUnlocked ? (
            <motion.div
              key="locked"
              className="valentine-locked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="valentine-locked-label" aria-hidden="true">
                <Lock size={40} strokeWidth={1.5} />
              </p>
              <h2 className="valentine-locked-title">Get 7 out of 7 on the quiz above</h2>
              <p className="valentine-locked-sub">Only then can you see the question below, {NAMES.her} — and only then can you click Yes.</p>
            </motion.div>
          ) : !saidYes ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="valentine-section"
            >
              <p className="valentine-question">So, {NAMES.her}...</p>
              <h2 className="valentine-title">
                <Heart size={32} className="valentine-title-icon" aria-hidden /> Will you be my Valentine?
              </h2>
              <div className="buttons-wrap buttons-wrap-pump">
                <YesButton
                  step={yesClickCount}
                  onPress={handleYes}
                  pumpTriggerRef={pumpTriggerRef}
                  onPumpComplete={() => setPumpDone((d) => d + 1)}
                />
                <motion.button
                  className="btn-valentine btn-no"
                  onMouseEnter={handleNoMove}
                  onClick={handleNoMove}
                  animate={{ x: noPosition.x, y: noPosition.y }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  No
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="celebration"
              className="celebration-wrap"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="celebration-title">
                <Heart size={36} className="celebration-title-icon" aria-hidden /> You said yes, {NAMES.her}
              </h2>
              <p className="celebration-sub">I'm the luckiest, {NAMES.her}.</p>
              <p className="celebration-line">Can't wait to be your Valentine - and to keep choosing you, every day.</p>
              <p className="celebration-love">Love you so much, always. - {NAMES.his}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <ConfettiCanvas active={confetti} onComplete={() => setConfetti(false)} />

      <SecretSection onUnlock={() => setSecretUnlocked(true)} />

      <p className="secret-hint-end">
        <Flower2 size={18} className="secret-hint-icon" aria-hidden /> Tap the title 3 times for something hidden, {NAMES.her}
      </p>
      <p className="names-footer">
        <Heart size={18} className="names-footer-icon" aria-hidden /> {NAMES.his} & {NAMES.her}
      </p>
    </>
  )
}

export default App
