import React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Analytics } from '@vercel/analytics/next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { CopyClickSound } from '@/components/copy-click-sound';

import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

export const metadata: Metadata = {
  title: {
    template: '%s | sound bits',
    default: 'sound bits — micro UX sound library',
  },
  description:
    'Procedural micro UX sound effects. Install with npm i sound-library — zero runtime deps, Web Audio + CLI.',
  metadataBase: new URL(siteUrl),
  applicationName: 'sound bits',
  authors: [{ name: 'Akshat Singh', url: 'https://github.com/abhi-yo' }],
  creator: 'Akshat Singh',
  keywords: [
    'sound-library',
    'web audio',
    'UI sounds',
    'micro interaction',
    'react',
    'npm',
  ],
  openGraph: {
    title: 'sound bits — micro UX sound library',
    description:
      'Procedural micro UX sound effects. Install with npm i sound-library — zero runtime deps, Web Audio + CLI.',
    type: 'website',
    siteName: 'sound bits',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'sound bits — micro UX sound library',
    description:
      'Procedural micro UX sound effects. Install with npm i sound-library — zero runtime deps, Web Audio + CLI.',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${geist.variable} ${geistMono.variable}`}
      style={{ colorScheme: 'dark' }}
    >
      <head>
        <meta name="theme-color" content="#0f0f11" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-foreground selection:text-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to main content
        </a>
        <RootProvider
          theme={{
            forcedTheme: 'dark',
            defaultTheme: 'dark',
            enableSystem: false,
            hotKey: false,
          }}
          search={{ enabled: true }}
        >
          <CopyClickSound />
          {children}
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
