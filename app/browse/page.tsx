'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import HomeHeader from '@/components/home-header';
import { playSound, playCopySound } from '@/lib/lazy-sounds';
import type { SoundName } from '@/lib/sound-names';
import {
  CursorClick,
  Plus,
  Minus,
  Heart,
  Bell,
  SpeakerHigh,
  ArrowsOut,
  X,
  Copy,
  Check,
} from '@phosphor-icons/react';

const EdgeDotBands = dynamic(
  () => import('@/components/originkit/ui/features-04/edge-dot-bands').then((m) => m.EdgeDotBands),
  { ssr: false, loading: () => null },
);

const BigFooter = dynamic(
  () => import('@/components/big-footer').then((m) => m.BigFooter),
  { loading: () => <div className="h-48 w-full" aria-hidden /> },
);

interface ComponentDef {
  id: string;
  idx: string;
  sound: SoundName;
  soundAlt?: SoundName;
  soundLabel?: string;
  soundAltLabel?: string;
  code: string;
}

const DEFS: ComponentDef[] = [
  {
    id: 'button',
    idx: '01',
    sound: 'button-click',
    code: `playSound('button-click')`,
  },
  {
    id: 'dial',
    idx: '02',
    sound: 'tick',
    code: `playSound('tick')`,
  },
  {
    id: 'switch',
    idx: '03',
    sound: 'toggle-on',
    soundAlt: 'toggle-off',
    code: `playSound(on ? 'toggle-on' : 'toggle-off')`,
  },
  {
    id: 'stepper',
    idx: '04',
    sound: 'blip',
    code: `playSound('blip')`,
  },
  {
    id: 'reaction',
    idx: '05',
    sound: 'bubble',
    soundAlt: 'bell',
    soundLabel: 'like',
    soundAltLabel: 'notify',
    code: `playSound(liked ? 'bubble' : 'bell')`,
  },
];

/* ─── Outer card shell — same for every component ───────────────────────── */

function CardShell({
  def,
  onExpand,
  children,
}: {
  def: ComponentDef;
  onExpand: () => void;
  children: React.ReactNode;
}) {
  const [playing, setPlaying] = useState<'primary' | 'alt' | null>(null);
  const playTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (playTimer.current) clearTimeout(playTimer.current);
    };
  }, []);

  const trigger = (which: 'primary' | 'alt', sound: SoundName) => {
    playSound(sound);
    setPlaying(which);
    if (playTimer.current) clearTimeout(playTimer.current);
    playTimer.current = setTimeout(() => setPlaying(null), 450);
  };

  return (
    <div
      className="group/card flex h-full min-h-[280px] flex-col rounded-[32px] border border-white/[0.04] bg-[#121212] p-2 transition-colors duration-200 ease-out hover:bg-[#171717]"
      style={{ cornerShape: 'squircle' } as React.CSSProperties}
    >
      <div
        className="relative flex min-h-[220px] flex-1 items-center justify-center overflow-hidden rounded-3xl border border-neutral-500/15 bg-neutral-950"
        style={{ cornerShape: 'squircle' } as React.CSSProperties}
      >
        <span className="pointer-events-none absolute left-3.5 top-3.5 font-mono text-[11px] font-bold tracking-[0.15em] text-[#ff3700]">
          {def.idx}
        </span>
        <button
          type="button"
          onClick={onExpand}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/35 backdrop-blur-sm transition-colors hover:border-[#ff3700]/35 hover:text-white/80 cursor-pointer"
        >
          <ArrowsOut size={12} weight="bold" />
        </button>
        <div className="flex items-center justify-center px-6 py-10">{children}</div>
      </div>

      <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => trigger('primary', def.sound)}
            className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
              playing === 'primary' ? 'text-[#ff3700]' : 'text-white/35 hover:text-white/55'
            }`}
          >
            <SpeakerHigh size={12} weight="fill" className="shrink-0" />
            <span className="truncate font-mono text-[11px] tracking-wide">
              {def.soundLabel ?? def.sound}
            </span>
          </button>
          {def.soundAlt && (
            <>
              <span className="text-white/[0.14] font-mono text-[10px]">/</span>
              <button
                type="button"
                onClick={() => trigger('alt', def.soundAlt!)}
                className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                  playing === 'alt' ? 'text-[#ff3700]' : 'text-white/35 hover:text-white/55'
                }`}
              >
                <SpeakerHigh size={12} weight="fill" className="shrink-0" />
                <span className="truncate font-mono text-[11px] tracking-wide">
                  {def.soundAltLabel ?? def.soundAlt}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── 01 Push button ────────────────────────────────────────────────────── */

