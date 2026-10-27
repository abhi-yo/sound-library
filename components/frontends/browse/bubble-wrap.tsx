'use client';

import React, { useState } from 'react';
import { ArrowCounterClockwise } from '@phosphor-icons/react';
import { playSound } from '@/lib/lazy-sounds';
import type { DemoProps } from './shared';

const COLS = 5;
const ROWS = 3;
const TOTAL = COLS * ROWS;

export default function BubbleWrap({ size = 'default' }: DemoProps) {
  const compact = size === 'compact';
  const [popped, setPopped] = useState<boolean[]>(() => Array(TOTAL).fill(false));
  const left = popped.filter((p) => !p).length;
  const b = compact ? 28 : 38;

  const pop = (i: number) => {
    if (popped[i]) return;
    playSound('pop');
    setPopped((p) => p.map((v, j) => (j === i ? true : v)));
  };

  const reset = () => {
    playSound('swipe');
    setPopped(Array(TOTAL).fill(false));
  };

  return (
    <div data-custom-sound className="flex flex-col items-center gap-3 select-none">
      <div
        className="grid rounded-2xl border border-white/[0.06] bg-[#0f0f12] p-2.5"
        style={{ gridTemplateColumns: `repeat(${COLS}, ${b}px)`, gap: compact ? 6 : 8 }}
      >
        {popped.map((isPopped, i) => (
          <button
            key={i}
            type="button"
            onClick={() => pop(i)}
            aria-pressed={isPopped}
            aria-label={`Bubble ${i + 1}${isPopped ? ', popped' : ''}`}
            className={`relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#ff3700]/60 transition-transform ${
              isPopped ? 'cursor-default scale-[0.82]' : 'cursor-pointer hover:-translate-y-px active:scale-90'
            }`}
            style={{
              width: b,
              height: b,
              transitionDuration: isPopped ? '220ms' : '120ms',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              background: isPopped
                ? 'radial-gradient(circle at 50% 50%, #141417 0%, #101013 100%)'
                : 'radial-gradient(circle at 34% 28%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.07) 22%, #1d1d22 58%, #141417 100%)',
              boxShadow: isPopped
                ? 'inset 0 1px 2px rgba(0,0,0,0.6)'
                : '0 2px 4px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)',
            }}
          >
            {isPopped && (
              <>
                <span className="absolute left-1/2 top-1/2 h-px w-[55%] -translate-x-1/2 -translate-y-1/2 rotate-[24deg] bg-white/15" />
                <span className="absolute left-1/2 top-1/2 h-px w-[40%] -translate-x-1/2 -translate-y-1/2 -rotate-[38deg] bg-white/10" />
              </>
            )}
          </button>
        ))}
      </div>
      <div className="flex h-6 items-center gap-3 font-mono text-[10px] tracking-[0.16em]">
        {left > 0 ? (
          <span className="text-white/35 tabular-nums">
            <span className="text-[#ff3700]">{String(left).padStart(2, '0')}</span> LEFT
          </span>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-full border border-[#ff3700]/35 bg-[#ff3700]/10 px-2.5 py-1 text-[#ff8a66] transition-colors hover:bg-[#ff3700]/20 hover:text-white cursor-pointer"
          >
            <ArrowCounterClockwise size={11} weight="bold" />
            NEW SHEET
          </button>
        )}
      </div>
    </div>
  );
}
