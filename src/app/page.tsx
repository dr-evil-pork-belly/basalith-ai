'use client'

import dynamic from 'next/dynamic'

const EntityLoader         = dynamic(() => import('@/components/ui/EntityLoader'),                   { ssr: false })
const Cursor               = dynamic(() => import('@/components/ui/Cursor'),                         { ssr: false })
const Nav                  = dynamic(() => import('@/components/ui/Nav'),                             { ssr: false })
const Hero                 = dynamic(() => import('@/components/sections/Hero'),                      { ssr: false })
const WhatItIs             = dynamic(() => import('@/components/sections/WhatItIs'),                  { ssr: false })
const ThreePhases          = dynamic(() => import('@/components/sections/ThreePhases'),               { ssr: false })
const EntityDemo           = dynamic(() => import('@/components/sections/EntityDemo'),                { ssr: false })
const ProvenanceVisualizer = dynamic(() => import('@/components/sections/ProvenanceVisualizer'),      { ssr: false })
const EntityVisual         = dynamic(() => import('@/components/sections/EntityVisual'),              { ssr: false })
const EntityGallery        = dynamic(() => import('@/components/sections/EntityGallery'),             { ssr: false })
const FourModes            = dynamic(() => import('@/components/sections/FourModes'),                 { ssr: false })
const Ecosystem            = dynamic(() => import('@/components/sections/Ecosystem'),                 { ssr: false })
const FoundingAccess       = dynamic(() => import('@/components/sections/FoundingAccess'),            { ssr: false })
const Creed                = dynamic(() => import('@/components/sections/Creed'),                     { ssr: false })
const Footer               = dynamic(() => import('@/components/ui/Footer'),                          { ssr: false })

export default function Home() {
  return (
    <>
      <EntityLoader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <WhatItIs />
        <ThreePhases />
        <EntityDemo />
        <ProvenanceVisualizer />
        <EntityVisual />
        <EntityGallery />
        <FourModes />
        <Ecosystem />
        <FoundingAccess />
        <Creed />
      </main>
      <Footer />
    </>
  )
}
