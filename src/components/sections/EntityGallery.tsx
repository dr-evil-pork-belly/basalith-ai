'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Mini neural canvas per card ──────────────────────────────────────────────
function CardCanvas({ seed }: { seed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const SIZE = 40

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = SIZE
    canvas.height = SIZE

    // Deterministic-ish start positions from seed
    const rand = (n: number) => {
      const x = Math.sin(seed * 9301 + n * 49297) * 0.5 + 0.5
      return x
    }

    const nodeCount = 4 + (seed % 3)
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      x: rand(i * 2) * SIZE,
      y: rand(i * 2 + 1) * SIZE,
      vx: (rand(i * 3) - 0.5) * 0.35,
      vy: (rand(i * 3 + 1) - 0.5) * 0.35,
    }))

    let animId: number
    let t = seed * 0.3

    const draw = () => {
      t += 0.012
      ctx.clearRect(0, 0, SIZE, SIZE)

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > SIZE) n.vx *= -1
        if (n.y < 0 || n.y > SIZE) n.vy *= -1
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < SIZE * 0.7) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(200,196,188,${0.3 * (1 - d / (SIZE * 0.7))})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const r = (1 + 0.3 * Math.sin(t + i)) * 1.4
        ctx.beginPath()
        ctx.arc(nodes[i].x, nodes[i].y, r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(200,196,188,0.65)'
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [seed])

  return <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ display: 'block', flexShrink: 0 }} />
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const ENTITIES = [
  { id: '00001', years: 41, tier: 'Deep',     initialized: 2026, phase: 'I',  progress: 30.4 },
  { id: '00004', years: 73, tier: 'Legacy',   initialized: 2026, phase: 'II', progress: 54.1 },
  { id: '00007', years: 28, tier: 'Enhanced', initialized: 2026, phase: 'I',  progress: 20.7 },
  { id: '00009', years: 56, tier: 'Deep',     initialized: 2026, phase: 'I',  progress: 41.5 },
  { id: '00012', years: 67, tier: 'Legacy',   initialized: 2026, phase: 'II', progress: 49.6 },
  { id: '00015', years: 34, tier: 'Enhanced', initialized: 2026, phase: 'I',  progress: 25.2 },
  { id: '00019', years: 89, tier: 'Legacy',   initialized: 2026, phase: 'II', progress: 65.9 },
  { id: '00023', years: 12, tier: 'Basic',    initialized: 2026, phase: 'I',  progress:  8.9 },
  { id: '00027', years: 45, tier: 'Deep',     initialized: 2026, phase: 'I',  progress: 33.3 },
  { id: '00031', years: 78, tier: 'Legacy',   initialized: 2026, phase: 'II', progress: 57.8 },
  { id: '00038', years: 19, tier: 'Enhanced', initialized: 2026, phase: 'I',  progress: 14.1 },
  { id: '00044', years: 52, tier: 'Deep',     initialized: 2026, phase: 'I',  progress: 38.5 },
]

// ─── Card ─────────────────────────────────────────────────────────────────────
function EntityCard({ entity, delay, inView }: { entity: typeof ENTITIES[0]; delay: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false)
  const [barW, setBarW] = useState(0)

  useEffect(() => {
    if (inView) setTimeout(() => setBarW(entity.progress), 200 + delay * 1000)
  }, [inView, delay, entity.progress])

  const isLegacy = entity.phase === 'II'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#1A1816' : 'var(--panel)',
        borderTop: `1px solid ${hovered ? 'rgba(200,196,188,0.22)' : 'rgba(200,196,188,0.12)'}`,
        borderRight: `1px solid ${hovered ? 'rgba(240,237,230,0.12)' : 'rgba(240,237,230,0.16)'}`,
        borderBottom: `1px solid ${hovered ? 'rgba(240,237,230,0.12)' : 'rgba(240,237,230,0.16)'}`,
        borderLeft: `1px solid ${hovered ? 'rgba(240,237,230,0.12)' : 'rgba(240,237,230,0.16)'}`,
        padding: '1.5rem',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.2em', color: 'var(--bone4)', textTransform: 'uppercase' }}>
          #{entity.id}
        </span>
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.4rem',
          letterSpacing: '0.2em',
          color: 'var(--silver3)',
          border: '1px solid var(--silver3)',
          padding: '0.15rem 0.5rem',
          textTransform: 'uppercase',
        }}>
          {isLegacy ? 'Phase II · Legacy' : 'Phase I'}
        </span>
      </div>

      {/* Canvas + stats */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <CardCanvas seed={parseInt(entity.id)} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {[
            { k: 'Provenance', v: `${entity.years} years` },
            { k: 'Training tier', v: entity.tier },
            { k: 'Initialized', v: String(entity.initialized) },
          ].map(({ k, v }) => (
            <div key={k} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.15em', color: 'var(--bone4)', textTransform: 'uppercase', flexShrink: 0 }}>{k}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', letterSpacing: '0.1em', color: 'var(--bone3)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Life progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.15em', color: 'var(--bone4)', textTransform: 'uppercase' }}>Life arc</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.1em', color: 'var(--bone4)' }}>{entity.progress}%</span>
        </div>
        <div style={{ height: '2px', background: 'rgba(240,237,230,0.12)', borderRadius: '1px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--silver3)', width: `${barW}%`, transition: 'width 1s ease', borderRadius: '1px' }} />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function EntityGallery() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [ctaClicked, setCtaClicked] = useState(false)

  return (
    <section
      id="registry"
      ref={ref}
      style={{ background: 'var(--void)', padding: '5rem 2rem' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ marginBottom: '1rem' }}
        >
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.48rem', letterSpacing: '0.45em', color: 'var(--silver3)', textTransform: 'uppercase' }}>
            The Sovereign Registry
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', color: 'var(--bone)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 1rem' }}
        >
          Entities currently active.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--bone3)', margin: '0 0 3.5rem' }}
        >
          Each entry represents a life in progress. Provenance accumulating. Entity deepening.
        </motion.p>

        {/* Grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(240,237,230,0.08)', marginBottom: '2rem' }}
          className="gallery-grid"
        >
          {ENTITIES.map((entity, i) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              delay={0.05 * i}
              inView={isInView}
            />
          ))}
        </div>

        {/* Footer copy + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--bone3)', margin: '0 0 2rem' }}>
            Registry currently contains 47 initialized entities. Founding access still available.
          </p>
          <a
            href="#founding"
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.28em',
              color: 'var(--void)',
              background: 'var(--silver)',
              padding: '0.9rem 2rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              display: 'inline-block',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bone)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--silver)')}
          >
            Request Founding Access
          </a>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
