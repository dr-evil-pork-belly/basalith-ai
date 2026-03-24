'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ─── Mini neural canvas for Eleanor's avatar ──────────────────────────────────
function EleanorAvatar({ size = 32 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    const nodes = Array.from({ length: 6 }, () => ({
      x: Math.random() * size,
      y: Math.random() * size,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }))

    let animId: number
    let t = 0

    const draw = () => {
      t += 0.015
      ctx.clearRect(0, 0, size, size)

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > size) n.vx *= -1
        if (n.y < 0 || n.y > size) n.vy *= -1
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < size * 0.65) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(200,196,188,${0.35 * (1 - d / (size * 0.65))})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const r = (1 + 0.3 * Math.sin(t + i)) * 1.5
        ctx.beginPath()
        ctx.arc(nodes[i].x, nodes[i].y, r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(200,196,188,0.7)'
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [size])

  return <canvas ref={canvasRef} width={size} height={size} style={{ display: 'block', flexShrink: 0, border: '1px solid rgba(212,208,200,0.2)' }} />
}

// ─── Types ─────────────────────────────────────────────────────────────────────
type Message = { role: 'user' | 'assistant'; content: string }

const INITIAL_MESSAGE = "I am 95 years old and it is 2026. I have seen enough to know that most questions are worth answering. Go ahead."

