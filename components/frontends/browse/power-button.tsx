'use client';

import React, { useState } from 'react';
import { Power } from '@phosphor-icons/react';
import { playSound } from '@/lib/lazy-sounds';
import type { DemoProps } from './shared';

const TICKS = 24;

export default function PowerButton({ size = 'default' }: DemoProps) {
  const compact = size === 'compact';
  const [on, setOn] = useState(false);
  const d = compact ? 112 : 148;
  const cap = compact ? 62 : 82;
  const c = d / 2;
  const rOut = c - 3;
  const rIn = c - (compact ? 10 : 13);

  const toggle = () => {
    const next = !on;
    playSound(next ? 'power-up' : 'power-down');
    setOn(next);
  };

  return (
    <div data-custom-sound className="flex flex-col items-center gap-3 select-none">
      <div className="relative" style={{ width: d, height: d }}>
        <svg width={d} height={d} className="absolute inset-0" aria-hidden>
          {Array.from({ length: TICKS }).map((_, i) => {
            const a = (i / TICKS) * Math.PI * 2 - Math.PI / 2;
            const lit = on;
            return (
              <line
                key={i}
                x1={c + Math.cos(a) * rIn}
                y1={c + Math.sin(a) * rIn}
                x2={c + Math.cos(a) * rOut}
                y2={c + Math.sin(a) * rOut}
                strokeWidth={i % 6 === 0 ? 2 : 1.4}
                strokeLinecap="round"
                style={{
                  stroke: lit ? '#ff3700' : 'rgba(255,255,255,0.12)',
                  transition: `stroke 180ms ease-out ${lit ? i * 18 : (TICKS - i) * 8}ms`,
                }}
              />
            );
          })}
        </svg>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={on}
          aria-label={on ? 'Power off' : 'Power on'}
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#ff3700]/60 transition-[transform,box-shadow,border-color] duration-200 active:scale-95"
          style={{
            width: cap,
            height: cap,
            borderColor: on ? 'rgba(255,55,0,0.55)' : 'rgba(255,255,255,0.1)',
            background: 'linear-gradient(145deg, #1d1d22 0%, #101013 100%)',
            boxShadow: on
              ? '0 0 0 4px rgba(255,55,0,0.08), 0 0 28px rgba(255,55,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)'
              : '0 6px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.4)',
          }}
        >
          <Power
            size={compact ? 24 : 32}
            weight="bold"
            className="transition-colors duration-200"
            style={{ color: on ? '#ff3700' : 'rgba(255,255,255,0.4)', filter: on ? 'drop-shadow(0 0 6px rgba(255,55,0,0.7))' : 'none' }}
          />
        </button>
      </div>
      <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em]">
        <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${on ? 'bg-[#ff3700] shadow-[0_0_6px_#ff3700]' : 'bg-white/20'}`} />
        <span className={on ? 'text-[#ff3700]' : 'text-white/40'}>{on ? 'ONLINE' : 'STANDBY'}</span>
      </div>
    </div>
  );
}
