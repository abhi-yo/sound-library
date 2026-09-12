'use client';

import React from 'react';
import { Terminal, Download, Code2, Volume2 } from 'lucide-react';
import { playSound } from '@/lib/lazy-sounds';
import Link from 'next/link';

const STEPS = [
  {
    n: '01',
    heading: 'Install',
    subtext: 'Zero dependencies, tiny footprint.',
    icon: Download,
    renderCode: () => (
      <div className="rounded-[12px] bg-[#161616] border border-[#242424] px-3.5 py-2.5 flex items-center gap-2 font-mono text-[12px] ipad:text-[13px] text-white/80">
        <span className="text-[#ff3700] select-none font-semibold">$</span>
        <span>npm i sound-library</span>
      </div>
    ),
  },
  {
    n: '02',
    heading: 'Import',
    subtext: 'Framework agnostic, pure Web Audio.',
    icon: Code2,
    renderCode: () => (
      <div className="rounded-[12px] bg-[#161616] border border-[#242424] px-3.5 py-2.5 font-mono text-[11px] ipad:text-[12px] leading-relaxed whitespace-nowrap overflow-x-auto text-white/80">
        <span className="text-[#ff3700]/90">import</span> &#123; playSound &#125; <span className="text-[#ff3700]/90">from</span> <span className="text-neutral-300">&apos;sound-library&apos;</span>
      </div>
    ),
  },
  {
    n: '03',
    heading: 'Play',
    subtext: 'Instant synthesized micro UX audio.',
    icon: Volume2,
    renderCode: () => (
      <button
        type="button"
        onClick={() => playSound('button-click')}
        title="Click to test live sound"
        className="rounded-[12px] bg-[#161616] hover:bg-[#1c1c1c] border border-[#242424] hover:border-[#ff3700]/40 px-3.5 py-2.5 flex items-center justify-between font-mono text-[12px] ipad:text-[13px] text-white/90 transition-all cursor-pointer group/test w-full"
      >
        <span>playSound(&apos;button-click&apos;)</span>
        <span className="inline-flex items-center gap-1 text-[11px] font-tight text-[#ff3700] bg-[#ff3700]/10 px-2 py-0.5 rounded-full font-medium transition-transform group-hover/test:scale-105">
          <Volume2 className="w-3 h-3" /> Test
        </span>
      </button>
    ),
  },
];

export function HomeHowItWorks() {
  return (
    <div className="relative mx-auto w-full max-w-[1192px] px-4 sm:px-6 lg:px-8 pt-8 ipad:pt-14 pb-16 ipad:pb-20">
      <header className="flex w-full flex-col items-center gap-[16px] ipad:gap-[20px] mb-12 text-center">
        <div className="flex items-center gap-[8px] rounded-[100px] bg-[#1c1c1c] border border-[#2a2a2a] px-[14px] py-[10px]">
          <Terminal className="w-3.5 h-3.5 text-[#ff3700]" />
          <span className="font-tight text-[12px] leading-[1.2] font-medium tracking-[-0.24px] whitespace-nowrap text-[#ff3700] ipad:text-[14px] ipad:tracking-[-0.28px]">
            Integration
          </span>
        </div>
        <div className="flex w-full flex-col items-center gap-[10px] text-center leading-[1.2] text-white">
          <h2 className="font-helvetica-neue text-[24px] tracking-[-0.48px] ipad:text-[32px] ipad:tracking-[-0.64px]">
            Three lines. That&apos;s it.
          </h2>
          <p className="max-w-[420px] font-tight text-[15px] tracking-[-0.32px] opacity-50 ipad:text-[17px] ipad:tracking-[-0.36px] leading-[1.3] mx-auto">
            No config, no audio files to host, no codec juggling. Works anywhere JavaScript runs.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ipad:gap-5 items-stretch">
        {STEPS.map((s) => {
          const IconComponent = s.icon;
          return (
            <div
              key={s.n}
              className="flex flex-col rounded-[20px] bg-[#1a1a1a] p-[6px] ipad:p-[8px] border border-[#262626]/50"
            >
              <div className="rounded-[16px] bg-[#111111] p-5 ipad:p-6 flex flex-col justify-between gap-6 drop-shadow-[0px_0px_6px_rgba(0,0,0,0.5)] flex-1 min-h-[200px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-tight text-[12px] font-bold tracking-wider text-[#ff3700] uppercase">
                      {s.n}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#181818] border border-[#242424] flex items-center justify-center text-white/40">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h3 className="font-helvetica-neue text-[18px] ipad:text-[20px] font-medium text-white leading-tight">
                    {s.heading}
                  </h3>
                  <p className="font-tight text-[13px] text-white/50 mt-1 leading-snug">
                    {s.subtext}
                  </p>
                </div>
                <div>{s.renderCode()}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/docs/sounds/interaction"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-[#ff3700] transition-colors"
        >
          Read the full docs →
        </Link>
      </div>
    </div>
  );
}
