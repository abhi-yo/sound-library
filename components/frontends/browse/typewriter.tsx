'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import type { DemoProps } from './shared';
import * as A from './anatomy/typewriter.art';
import { isoOf, play, shift } from './anatomy/runtime';
import './anatomy/anatomy.css';

/*
 * 08 Typewriter (anatomy): an open-frame typewriter. A key press swings its
 * typebar up out of the segment to strike the platen through the ribbon, and
 * the carriage steps one column left. The twelfth column (the right margin)
 * rings the bell, then the carriage returns and feeds a line.
 */

const C = A.CAM;
const g = A.GEO;
const COLS = g.cols;
/** Paper x of column j: the line runs margin to margin across the whole sheet. */
const colX = (j: number) => g.col0 + j * g.pitch;
const RETURN_DELAY = 260;
const L = Math.hypot(g.rp, g.pp[2] - g.c[2]);
const THETA_REST = Math.asin((21.5 - g.c[2]) / L);
const THETA_HIT = Math.atan2(g.pp[2] - g.c[2], -g.rp);

function bar(i: number, theta: number) {
  const a = g.phi[i];
  const out = [Math.sin(a), Math.cos(a)];
  const pivot = [g.c[0] + out[0] * g.rp, g.c[1] + out[1] * g.rp, g.c[2]];
  const dir = [out[0] * Math.cos(theta), out[1] * Math.cos(theta), Math.sin(theta)];
  const tip = [pivot[0] + dir[0] * L, pivot[1] + dir[1] * L, pivot[2] + dir[2] * L];
  const slug = [pivot[0] + dir[0] * (L - 3.2), pivot[1] + dir[1] * (L - 3.2), pivot[2] + dir[2] * (L - 3.2)];
  const heel = [pivot[0] - dir[0] * 2.5, pivot[1] - dir[1] * 2.5, pivot[2] - dir[2] * 2.5];
  const [hx, hy] = isoOf(C, heel);
  const [sx, sy] = isoOf(C, slug);
  const [tx, ty] = isoOf(C, tip);
  const [px, py] = isoOf(C, pivot);
  return { body: `M${hx.toFixed(1)} ${hy.toFixed(1)}L${tx.toFixed(1)} ${ty.toFixed(1)}`, slug: `M${sx.toFixed(1)} ${sy.toFixed(1)}L${tx.toFixed(1)} ${ty.toFixed(1)}`, pivot: [px, py] as const };
}

const REST_BARS = g.phi.map((_, i) => bar(i, THETA_REST));
// paint bars back to front: the outer ones sit further back on screen
const ORDER = [0, 4, 1, 3, 2];

