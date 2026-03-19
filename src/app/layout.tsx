import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Basalith · AI — Digital Immortality',
  description: 'The AI entity that starts in your lifetime and runs forever.',
  openGraph: {
    title: 'Basalith · AI',
    description: 'Not a recording. Not an archive. A continuation.',
    url: 'https://basalith.ai',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}