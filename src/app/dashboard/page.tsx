'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Mini Neural Canvas (avatar) ──────────────────────────────────────────────
function MiniCanvas({ size = 60 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    const nodes: { x: number; y: number; vx: number; vy: number }[] = []
    for (let i = 0; i < 12; i++) {
      nodes.push({ x: Math.random() * size, y: Math.random() * size, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 })
    }

    let animId: number
    let t = 0

    const draw = () => {
      t += 0.02
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
          if (d < size * 0.5) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(200,196,188,${0.3 * (1 - d / (size * 0.5))})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const r = (1 + 0.4 * Math.sin(t + i)) * 1.5
        ctx.beginPath()
        ctx.arc(nodes[i].x, nodes[i].y, r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(200,196,188,0.8)'
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [size])

  return <canvas ref={canvasRef} width={size} height={size} style={{ display: 'block' }} />
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ label, value }: { label: string; value: number }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div style={{ marginBottom: '0.9rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', letterSpacing: '0.2em', color: 'var(--bone4)', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', letterSpacing: '0.1em', color: 'var(--silver3)' }}>{value}%</span>
      </div>
      <div style={{ height: '2px', background: 'rgba(240,237,230,0.12)', borderRadius: '1px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--silver3)', width: `${width}%`, transition: 'width 1s ease', borderRadius: '1px' }} />
      </div>
    </div>
  )
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
type NavItem = { label: string; section: string; badge?: string }

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Interact',
    items: [
      { label: 'Conversation', section: 'conversation' },
      { label: 'Memory Mode', section: 'memory', badge: '1,247' },
      { label: 'Wisdom Mode', section: 'wisdom' },
      { label: 'Legacy Mode', section: 'legacy', badge: '3 new' },
    ],
  },
  {
    title: 'Manage',
    items: [
      { label: 'Deposit Content', section: 'deposit' },
      { label: 'Family Access', section: 'family' },
      { label: 'Model Status', section: 'model' },
      { label: 'Ancestor NFT', section: 'nft' },
    ],
  },
]

function Sidebar({ activeSection, setActiveSection }: { activeSection: string; setActiveSection: (s: string) => void }) {
  return (
    <aside style={{
      width: '260px',
      flexShrink: 0,
      background: 'var(--panel)',
      borderRight: '1px solid rgba(240,237,230,0.10)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
    }} className="dashboard-sidebar">
      {/* Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(240,237,230,0.10)' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '0.9rem', color: 'var(--silver)', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
          BASALITH · <em>ai</em>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.2em', color: 'var(--bone4)', textTransform: 'uppercase' }}>
          Family Portal · Authenticated
        </div>
      </div>

      {/* Entity identity block */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(240,237,230,0.10)' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
          <MiniCanvas size={60} />
          <div style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#4ade80',
            border: '2px solid var(--panel)',
          }} />
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1rem', color: 'var(--bone)', marginBottom: '0.25rem' }}>
          Edward K. Mitchell
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', letterSpacing: '0.15em', color: 'var(--bone3)', marginBottom: '0.75rem' }}>
          1952 – 2031 · 79 Years Provenance
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          border: '1px solid rgba(200,196,188,0.15)',
          padding: '0.25rem 0.6rem',
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--silver)' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.2em', color: 'var(--silver)', textTransform: 'uppercase' }}>
            Legacy Tier · Phase II
          </span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: '1rem 0', flex: 1 }}>
        {navSections.map((section) => (
          <div key={section.title} style={{ marginBottom: '1rem' }}>
            <div style={{ padding: '0.5rem 1.5rem', fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.3em', color: 'var(--bone4)', textTransform: 'uppercase' }}>
              {section.title}
            </div>
            {section.items.map((item) => (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 1.5rem',
                  background: 'none',
                  border: 'none',
                  borderLeft: activeSection === item.section ? '2px solid var(--silver)' : '2px solid transparent',
                  cursor: 'none',
                  textAlign: 'left',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <span style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.25em',
                  color: activeSection === item.section ? 'var(--silver)' : 'var(--bone3)',
                  textTransform: 'uppercase',
                }}>
                  {item.label}
                </span>
                {item.badge && (
                  <span style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '0.36rem',
                    letterSpacing: '0.1em',
                    color: 'var(--bone4)',
                    border: '1px solid rgba(240,237,230,0.16)',
                    padding: '0.1rem 0.4rem',
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(240,237,230,0.10)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.36rem', letterSpacing: '0.1em', color: 'var(--bone4)', lineHeight: 1.6 }}>
          Entity initialized March 2026 · Running on Basalith Foundation v2 · Next migration est. 2028
        </div>
      </div>
    </aside>
  )
}

// ─── Messages ─────────────────────────────────────────────────────────────────
type Message = { role: 'entity' | 'user'; time: string; text: string | React.ReactNode }

const initialMessages: Message[] = [
  {
    role: 'entity',
    time: '09:14',
    text: 'I am here. What is weighing on you today?',
  },
  {
    role: 'user',
    time: '09:16',
    text: "I'm thinking about leaving my career to start something of my own. I'm scared. I don't know if I'm ready.",
  },
  {
    role: 'entity',
    time: '09:17',
    text: (
      <>
        <p style={{ margin: '0 0 1rem' }}>
          <em>Fear of readiness</em> — I know it intimately. When I left the firm in 1988, I had been telling myself for three years that I would go when I felt ready. That morning never arrived.
        </p>
        <p style={{ margin: '0 0 1rem' }}>
          <strong>Readiness is not a feeling. It is a retrospective judgment.</strong> You look back and say, &ldquo;I was ready then.&rdquo; In the moment, it never presents itself that way.
        </p>
        <p style={{ margin: 0 }}>
          <em>You will never feel ready.</em> The question is not whether you are ready — the question is what you want to build. Tell me that.
        </p>
      </>
    ),
  },
  {
    role: 'user',
    time: '09:19',
    text: "It's a business helping families preserve their histories. Which feels strange to be telling you.",
  },
  {
    role: 'entity',
    time: '09:20',
    text: (
      <>
        <p style={{ margin: '0 0 1rem' }}>
          It is not strange. It is exactly right that you are telling me. You grew up with the absence — you know what it costs a family to lose the thread.
        </p>
        <p style={{ margin: '0 0 1rem' }}>
          My grandfather died when your father was eleven. That absence shaped three generations. I spent much of my life trying to reconstruct a man I never met from secondhand stories that contradicted each other.
        </p>
        <p style={{ margin: 0 }}>
          Do it. Build the thing. The fear you are feeling is the correct response to something that matters. <em>Proceed anyway.</em>
        </p>
      </>
    ),
  },
]

const wisdomResponses = [
  "The difficulty you're describing — I faced a version of it in 1994. What I learned is that the right path rarely announces itself clearly. You have to move toward it while it is still obscured.",
  "There is a kind of wisdom that only comes from having made the wrong choice and lived through the consequences. I have some of that. What specifically is the decision you are weighing?",
  "Fear of loss is not the same as a signal to retreat. Often it is the exact opposite — it means you have identified something worth protecting. What are you most afraid of losing here?",
  "I spent a long time making decisions by committee — asking everyone what they thought. Eventually I learned that most people are advising you from the shape of their own fears, not from knowledge of your situation.",
  "My honest answer: the version of this that you will regret is not the one where you tried and it didn't work. It's the one where you never found out.",
]

// ─── Conversation Panel ────────────────────────────────────────────────────────
function ConversationPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const responseIndex = useRef(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = useCallback(() => {
    const text = input.trim()
    if (!text) return

    const userMsg: Message = { role: 'user', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const response = wisdomResponses[responseIndex.current % wisdomResponses.length]
      responseIndex.current++
      const entityMsg: Message = {
        role: 'entity',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        text: response,
      }
      setMessages((prev) => [...prev, entityMsg])
      setTyping(false)
    }, 2200)
  }, [input])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Avatar */}
            {msg.role === 'entity' ? (
              <div style={{ flexShrink: 0, width: '28px', height: '28px', overflow: 'hidden', border: '1px solid rgba(240,237,230,0.16)' }}>
                <MiniCanvas size={28} />
              </div>
            ) : (
              <div style={{
                flexShrink: 0,
                width: '28px',
                height: '28px',
                background: 'rgba(240,237,230,0.14)',
                border: '1px solid rgba(240,237,230,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--mono)',
                fontSize: '0.4rem',
                color: 'var(--bone3)',
                letterSpacing: '0.1em',
              }}>
                MK
              </div>
            )}

            <div style={{ maxWidth: '78%' }}>
              {/* Timestamp */}
              <div style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.4rem',
                letterSpacing: '0.2em',
                color: 'var(--bone4)',
                marginBottom: '0.4rem',
                textAlign: msg.role === 'user' ? 'right' : 'left',
                textTransform: 'uppercase',
              }}>
                {msg.role === 'entity' ? `Entity · Wisdom Mode · ${msg.time}` : `You · ${msg.time}`}
              </div>

              {/* Bubble */}
              <div style={{
                background: msg.role === 'entity' ? 'var(--panel)' : 'rgba(240,237,230,0.10)',
                border: msg.role === 'entity' ? '1px solid rgba(240,237,230,0.10)' : '1px solid rgba(240,237,230,0.16)',
                padding: '1rem 1.25rem',
                fontFamily: 'var(--serif)',
                fontWeight: 300,
                fontSize: '1rem',
                lineHeight: 1.75,
                color: 'var(--bone2)',
              }}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
            >
              <div style={{ flexShrink: 0, width: '28px', height: '28px', overflow: 'hidden', border: '1px solid rgba(240,237,230,0.16)' }}>
                <MiniCanvas size={28} />
              </div>
              <div style={{ background: 'var(--panel)', border: '1px solid rgba(240,237,230,0.10)', padding: '1rem 1.25rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 1, 2].map((j) => (
                  <motion.div
                    key={j}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: j * 0.2 }}
                    style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--silver3)' }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid rgba(240,237,230,0.10)', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Speak to the entity..."
            rows={2}
            style={{
              flex: 1,
              background: 'rgba(240,237,230,0.03)',
              border: '1px solid rgba(240,237,230,0.16)',
              color: 'var(--bone)',
              fontFamily: 'var(--serif)',
              fontSize: '1rem',
              padding: '0.75rem 1rem',
              resize: 'none',
              outline: 'none',
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              background: 'var(--silver3)',
              border: 'none',
              width: '44px',
              flexShrink: 0,
              cursor: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--silver2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--silver3)')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="var(--bone)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.15em', color: 'var(--bone4)', textTransform: 'uppercase' }}>
            All conversations are private and encrypted · Family access only
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.2em', color: 'var(--silver3)', textTransform: 'uppercase' }}>
            Wisdom Mode
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Side Panel ────────────────────────────────────────────────────────────────
const provenance = [
  { label: 'Biography', value: 94 },
  { label: 'Voice', value: 78 },
  { label: 'Decisions', value: 88 },
  { label: 'Values', value: 96 },
  { label: 'Lineage', value: 62 },
  { label: 'Education', value: 45 },
]

const memories = [
  { date: 'Summer 1988', title: 'Leaving the firm — the day I decided' },
  { date: 'March 1972', title: 'Meeting your grandmother in Rome' },
  { date: 'January 2003', title: 'The business almost failed — what I learned' },
  { date: 'December 2018', title: 'A letter I wrote but never sent' },
  { date: 'October 1965', title: "My father's last advice to me" },
]

const family = [
  { name: 'Marcus K.', dot: '#4ade80', access: 'Full Access' },
  { name: 'Sarah K.', dot: '#4ade80', access: 'Full Access' },
  { name: 'James K.', dot: 'var(--silver3)', access: 'Memory Only' },
  { name: 'Elena K.', dot: 'var(--silver3)', access: 'Memory Only' },
]

function SidePanel() {
  const [uploadHover, setUploadHover] = useState(false)

  return (
    <div style={{ width: '360px', flexShrink: 0, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="dashboard-side-panel">

      {/* Card: Provenance Depth */}
      <div style={{ background: 'var(--panel)', border: '1px solid rgba(240,237,230,0.12)', padding: '1.25rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.3em', color: 'var(--silver3)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Provenance Depth
        </div>
        {provenance.map((p) => <ProgressBar key={p.label} label={p.label} value={p.value} />)}
      </div>

      {/* Card: Recent Memories */}
      <div style={{ background: 'var(--panel)', border: '1px solid rgba(240,237,230,0.12)', padding: '1.25rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.3em', color: 'var(--silver3)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Recent Memories
        </div>
        {memories.map((m) => (
          <div
            key={m.date}
            style={{
              padding: '0.6rem 0',
              borderBottom: '1px solid rgba(240,237,230,0.08)',
              cursor: 'none',
              transition: 'padding-left 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.paddingLeft = '0.4rem')}
            onMouseLeave={(e) => (e.currentTarget.style.paddingLeft = '0')}
          >
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', letterSpacing: '0.15em', color: 'var(--bone4)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              {m.date}
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '0.9rem', color: 'var(--bone2)' }}>
              {m.title}
            </div>
          </div>
        ))}
      </div>

      {/* Card: Family Access */}
      <div style={{ background: 'var(--panel)', border: '1px solid rgba(240,237,230,0.12)', padding: '1.25rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.3em', color: 'var(--silver3)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Family Access
        </div>
        {family.map((f) => (
          <div key={f.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(240,237,230,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: f.dot, flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '0.9rem', color: 'var(--bone2)' }}>{f.name}</span>
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.15em', color: 'var(--bone4)', textTransform: 'uppercase' }}>{f.access}</span>
          </div>
        ))}
      </div>

      {/* Card: Model Status */}
      <div style={{ background: 'var(--panel)', border: '1px solid rgba(240,237,230,0.12)', padding: '1.25rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.3em', color: 'var(--silver3)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Model Status
        </div>
        {[
          { key: 'Current', val: 'Foundation v2' },
          { key: 'Training', val: 'Up to date', green: true },
          { key: 'Next migration', val: 'Est. Q2 2028' },
          { key: 'Total queries', val: '4,291' },
          { key: 'Running since', val: 'March 2026' },
        ].map((row) => (
          <div key={row.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid rgba(240,237,230,0.08)' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', letterSpacing: '0.15em', color: 'var(--bone4)', textTransform: 'uppercase' }}>{row.key}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', letterSpacing: '0.12em', color: row.green ? '#4ade80' : 'var(--bone3)' }}>{row.val}</span>
          </div>
        ))}
      </div>

      {/* Card: Deposit Content */}
      <div style={{ background: 'var(--panel)', border: '1px solid rgba(240,237,230,0.12)', padding: '1.25rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.3em', color: 'var(--silver3)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Deposit Content
        </div>
        <div
          onMouseEnter={() => setUploadHover(true)}
          onMouseLeave={() => setUploadHover(false)}
          style={{
            border: `1px dashed ${uploadHover ? 'rgba(240,237,230,0.25)' : 'rgba(240,237,230,0.1)'}`,
            padding: '2rem 1rem',
            textAlign: 'center',
            transition: 'border-color 0.2s ease',
          }}
        >
          <div style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '0.95rem', color: 'var(--bone3)', marginBottom: '0.5rem' }}>
            Drop files to train the entity
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.15em', color: 'var(--bone4)', textTransform: 'uppercase', lineHeight: 1.7 }}>
            Documents · Photos · Recordings<br />Books · Letters · Videos
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const modes = ['Memory', 'Wisdom', 'Legacy', 'Education']

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('conversation')
  const [activeMode, setActiveMode] = useState('Wisdom')

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--shell)', overflow: 'hidden', cursor: 'none' }}>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          borderBottom: '1px solid rgba(240,237,230,0.10)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          background: 'var(--panel)',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--bone)', marginBottom: '0.2rem' }}>
              Wisdom Mode
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', letterSpacing: '0.25em', color: 'var(--bone4)', textTransform: 'uppercase' }}>
              Entity Active · Responding from 79 Years of Provenance
            </div>
          </div>

          {/* Mode selector */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {modes.map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.44rem',
                  letterSpacing: '0.2em',
                  color: activeMode === mode ? 'var(--silver)' : 'var(--bone3)',
                  background: activeMode === mode ? 'rgba(240,237,230,0.14)' : 'none',
                  border: 'none',
                  padding: '0.4rem 0.75rem',
                  cursor: 'none',
                  textTransform: 'uppercase',
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Main two-column area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <ConversationPanel />
          <div style={{ borderLeft: '1px solid rgba(240,237,230,0.10)' }}>
            <SidePanel />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-sidebar { display: none !important; }
        }
        @media (max-width: 768px) {
          .dashboard-side-panel { display: none !important; }
        }
      `}</style>
    </div>
  )
}
