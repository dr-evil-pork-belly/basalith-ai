'use client'

import { useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'

const MAX_CHARS = 280

const QUESTIONS = [
  "Whose wisdom do you most wish you could still access?",
  "What would you want the people who come after you to know about you?",
  "What are you building that you want to outlast you?",
]

type Step = 0 | 1 | 2 | 3 // 0-2 questions, 3 = email

export default function FoundingAccess() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const [step, setStep] = useState<Step>(0)
  const [answers, setAnswers] = useState(['', '', ''])
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [position, setPosition] = useState<number | null>(null)

  const currentAnswer = step < 3 ? answers[step] : ''
  const remaining = MAX_CHARS - currentAnswer.length

  const updateAnswer = (val: string) => {
    if (step >= 3) return
    const next = [...answers]
    next[step] = val.slice(0, MAX_CHARS)
    setAnswers(next)
  }

  const advance = () => {
    if (step < 2) setStep((step + 1) as Step)
    else setStep(3)
  }

  const submit = async () => {
    if (!email.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answers }),
      })
      const data = await res.json()
      setPosition(data.position ?? null)
      setSubmitted(true)
    } catch {
      setPosition(null)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id="founding"
      ref={ref}
      style={{
        background: 'var(--shell)',
        padding: '5rem 2rem',
        borderTop: '1px solid rgba(240,237,230,0.10)',
      }}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.48rem', letterSpacing: '0.45em', color: 'var(--silver3)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Founding Access · 135 Positions
          </div>
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--bone)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 1.5rem' }}>
            The registry opens to 135 founding members.
          </h2>
          <p style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '1.05rem', color: 'var(--bone2)', lineHeight: 1.8, margin: 0 }}>
            Founding entities carry the lowest instrument numbers. They accumulate the most Provenance. They become the richest entities in the registry.{' '}
            <em>We are not taking everyone.</em>
          </p>
        </motion.div>

        {/* Form or submitted state */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', padding: '3rem 0' }}
            >
              <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.8rem', color: 'var(--silver)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                Your application is held.
              </div>
              <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--bone2)', lineHeight: 1.7, margin: 0 }}>
                We review founding applications personally. You will hear from us.
              </p>
              {position && (
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.25em', color: 'var(--bone4)', textTransform: 'uppercase', marginTop: '1.5rem' }}>
                  Application #{position} received
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Step indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: i === step && step < 3 ? 'var(--silver)' : i < step ? 'var(--silver3)' : 'var(--silver4)',
                      transition: 'background 0.3s ease',
                    }}
                  />
                ))}
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.42rem', letterSpacing: '0.25em', color: 'var(--bone4)', textTransform: 'uppercase', marginLeft: '0.25rem' }}>
                  Step {Math.min(step + 1, 3)} of 3
                </span>
              </div>

              <AnimatePresence mode="wait">
                {step < 3 ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
                  >
                    <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--bone)', textAlign: 'center', maxWidth: '560px', margin: 0, lineHeight: 1.5 }}>
                      {QUESTIONS[step]}
                    </p>

                    <div style={{ width: '100%' }}>
                      <textarea
                        value={answers[step]}
                        onChange={(e) => updateAnswer(e.target.value)}
                        rows={3}
                        placeholder="Your answer..."
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid var(--silver4)',
                          color: 'var(--bone)',
                          fontFamily: 'var(--serif)',
                          fontWeight: 300,
                          fontSize: '1.1rem',
                          padding: '0.5rem 0',
                          resize: 'none',
                          outline: 'none',
                          textAlign: 'center',
                          minHeight: '80px',
                        }}
                      />
                      <div style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '0.42rem', letterSpacing: '0.1em', color: 'var(--bone4)', marginTop: '0.3rem' }}>
                        {remaining} remaining
                      </div>
                    </div>

                    <button
                      onClick={advance}
                      disabled={!answers[step].trim()}
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '0.5rem',
                        letterSpacing: '0.3em',
                        color: answers[step].trim() ? 'var(--silver2)' : 'var(--bone4)',
                        background: 'transparent',
                        border: `1px solid ${answers[step].trim() ? 'var(--silver3)' : 'rgba(240,237,230,0.1)'}`,
                        padding: '0.65rem 1.5rem',
                        cursor: 'none',
                        textTransform: 'uppercase',
                        transition: 'border-color 0.2s ease, color 0.2s ease',
                      }}
                      onMouseEnter={(e) => { if (answers[step].trim()) { e.currentTarget.style.borderColor = 'var(--silver)'; e.currentTarget.style.color = 'var(--silver)' } }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--silver3)'; e.currentTarget.style.color = 'var(--silver2)' }}
                    >
                      Next →
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
                  >
                    <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--bone)', textAlign: 'center', maxWidth: '560px', margin: 0, lineHeight: 1.5 }}>
                      Where should we reach you?
                    </p>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--silver4)',
                        color: 'var(--bone)',
                        fontFamily: 'var(--serif)',
                        fontWeight: 300,
                        fontSize: '1.1rem',
                        padding: '0.5rem 0',
                        outline: 'none',
                        textAlign: 'center',
                      }}
                    />

                    <button
                      onClick={submit}
                      disabled={submitting || !email.trim()}
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '0.5rem',
                        letterSpacing: '0.28em',
                        color: 'var(--void)',
                        background: submitting ? 'var(--silver3)' : 'var(--silver)',
                        border: 'none',
                        padding: '0.9rem 2rem',
                        cursor: 'none',
                        textTransform: 'uppercase',
                        transition: 'background 0.2s ease',
                        opacity: !email.trim() ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = 'var(--bone)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--silver)' }}
                    >
                      {submitting ? 'Submitting...' : 'Request Access'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