function NeoBrutalistButton({ size = 'default' }: { size?: 'compact' | 'default' }) {
  const [pressed, setPressed] = useState(false);
  const isCompact = size === 'compact';

  return (
    <button
      type="button"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => {
        setPressed(false);
        playSound('button-click');
      }}
      onPointerLeave={() => setPressed(false)}
      className={`group relative select-none font-mono font-bold uppercase tracking-wider transition-all duration-75 cursor-pointer border-2 border-white ${
        isCompact ? 'px-5 py-2.5 text-xs' : 'px-7 py-3.5 text-sm'
      } ${
        pressed
          ? 'translate-x-[4px] translate-y-[4px] shadow-none bg-[#ff3700] text-black border-[#ff3700]'
          : 'bg-[#0f0f12] text-white shadow-[4px_4px_0px_#ff3700] hover:shadow-[5px_5px_0px_#ff3700]'
      }`}
    >
      <div className="flex items-center gap-2">
        <CursorClick
          size={isCompact ? 16 : 18}
          weight="bold"
          className={pressed ? 'text-black' : 'text-[#ff3700]'}
        />
        <span>Push</span>
      </div>
    </button>
  );
}

/* ─── 02 Rotary dial ────────────────────────────────────────────────────── */

function NeumorphicDial({
  value,
  onChange,
  size = 'default',
}: {
  value: number;
  onChange: (v: number) => void;
  size?: 'compact' | 'default';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const prevVal = useRef(value);

  const isCompact = size === 'compact';
  const boxDim = isCompact ? 104 : 156;
  const cx = boxDim / 2;
  const cy = boxDim / 2;

  const TOTAL_TICKS = 21;
  const START_DEG = -135;
  const END_DEG = 135;
  const STEP_DEG = (END_DEG - START_DEG) / (TOTAL_TICKS - 1);

  const rOuter = isCompact ? 48 : 72;
  const rMajorIn = isCompact ? 41 : 63;
  const rMinorIn = isCompact ? 44 : 67;

  const wellDim = isCompact ? 70 : 108;
  const knobDim = isCompact ? 58 : 90;
  const notchW = isCompact ? 2.5 : 3.5;
  const notchH = isCompact ? 8 : 12;
  const divotDim = isCompact ? 13 : 19;

  const angle = START_DEG + (value / 100) * (END_DEG - START_DEG);

  const calculateAngleAndStep = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;

      let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (deg > 180) deg -= 360;

      if (deg < START_DEG) {
        if (deg >= -160) deg = START_DEG;
        else return;
      } else if (deg > END_DEG) {
        if (deg <= 160) deg = END_DEG;
        else return;
      }

      const pct = (deg - START_DEG) / (END_DEG - START_DEG);
      const stepped = Math.round((pct * 100) / 5) * 5;
      const nextVal = Math.max(0, Math.min(100, stepped));

      if (nextVal !== prevVal.current) {
        playSound('tick');
        prevVal.current = nextVal;
        onChange(nextVal);
      }
    },
    [onChange],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    calculateAngleAndStep(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    calculateAngleAndStep(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 5 : -5;
    const nextVal = Math.max(0, Math.min(100, value + delta));
    if (nextVal !== value) {
      playSound('tick');
      prevVal.current = nextVal;
      onChange(nextVal);
    }
  };

  const ticks = Array.from({ length: TOTAL_TICKS }).map((_, i) => {
    const tickDeg = START_DEG + i * STEP_DEG;
    const tickPct = (i / (TOTAL_TICKS - 1)) * 100;
    const isActive = tickPct <= value;
    const isMajor = i % 5 === 0;

    const rad = (tickDeg * Math.PI) / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    const x1 = cx + rOuter * sin;
    const y1 = cy - rOuter * cos;
    const rIn = isMajor ? rMajorIn : rMinorIn;
    const x2 = cx + rIn * sin;
    const y2 = cy - rIn * cos;

    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isActive ? '#ff3700' : 'rgba(255,255,255,0.18)'}
        strokeWidth={isMajor ? 2 : 1.25}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div
      ref={containerRef}
      className="relative select-none touch-none cursor-grab active:cursor-grabbing"
      style={{ width: boxDim, height: boxDim }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    >
      <svg width={boxDim} height={boxDim} className="absolute inset-0 pointer-events-none">
        {ticks}
      </svg>

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
        style={{
          width: wellDim,
          height: wellDim,
          background: '#0c0c0f',
          boxShadow:
            'inset 0 2px 6px rgba(0,0,0,0.65), inset 0 -1px 1px rgba(255,255,255,0.04), 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div
          className="relative rounded-full"
          style={{
            width: knobDim,
            height: knobDim,
            background: 'linear-gradient(145deg, #1a1a20 0%, #101014 100%)',
            boxShadow:
              '0 4px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.4)',
            transform: `rotate(${angle}deg)`,
          }}
        >
          <div
            className="absolute left-1/2 top-[12%] -translate-x-1/2 rounded-full bg-[#ff3700]"
            style={{ width: notchW, height: notchH }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: divotDim,
              height: divotDim,
              background: '#08080a',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.7), 0 0.5px 0 rgba(255,255,255,0.06)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── 03 Switch ─────────────────────────────────────────────────────────── */

function NeumorphicSwitch({
  on,
  onChange,
  size = 'default',
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  size?: 'compact' | 'default';
}) {
  const isCompact = size === 'compact';
  const trackW = isCompact ? 56 : 68;
  const trackH = isCompact ? 32 : 38;
  const thumb = isCompact ? 24 : 30;

  return (
    <button
      type="button"
      onClick={() => {
        const next = !on;
        playSound(next ? 'toggle-on' : 'toggle-off');
        onChange(next);
      }}
      className="relative select-none cursor-pointer rounded-full transition-colors duration-200 border border-white/[0.08]"
      style={{
        width: trackW,
        height: trackH,
        background: on ? '#ff3700' : '#121215',
        boxShadow: on
          ? 'inset 0 1px 2px rgba(0,0,0,0.25)'
          : 'inset 0 1px 3px rgba(0,0,0,0.55), 0 0.5px 0 rgba(255,255,255,0.04)',
      }}
      aria-pressed={on}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 rounded-full bg-[#f2f2f4] transition-all duration-200"
        style={{
          width: thumb,
          height: thumb,
          left: on ? trackW - thumb - 4 : 4,
          boxShadow: on
            ? '0 0.5px 1px rgba(0,0,0,0.25)'
            : 'inset 0 0.5px 1px rgba(0,0,0,0.5), 0 0.5px 0.5px rgba(255,255,255,0.5)',
        }}
      />
    </button>
  );
}

/* ─── 04 Stepper ────────────────────────────────────────────────────────── */

function CleanStepper({
  value,
  onChange,
  size = 'default',
}: {
  value: number;
  onChange: (v: number) => void;
  size?: 'compact' | 'default';
}) {
  const isCompact = size === 'compact';
  const btnSz = isCompact ? 'w-9 h-9' : 'w-11 h-11';
  const numW = isCompact ? 'w-14' : 'w-16';
  const textSz = isCompact ? 'text-sm' : 'text-base';

  return (
    <div className="flex items-center rounded-xl bg-[#121215] border border-white/[0.1] overflow-hidden select-none">
      <button
        type="button"
        onClick={() => {
          playSound('blip');
          onChange(Math.max(0, value - 1));
        }}
        className={`${btnSz} flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.1] active:scale-95 transition-all border-r border-white/[0.08] cursor-pointer`}
      >
        <Minus size={isCompact ? 13 : 15} weight="bold" />
      </button>

      <span
        className={`${numW} text-center font-mono ${textSz} font-semibold text-white tabular-nums select-none`}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => {
          playSound('blip');
          onChange(value + 1);
        }}
        className={`${btnSz} flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.1] active:scale-95 transition-all border-l border-white/[0.08] cursor-pointer`}
      >
        <Plus size={isCompact ? 13 : 15} weight="bold" />
      </button>
    </div>
  );
}

/* ─── 05 Reactions ──────────────────────────────────────────────────────── */

function CleanReactions({
  liked,
  notifCount,
  onLike,
  onNotifHover,
  onNotifClick,
  size = 'default',
}: {
  liked: boolean;
  notifCount: number;
  onLike: () => void;
  onNotifHover: () => void;
  onNotifClick: () => void;
  size?: 'compact' | 'default';
}) {
  const isCompact = size === 'compact';
  const iconS = isCompact ? 18 : 22;
  const btnSz = isCompact ? 'w-11 h-11 rounded-xl' : 'w-13 h-13 rounded-xl';

  return (
    <div className={`flex items-center ${isCompact ? 'gap-3.5' : 'gap-4'} select-none`}>
      <button
        type="button"
        onClick={onLike}
        className={`${btnSz} flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 border ${
          liked
            ? 'bg-[#ff3700] border-[#ff3700] text-black'
            : 'bg-[#121215] border-white/[0.1] text-white/50 hover:text-white hover:border-white/20'
        }`}
        title="Like"
      >
        <Heart size={iconS} weight={liked ? 'fill' : 'bold'} />
      </button>

      <div className="relative">
        <button
          type="button"
          onMouseEnter={onNotifHover}
          onClick={onNotifClick}
          className={`${btnSz} flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 border ${
            notifCount > 0
              ? 'bg-[#18181f] border-white/20 text-[#ff3700]'
              : 'bg-[#121215] border-white/[0.1] text-white/50 hover:text-white hover:border-white/20'
          }`}
          title={
            notifCount > 0
              ? `${notifCount} notification${notifCount > 1 ? 's' : ''} (click to clear)`
              : 'Hover to trigger notification'
          }
        >
          <Bell size={iconS} weight={notifCount > 0 ? 'fill' : 'bold'} />
        </button>

        {notifCount > 0 && (
          <span
            key={notifCount}
            className="absolute -top-1.5 -right-1.5 bg-[#ff3700] text-black font-mono font-bold text-[10px] leading-none px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-[#0b0b0d] select-none pointer-events-none"
          >
            {notifCount > 99 ? '99+' : notifCount}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Card items ────────────────────────────────────────────────────────── */

function DialCardItem({ onExpand }: { onExpand: () => void }) {
  const [val, setVal] = useState(65);
  return (
    <CardShell def={DEFS[1]} onExpand={onExpand}>
      <NeumorphicDial value={val} onChange={setVal} size="compact" />
    </CardShell>
  );
}

function SwitchCardItem({ onExpand }: { onExpand: () => void }) {
  const [on, setOn] = useState(false);
  return (
    <CardShell def={DEFS[2]} onExpand={onExpand}>
      <NeumorphicSwitch on={on} onChange={setOn} size="compact" />
    </CardShell>
  );
}

function StepperCardItem({ onExpand }: { onExpand: () => void }) {
  const [val, setVal] = useState(4);
  return (
    <CardShell def={DEFS[3]} onExpand={onExpand}>
      <CleanStepper value={val} onChange={setVal} size="compact" />
    </CardShell>
  );
}

function ReactionCardItem({ onExpand }: { onExpand: () => void }) {
  const [liked, setLiked] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  return (
    <CardShell def={DEFS[4]} onExpand={onExpand}>
      <CleanReactions
        liked={liked}
        notifCount={notifCount}
        onLike={() => {
          playSound('bubble');
          setLiked((l) => !l);
        }}
        onNotifHover={() => {
          playSound('bell');
          setNotifCount((c) => c + 1);
        }}
        onNotifClick={() => {
          playSound('bell');
          setNotifCount(0);
        }}
        size="compact"
      />
    </CardShell>
  );
}

function ModalPreviewItem({ id }: { id: string }) {
  const [dialVal, setDialVal] = useState(65);
  const [switchOn, setSwitchOn] = useState(false);
  const [counter, setCounter] = useState(4);
  const [liked, setLiked] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  if (id === 'button') return <NeoBrutalistButton />;
  if (id === 'dial') return <NeumorphicDial value={dialVal} onChange={setDialVal} size="default" />;
  if (id === 'switch') return <NeumorphicSwitch on={switchOn} onChange={setSwitchOn} />;
  if (id === 'stepper') return <CleanStepper value={counter} onChange={setCounter} />;
  if (id === 'reaction') {
    return (
      <CleanReactions
        liked={liked}
        notifCount={notifCount}
        onLike={() => {
          playSound('bubble');
          setLiked((l) => !l);
        }}
        onNotifHover={() => {
          playSound('bell');
          setNotifCount((c) => c + 1);
        }}
        onNotifClick={() => {
          playSound('bell');
          setNotifCount(0);
        }}
      />
    );
  }
  return null;
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function BrowsePage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const handleCopy = (code: string) => {
    playCopySound();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const activeDef = DEFS.find((d) => d.id === activeId);

  return (
    <div className="min-h-screen min-w-0 flex flex-col overflow-x-clip bg-[#000000] text-neutral-100 font-sans selection:bg-white selection:text-neutral-900">
      <HomeHeader />

      <main className="relative w-full flex-1 overflow-hidden bg-[#0a0a0a]">
        <div className="relative mx-auto w-full overflow-hidden max-w-[1440px] px-0 pt-10 pb-16 sm:pt-14 sm:pb-20">
          <EdgeDotBands />

          <div className="relative mx-auto w-full min-w-0 max-w-[960px] px-4 sm:px-6">
            <div className="flex items-center justify-between font-mono text-[11px] text-white/20 mb-10 pb-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3700] opacity-40" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff3700]" />
                </span>
                <span className="text-[#ff3700]/70 tracking-[0.2em] uppercase">Frontends</span>
              </div>
              <span className="tracking-[0.15em] text-white/15">{DEFS.length} COMPONENTS</span>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 items-stretch">
              <CardShell def={DEFS[0]} onExpand={() => setActiveId('button')}>
                <NeoBrutalistButton size="compact" />
              </CardShell>
              <DialCardItem onExpand={() => setActiveId('dial')} />
              <SwitchCardItem onExpand={() => setActiveId('switch')} />
              <StepperCardItem onExpand={() => setActiveId('stepper')} />
              <ReactionCardItem onExpand={() => setActiveId('reaction')} />
            </div>
          </div>
        </div>
      </main>

      {activeDef && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveId(null)}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[6px]" />

          <div
            className="relative w-full max-w-[380px] rounded-2xl bg-[#0d0d10] border border-white/[0.1] shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 bg-[#09090c] border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3700]" />
                <span className="font-mono text-[11px] tracking-[0.15em] text-[#ff3700]/80 font-medium">
                  {activeDef.idx}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="w-6 h-6 rounded-full bg-[#15151a] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/70 transition-colors cursor-pointer"
              >
                <X size={11} weight="bold" />
              </button>
            </div>

            <div className="p-8 flex items-center justify-center min-h-[160px]">
              <ModalPreviewItem id={activeDef.id} />
            </div>

            <div className="relative mx-4 mb-3.5 rounded-lg bg-[#060608] border border-white/[0.05] overflow-hidden">
              <pre className="font-mono text-[11px] text-white/60 px-4 py-3 overflow-x-auto whitespace-pre leading-relaxed">
                <span className="text-[#ff3700]/50">import</span>{' '}
                <span className="text-white/35">{'{ playSound }'}</span>{' '}
                <span className="text-[#ff3700]/50">from</span>{' '}
                <span className="text-white/30">&apos;sound-library&apos;</span>
                {'\n\n'}
                <span className="text-white/80">{activeDef.code}</span>
              </pre>
              <button
                type="button"
                onClick={() =>
                  handleCopy(`import { playSound } from 'sound-library';\n\n${activeDef.code}`)
                }
                className="absolute top-2 right-2 w-6 h-6 rounded-md bg-[#111116] hover:bg-[#1a1a22] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 transition-all cursor-pointer"
              >
                {copied ? (
                  <Check size={11} weight="bold" className="text-emerald-400" />
                ) : (
                  <Copy size={11} />
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 px-5 py-3 border-t border-white/[0.04]">
              <button
                type="button"
                onClick={() => playSound(activeDef.sound)}
                className="flex items-center gap-1.5 font-mono text-[11px] text-[#ff3700]/60 hover:text-[#ff3700] transition-colors cursor-pointer"
              >
                <SpeakerHigh size={12} weight="fill" />
                <span>{activeDef.soundLabel ?? activeDef.sound}</span>
              </button>
              {activeDef.soundAlt && (
                <>
                  <span className="text-white/[0.08]">·</span>
                  <button
                    type="button"
                    onClick={() => playSound(activeDef.soundAlt!)}
                    className="flex items-center gap-1.5 font-mono text-[11px] text-white/25 hover:text-[#ff3700]/80 transition-colors cursor-pointer"
                  >
                    <SpeakerHigh size={12} weight="fill" />
                    <span>{activeDef.soundAltLabel ?? activeDef.soundAlt}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <BigFooter />
    </div>
  );
}
