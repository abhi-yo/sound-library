import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/next'

import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Sonix — UI Sound Effects Library',
  description: 'Micro UX audio interactions for web apps. 14 sounds, zero dependencies, copy-paste ready.',
  metadataBase: new URL('https://abhi-yo.github.io/sound-library'),
  openGraph: {
    title: 'Sonix — UI Sound Effects Library',
    description: 'Micro UX audio interactions for web apps. 14 sounds, zero dependencies, copy-paste ready.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sonix — UI Sound Effects Library',
    description: 'Micro UX audio interactions for web apps. 14 sounds, zero dependencies, copy-paste ready.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="font-sans antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
