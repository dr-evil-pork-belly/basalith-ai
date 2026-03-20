'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const modes = [
  {
    name: 'Memory Mode',
    desc: 'Ask about specific events, decisions, relationships. Answers drawn directly from training data. The more Provenance deposited, the deeper and more specific the answer.',
  },
  {
    name: 'Wisdom Mode',
    desc: 'Bring a current situation. The entity responds as the person would have — reasoning through your specific circumstances with their established values and lived perspective. The most emotionally significant use case.',
  },
  {
    name: 'Legacy Mode',
    desc: 'The entity initiates. Weekly messages. Reflections. Memories it surfaces unprompted. The entity as an ongoing presence in your life — not just a tool to consult, but a voice that continues.',
  },
  {
    name: 'Education Mode',
    desc: 'Family uploads new material — books, letters, lectures. Entity absorbs and discusses through its established value framework. Never stops learning. Knowledge compounds across generations.',
  },
]

function ModeCard({ mode, delay, inView }: { mode: typeof modes[0]; delay: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.9, ease: 'easeOut', delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#070706' : 'var(--void)',
        padding: '2.5rem',
        transition: 'background 0.3s ease',
      }}
    >
      {/* Icon dot */}
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: '1px solid var(--silver3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
      }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--silver3)' }} />
      </div>

      <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--silver)', marginBottom: '1rem' }}>
        {mode.name}
      </div>
      <p style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '0.92rem', color: 'var(--bone2)', lineHeight: 1.75, margin: 0 }}>
        {mode.desc}
      </p>
    </motion.div>
  )
}

export default function FourModes() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="modes"
      ref={ref}
      style={{ padding: '5rem 0', background: 'var(--void)' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ marginBottom: '1rem' }}
        >
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.48rem', letterSpacing: '0.45em', color: 'var(--silver3)', textTransform: 'uppercase' }}>
            How You Interact
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 5.5vw, 5rem)',
            color: 'var(--bone)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: '0 0 4rem',
          }}
        >
          Four modes. One presence.
        </motion.h2>
      </div>

      {/* 2×2 Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1px',
          background: 'rgba(240,237,230,0.10)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
        className="modes-grid"
      >
        {modes.map((mode, i) => (
          <ModeCard key={mode.name} mode={mode} delay={0.2 + i * 0.1} inView={isInView} />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .modes-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
