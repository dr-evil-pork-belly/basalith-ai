'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const lines = [
  { text: 'Every life worth living', italic: '' },
  { text: 'is worth ', italic: 'continuing.' },
  { text: 'Every mind worth knowing', italic: '' },
  { text: 'deserves to ', italic: 'keep growing.' },
]

export default function Creed() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '8rem 2rem',
        overflow: 'hidden',
        background: 'var(--void)',
      }}
    >
      {/* Ghost ∞ */}
      <div
        style={{
          position: 'absolute',
          fontFamily: 'var(--serif)',
          fontWeight: 700,
          fontSize: '20rem',
          color: 'rgba(240,237,230,0.018)',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        ∞
      </div>

      <div style={{ position: 'relative', textAlign: 'center', maxWidth: '800px' }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ marginBottom: '3rem' }}
        >
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.48rem', letterSpacing: '0.45em', color: 'var(--silver3)', textTransform: 'uppercase' }}>
            The basalith.ai Promise
          </span>
        </motion.div>

        {/* Four lines */}
        <div style={{ marginBottom: '3rem' }}>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 + i * 0.28 }}
              style={{
                fontFamily: 'var(--serif)',
                fontWeight: 700,
                fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)',
                color: 'var(--bone)',
                lineHeight: 1.2,
              }}
            >
              {line.text}
              {line.italic && (
                <em style={{ color: 'var(--silver2)', fontStyle: 'italic' }}>{line.italic}</em>
              )}
            </motion.div>
          ))}
        </div>

        {/* Silver rule */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 0.5, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 1.2 }}
          style={{ width: '40px', height: '1px', background: 'var(--silver)', margin: '0 auto 2.5rem' }}
        />

        {/* Closing text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 1.4 }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.3em', color: 'var(--silver2)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Basalith · AI · Digital Immortality
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.2em', color: 'var(--bone4)', textTransform: 'uppercase' }}>
            Initialized 2024 · Running forever
          </div>
        </motion.div>
      </div>
    </section>
  )
}