const SUGGESTED = [
  "What was 1974 like for you?",
  "Tell me about Harold.",
  "What do you wish you'd started sooner?",
  "What do you know now that you didn't at 50?",
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function EntityDemo() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Build display messages including Eleanor's opener
  const displayMessages: { role: 'eleanor' | 'user'; content: string }[] = [
    { role: 'eleanor', content: INITIAL_MESSAGE },
    ...messages.map((m) => ({
      role: (m.role === 'assistant' ? 'eleanor' : 'user') as 'eleanor' | 'user',
      content: m.content,
    })),
  ]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayMessages.length, loading])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setError(null)
    setHasInteracted(true)
    setInput('')

    const userMsg: Message = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setLoading(true)

    // Send last 6 messages as history
    const history = nextMessages.slice(-6).slice(0, -1).map((m) => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const res = await fetch('/api/entity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Entity unavailable')
        setLoading(false)
        return
      }

      setMessages([...nextMessages, { role: 'assistant', content: data.response }])
    } catch {
      setError('Entity unavailable')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <section
      id="demo"
      ref={ref}
      style={{ background: '#030303', padding: '5rem 2rem' }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.48rem', letterSpacing: '0.45em', color: 'var(--silver3)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Speak to the Entity · Demo Access
          </div>
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '3rem', color: 'var(--bone)', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            Eleanor Voss
          </h2>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.5rem', letterSpacing: '0.25em', color: 'var(--silver2)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Born 1931 · Age 95 · 1 Year Provenance · Basic Tier
          </div>
          <p style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--bone4)', margin: 0, lineHeight: 1.6 }}>
            This is a live demo entity. Eleanor is 95. Her entity was initialized in 2025 by her daughter Patricia. Responses are generated in real time.
          </p>
        </motion.div>

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          className="eleanor-status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            background: 'rgba(212,208,200,0.06)',
            border: '1px solid rgba(212,208,200,0.15)',
            borderTop: '2px solid rgba(212,208,200,0.25)',
            borderBottom: '1px solid rgba(212,208,200,0.12)',
            marginBottom: '0',
          }}
        >
          {[
            { label: 'Entity Active', pulse: true },
            { label: 'Basic Tier' },
            { label: '1 Yr Provenance' },
            { label: 'Mirror Mode' },
          ].map((item, i) => (
            <div
              key={item.label}
              className={i === 3 ? 'status-last' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1rem',
                borderRight: i < 3 ? '1px solid rgba(212,208,200,0.12)' : 'none',
              }}
            >
              {item.pulse && (
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', flexShrink: 0 }}
                />
              )}
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.25em', color: 'var(--bone3)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Chat container */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
          style={{
            border: '1px solid rgba(212,208,200,0.15)',
            borderTop: 'none',
            background: '#111110',
            display: 'flex',
            flexDirection: 'column',
            height: '480px',
          }}
        >
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {displayMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                }}
              >
                {msg.role === 'eleanor' ? (
                  <div style={{ flexShrink: 0 }}>
                    <EleanorAvatar size={32} />
                  </div>
                ) : (
                  <div style={{ width: '32px', height: '32px', background: 'rgba(240,237,230,0.10)', border: '1px solid rgba(240,237,230,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--mono)', fontSize: '0.38rem', color: 'var(--bone4)', letterSpacing: '0.1em' }}>
                    YOU
                  </div>
                )}
                <div style={{ maxWidth: '82%' }}>
                  {msg.role === 'eleanor' && (
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', letterSpacing: '0.2em', color: 'var(--bone4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Eleanor · Entity #00012
                    </div>
                  )}
                  <div style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 300,
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: msg.role === 'eleanor' ? 'var(--bone2)' : 'var(--bone)',
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                    background: msg.role === 'eleanor' ? 'rgba(212,208,200,0.07)' : 'rgba(240,237,230,0.10)',
                    border: `1px solid ${msg.role === 'eleanor' ? 'rgba(212,208,200,0.12)' : 'rgba(240,237,230,0.16)'}`,
                    padding: '0.75rem 1rem',
                  }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
                >
                  <EleanorAvatar size={32} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[0, 1, 2].map((j) => (
                        <motion.div
                          key={j}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: j * 0.2 }}
                          style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--silver3)' }}
                        />
                      ))}
                    </div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.15em', color: 'var(--bone4)' }}>
                      Eleanor is composing...
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--bone3)', textAlign: 'center', padding: '0.5rem' }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={bottomRef} />
          </div>

          {/* Suggested prompts */}
          <AnimatePresence>
            {!hasInteracted && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: '0 1.5rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
              >
                {SUGGESTED.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => send(prompt)}
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '0.44rem',
                      letterSpacing: '0.1em',
                      color: 'var(--bone3)',
                      background: 'rgba(212,208,200,0.04)',
                      border: '1px solid rgba(212,208,200,0.18)',
                      padding: '0.4rem 0.75rem',
                      cursor: 'none',
                      textAlign: 'left',
                      transition: 'border-color 0.2s ease, color 0.2s ease, background 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(212,208,200,0.35)'; e.currentTarget.style.color = 'var(--bone2)'; e.currentTarget.style.background = 'rgba(212,208,200,0.08)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212,208,200,0.18)'; e.currentTarget.style.color = 'var(--bone3)'; e.currentTarget.style.background = 'rgba(212,208,200,0.04)' }}
                  >
                    {prompt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input area */}
          <div style={{ borderTop: '1px solid rgba(212,208,200,0.12)', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
                placeholder="Ask Eleanor anything..."
                className="eleanor-input"
                rows={2}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(212,208,200,0.25)',
                  color: 'var(--bone)',
                  fontFamily: 'var(--serif)',
                  fontSize: '1rem',
                  padding: '0.4rem 0',
                  resize: 'none',
                  outline: 'none',
                  opacity: loading ? 0.5 : 1,
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                style={{
                  background: 'var(--silver3)',
                  border: 'none',
                  width: '40px',
                  flexShrink: 0,
                  cursor: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: loading || !input.trim() ? 0.4 : 1,
                  transition: 'opacity 0.2s ease, background 0.2s ease',
                  alignSelf: 'flex-end',
                  height: '36px',
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--silver2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--silver3)' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 6h10M6 1l5 5-5 5" stroke="var(--bone)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', letterSpacing: '0.12em', color: 'var(--bone4)', textTransform: 'uppercase' }}>
              Responses generated by basalith.ai entity engine · Powered by 67 years of Provenance data
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`
        .eleanor-input::placeholder { color: var(--bone4); opacity: 1; }
        @media (max-width: 768px) {
          .eleanor-status { flex-wrap: wrap; overflow: hidden; }
          .eleanor-status > div { font-size: 0.38rem !important; padding: 0.3rem 0.6rem !important; }
          .status-last { display: none !important; }
        }
      `}</style>
    </section>
  )
}
