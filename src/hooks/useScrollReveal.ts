'use client'

import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function useScrollReveal(margin = '-100px') {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  return { ref, isInView }
}
