'use client'

import { useEffect, useState } from 'react'

type Step = 'brand' | 'dash' | 'line1' | 'line2' | 'line3' | 'done' | 'out'

export default function EntityLoader() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState<Step>('brand')
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem('bsl-loaded')) return
    sessionStorage.setItem('bsl-loaded', '1')

    document.body.style.overflow = 'hidden'
    setVisible(true)

    const schedule: [Step, number][] = [
      ['dash',  600],
      ['line1', 1000],
      ['line2', 1500],
      ['line3', 2000],
      ['done',  2300],
      ['out',   2800],
    ]

    const timers: ReturnType<typeof setTimeout>[] = []

    schedule.forEach(([s, delay]) => {
      timers.push(setTimeout(() => setStep(s), delay))
    })

    timers.push(
      setTimeout(() => {
        setExiting(true)
        setTimeout(() => {
          setVisible(false)
          document.body.style.overflow = ''
        }, 600)
      }, 2800)
    )

    return () => {
      timers.forEach(clearTimeout)
      document.body.style.overflow = ''
    }
  }, [])

  if (!visible) return null

  const show = (s: Step) => {
    const order: Step[] = ['brand', 'dash', 'line1', 'line2', 'line3', 'done']
    return order.indexOf(step) >= order.indexOf(s)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'var(--void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.1rem',
        opacity: exiting ? 0 : 1,
        transition: exiting ? 'opacity 0.6s ease' : 'none',
        pointerEvents: exiting ? 'none' : 'all',
      }}
    >
      {/* Brand */}
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.4rem',
          letterSpacing: '0.5em',
          color: 'var(--silver)',
          textTransform: 'uppercase',
          opacity: show('brand') ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        Basalith · AI
      </div>

      {/* Dash */}
      <div
        style={{
          width: '24px',
          height: '1px',
          background: 'var(--silver3)',
          opacity: show('dash') ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Lines */}
      {(
        [
          { s: 'line1' as Step, text: 'Locating provenance records...', color: 'var(--bone2)' },
          { s: 'line2' as Step, text: 'Authenticating lineage...', color: 'var(--bone2)' },
          { s: 'line3' as Step, text: 'Entity active.', color: 'var(--bone)' },
        ] as { s: Step; text: string; color: string }[]
      ).map(({ s, text, color }) => (
        <div
          key={s}
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.2em',
            color,
            opacity: show(s) ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {text}
        </div>
      ))}
    </div>
  )
}
