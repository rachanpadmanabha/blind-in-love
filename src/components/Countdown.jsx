import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Calendar, CalendarDays, Sun, Clock, Timer, RotateCw } from 'lucide-react'
import { COUNTDOWN_START } from '../config'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function Countdown() {
  const [diff, setDiff] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const start = new Date(COUNTDOWN_START)
      const total = Math.floor((now - start) / 1000)
      if (total < 0) {
        setDiff({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      const totalDays = total / 86400
      const years = Math.floor(totalDays / 365.25)
      const days = Math.floor(totalDays % 365.25)
      const hours = Math.floor((total % 86400) / 3600)
      const minutes = Math.floor((total % 3600) / 60)
      const seconds = total % 60
      setDiff({ years, days, hours, minutes, seconds })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { value: diff.years, label: 'Years', Icon: CalendarDays },
    { value: diff.days, label: 'Days', Icon: Sun },
    { value: diff.hours, label: 'Hours', Icon: Clock },
    { value: diff.minutes, label: 'Mins', Icon: Timer },
    { value: diff.seconds, label: 'Secs', Icon: RotateCw },
  ]

  return (
    <motion.section
      className="countdown-section section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <p className="section-label">
        <Heart size={22} className="section-label-icon" aria-hidden /> Together for
      </p>
      <h2 className="section-title">
        <Calendar size={26} className="section-title-icon" aria-hidden /> Since 26 November 2016
      </h2>
      <motion.div
        className="countdown-grid"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      >
        {units.map((u) => {
          const Icon = u.Icon
          return (
            <div key={u.label} className="countdown-unit">
              <div className="countdown-value-wrap">
                <motion.span
                  className="countdown-value"
                  key={`${u.label}-${u.value}`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {pad(u.value)}
                </motion.span>
              </div>
              <span className="countdown-label">
                <Icon size={14} className="countdown-label-icon" aria-hidden /> {u.label}
              </span>
            </div>
          )
        })}
      </motion.div>
    </motion.section>
  )
}
