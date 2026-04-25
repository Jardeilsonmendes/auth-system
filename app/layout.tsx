import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

export const metadata: Metadata = {
  title: 'Auth System',
  description: 'Sistema de autenticacao com Next.js e PostgreSQL',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
        {children}
        <Analytics />
      </body>
    </html>
  )
}