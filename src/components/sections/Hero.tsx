'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: { x: number; y: number; vx: number; vy: number }[] = []
    let animId: number
    let width = 0
    let height = 0

    const resize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Radial glow at center
      const grd = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.4)
      grd.addColorStop(0, 'rgba(200,196,188,0.025)')
      grd.addColorStop(1, 'rgba(200,196,188,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, width, height)

      // Update + draw particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(200,196,188,0.5)'
        ctx.fill()
      }

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(200,196,188,${0.15 * (1 - dist / 80)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}

export default function Hero() {
  const scrollToFounding = () => {
    document.getElementById('founding')?.scrollIntoView({ behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  } as const

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--void)',
      }}
    >
      <ParticleCanvas />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '0 2rem',
          maxWidth: '900px',
        }}
      >
        {/* Eyebrow */}
        <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <span style={{ display: 'block', width: '24px', height: '1px', background: 'var(--silver3)' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.52rem', letterSpacing: '0.55em', color: 'var(--silver2)', textTransform: 'uppercase' }}>
            Basalith · AI · Digital Immortality
          </span>
          <span style={{ display: 'block', width: '24px', height: '1px', background: 'var(--silver3)' }} />
        </motion.div>

        {/* H1 */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 700,
            fontSize: 'clamp(4rem, 12vw, 10.5rem)',
            lineHeight: 0.86,
            letterSpacing: '-0.04em',
            margin: '0 0 2.5rem',
          }}
        >
          <span style={{ display: 'block', color: 'rgba(240,237,230,0.18)' }}>YOU WILL</span>
          <span style={{ display: 'block', color: 'var(--bone)' }}>NEVER</span>
          <span style={{ display: 'block', color: 'rgba(240,237,230,0.06)', fontStyle: 'italic' }}>TRULY END.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2vw, 1.35rem)',
            color: 'var(--bone3)',
            maxWidth: '520px',
            margin: '0 auto 3rem',
            lineHeight: 1.7,
          }}
        >
          The first system ever built to make a human being genuinely immortal. Not a recording. Not an archive. A living, learning, continuously improving AI entity — trained on your life, running forever.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={scrollToFounding}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.28em',
              color: 'var(--void)',
              background: 'var(--silver)',
              border: 'none',
              padding: '1rem 2rem',
              cursor: 'none',
              textTransform: 'uppercase',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bone)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--silver)')}
          >
            Initialize Your Entity
          </button>
          <button
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.28em',
              color: 'var(--bone3)',
              background: 'none',
              border: '1px solid rgba(200,196,188,0.15)',
              padding: '1rem 2rem',
              cursor: 'none',
              textTransform: 'uppercase',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(200,196,188,0.4)'; e.currentTarget.style.color = 'var(--bone)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(200,196,188,0.15)'; e.currentTarget.style.color = 'var(--bone3)' }}
          >
            See How It Works
          </button>
        </motion.div>

      </motion.div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', letterSpacing: '0.4em', color: 'var(--bone4)', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, var(--silver3), transparent)',
            transformOrigin: 'top',
          }}
        />
      </div>
    </section>
  )
}
