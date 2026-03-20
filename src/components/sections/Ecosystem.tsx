'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const domains = [
  {
    domain: 'basalith.life',
    tagline: 'Where you begin',
    role: 'The culture, the Protocol, the 135 philosophy. Where you get Deeded, mine $DEED, and live the Saturday life.',
    tags: ['135 DEED', '$DEED TOKEN', 'THE PROTOCOL', 'COMMUNITY', 'DROP 001'],
    href: 'https://basalith.life',
    isCurrent: false,
  },
  {
    domain: 'basalith.xyz',
    tagline: 'Where you build',
    role: 'The data infrastructure. Every deposit feeds the AI. Your provenance record is the foundation everything else is built on.',
    tags: ['PROVENANCE RECORD', 'ESTATE PLANNING', 'DATA VAULT'],
    href: 'https://basalith.xyz',
    isCurrent: false,
  },
  {
    domain: 'basalith.ai',
    tagline: 'Where you continue',
    role: 'The entity. The AI clone trained on everything in .xyz, running forever, improving with every model generation.',
    tags: ['AI ENTITY', 'ANCESTOR NFT', 'MODEL MIGRATION', 'FOREVER'],
    href: '#',
    isCurrent: true,
  },
]

export default function Ecosystem() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="ecosystem"
      ref={ref}
      style={{ padding: '5rem 0', background: 'var(--shell)' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ marginBottom: '1rem' }}
        >
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.48rem', letterSpacing: '0.45em', color: 'var(--silver3)', textTransform: 'uppercase' }}>
            The Basalith Ecosystem
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
            margin: '0 0 1rem',
          }}
        >
          Three domains. One arc.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--bone3)', margin: '0 0 4rem' }}
        >
          Each domain serves a different phase of a sovereign life.
        </motion.p>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {domains.map((d, i) => (
            <motion.div
              key={d.domain}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 + i * 0.12 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1px 1fr',
                gap: '0 2.5rem',
                border: '1px solid rgba(240,237,230,0.05)',
                borderTop: i === 0 ? '1px solid rgba(240,237,230,0.05)' : 'none',
                padding: '2.5rem 0',
                alignItems: 'start',
              }}
              className="eco-row"
            >
              {/* Domain name */}
              <div style={{ padding: '0 2.5rem 0 0' }}>
                <a
                  href={d.href}
                  style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: d.isCurrent ? 'var(--silver2)' : 'var(--silver)',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}
                >
                  {d.domain}
                </a>
                <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--bone4)' }}>
                  {d.tagline}
                </span>
              </div>

              {/* Divider */}
              <div style={{ background: 'rgba(240,237,230,0.06)', alignSelf: 'stretch' }} />

              {/* Description + tags */}
              <div style={{ padding: '0 0 0 0' }}>
                <p style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '1rem', color: 'var(--bone2)', lineHeight: 1.75, margin: '0 0 1.25rem' }}>
                  {d.role}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {d.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '0.38rem',
                        letterSpacing: '0.3em',
                        color: 'var(--bone3)',
                        border: '1px solid rgba(240,237,230,0.15)',
                        padding: '0.3rem 0.6rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .eco-row { grid-template-columns: 1fr !important; gap: 1.5rem 0 !important; }
          .eco-row > div:nth-child(2) { display: none; }
        }
      `}</style>
    </section>
  )
}
