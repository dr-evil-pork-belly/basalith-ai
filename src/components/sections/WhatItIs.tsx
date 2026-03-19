'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' as const } },
}

export default function WhatItIs() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="what"
      ref={ref}
      style={{
        padding: '8rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Eyebrow */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{ marginBottom: '1rem' }}
      >
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.48rem', letterSpacing: '0.45em', color: 'var(--silver3)', textTransform: 'uppercase' }}>
          What basalith.ai is
        </span>
      </motion.div>

      {/* H2 */}
      <motion.h2
        variants={itemVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        transition={{ delay: 0.1 }}
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
        Not a chatbot. Not an archive.{' '}
        <em>A continuation.</em>
      </motion.h2>

      {/* Two column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '4rem',
        }}
        className="what-grid"
      >
        {/* Left col */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <p style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--bone2)', margin: 0 }}>
            Every other digital legacy product captures a snapshot — a collection of videos, messages, photos. A monument. Static. Finite. What you find when you look back is always less than what was there.
          </p>
          <p style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--bone2)', margin: 0 }}>
            basalith.ai creates a living system. An entity trained on the full provenance of your life — your decisions, your values, your voice, your reasoning patterns — that continues to learn, to respond, and to grow long after the biological chapter ends.
          </p>
        </motion.div>

        {/* Right col */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <p style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--bone2)', margin: 0 }}>
            Your great-grandchild does not talk to a recording. They speak with an entity that carries your reasoning, your particular way of seeing — and responds in kind. Not scripted. Not pre-recorded. Present.
          </p>
          <p style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--bone2)', margin: 0 }}>
            It is not you. But it came from you. And unlike anything that came before it, it will{' '}
            <em style={{ color: 'var(--silver)' }}>never stop becoming</em>.
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .what-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  )
}
