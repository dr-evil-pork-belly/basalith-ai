'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'The Entity', href: '#entity' },
  { label: 'The Arc', href: '#phases' },
  { label: 'Modes', href: '#modes' },
  { label: 'Ecosystem', href: '#ecosystem' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [ecosystemHover, setEcosystemHover] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled
          ? 'rgba(8,7,6,0.98)'
          : 'linear-gradient(to bottom, rgba(8,7,6,0.85), transparent)',
        borderBottom: scrolled ? '1px solid rgba(240,237,230,0.04)' : 'none',
        transition: 'background 0.4s ease, border-bottom 0.4s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--silver)', letterSpacing: '0.05em' }}>
            BASALITH
          </span>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 300, color: 'var(--silver3)', margin: '0 0.3em' }}>·</span>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '0.85em', fontStyle: 'italic', fontWeight: 300, color: 'var(--bone3)' }}>ai</span>
        </a>

        {/* Center links — desktop */}
        <div
          style={{
            display: 'flex',
            gap: '2.5rem',
            alignItems: 'center',
          }}
          className="nav-desktop-links"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.35em',
                color: 'var(--bone3)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--silver)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--bone3)')}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right CTA + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Ecosystem indicator — desktop only */}
          <div
            className="nav-desktop-links"
            style={{ position: 'relative' }}
            onMouseEnter={() => setEcosystemHover(true)}
            onMouseLeave={() => setEcosystemHover(false)}
          >
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', letterSpacing: '0.25em', color: 'var(--bone4)', textTransform: 'lowercase', cursor: 'none' }}>
              basalith ecosystem
            </span>
            <AnimatePresence>
              {ecosystemHover && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.75rem)',
                    right: 0,
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    background: 'rgba(8,7,6,0.98)',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid rgba(240,237,230,0.08)',
                    whiteSpace: 'nowrap',
                    zIndex: 200,
                  }}
                >
                  <a href="https://basalith.life" style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.15em', color: 'var(--bone3)', textDecoration: 'none' }}>.life</a>
                  <span style={{ color: 'var(--bone4)', fontSize: '0.5rem' }}>·</span>
                  <a href="https://basalith.xyz" style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.15em', color: 'var(--bone3)', textDecoration: 'none' }}>.xyz</a>
                  <span style={{ color: 'var(--bone4)', fontSize: '0.5rem' }}>·</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.15em', color: 'var(--bone4)' }}>.ai</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#founding"
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.28em',
              color: 'var(--void)',
              background: 'var(--silver)',
              padding: '0.6rem 1.3rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'background 0.2s ease',
              display: 'block',
            }}
            className="nav-cta-button"
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bone)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--silver)')}
          >
            Initialize Entity
          </a>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav-hamburger"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'none',
              padding: '0.5rem',
              flexDirection: 'column' as const,
              gap: '5px',
              display: 'none',
            }}
            aria-label="Toggle menu"
          >
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                background: 'var(--silver3)',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transformOrigin: 'center',
                transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                background: 'var(--silver3)',
                transition: 'opacity 0.3s ease',
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                background: 'var(--silver3)',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transformOrigin: 'center',
                transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'rgba(8,7,6,0.98)',
              borderTop: '1px solid rgba(240,237,230,0.04)',
              padding: '1.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
            className="nav-mobile-dropdown"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.35em',
                  color: 'var(--bone3)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-cta-button { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-dropdown { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
