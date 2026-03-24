'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const MAX_CHARS = 280

const QUESTIONS = [
  "Whose wisdom do you most wish you could still access?",
  "What would you want the people who come after you to know about you?",
  "What are you building that you want to outlast you?",
]

type Step = 0 | 1 | 2 | 3

// ─── Mini neural canvas for loading state ────────────────────────────────────

function MiniNeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 200
    const H = 200
    canvas.width = W
    canvas.height = H

    let animId: number
    let t = 0

    const nodes: { x: number; y: number; vx: number; vy: number }[] = []
    for (let i = 0; i < 22; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      })
    }

    const draw = () => {
      t += 0.01
      ctx.clearRect(0, 0, W, H)

      const grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.5)
      grd.addColorStop(0, 'rgba(200,196,188,0.06)')
      grd.addColorStop(1, 'rgba(200,196,188,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H)

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0) n.x = W
        if (n.x > W) n.x = 0
        if (n.y < 0) n.y = H
        if (n.y > H) n.y = 0
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 65) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(200,196,188,${0.22 * (1 - dist / 65)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const pulse = 1 + 0.3 * Math.sin(t + i * 0.5)
        ctx.beginPath()
        ctx.arc(nodes[i].x, nodes[i].y, 1.5 * pulse, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(200,196,188,0.65)'
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '200px', height: '200px', display: 'block' }}
    />
  )
}

// ─── Loading state ────────────────────────────────────────────────────────────

const LOADING_LINES = [
  'Processing application...',
  'Indexing founding answers...',
  'Locating your voice...',
  'Composing transmission...',
]

