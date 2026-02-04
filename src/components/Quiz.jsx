import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Heart, Smile, Gamepad2, Sparkles } from 'lucide-react'
import { QUIZ_QUESTIONS, QUIZ_RESULTS } from '../config'

const QUIZ_TOTAL = QUIZ_QUESTIONS.length

export default function Quiz({ onPerfectScore }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)

  const isLast = step === QUIZ_TOTAL - 1
  const current = QUIZ_QUESTIONS[step]

  const pick = (optionIndex) => {
    const next = [...answers, optionIndex]
    setAnswers(next)
    if (isLast) {
      setShowResult(true)
      const finalScore = next.filter((a, i) => a === QUIZ_QUESTIONS[i].correct).length
      if (finalScore === QUIZ_TOTAL && onPerfectScore) onPerfectScore()
    } else {
      setStep((s) => s + 1)
    }
  }

  const score = answers.filter((a, i) => a === QUIZ_QUESTIONS[i].correct).length
  const resultIndex = Math.min(
    Math.floor((score / QUIZ_TOTAL) * QUIZ_RESULTS.length),
    QUIZ_RESULTS.length - 1
  )
  const result = QUIZ_RESULTS[resultIndex]
  const ResultIcon = score >= QUIZ_TOTAL ? Trophy : score >= QUIZ_TOTAL / 2 ? Heart : Smile

  return (
    <motion.section
      className="quiz-section section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <p className="section-label">
        <Gamepad2 size={22} className="section-label-icon" aria-hidden /> A little game
      </p>
      <h2 className="section-title">
        <Sparkles size={26} className="section-title-icon" aria-hidden /> How well do you know us?
      </h2>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz"
            className="quiz-box"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="quiz-progress">
              <motion.div
                className="quiz-progress-bar"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / QUIZ_TOTAL) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="quiz-question">{current.question}</p>
            <div className="quiz-options">
              {current.options.map((opt, i) => (
                <motion.button
                  key={i}
                  type="button"
                  className="quiz-option"
                  onClick={() => pick(i)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
            <p className="quiz-step">
              {step + 1} / {QUIZ_TOTAL}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="quiz-result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <motion.span
              className="quiz-result-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              aria-hidden
            >
              <ResultIcon size={48} strokeWidth={1.5} />
            </motion.span>
            <h3 className="quiz-result-title">{result.title}</h3>
            <p className="quiz-result-sub">{result.sub}</p>
            <p className="quiz-result-score">
              You got {score} out of {QUIZ_TOTAL} right!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
