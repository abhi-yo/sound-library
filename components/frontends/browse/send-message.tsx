'use client';

import React, { useCallback, useRef, useState } from 'react';
import { PaperPlaneTilt } from '@phosphor-icons/react';
import { playSound } from '@/lib/lazy-sounds';
import { animateOnce, type DemoProps } from './shared';

const SUGGESTIONS = ['Ship it', 'Sounds good', 'On my way', 'Looks crisp', 'Love that click'];

interface Msg {
  id: number;
  text: string;
}

export default function SendMessage({ size = 'default' }: DemoProps) {
  const compact = size === 'compact';
  const [text, setText] = useState(SUGGESTIONS[0]);
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, text: 'New sounds are live?' }]);
  const nextId = useRef(1);
  const planeRef = useRef<HTMLSpanElement>(null);

  const canSend = text.trim().length > 0;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    playSound('send');
    const id = nextId.current++;
    setMsgs((m) => [...m, { id, text: text.trim() }].slice(-3));
    setText(SUGGESTIONS[id % SUGGESTIONS.length]);
    animateOnce(
      planeRef.current,
      [
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: 'translate(16px,-16px) rotate(-12deg)', opacity: 0, offset: 0.45 },
        { transform: 'translate(-12px,12px)', opacity: 0, offset: 0.46 },
        { transform: 'translate(0,0)', opacity: 1 },
      ],
      { duration: 520, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' },
    );
  };

  // Stable ref callback: runs once per new bubble, not on every render.
  const popIn = useCallback((el: HTMLDivElement | null) => {
    animateOnce(
      el,
      [
        { transform: 'translateY(8px) scale(0.92)', opacity: 0 },
        { transform: 'translateY(0) scale(1)', opacity: 1 },
      ],
      { duration: 260, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    );
  }, []);

  return (
    <div data-custom-sound className="flex flex-col gap-2.5 select-none" style={{ width: compact ? 212 : 280 }}>
      <div
        className="flex flex-col justify-end gap-1.5 overflow-hidden"
        style={{ height: compact ? 74 : 92 }}
        aria-live="polite"
      >
        {msgs.map((m, i) => (
          <div
            key={m.id}
            ref={m.id === 0 ? undefined : popIn}
            className={`max-w-[80%] truncate rounded-2xl px-3 py-1.5 font-tight text-[12px] leading-tight ${
              m.id === 0
                ? 'self-start rounded-bl-md bg-[#18181c] text-white/60 border border-white/[0.06]'
                : 'self-end rounded-br-md bg-[#ff3700] text-black font-medium'
            } ${i < msgs.length - 2 ? 'opacity-50' : ''}`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <form
        onSubmit={send}
        className="flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-[#121215] py-1 pl-3.5 pr-1 focus-within:border-white/20 transition-colors"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 40))}
          aria-label="Message"
          placeholder="Message"
          className="min-w-0 flex-1 bg-transparent font-tight text-[13px] text-white/85 placeholder:text-white/25 outline-none select-text"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full transition-all duration-150 active:scale-90 cursor-pointer disabled:cursor-default ${
            compact ? 'h-7 w-7' : 'h-8 w-8'
          } ${canSend ? 'bg-[#ff3700] text-black' : 'bg-white/[0.06] text-white/25'}`}
        >
          <span ref={planeRef} className="flex">
            <PaperPlaneTilt size={compact ? 14 : 16} weight="fill" />
          </span>
        </button>
      </form>
    </div>
  );
}