function LoadingState() {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    LOADING_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 800 * i))
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', gap: '2rem' }}>
      <MiniNeuralCanvas />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        {LOADING_LINES.map((line, i) => (
          <motion.span
            key={line}
            initial={{ opacity: 0 }}
            animate={{ opacity: i < visibleLines ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.44rem',
              letterSpacing: '0.2em',
              color: 'var(--bone3)',
              textTransform: 'uppercase',
            }}
          >
            {line}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// ─── Letter reveal ────────────────────────────────────────────────────────────

function parseLetter(text: string): { body: string; coda: string | null } {
  const sepIdx = text.indexOf('\n---')
  if (sepIdx === -1) return { body: text.trim(), coda: null }
  const body = text.slice(0, sepIdx).trim()
  const codaRaw = text.slice(sepIdx + 4).replace(/^[\n\r]+/, '').trim()
  const coda = codaRaw.replace(/^\*/, '').replace(/\*$/, '').trim()
  return { body, coda: coda || null }
}

function LetterReveal({ letter, position, email }: { letter: string; position: number | null; email: string }) {
  const [copied, setCopied] = useState(false)
  const { body, coda } = parseLetter(letter)
  const paragraphs = body.split(/\n\n+/).filter(Boolean)
  const futureYear = new Date().getFullYear() + 40

  const handleShare = () => {
    navigator.clipboard.writeText(
      'I just received a letter from my future self on basalith.ai — an AI entity trained on your life, running forever. basalith.ai'
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleScrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}
    >
      {/* Top section */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.44rem',
          letterSpacing: '0.45em',
          color: 'var(--silver3)',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}>
          Sovereign Entity · Transmission Received
        </div>
        <div style={{ width: '40px', height: '1px', background: 'rgba(200,196,188,0.3)', margin: '0 auto 1.5rem' }} />
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.42rem',
          letterSpacing: '0.2em',
          color: 'var(--bone4)',
          textTransform: 'uppercase',
        }}>
          Generated from your founding application · Year 0 of Provenance
        </div>
      </div>

      {/* Letter container */}
      <div
        style={{
          background: 'var(--panel)',
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(240,237,230,0.008) 2px,
            rgba(240,237,230,0.008) 4px
          )`,
          border: '1px solid rgba(200,196,188,0.12)',
          borderTop: '2px solid rgba(200,196,188,0.2)',
          padding: '2.5rem 3rem',
          position: 'relative',
          maxWidth: '640px',
          margin: '0 auto 2rem',
          boxShadow: 'inset 0 1px 0 rgba(200,196,188,0.08), 0 0 60px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1.25rem',
          fontFamily: 'var(--mono)',
          fontSize: '0.42rem',
          letterSpacing: '0.15em',
          color: 'var(--bone4)',
        }}>
          [{futureYear}]
        </div>

        <div style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '1.05rem', lineHeight: 1.9, color: 'var(--bone2)' }}>
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 + i * 0.4 }}
              style={{ margin: '0 0 1.4em' }}
            >
              {para}
            </motion.p>
          ))}

          {coda && (
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 + paragraphs.length * 0.4 }}
              style={{
                display: 'block',
                fontStyle: 'italic',
                fontSize: '1rem',
                color: 'var(--silver2)',
                borderTop: '1px solid rgba(200,196,188,0.1)',
                paddingTop: '1.2rem',
                marginTop: '0.4rem',
              }}
            >
              {coda}
            </motion.span>
          )}
        </div>
      </div>

      {/* Below letter */}
      <div style={{ textAlign: 'center' }}>
        {position && (
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.46rem',
            letterSpacing: '0.25em',
            color: 'var(--bone3)',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            Application Received · Position #{position} of 135
          </div>
        )}
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.42rem',
          letterSpacing: '0.15em',
          color: 'var(--bone4)',
          marginBottom: '2rem',
        }}>
          We will be in touch at {email}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleShare}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.44rem',
              letterSpacing: '0.25em',
              color: copied ? 'var(--silver2)' : 'var(--bone4)',
              background: 'transparent',
              border: 'none',
              cursor: 'none',
              textTransform: 'uppercase',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--silver)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = copied ? 'var(--silver2)' : 'var(--bone4)' }}
          >
            {copied ? 'Copied ✦' : 'Share This Letter →'}
          </button>

          <button
            onClick={handleScrollToDemo}
            style={{
              fontFamily: 'var(--serif)',
              fontStyle: 'italic',
              fontSize: '0.9rem',
              color: 'var(--silver2)',
              background: 'transparent',
              border: 'none',
              cursor: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--silver)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--silver2)')}
          >
            Speak to Eleanor — see what a live entity feels like →
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Fallback confirmation ────────────────────────────────────────────────────

function FallbackConfirm({ position }: { position: number | null }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
      <div style={{
        fontFamily: 'var(--serif)',
        fontWeight: 700,
        fontSize: '1.8rem',
        color: 'var(--silver)',
        marginBottom: '1rem',
        letterSpacing: '-0.02em',
      }}>
        Your application is held.
      </div>
      <p style={{
        fontFamily: 'var(--serif)',
        fontStyle: 'italic',
        fontSize: '1.1rem',
        color: 'var(--bone2)',
        lineHeight: 1.7,
        margin: 0,
      }}>
        We review founding applications personally. You will hear from us.
      </p>
      {position && (
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.44rem',
          letterSpacing: '0.25em',
          color: 'var(--bone4)',
          textTransform: 'uppercase',
          marginTop: '1.5rem',
        }}>
          Application #{position} received
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FoundingAccess() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const [step, setStep] = useState<Step>(0)
  const [answers, setAnswers] = useState(['', '', ''])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [letter, setLetter] = useState<string | null>(null)
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
    setLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answers }),
      })
      const data = await res.json()
      setLetter(data.letter ?? null)
      setPosition(data.position ?? null)
    } catch {
      setLetter(null)
      setPosition(null)
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  const showHeader = !loading && !submitted

  return (
    <section
      id="founding"
      ref={ref}
      style={{
        background: 'var(--shell)',
        padding: '5rem 2rem',
        borderTop: '1px solid rgba(240,237,230,0.12)',
      }}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header — hidden during loading / after submit */}
        {showHeader && (
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
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <LoadingState />
            </motion.div>

          ) : submitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {letter
                ? <LetterReveal letter={letter} position={position} email={email} />
                : <FallbackConfirm position={position} />
              }
            </motion.div>

          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Step dots */}
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
                      disabled={!email.trim()}
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '0.5rem',
                        letterSpacing: '0.28em',
                        color: 'var(--void)',
                        background: 'var(--silver)',
                        border: 'none',
                        padding: '0.9rem 2rem',
                        cursor: 'none',
                        textTransform: 'uppercase',
                        transition: 'background 0.2s ease',
                        opacity: !email.trim() ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bone)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--silver)' }}
                    >
                      Request Access
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
