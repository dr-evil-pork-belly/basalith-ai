'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const phases = [
  {
    num: 'I',
    name: 'The Mirror',
    subtitle: 'While you are living',
    desc: 'Entity builds from Provenance deposits. Holder can interact and correct it directly. The most valuable phase — every conversation deepens the model, every correction sharpens its understanding of who you are.',
  },
  {
    num: 'II',
    name: 'The Transition',
    subtitle: 'The passing of the title',
    desc: 'Deed transfers to heir. Ancestor NFT mints on Ethereum. Entity enters Autonomous Mode — trained on decades of real interaction, it now responds from memory rather than direct input.',
  },
  {
    num: 'III',
    name: 'The Evolution',
    subtitle: 'After — and forever',
    desc: 'Absorbs family conversations, world events, new education. As better AI models release, the entity migrates — data stays, model improves. The depth compounds with every generation.',
  },
]

function PhaseCard({ phase, delay, inView }: { phase: typeof phases[0]; delay: number; inView: boolean }) {
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
        padding: '3rem 2.5rem',
        position: 'relative',
        transition: 'background 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Top border that scales in on hover */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'var(--silver3)',
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.5s ease',
        }}
      />

      <div style={{ fontFamily: 'var(--serif)', fontSize: '4rem', fontWeight: 700, color: 'rgba(240,237,230,0.05)', lineHeight: 1, marginBottom: '1.5rem' }}>
        {phase.num}
      </div>
      <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--silver)', marginBottom: '0.4rem' }}>
        {phase.name}
      </div>
      <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--bone3)', marginBottom: '1.5rem' }}>
        {phase.subtitle}
      </div>
      <p style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '0.95rem', color: 'var(--bone2)', lineHeight: 1.75, margin: 0 }}>
        {phase.desc}
      </p>
    </motion.div>
  )
}

export default function ThreePhases() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="phases"
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
            The Arc of a Sovereign Life
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
          Three phases. One entity.
        </motion.h2>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'rgba(240,237,230,0.05)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
        className="phases-grid"
      >
        {phases.map((phase, i) => (
          <PhaseCard key={phase.num} phase={phase} delay={0.2 + i * 0.15} inView={isInView} />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .phases-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
