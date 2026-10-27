'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { SoundBitsLogo } from './sound-bits-logo';
import { playSound } from '@/lib/lazy-sounds';

const FooterTapGame = dynamic(
  () => import('./footer-tap-game').then((m) => m.FooterTapGame),
  { ssr: false, loading: () => <div className="h-[200px] w-full max-w-[380px] rounded-[28px] bg-[#121212]/80" aria-hidden /> }
);

const Aurora = dynamic(() => import('./aurora'), {
  ssr: false,
  loading: () => null,
});


const AURORA_COLOR_STOPS: [string, string, string] = ['#ff3700', '#ff5200', '#e02600'];

export const BigFooter = React.memo(function BigFooter() {
  return (
    <footer className="sound-bits-footer relative w-full min-h-[540px] lg:min-h-[600px] flex flex-col justify-between bg-[#080808] text-white border-t border-[#1f1f1f] overflow-hidden select-none">
      {/* Dynamic Aurora Ambient Background */}
      <div className="sound-bits-footer__aurora absolute inset-0 pointer-events-none opacity-75 overflow-hidden">
        <Aurora
          colorStops={AURORA_COLOR_STOPS}
          blend={0.5}
          amplitude={1.05}
          speed={0.75}
        />
      </div>

      {/* Subtle Tactile Film Grain Texture Overlay */}
      <div
        className="sound-bits-footer__grain absolute inset-0 pointer-events-none opacity-[0.22] mix-blend-overlay z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
        aria-hidden="true"
      />

      {/* Main Container evenly utilizing the full grid width */}
      <div className="sound-bits-footer__inner relative z-10 w-full flex-1 flex flex-col justify-between max-w-[1440px] mx-auto px-6 py-14 sm:px-10 sm:py-16 md:px-12 lg:px-16">
        {/* Top Row: Spanning across 4 balanced columns */}
        <div className="sound-bits-footer__top grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start w-full">
          {/* Column 1: Brand Wordmark + Enlarged Logo + Tagline */}
          <div className="sound-bits-footer__brand lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-baseline gap-3.5">
              <h2 className="font-helvetica-neue text-3xl sm:text-4xl md:text-[44px] font-medium uppercase tracking-tight leading-[0.95] text-white">
                SOUND<br />
                <span className="inline-flex items-center gap-3.5">
                  BITS
                  <SoundBitsLogo size={54} color="#ff3700" className="inline-block shrink-0" />
                </span>
              </h2>
              <span className="shrink-0 font-tight text-[11px] sm:text-[12px] font-medium tracking-wider text-[#ff3700] px-2 py-0.5 rounded-full bg-[#ff3700]/10 border border-[#ff3700]/20">
                AUDIO
              </span>
            </div>
            <p className="font-tight text-[14px] text-white/50 max-w-sm leading-relaxed mt-1">
              Procedural micro UX sound library. Zero dependencies, sub-ms latency, live Web Audio synthesis.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="sound-bits-footer__nav lg:col-span-2 lg:pl-2">
            <p className="font-tight text-[12px] font-semibold text-[#ff3700] uppercase tracking-wider mb-4">
              Navigation
            </p>
            <nav className="space-y-2.5 font-tight text-[14px] sm:text-[15px]">
              <Link
                href="/"
                onClick={() => playSound('tick')}
                className="block text-white/70 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/docs"
                onClick={() => playSound('tick')}
                className="block text-white/70 hover:text-white transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="/browse"
                onClick={() => playSound('tick')}
                className="block text-white/70 hover:text-white transition-colors"
              >
                Frontends & Examples
              </Link>
              <Link
                href="/docs/sounds/interaction"
                onClick={() => playSound('tick')}
                className="block text-white/70 hover:text-white transition-colors"
              >
                Sound Catalog
              </Link>
              <a
                href="https://github.com/abhi-yo/sound-library"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-white transition-colors"
              >
                GitHub Repository
              </a>
            </nav>
          </div>

          {/* Column 3: Community */}
          <div className="sound-bits-footer__community lg:col-span-2">
            <p className="font-tight text-[12px] font-semibold text-[#ff3700] uppercase tracking-wider mb-4">
              Community
            </p>
            <div className="space-y-2.5 font-tight text-[14px] sm:text-[15px]">
              <a
                href="https://github.com/abhi-yo/sound-library"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://github.com/abhi-yo/sound-library/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-white transition-colors"
              >
                Issues
              </a>
              <a
                href="https://www.npmjs.com/package/sound-library"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-white transition-colors"
              >
                npm package
              </a>
            </div>
          </div>

          {/* Column 4: Contact & Inquiries (Pinned to Right) */}
          <div className="sound-bits-footer__contact lg:col-span-3 flex flex-col lg:items-end lg:text-right space-y-4">
            <p className="font-tight text-[12px] font-semibold text-[#ff3700] uppercase tracking-wider mb-1">
              Contact & Inquiries
            </p>
            <p className="font-tight text-[14px] text-white/50 max-w-xs leading-relaxed">
              Have questions or want bespoke procedural sounds for your product?
            </p>
            <a
              href="mailto:akshatsing11@gmail.com"
              className="inline-flex items-center gap-2 font-tight text-[14px] font-medium text-white/80 hover:text-[#ff3700] transition-colors group pt-1"
            >
              <span className="text-base text-[#ff3700] transition-transform group-hover:translate-x-0.5">↳</span>
              <span className="break-all underline underline-offset-4 decoration-white/30 group-hover:decoration-[#ff3700]">
                akshatsing11@gmail.com
              </span>
            </a>
          </div>
        </div>

        {/* Middle Breathing Room */}
        <div className="sound-bits-footer__spacer my-10 sm:my-14 md:my-16" />

        {/* Bottom Row: Game on Left, Policies Center, Copyright Pinned on Right */}
        <div className="sound-bits-footer__bottom grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-end w-full">
          {/* Bottom Left: Tap game */}
          <div className="sound-bits-footer__game lg:col-span-5">
            <FooterTapGame />
          </div>

          {/* Bottom Center: Legal Policies */}
          <div className="sound-bits-footer__legal lg:col-span-3 lg:pl-2">
            <p className="font-tight text-[12px] font-semibold text-white/40 uppercase tracking-wider mb-3">
              Legal
            </p>
            <div className="space-y-2 font-tight text-[13px] text-white/50">
              <div>
                <a
                  href="https://github.com/abhi-yo/sound-library/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  MIT License
                </a>
              </div>
              <div>
                <a
                  href="mailto:akshatsing11@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Right: Credits & Copyright (Pinned to Far Right) */}
          <div className="sound-bits-footer__credits lg:col-span-4 flex flex-col lg:items-end lg:text-right space-y-1 font-tight text-[13px] text-white/40">
            <p className="text-white/60">Built for interactive web interfaces.</p>
            <p className="text-white/80 font-medium">Studio Sound Bits</p>
            <p className="pt-2 text-white/30 font-mono text-[12px]">© {new Date().getFullYear()} SOUND BITS · ALL RIGHTS RESERVED</p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default BigFooter;
