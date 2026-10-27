'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import type { DemoProps } from './shared';
import * as A from './anatomy/coin.art';
import { isoOf, pathOf, play, shift } from './anatomy/runtime';
import './anatomy/anatomy.css';

/*
 * 06 Coin mech (anatomy): a vending coin acceptor on a bench plate with its
 * side cover off. Press: the quarter goes into the slot, drops inside the
 * housing, rolls out down the chute, trips the coin-switch lever that turns
 * the counter wheels, and lands on the stack in the cash box.
 */

const C = A.CAM;
const g = A.GEO;
const add = (a: readonly number[], b: readonly number[], k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const chute = (s: number, lift: number) => add(add(g.chO, g.chA, s), g.chV, lift);

const LEVER_REST = [
  g.pivot,
  [g.pivot[0] - 1.2, g.pivot[1], g.pivot[2] + 7],
  [g.chO[0] + 1.5, g.pivot[1], g.pivot[2] + 5],
];
const LEVER_TRIP = [
  g.pivot,
  [g.pivot[0] - 0.4, g.pivot[1], g.pivot[2] + 7.6],
  [g.chO[0] + 3, g.pivot[1], g.pivot[2] + 11],
];
const leverPath = (t: number) =>
  pathOf(
    C,
    LEVER_REST.map((p, i) => [0, 1, 2].map((j) => p[j] + (LEVER_TRIP[i][j] - p[j]) * t)),
  );

const SLOT_IN = 160;
const DROP = 220;
const ROLL = 560;
const FALL = 240;
const REARM = 260;
const TOTAL = SLOT_IN + DROP + ROLL + FALL + REARM;
// the quarter sits face-on, half into the top slot, then drops straight in
const REST_Z = g.slotTop + g.coinR * 0.45; // half-way into the slot, ready
const IN_Z = g.slotTop - g.coinR - 2;
const REST = shift(C, [g.slotX, g.slotY, REST_Z]);
const S0 = -7;
const S1 = g.chLen + 3;

export default function CoinSlot({ size = 'default' }: DemoProps) {
  const compact = size === 'compact';
  const uid = useId().replace(/:/g, '');
  const [credit, setCredit] = useState(0);
  const [stack, setStack] = useState(0);
  const slotCoin = useRef<SVGGElement>(null);
  const rollCoin = useRef<SVGGElement>(null);
  const fallCoin = useRef<SVGGElement>(null);
  const lever = useRef<SVGPathElement>(null);
  const mark = useRef<SVGPathElement>(null);
  const btnCap = useRef<SVGGElement>(null);
  const cancel = useRef<() => void>(() => {});
  const stackRef = useRef(0);
  stackRef.current = stack;

  useEffect(() => () => cancel.current(), []);

  const hideAll = () => {
    for (const el of [rollCoin.current, fallCoin.current]) el?.setAttribute('opacity', '0');
  };
  const rearm = (p = 1) => {
    // the next quarter slides back into the fingers, ready at the slot
    slotCoin.current?.setAttribute('opacity', String(p));
    slotCoin.current?.setAttribute('transform', shift(C, [g.slotX, g.slotY, REST_Z + 14 * (1 - p)]));
  };

  const land = () => {
    setStack((n) => Math.min(n + 1, g.stackMax));
    setCredit((c) => Math.min(c + 25, 975));
  };

  const insert = () => {
    playSound('coin');
    cancel.current();
    hideAll();
    let landed = false;
    let tripped = false;
    const startStack = Math.min(stackRef.current, g.stackMax - 1);
    cancel.current = play(
      TOTAL,
      (t) => {
        if (t < SLOT_IN) {
          const p = t / SLOT_IN;
          const z = REST_Z - (REST_Z - IN_Z) * (p * p);
          slotCoin.current?.setAttribute('opacity', '1');
          slotCoin.current?.setAttribute('transform', shift(C, [g.slotX, g.slotY, z]));
        } else if (t < TOTAL - REARM) slotCoin.current?.setAttribute('opacity', '0');
        else rearm(Math.min(1, (t - (TOTAL - REARM)) / REARM));

        if (t >= SLOT_IN + DROP && t < SLOT_IN + DROP + ROLL) {
          const p = (t - SLOT_IN - DROP) / ROLL;
          const s = S0 + (S1 - S0) * (0.25 * p + 0.75 * p * p);
          const c = chute(s, g.coinR);
          rollCoin.current?.setAttribute('opacity', '1');
          rollCoin.current?.setAttribute('transform', shift(C, c));
          // a rolling coin turns by s / r
          const a = s / g.coinR;
          const tip = [c[0] + 0.9, c[1] + Math.sin(a) * (g.coinR - 2), c[2] + Math.cos(a) * (g.coinR - 2)];
          const tail = [c[0] + 0.9, c[1] - Math.sin(a) * 2, c[2] - Math.cos(a) * 2];
          const [ox, oy] = isoOf(C, c);
          const [ax, ay] = isoOf(C, tail);
          const [bx, by] = isoOf(C, tip);
          mark.current?.setAttribute('d', `M${(ax - ox).toFixed(1)} ${(ay - oy).toFixed(1)}L${(bx - ox).toFixed(1)} ${(by - oy).toFixed(1)}`);
          const near = Math.abs(s - g.switchS);
          const lift = near < g.coinR ? Math.cos((near / g.coinR) * (Math.PI / 2)) : 0;
          lever.current?.setAttribute('d', leverPath(lift));
          if (lift > 0.6 && !tripped) tripped = true;
        } else {
          rollCoin.current?.setAttribute('opacity', '0');
          lever.current?.setAttribute('d', leverPath(0));
        }

        if (t >= SLOT_IN + DROP + ROLL && t < TOTAL - REARM + 1) {
          const p = Math.min(1, (t - SLOT_IN - DROP - ROLL) / FALL);
          const from = chute(S1, g.coinR);
          const top = 1.4 + startStack * 1.7 + 1.7;
          const to = [g.stack[0], g.stack[1], top + g.coinR * 0.2];
          const c = [from[0] + (to[0] - from[0]) * p, from[1] + (to[1] - from[1]) * p, from[2] + (to[2] - from[2]) * p * p];
          fallCoin.current?.setAttribute('opacity', p < 1 ? '1' : '0');
          fallCoin.current?.setAttribute('transform', shift(C, c));
          if (p >= 1 && !landed) {
            landed = true;
            land();
          }
        }
      },
      () => {
        hideAll();
        rearm(1);
        if (!landed) land();
      },
    );
  };

  const giveBack = () => {
    if (credit === 0) return;
    playSound('drop');
    cancel.current();
    hideAll();
    rearm(1);
    setCredit(0);
    setStack(0);
    const cap = btnCap.current;
    if (cap) {
      cap.setAttribute('transform', shift(C, [-1.8, 0, 0]));
      window.setTimeout(() => cap.removeAttribute('transform'), 140);
    }
  };

  const digits = String(credit).padStart(3, '0').split('');
  const dollars = `$${(credit / 100).toFixed(2)}`;
  const w = compact ? 248 : 300;

  return (
    <div data-custom-sound className="anat relative flex select-none flex-col items-center gap-1.5" style={{ width: w }}>
      <button
        type="button"
        onClick={insert}
        aria-label={`Insert a quarter. Credit ${dollars}`}
        className="block w-full cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#ff4a1a]/60"
      >
        <svg viewBox={`0 0 ${A.W} ${A.H}`} className="iso-svg" role="img" aria-label="A vending coin mechanism seen from the front: a coin slot on top, a counter and return button on the front plate, a chute out of the housing past a coin switch, and a cash box.">
          <defs>
            <clipPath id={`${uid}-slot`}>
              <rect x={0} y={0} width={A.W} height={g.slotClipY} />
            </clipPath>
            <clipPath id={`${uid}-port`}>
              <rect x={0} y={0} width={g.portClipX} height={A.H} />
            </clipPath>
          </defs>
          <g dangerouslySetInnerHTML={{ __html: A.BACK }} />
          {g.digitMatrices.map((m, i) => (
            <text key={i} className="anat-digit" transform={m} fontSize={g.digitSize} textAnchor="middle">
              {digits[i]}
            </text>
          ))}
          <g ref={btnCap} style={{ transition: 'transform 120ms ease-out' }} dangerouslySetInnerHTML={{ __html: A.RETURN_BTN }} />
          <g clipPath={`url(#${uid}-slot)`}>
            <g ref={slotCoin} transform={REST} dangerouslySetInnerHTML={{ __html: A.COIN_SLOT }} />
          </g>
          <g dangerouslySetInnerHTML={{ __html: A.CHUTE_BACK }} />
          <g clipPath={`url(#${uid}-port)`}>
            <g ref={rollCoin} opacity={0}>
              <g dangerouslySetInnerHTML={{ __html: A.COIN_ROLL }} />
              <path ref={mark} className="iso-line" data-tone="hi" d="" />
            </g>
          </g>
          <g dangerouslySetInnerHTML={{ __html: A.CHUTE_FRONT + A.SWITCH }} />
          <path ref={lever} className="iso-line" data-tone="hi" d={leverPath(0)} style={{ strokeWidth: 1.4 }} />
          <g dangerouslySetInnerHTML={{ __html: A.WIRE + A.BOX_BACK }} />
          {A.STACK.slice(0, stack).map((s, i) => (
            <g key={i} dangerouslySetInnerHTML={{ __html: s }} />
          ))}
          <g ref={fallCoin} opacity={0} dangerouslySetInnerHTML={{ __html: A.COIN_ROLL }} />
          <g dangerouslySetInnerHTML={{ __html: A.BOX_FRONT }} />
        </svg>
      </button>
      <button
        type="button"
        onClick={giveBack}
        aria-label="Return coins"
        disabled={credit === 0}
        className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#ff4a1a]/60 disabled:cursor-default"
        style={{ left: g.btn[0] * w, top: (g.btn[1] * w * A.H) / A.W }}
      />
      <div aria-live="polite" aria-label={`Credit ${dollars}, ${stack} in the cash box`} className="flex w-full items-center justify-center whitespace-nowrap font-mono text-[10px] tracking-[0.14em] tabular-nums text-[#ff4a1a]">
        {dollars}
      </div>
    </div>
  );
}
