'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import type { SoundName } from '@/lib/sound-names';

const COLS = 3;
const ROWS = 3;
const CELLS = COLS * ROWS;
const LIVES = 5;
const HIT_SOUNDS: SoundName[] = ['tap', 'pop', 'blip', 'haptic-pop', 'bloop', 'snap'];

type Phase = 'idle' | 'playing' | 'over';

export function FooterTapGame() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [active, setActive] = useState<number | null>(null);
  const [lives, setLives] = useState(LIVES);
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(0);
  const [streak, setStreak] = useState(0);
  const [flash, setFlash] = useState<number | null>(null);
  const [burst, setBurst] = useState<{ i: number; id: number } | null>(null);

  const phaseRef = useRef<Phase>('idle');
  const activeRef = useRef<number | null>(null);
  const livesRef = useRef(LIVES);
  const scoreRef = useRef(0);
  const highRef = useRef(0);
  const streakRef = useRef(0);
  const roundRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startMsRef = useRef(0);
  const soundIdx = useRef(0);
  const insideRef = useRef(false);

  phaseRef.current = phase;
  activeRef.current = active;
  livesRef.current = lives;
  scoreRef.current = score;
  highRef.current = high;
  streakRef.current = streak;

  useEffect(() => {
    try {
      const v = Number(sessionStorage.getItem('sb-tap-hi') || 0);
      if (v > 0) {
        setHigh(v);
        highRef.current = v;
      }
    } catch {
      /* ignore */
    }
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const windowMs = (round: number) => Math.max(520, 1250 - round * 28);

  const persistHigh = (n: number) => {
    highRef.current = n;
    setHigh(n);
    try {
      sessionStorage.setItem('sb-tap-hi', String(n));
    } catch {
      /* ignore */
    }
  };

  const endGame = useCallback((silent = false) => {
    clearTimer();
    const wasPlaying = phaseRef.current === 'playing';
    phaseRef.current = 'over';
    setPhase('over');
    setActive(null);
    activeRef.current = null;
    if (wasPlaying && !silent) playSound('error');
    if (scoreRef.current > highRef.current) persistHigh(scoreRef.current);
    // settle back to idle so next hover can start again
    setTimeout(() => {
      if (!insideRef.current) {
        phaseRef.current = 'idle';
        setPhase('idle');
        setLives(LIVES);
        livesRef.current = LIVES;
        setStreak(0);
        streakRef.current = 0;
      }
    }, 400);
  }, []);

  const spawn = useCallback(() => {
    if (phaseRef.current !== 'playing' || !insideRef.current) return;
    clearTimer();
    let next = Math.floor(Math.random() * CELLS);
    if (activeRef.current != null && CELLS > 1) {
      while (next === activeRef.current) next = Math.floor(Math.random() * CELLS);
    }
    activeRef.current = next;
    setActive(next);
    startMsRef.current = performance.now();
    const limit = windowMs(roundRef.current);
    timerRef.current = setTimeout(() => {
      if (phaseRef.current !== 'playing') return;
      if (activeRef.current !== next) return;
      const left = livesRef.current - 1;
      livesRef.current = left;
      setLives(left);
      streakRef.current = 0;
      setStreak(0);
      setFlash(next);
      setTimeout(() => setFlash(null), 180);
      playSound('thud');
      if (left <= 0) {
        endGame();
        return;
      }
      activeRef.current = null;
      setActive(null);
      timerRef.current = setTimeout(() => spawn(), 220);
    }, limit);
  }, [endGame]);

  const start = useCallback(() => {
    if (phaseRef.current === 'playing') return;
    clearTimer();
    roundRef.current = 0;
    livesRef.current = LIVES;
    scoreRef.current = 0;
    streakRef.current = 0;
    setLives(LIVES);
    setScore(0);
    setStreak(0);
    setFlash(null);
    setBurst(null);
    phaseRef.current = 'playing';
    setPhase('playing');
    playSound('toggle-on');
    timerRef.current = setTimeout(() => spawn(), 280);
  }, [spawn]);

  const onEnter = () => {
    insideRef.current = true;
    if (phaseRef.current !== 'playing') start();
  };

  const onLeave = () => {
    insideRef.current = false;
    if (phaseRef.current === 'playing') endGame();
    else {
      clearTimer();
      phaseRef.current = 'idle';
      setPhase('idle');
      setActive(null);
    }
  };

  const onPad = (i: number) => {
    if (phaseRef.current !== 'playing' || activeRef.current == null) return;

    if (i === activeRef.current) {
      clearTimer();
      const elapsed = performance.now() - startMsRef.current;
      const limit = windowMs(roundRef.current);
      const early = elapsed < limit * 0.35;
      const s = HIT_SOUNDS[soundIdx.current % HIT_SOUNDS.length];
      soundIdx.current += 1;
      playSound(s);

      const nextStreak = streakRef.current + 1;
      streakRef.current = nextStreak;
      setStreak(nextStreak);
      const gain = 1 + Math.floor(nextStreak / 5) + (early ? 1 : 0);
      scoreRef.current += gain;
      setScore(scoreRef.current);
      if (scoreRef.current > highRef.current) persistHigh(scoreRef.current);

      setBurst({ i, id: Date.now() });
      setTimeout(() => setBurst(null), 280);
      roundRef.current += 1;
      activeRef.current = null;
      setActive(null);
      timerRef.current = setTimeout(() => spawn(), early ? 90 : 150);
      return;
    }

    const left = livesRef.current - 1;
    livesRef.current = left;
    setLives(left);
    streakRef.current = 0;
    setStreak(0);
    setFlash(i);
    setTimeout(() => setFlash(null), 160);
    playSound('tick');
    if (left <= 0) endGame();
  };

  useEffect(() => () => clearTimer(), []);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden && phaseRef.current === 'playing') endGame(true);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [endGame]);

  return (
    <div
      className="relative w-full max-w-[300px] select-none outline-none"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onLeave();
      }}
      tabIndex={0}
      aria-label="Hidden reaction pads"
    >
      <div
        className={`relative overflow-hidden rounded-[18px] border bg-[#08080a] p-2 shadow-2xl transition-all duration-200 ${
          phase === 'playing'
            ? 'border-[#ff3700]/25 shadow-[0_0_24px_rgba(255,55,0,0.12)]'
            : 'border-white/[0.08] hover:border-white/15'
        }`}
      >
        <div className="relative rounded-[14px] border border-white/[0.05] bg-neutral-950 px-2.5 pb-2.5 pt-2">
          <div className="mb-2 flex items-center justify-between gap-2 px-0.5">
            <div className="flex items-center gap-1">
              {Array.from({ length: LIVES }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                    i < lives
                      ? 'bg-[#ff3700] shadow-[0_0_6px_rgba(255,55,0,0.55)]'
                      : 'bg-white/10'
                  }`}
                />
              ))}
              {streak >= 5 && (
                <span className="ml-1 font-mono text-[9px] font-bold tracking-wider text-[#ff3700]/80">
                  ×{streak}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              {high > 0 && (
                <span className="text-[10px] font-semibold tracking-wider text-white/30">
                  HI {String(high).padStart(3, '0')}
                </span>
              )}
              <span className="rounded-[5px] border border-white/10 bg-black/70 px-1.5 py-0.5 font-bold tracking-wider text-white">
                {String(score).padStart(3, '0')}
              </span>
            </div>
          </div>

          <div
            className="mx-auto grid w-full max-w-[220px] gap-1.5"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: CELLS }).map((_, i) => {
              const isLit = active === i && phase === 'playing';
              const isFlash = flash === i;
              const isBurst = burst?.i === i;
              return (
                <button
                  key={i}
                  type="button"
                  aria-label="pad"
                  tabIndex={-1}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    onPad(i);
                  }}
                  className={`relative h-[52px] w-full rounded-[10px] border transition-transform duration-100 ease-out will-change-transform active:scale-[0.94] cursor-pointer sm:h-[56px] ${
                    isLit
                      ? 'border-[#ff3700]/55 bg-[#ff3700]/25 shadow-[0_0_18px_rgba(255,55,0,0.28)] scale-[1.03]'
                      : isFlash
                        ? 'border-white/25 bg-white/10'
                        : 'border-white/[0.06] bg-white/[0.035] hover:bg-white/[0.06] hover:border-white/10'
                  }`}
                >
                  {isLit && (
                    <span className="pointer-events-none absolute inset-0 rounded-[10px] bg-[#ff3700]/15 animate-pulse" />
                  )}
                  {isBurst && (
                    <span
                      key={burst.id}
                      className="pointer-events-none absolute inset-0 rounded-[10px] bg-[#ff3700]/40 animate-ping"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterTapGame;
