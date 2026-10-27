'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkle } from '@phosphor-icons/react';
import { playSound } from '@/lib/lazy-sounds';
import { animateOnce, type DemoProps } from './shared';

const IDEAS = [
  'glass marble on a tile floor',
  'soft laser chirp, short tail',
  'wooden block, warm and dry',
  'tiny bell under water',
  'paper fold with a snap',
];
const SPARKS = 7;

export default function MagicGenerate({ size = 'default' }: DemoProps) {
  const compact = size === 'compact';
  const [idx, setIdx] = useState(-1);
  const [busy, setBusy] = useState(false);
  const sparkRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const generate = () => {
    if (busy) return;
    playSound('magic-sparkle');
    setBusy(true);
    sparkRefs.current.forEach((el, i) => {
      const a = (i / SPARKS) * Math.PI * 2 + 0.4;
      const dist = 26 + (i % 3) * 8;
      animateOnce(
        el,
        [
          { transform: 'translate(-50%, -50%) scale(0.2) rotate(0deg)', opacity: 0 },
          { transform: 'translate(-50%, -50%) scale(1) rotate(45deg)', opacity: 1, offset: 0.3 },
          {
            transform: `translate(calc(-50% + ${Math.cos(a) * dist}px), calc(-50% + ${Math.sin(a) * dist * 0.7}px)) scale(0.3) rotate(120deg)`,
            opacity: 0,
          },
        ],
        { duration: 620 + (i % 3) * 80, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    });
    timer.current = setTimeout(() => {
      setIdx((n) => (n + 1) % IDEAS.length);
      setBusy(false);
    }, 650);
  };

  return (
    <div data-custom-sound className="flex flex-col items-center gap-3 select-none" style={{ width: compact ? 212 : 270 }}>
      <div
        className="flex h-[52px] w-full flex-col justify-center rounded-xl border border-white/[0.07] bg-[#0f0f12] px-3"
        aria-live="polite"
      >
        <span className="font-mono text-[9px] tracking-[0.18em] text-white/25">PROMPT → SOUND</span>
        {busy ? (
          <span className="mt-1.5 flex flex-col gap-1">
            <span className="h-[6px] w-[80%] animate-pulse rounded-full bg-white/[0.08]" />
          </span>
        ) : (
          <span key={idx} className="mt-0.5 truncate font-tight text-[13px] text-white/80">
            {idx < 0 ? 'Press generate for an idea' : IDEAS[idx]}
          </span>
        )}
      </div>
      <div className="relative">
        {Array.from({ length: SPARKS }).map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              sparkRefs.current[i] = el;
            }}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 text-[#ff3700] opacity-0"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <Sparkle size={i % 2 ? 8 : 11} weight="fill" />
          </span>
        ))}
        <button
          type="button"
          onClick={generate}
          aria-busy={busy}
          className="relative flex items-center gap-2 rounded-full p-px cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#ff3700]/60 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #ff7a4d, #ff3700 45%, #6b1800)' }}
        >
          <span
            className={`flex items-center gap-2 rounded-full bg-[#120b08] font-mono font-bold uppercase tracking-[0.14em] text-white ${
              compact ? 'px-4 py-2 text-[11px]' : 'px-5 py-2.5 text-[12px]'
            }`}
          >
            <Sparkle size={compact ? 13 : 15} weight="fill" className={`text-[#ff3700] transition-transform duration-500 ${busy ? 'rotate-180 scale-110' : ''}`} />
            {busy ? 'Brewing' : 'Generate'}
          </span>
        </button>
      </div>
    </div>
  );
}
