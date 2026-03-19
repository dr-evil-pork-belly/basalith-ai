'use client'

import dynamic from 'next/dynamic'

const Cursor = dynamic(() => import('@/components/ui/Cursor'), { ssr: false })
const Nav = dynamic(() => import('@/components/ui/Nav'), { ssr: false })
const Hero = dynamic(() => import('@/components/sections/Hero'), { ssr: false })
const WhatItIs = dynamic(() => import('@/components/sections/WhatItIs'), { ssr: false })
const ThreePhases = dynamic(() => import('@/components/sections/ThreePhases'), { ssr: false })
const EntityVisual = dynamic(() => import('@/components/sections/EntityVisual'), { ssr: false })
const FourModes = dynamic(() => import('@/components/sections/FourModes'), { ssr: false })
const Ecosystem = dynamic(() => import('@/components/sections/Ecosystem'), { ssr: false })
const Creed = dynamic(() => import('@/components/sections/Creed'), { ssr: false })
const Footer = dynamic(() => import('@/components/ui/Footer'), { ssr: false })

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <WhatItIs />
        <ThreePhases />
        <EntityVisual />
        <FourModes />
        <Ecosystem />
        <Creed />
      </main>
      <Footer />
    </>
  )
}
