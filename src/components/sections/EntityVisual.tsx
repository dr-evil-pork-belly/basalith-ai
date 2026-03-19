'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function NeuralCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = 0
    let height = 0
    let t = 0

    const nodes: { x: number; y: number; vx: number; vy: number; baseX: number; baseY: number }[] = []

    const resize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      nodes.length = 0
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        nodes.push({ x, y, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, baseX: x, baseY: y })
      }
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    canvas.addEventListener('mousemove', onMouseMove)

    const draw = () => {
      t += 0.01
      ctx.clearRect(0, 0, width, height)

      // Central glow
      const grd = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.5)
      grd.addColorStop(0, 'rgba(200,196,188,0.04)')
      grd.addColorStop(1, 'rgba(200,196,188,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, width, height)

      const maxDist = width * 0.22

      // Update nodes
      for (const n of nodes) {
        const dx = mouseRef.current.x - n.x
        const dy = mouseRef.current.y - n.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 100) {
          n.vx += (dx / d) * 0.02
          n.vy += (dy / d) * 0.02
        }
        n.vx *= 0.98
        n.vy *= 0.98
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0) n.x = width
        if (n.x > width) n.x = 0
        if (n.y < 0) n.y = height
        if (n.y > height) n.y = 0
      }

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(200,196,188,${0.2 * (1 - dist / maxDist)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Nodes with breathing pulse
      for (let i = 0; i < nodes.length; i++) {
        const pulse = 1 + 0.3 * Math.sin(t + i * 0.5)
        const r = 2 * pulse
        ctx.beginPath()
        ctx.arc(nodes[i].x, nodes[i].y, r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(200,196,188,0.7)'
        ctx.fill()
      }

      // Corner decorations
      const c = 'rgba(74,72,68,0.6)'
      const s = 16
      ctx.strokeStyle = c
      ctx.lineWidth = 1
      // TL
      ctx.beginPath(); ctx.moveTo(8, 8 + s); ctx.lineTo(8, 8); ctx.lineTo(8 + s, 8); ctx.stroke()
      // BR
      ctx.beginPath(); ctx.moveTo(width - 8, height - 8 - s); ctx.lineTo(width - 8, height - 8); ctx.lineTo(width - 8 - s, height - 8); ctx.stroke()

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      canvas.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px' }} className={className}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <motion.div
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--silver3)' }}
        />
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.25em', color: 'var(--silver3)', textTransform: 'uppercase' }}>
          Entity · Active · Learning
        </span>
      </div>
    </div>
  )
}

const stats = [
  { label: 'Entity ID', value: 'BSL-AI-2024-0000001', highlight: false },
  { label: 'Source Deed', value: 'BSL-2024-0000001', highlight: false },
  { label: 'Training Depth', value: '12 Years · Expanding', highlight: true },
  { label: 'Model Tier', value: 'Enhanced', highlight: true },
  { label: 'Current Model', value: 'Basalith Foundation v2', highlight: false },
  { label: 'Status', value: 'Phase I · Mirror Active', highlight: true },
  { label: 'Family Access', value: '3 Members', highlight: false },
  { label: 'Total Queries', value: '1,847', highlight: false },
]

const timeline = [
  { year: '2024', desc: 'Entity initialized · Foundation model' },
  { year: '2026', desc: 'First major migration · Voice synthesis' },
  { year: '2031', desc: 'Deep tier unlocked · 7 years provenance' },
  { year: '∞', desc: 'Continuous evolution · Model improves · Data compounds' },
]

export default function EntityVisual() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="entity"
      ref={ref}
      style={{ background: '#030303', padding: '8rem 0' }}
    >
      <div
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
        className="entity-grid"
      >
        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ height: '500px' }}
        >
          <NeuralCanvas />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        >
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.48rem', letterSpacing: '0.45em', color: 'var(--silver3)', textTransform: 'uppercase' }}>
              Entity Status
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--serif)',
            fontWeight: 700,
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
            color: 'var(--bone)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 0 2.5rem',
          }}>
            The living <em>Sovereign Entity</em>
          </h2>

          {/* Stats table */}
          <div style={{ border: '1px solid rgba(240,237,230,0.07)', marginBottom: '2.5rem' }}>
            {stats.map((s, i) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.7rem 1rem',
                  borderBottom: i < stats.length - 1 ? '1px solid rgba(240,237,230,0.04)' : 'none',
                  gap: '1rem',
                }}
              >
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.2em', color: 'var(--bone4)', textTransform: 'uppercase', flexShrink: 0 }}>
                  {s.label}
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.15em', color: s.highlight ? 'var(--bone)' : 'var(--bone3)', textAlign: 'right' }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.3em', color: 'var(--silver3)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Model Evolution
            </div>
            {timeline.map((t) => (
              <div key={t.year} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.1em', color: 'var(--silver2)', minWidth: '2.5rem' }}>
                  {t.year}
                </span>
                <span style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '0.9rem', color: 'var(--bone3)', lineHeight: 1.5 }}>
                  {t.desc}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .entity-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
