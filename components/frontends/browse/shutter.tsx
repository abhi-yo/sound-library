'use client';

import React, { useEffect, useRef, useState } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import type { DemoProps } from './shared';
import * as A from './anatomy/lens.art';
import { isoOf, play, shift } from './anatomy/runtime';
import './anatomy/anatomy.css';

/*
 * 07 Leaf shutter (anatomy): a Copal-style shutter on a lens board, front
 * cell removed so the six iris blades show. Press the release plunger: the
 * blades swing shut on their pins and reopen, one exposure.
 */

const C = A.CAM;
const g = A.GEO;
const OPEN = 13.5;
const BLADES = 6;

function facePoint(x: number, y: number, ds = 0) {
  const s = g.irisS + ds;
  return [
    g.o[0] + g.a[0] * s + g.u[0] * x + g.v[0] * y,
    g.o[1] + g.a[1] * s + g.u[1] * x + g.v[1] * y,
    g.o[2] + g.a[2] * s + g.u[2] * x + g.v[2] * y,
  ];
}

const fmt = (p: [number, number]) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

/** The iris at aperture radius ap: six pinwheel blades, plus the pivot pins. */
function irisPaths(ap: number) {
  const R = g.irisR;
  const rot = (1 - ap / OPEN) * 0.75 + 0.2;
  const th = Array.from({ length: BLADES }, (_, i) => rot + (i * 2 * Math.PI) / BLADES);
  const v = th.map((t) => [Math.cos(t) * ap, Math.sin(t) * ap]);
  // where the extension of edge (k-1) through v_k meets the barrel wall
  const ext = th.map((t, i) => {
    const d = [Math.cos(t + Math.PI / 3), Math.sin(t + Math.PI / 3)];
    const b = d[0] * v[i][0] + d[1] * v[i][1];
    const c = v[i][0] ** 2 + v[i][1] ** 2 - R * R;
    const s = -b + Math.sqrt(Math.max(0, b * b - c));
    return [v[i][0] + d[0] * s, v[i][1] + d[1] * s];
  });
  const blades: string[] = [];
  const pins: [number, number][] = [];
  for (let i = 0; i < BLADES; i++) {
    const j = (i + 1) % BLADES;
    const pts: number[][] = [v[i], v[j], ext[j]];
    let a1 = Math.atan2(ext[j][1], ext[j][0]);
    let a0 = Math.atan2(ext[i][1], ext[i][0]);
    while (a1 < a0) a1 += Math.PI * 2;
    while (a1 - a0 > Math.PI * 2) a1 -= Math.PI * 2;
    for (let s = 1; s < 8; s++) {
      const a = a1 - ((a1 - a0) * s) / 8;
      pts.push([Math.cos(a) * R, Math.sin(a) * R]);
    }
    pts.push(ext[i]);
    blades.push('M' + pts.map((p) => fmt(isoOf(C, facePoint(p[0], p[1], i * 0.02)))).join('L') + 'Z');
    const pin = [v[i][0] * 0.15 + ext[i][0] * 0.85, v[i][1] * 0.15 + ext[i][1] * 0.85];
    pins.push(isoOf(C, facePoint(pin[0], pin[1], 0.2)));
  }
  return { blades, pins };
}

export default function Shutter({ size = 'default' }: DemoProps) {
  const compact = size === 'compact';
  const [frame, setFrame] = useState(7);
  const bladeRefs = useRef<(SVGPathElement | null)[]>([]);
  const pinRefs = useRef<(SVGCircleElement | null)[]>([]);
  const plunger = useRef<SVGGElement>(null);
  const cancel = useRef<() => void>(() => {});
  const initial = useRef(irisPaths(OPEN)).current;

  useEffect(() => () => cancel.current(), []);

  const draw = (ap: number) => {
    const { blades, pins } = irisPaths(ap);
    blades.forEach((d, i) => bladeRefs.current[i]?.setAttribute('d', d));
    pins.forEach(([x, y], i) => {
      pinRefs.current[i]?.setAttribute('cx', x.toFixed(1));
      pinRefs.current[i]?.setAttribute('cy', y.toFixed(1));
    });
  };

  const fire = () => {
    playSound('shutter');
    setFrame((f) => (f % 36) + 1);
    cancel.current();
    const CLOSE = 80;
    const HOLD = 50;
    const OPENING = 230;
    cancel.current = play(CLOSE + HOLD + OPENING, (t) => {
      let ap: number;
      if (t < CLOSE) ap = OPEN * (1 - (t / CLOSE) ** 2);
      else if (t < CLOSE + HOLD) ap = 0;
      else ap = OPEN * (1 - Math.pow(1 - (t - CLOSE - HOLD) / OPENING, 3));
      draw(ap);
      const press = t < CLOSE + HOLD ? Math.min(1, t / 40) : Math.max(0, 1 - (t - CLOSE - HOLD) / 120);
      plunger.current?.setAttribute('transform', shift(C, [0, 0, -2.4 * press]));
    }, () => {
      draw(OPEN);
      plunger.current?.removeAttribute('transform');
    });
  };

  const w = compact ? 248 : 300;

  return (
    <div data-custom-sound className="anat flex select-none flex-col items-center gap-1.5" style={{ width: w }}>
      <button
        type="button"
        onClick={fire}
        aria-label={`Fire the shutter. Frame ${frame}`}
        className="block w-full cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#ff4a1a]/60"
      >
        <svg viewBox={`0 0 ${A.W} ${A.H}`} className="iso-svg" role="img" aria-label="A leaf shutter on a lens board, front cell removed so its six iris blades show; the release plunger sits on top.">
          <g dangerouslySetInnerHTML={{ __html: A.BACK }} />
          <g>
            {initial.blades.map((d, i) => (
              <path
                key={i}
                ref={(el) => {
                  bladeRefs.current[i] = el;
                }}
                className="iso-shade"
                data-shade={i % 2 ? 3 : 2}
                d={d}
                style={{ stroke: 'var(--anatomy-hi)', strokeWidth: 0.7, strokeLinejoin: 'round', vectorEffect: 'non-scaling-stroke' }}
              />
            ))}
            {initial.pins.map(([x, y], i) => (
              <circle
                key={i}
                ref={(el) => {
                  pinRefs.current[i] = el;
                }}
                cx={x}
                cy={y}
                r={0.9}
                fill="var(--anatomy-hi)"
              />
            ))}
          </g>
          <g dangerouslySetInnerHTML={{ __html: A.RELEASE }} />
          <g ref={plunger} dangerouslySetInnerHTML={{ __html: A.PLUNGER }} />
        </svg>
      </button>
      <div aria-live="polite" aria-label={`Frame ${frame}`} className="flex w-full items-center justify-center whitespace-nowrap font-mono text-[10px] tracking-[0.14em] tabular-nums text-white/40">
        FR {String(frame).padStart(2, '0')}
      </div>
    </div>
  );
}
