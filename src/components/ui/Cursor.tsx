'use client'

import { useCursor } from '@/hooks/useCursor'

export default function Cursor() {
  const { dotRef, ringRef } = useCursor()

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          width: '5px',
          height: '5px',
          background: 'var(--silver)',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          pointerEvents: 'none',
          zIndex: 9999,
          top: 0,
          left: 0,
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: '24px',
          height: '24px',
          border: '1px solid rgba(200,196,188,0.25)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9998,
          top: 0,
          left: 0,
        }}
      />
    </>
  )
}
