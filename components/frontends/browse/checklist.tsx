'use client';

import React, { useState } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import type { DemoProps } from './shared';

const TASKS = ['Pick a sound', 'Wire playSound()', 'Ship it'];

export default function Checklist({ size = 'default' }: DemoProps) {
  const compact = size === 'compact';
  const [done, setDone] = useState<boolean[]>([true, false, false]);
  const count = done.filter(Boolean).length;
  const all = count === TASKS.length;

  const toggle = (i: number) => {
    const next = done.map((v, j) => (j === i ? !v : v));
    const nowAll = next.every(Boolean);
    playSound(nowAll ? 'success-fanfare' : 'select');
    setDone(next);
  };

  return (
    <div data-custom-sound className="flex flex-col gap-2.5 select-none" style={{ width: compact ? 200 : 260 }}>
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em]">
        <span className={all ? 'text-[#ff3700]' : 'text-white/35'}>{all ? 'ALL DONE' : 'LAUNCH LIST'}</span>
        <span className="tabular-nums text-white/35">
          {count}/{TASKS.length}
        </span>
      </div>
      <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full origin-left rounded-full bg-[#ff3700] transition-transform duration-300 ease-out"
          style={{
            transform: `scaleX(${count / TASKS.length})`,
            boxShadow: all ? '0 0 10px #ff3700' : 'none',
          }}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        {TASKS.map((t, i) => (
          <button
            key={t}
            type="button"
            role="checkbox"
            aria-checked={done[i]}
            onClick={() => toggle(i)}
            className={`group flex items-center gap-2.5 rounded-xl border px-3 text-left transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#ff3700]/60 ${
              compact ? 'py-2' : 'py-2.5'
            } ${done[i] ? 'border-white/[0.05] bg-[#0f0f12]' : 'border-white/[0.09] bg-[#141417] hover:border-white/20'}`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-all duration-200 group-active:scale-90 ${
                done[i] ? 'border-[#ff3700] bg-[#ff3700]' : 'border-white/25 bg-transparent'
              }`}
            >
              <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
                <path
                  d="M2.2 6.3 4.8 8.8 9.8 3.4"
                  fill="none"
                  stroke="#000"
                  strokeWidth={1.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 12,
                    strokeDashoffset: done[i] ? 0 : 12,
                    transition: 'stroke-dashoffset 220ms ease-out 40ms',
                  }}
                />
              </svg>
            </span>
            <span className="relative font-tight text-[13px]">
              <span className={`transition-colors ${done[i] ? 'text-white/35' : 'text-white/85'}`}>{t}</span>
              <span
                aria-hidden
                className="absolute left-0 right-0 top-1/2 h-px origin-left bg-white/35 transition-transform duration-200 ease-out"
                style={{ transform: `scaleX(${done[i] ? 1 : 0})` }}
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