export default function Typewriter({ size = 'default' }: DemoProps) {
  const compact = size === 'compact';
  const uid = useId().replace(/:/g, '');
  const [lines, setLines] = useState<[string, string, string]>(['', '', '']);
  const [col, setCol] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const bodyRefs = useRef<(SVGPathElement | null)[]>([]);
  const shadowRefs = useRef<(SVGPathElement | null)[]>([]);
  const slugRefs = useRef<(SVGPathElement | null)[]>([]);
  const keyRefs = useRef<(SVGGElement | null)[]>([]);
  const cancel = useRef<() => void>(() => {});
  const returnTimer = useRef<number | undefined>(undefined);
  const state = useRef({ lines, col });
  state.current = { lines, col };

  useEffect(
    () => () => {
      cancel.current();
      window.clearTimeout(returnTimer.current);
    },
    [],
  );

  // carriage return + line feed: the finished line moves up, the carriage slides home
  const carriageReturn = () => {
    setLines((ls) => [ls[1], ls[2], '']);
    setCol(0);
  };

  const setBar = (i: number, theta: number) => {
    const b = bar(i, theta);
    bodyRefs.current[i]?.setAttribute('d', b.body);
    shadowRefs.current[i]?.setAttribute('d', b.body);
    slugRefs.current[i]?.setAttribute('d', b.slug);
  };

  const strike = (ch: string, keyIndex: number) => {
    let { lines: ls, col: c } = state.current;
    window.clearTimeout(returnTimer.current);
    if (c >= COLS) {
      // pressed before the automatic return finished: return now, then type
      ls = [ls[1], ls[2], ''];
      c = 0;
    }
    const lineEnd = c + 1 === COLS;
    // one sound per press: the last column rings the bell instead of the key
    playSound(lineEnd ? 'typewriter-bell' : 'typewriter-key');
    const next: [string, string, string] = [ls[0], ls[1], ls[2] + ch];
    const nextCol = c + 1;
    if (lineEnd) returnTimer.current = window.setTimeout(carriageReturn, RETURN_DELAY);
    cancel.current();
    ORDER.forEach((i) => setBar(i, THETA_REST));
    setActive(keyIndex);
    const UP = 70;
    const DOWN = 150;
    let printed = false;
    cancel.current = play(
      UP + DOWN,
      (t) => {
        const p = t < UP ? (t / UP) ** 2 : 1 - (t - UP) / DOWN;
        setBar(keyIndex, THETA_REST + (THETA_HIT - THETA_REST) * Math.max(0, Math.min(1, p)));
        keyRefs.current[keyIndex]?.setAttribute('transform', shift(C, [0, 0, -2.6 * Math.min(1, t < UP ? t / 30 : 1 - (t - UP) / DOWN)]));
        if (t >= UP && !printed) {
          printed = true;
          setLines(next);
          setCol(nextCol);
        }
      },
      () => {
        setBar(keyIndex, THETA_REST);
        keyRefs.current[keyIndex]?.removeAttribute('transform');
        setActive(null);
        if (!printed) {
          setLines(next);
          setCol(nextCol);
        }
      },
    );
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    if (e.key.length !== 1) return;
    const ch = e.key.toUpperCase();
    if (!/[A-Z0-9]/.test(ch)) return;
    e.preventDefault();
    const idx = g.keys.indexOf(ch as (typeof g.keys)[number]);
    strike(ch, idx >= 0 ? idx : ch.charCodeAt(0) % g.keys.length);
  };

  // strike point is fixed at x = 0: the carriage carries the next column there
  const carriage = shift(C, [-colX(col), 0, 0]).match(/translate\(([-\d.]+) ([-\d.]+)\)/)!;
  const w = compact ? 248 : 300;

  return (
    <div
      data-custom-sound
      tabIndex={0}
      role="group"
      aria-label="Typewriter. Press the keys, or type letters on your keyboard."
      onKeyDown={onKeyDown}
      className="anat flex select-none flex-col items-center gap-1.5 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#ff4a1a]/50"
      style={{ width: w }}
    >
      <svg viewBox={`0 0 ${A.W} ${A.H}`} className="iso-svg" role="img" aria-label="An open-frame typewriter: carriage with platen and paper on a rail, ribbon spools, a segment of five typebars on a felt rest, five keys and a margin bell.">
        <defs>
          <clipPath id={`${uid}-paper`}>
            <path d={g.paperClip} />
          </clipPath>
        </defs>
        <g dangerouslySetInnerHTML={{ __html: A.BACK }} />
        <g style={{ transform: `translate(${carriage[1]}px, ${carriage[2]}px)`, transition: 'transform 140ms cubic-bezier(0.32,0.72,0,1)' }}>
          <g dangerouslySetInnerHTML={{ __html: A.CARRIAGE }} />
          <g clipPath={`url(#${uid}-paper)`}>
            {lines.map((line, j) =>
              line ? (
                <text
                  key={j}
                  transform={g.lineMatrices[2 - j]}
                  x={Array.from(line, (_, i) => colX(i).toFixed(2)).join(' ')}
                  fontSize={g.textSize}
                  fontWeight={700}
                  textAnchor="middle"
                  className="anat-typed"
                  style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace', fill: '#141210', opacity: j === 2 ? 1 : 0.55 }}
                >
                  {line}
                </text>
              ) : null,
            )}
          </g>
        </g>
        <g dangerouslySetInnerHTML={{ __html: A.MIDDLE }} />
        {ORDER.map((i) => (
          <g key={i}>
            <path ref={(el) => { shadowRefs.current[i] = el; }} d={REST_BARS[i].body} stroke="#0b0b0d" strokeWidth={3} strokeLinecap="round" fill="none" />
            <path
              ref={(el) => { bodyRefs.current[i] = el; }}
              d={REST_BARS[i].body}
              stroke={active === i ? 'var(--anatomy-hi)' : 'var(--anatomy-mid)'}
              strokeWidth={1.5}
              strokeLinecap="round"
              fill="none"
            />
            <path ref={(el) => { slugRefs.current[i] = el; }} d={REST_BARS[i].slug} stroke={active === i ? '#ffffff' : 'var(--anatomy-hi)'} strokeWidth={2.4} strokeLinecap="round" fill="none" />
            <circle cx={REST_BARS[i].pivot[0]} cy={REST_BARS[i].pivot[1]} r={0.9} fill="var(--anatomy-hi)" />
          </g>
        ))}
        <g dangerouslySetInnerHTML={{ __html: A.KEYBOARD }} />
        {A.KEYS.map((art, i) => (
          <g
            key={i}
            ref={(el) => { keyRefs.current[i] = el; }}
            role="button"
            tabIndex={0}
            aria-label={`Key ${g.keys[i]}`}
            className="cursor-pointer outline-none"
            onClick={() => strike(g.keys[i], i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                strike(g.keys[i], i);
              }
            }}
            dangerouslySetInnerHTML={{ __html: art }}
          />
        ))}
        <g dangerouslySetInnerHTML={{ __html: A.BELL }} />
      </svg>
      <span className="sr-only" aria-live="polite">
        {`Column ${Math.min(col, COLS)} of ${COLS}${lines[2] ? `, typed ${lines[2]}` : ''}`}
      </span>
    </div>
  );
}
