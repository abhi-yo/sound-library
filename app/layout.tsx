import React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Analytics } from '@vercel/analytics/next';

import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: {
    template: '%s | bloub audio',
    default: 'bloub — micro UX sound library',
  },
  description: 'Procedural micro UX sound effects for interactive interfaces. Zero dependencies, copy-paste ready.',
  metadataBase: new URL('https://abhi-yo.github.io/sound-library'),
  openGraph: {
    title: 'bloub — micro UX sound library',
    description: 'Procedural micro UX sound effects for interactive interfaces. Zero dependencies, copy-paste ready.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'bloub — micro UX sound library',
    description: 'Procedural micro UX sound effects for interactive interfaces. Zero dependencies, copy-paste ready.',
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
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-foreground selection:text-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to main content
        </a>
        <RootProvider
          search={{
            enabled: true,
          }}
        >
          {children}
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
