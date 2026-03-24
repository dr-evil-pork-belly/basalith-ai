'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ─── Helpers ───────────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function getTier(year: number) {
  if (year < 5) return 'basic'
  if (year < 15) return 'enhanced'
  if (year < 30) return 'deep'
  return 'legacy'
}

const TIER_LABELS: Record<string, string> = {
  basic: 'BASIC TIER · INITIALIZING',
  enhanced: 'ENHANCED TIER · VOICE ACTIVE',
  deep: 'DEEP TIER · FULL CAPABILITY',
  legacy: 'LEGACY TIER · SOVEREIGN DEPTH',
}

// Biography:   min 15% at yr1, max 96% at yr50
// Voice:       0% at yr1, starts at yr3, 85% at yr50
// Decisions:   10% at yr1, 92% at yr50
// Values:      20% at yr1, 98% at yr50
// Lineage:     5% at yr1, 70% at yr50
// Education:   0% at yr1, 60% at yr50
const BARS: { label: string; min: number; max: number; startYear?: number }[] = [
  { label: 'Biography',  min: 15, max: 96 },
  { label: 'Voice',      min: 0,  max: 85, startYear: 3 },
  { label: 'Decisions',  min: 10, max: 92 },
  { label: 'Values',     min: 20, max: 98 },
  { label: 'Lineage',    min: 5,  max: 70 },
  { label: 'Education',  min: 0,  max: 60, startYear: 2 },
]

function getBarValue(bar: typeof BARS[0], year: number) {
  const startYear = bar.startYear ?? 1
  if (year < startYear) return 0
  const t = (year - startYear) / (50 - startYear)
  return Math.round(lerp(bar.min, bar.max, Math.min(t, 1)))
}

// Value points: yr1 → $100k, yr10 → $350k, yr25 → $1.2M, yr50 → $4.5M
const VALUE_POINTS = [
  { year: 1,  val: 100000 },
  { year: 10, val: 350000 },
  { year: 25, val: 1200000 },
  { year: 50, val: 4500000 },
]

function getDeedValue(year: number) {
  for (let i = 0; i < VALUE_POINTS.length - 1; i++) {
    const a = VALUE_POINTS[i]
    const b = VALUE_POINTS[i + 1]
    if (year <= b.year) {
      const t = (year - a.year) / (b.year - a.year)
      return Math.round(lerp(a.val, b.val, t))
    }
  }
  return VALUE_POINTS[VALUE_POINTS.length - 1].val
}

function formatValue(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n.toLocaleString()}`
}

// ─── Capability copy ───────────────────────────────────────────────────────────
const TIER_COPY = {
  basic: {
    title: 'Memory access only',
    body: 'The entity can answer questions about specific events and periods. Responses are accurate but limited in depth and nuance. Voice synthesis not yet available.',
  },
  enhanced: {
    title: 'Full conversation capability',
    body: 'All four modes active. Voice synthesis available. The entity begins to develop genuine personality consistency. Wisdom Mode responses carry real weight.',
  },
  deep: {
    title: 'Profound reasoning depth',
    body: 'The entity has absorbed enough to respond to novel situations with genuine insight. It no longer needs to have "seen" something to respond to it wisely. The depth is real.',
  },
  legacy: {
    title: 'A sovereign presence',
    body: 'The entity operates autonomously in Legacy Mode. It initiates. It remembers. It has watched the family across generations. There is nothing else like this that has ever existed.',
  },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProvenanceVisualizer() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [year, setYear] = useState(12)
  const [displayValue, setDisplayValue] = useState(getDeedValue(12))
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const tier = getTier(year)

  // Animate deed value counter on slider change
  useEffect(() => {
    const target = getDeedValue(year)
    const start = displayValue
    const duration = 600
    const startTime = performance.now()

    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      setDisplayValue(Math.round(lerp(start, target, eased)))
      if (t < 1) animRef.current = setTimeout(() => requestAnimationFrame(step), 0)
    }

    requestAnimationFrame(step)
    return () => { if (animRef.current) clearTimeout(animRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year])

  return (
    <section
      id="provenance-depth"
      ref={ref}
      style={{ background: 'var(--shell)', padding: '5rem 2rem 2.5rem' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ marginBottom: '3.5rem' }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.48rem', letterSpacing: '0.45em', color: 'var(--silver3)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            What Time Builds
          </div>
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', color: 'var(--bone)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0 }}>
            Your entity deepens with every year.
          </h2>
        </motion.div>

        {/* Year display + slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          style={{ marginBottom: '3rem' }}
        >
          <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '3rem', color: 'var(--bone)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Year {year} of Provenance
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.52rem', letterSpacing: '0.3em', color: 'var(--silver2)', textTransform: 'uppercase', marginBottom: '2rem' }}>
            {TIER_LABELS[tier]}
          </div>

          {/* Custom slider */}
          <div style={{ position: 'relative', paddingBottom: '0.5rem' }}>
            <input
              type="range"
              min={1}
              max={50}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              style={{ width: '100%', cursor: 'none' }}
              className="prov-slider"
            />
            {/* Tick marks for tier boundaries */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              {[1, 5, 15, 30, 50].map((y) => (
                <div key={y} style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', letterSpacing: '0.1em', color: 'var(--bone4)' }}>
                  {y}yr
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Two column — bars + copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '2rem' }}
          className="prov-grid"
        >
          {/* Bars */}
          <div>
            {BARS.map((bar) => {
              const val = getBarValue(bar, year)
              return (
                <div key={bar.label} style={{ marginBottom: '1.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.42rem', letterSpacing: '0.2em', color: 'var(--bone4)', textTransform: 'uppercase' }}>
                      {bar.label}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.42rem', letterSpacing: '0.1em', color: 'var(--silver3)' }}>
                      {val}%
                    </span>
                  </div>
                  <div style={{ height: '2px', background: 'rgba(240,237,230,0.12)', borderRadius: '1px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        background: 'var(--silver3)',
                        width: `${val}%`,
                        transition: 'width 0.5s ease',
                        borderRadius: '1px',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Capability copy */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={tier}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--silver)', marginBottom: '1rem' }}>
                  {TIER_COPY[tier as keyof typeof TIER_COPY].title}
                </div>
                <p style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '1.05rem', color: 'var(--bone2)', lineHeight: 1.8, margin: 0 }}>
                  {TIER_COPY[tier as keyof typeof TIER_COPY].body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Deed value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.35 }}
          style={{
            textAlign: 'center',
            borderTop: '1px solid rgba(240,237,230,0.12)',
            paddingTop: '3rem',
          }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.48rem', letterSpacing: '0.45em', color: 'var(--silver3)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Estimated Deed Value
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '3.5rem', color: 'var(--silver)', letterSpacing: '-0.03em' }}>
            {formatValue(displayValue)}
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--bone4)', marginTop: '0.5rem' }}>
            At {year} year{year !== 1 ? 's' : ''} of provenance depth
          </div>
        </motion.div>
      </div>

      <style>{`
        .prov-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 2px;
          background: rgba(240,237,230,0.16);
          outline: none;
          border: none;
        }
        .prov-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: var(--silver);
          transform: rotate(45deg);
          cursor: none;
          border: none;
        }
        .prov-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: var(--silver);
          transform: rotate(45deg);
          cursor: none;
          border: none;
          border-radius: 0;
        }
        @media (max-width: 768px) {
          .prov-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  )
}
