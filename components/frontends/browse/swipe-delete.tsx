'use client';

import React, { useRef, useState } from 'react';
import { Trash, Waveform } from '@phosphor-icons/react';
import { playSound } from '@/lib/lazy-sounds';
import type { DemoProps } from './shared';

const FILES = [
  { id: 'kick', name: 'kick-final.wav', meta: '1.2 MB · 0:02' },
  { id: 'snare', name: 'snare-v2.wav', meta: '840 KB · 0:01' },
];
const THRESHOLD = 72;

function Row({
  file,
  deleted,
  onDelete,
}: {
  file: (typeof FILES)[number];
  deleted: boolean;
  onDelete: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x0: number; dx: number; id: number } | null>(null);

  const setX = (dx: number, animate: boolean) => {
    const el = rowRef.current;
    if (!el) return;
    el.style.transition = animate ? 'transform 260ms cubic-bezier(0.32, 0.72, 0, 1)' : 'none';
    el.style.transform = `translateX(${dx}px)`;
    if (zoneRef.current) zoneRef.current.style.opacity = String(Math.min(1, Math.abs(dx) / THRESHOLD));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (deleted || (e.target as HTMLElement).closest('button')) return;
    drag.current = { x0: e.clientX, dx: 0, id: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const raw = Math.min(0, e.clientX - d.x0);
    d.dx = raw < -THRESHOLD ? -THRESHOLD + (raw + THRESHOLD) * 0.35 : raw;
    setX(d.dx, false);
  };
  const onPointerEnd = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.dx <= -THRESHOLD) onDelete();
    setX(0, true);
  };

  return (
    <div
      className="grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out"
      style={{ gridTemplateRows: deleted ? '0fr' : '1fr', opacity: deleted ? 0 : 1, marginTop: deleted ? -6 : 0 }}
      aria-hidden={deleted}
    >
      <div className="overflow-hidden">
        <div className="relative overflow-hidden rounded-xl">
          <div
            ref={zoneRef}
            className="absolute inset-0 flex items-center justify-end rounded-xl bg-[#ff3700] pr-4 text-black"
            style={{ opacity: 0 }}
          >
            <Trash size={16} weight="bold" />
          </div>
          <div
            ref={rowRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            className="relative flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#141417] py-2 pl-2.5 pr-1.5 cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'pan-y' }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ff3700]/10 text-[#ff3700]">
              <Waveform size={16} weight="bold" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-tight text-[13px] text-white/85">{file.name}</span>
              <span className="block font-mono text-[10px] tracking-wide text-white/30">{file.meta}</span>
            </span>
            <button
              type="button"
              tabIndex={deleted ? -1 : 0}
              onClick={onDelete}
              aria-label={`Delete ${file.name}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-[#ff3700]/10 hover:text-[#ff3700] active:scale-90 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#ff3700]/60"
            >
              <Trash size={15} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SwipeDelete({ size = 'default' }: DemoProps) {
  const compact = size === 'compact';
  const [deleted, setDeleted] = useState<string[]>([]);

  const remove = (id: string) => {
    if (deleted.includes(id)) return;
    playSound('delete');
    setDeleted((d) => [...d, id]);
  };

  const undo = () => {
    if (!deleted.length) return;
    playSound('drop');
    setDeleted((d) => d.slice(0, -1));
  };

  return (
    <div data-custom-sound className="flex flex-col gap-1.5 select-none" style={{ width: compact ? 204 : 280 }}>
      {FILES.map((f) => (
        <Row key={f.id} file={f} deleted={deleted.includes(f.id)} onDelete={() => remove(f.id)} />
      ))}
      <div className="mt-1 flex h-7 items-center justify-between font-mono text-[10px] tracking-[0.14em]">
        <span className="text-white/30">{deleted.length ? `${deleted.length} DELETED` : '← SWIPE OR TAP'}</span>
        {deleted.length > 0 && (
          <button
            type="button"
            onClick={undo}
            className="rounded-full border border-[#ff3700]/35 bg-[#ff3700]/10 px-2.5 py-1 text-[#ff8a66] transition-colors hover:bg-[#ff3700]/20 hover:text-white cursor-pointer"
          >
            UNDO
          </button>
        )}
      </div>
    </div>
  );
}
