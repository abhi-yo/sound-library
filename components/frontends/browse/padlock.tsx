'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import type { DemoProps } from './shared';
import * as A from './anatomy/padlock.art';
import { easeIn, easeOut, pathOf, play, shift, springOut } from './anatomy/runtime';
import './anatomy/anatomy.css';

/*
 * 09 Padlock, cutaway (anatomy): a laminated padlock with a window milled
 * down to the plug axis, showing the pin-tumbler cylinder. Unlock: the key
 * slides in, each key pin rises until its top meets the shear line, and the
 * shackle springs up. Lock: the shackle drops, the key comes out, pins fall.
 */

const C = A.CAM;
const g = A.GEO;
const FRAMES = A.SHACKLE.length;

/** Pin stack i at lift t (0 = resting on the plug floor, 1 = top on the shear line). */
function pinPaths(i: number, t: number) {
  const y = g.pinsY[i];
  const hw = g.boreW / 2;
  const rest = g.keywayFloor;
  const bottom = rest + (g.keyTop[i] - rest) * t;
  const top = bottom + g.pinLen[i];
  const dTop = top + g.driver;
  const p = (yy: number, z: number) => [g.secX, yy, z];
  const keyPin = pathOf(C, [p(y, bottom), p(y + hw, bottom + 1.6), p(y + hw, top), p(y - hw, top), p(y - hw, bottom + 1.6)], true);
  const driver = pathOf(C, [p(y - hw, top + 0.15), p(y + hw, top + 0.15), p(y + hw, dTop), p(y - hw, dTop)], true);
  const coils = 6;
  const pts = [p(y, dTop)];
  for (let c = 0; c <= coils * 2; c++) {
    const z = dTop + ((g.boreTop - dTop) * (c + 0.5)) / (coils * 2 + 1);
    pts.push(p(y + (c % 2 ? hw : -hw) * 0.85, z));
  }
  pts.push(p(y, g.boreTop));
  return { keyPin, driver, spring: pathOf(C, pts) };
}

const liftAt = (i: number, out: number) => Math.max(0, Math.min(1, 1 - out / (g.pinsY[i] + 22 + 4)));
const REST_PINS = g.pinsY.map((_, i) => pinPaths(i, 0));

export default function Padlock({ size = 'default' }: DemoProps) {
  const compact = size === 'compact';
  const uid = useId().replace(/:/g, '');
  const [open, setOpen] = useState(false);
  const keyRef = useRef<SVGGElement>(null);
  const shackleRefs = useRef<(SVGGElement | null)[]>([]);
  const pinRefs = useRef<(SVGPathElement | null)[][]>(g.pinsY.map(() => []));
  const cancel = useRef<() => void>(() => {});
  const pose = useRef<{ out: number; rise: number }>({ out: g.keyOut, rise: 0 });

  useEffect(() => () => cancel.current(), []);

  const draw = (out: number, rise: number) => {
    pose.current = { out, rise };
    keyRef.current?.setAttribute('transform', shift(C, [0, out, 0]));
    g.pinsY.forEach((_, i) => {
      const { keyPin, driver, spring } = pinPaths(i, liftAt(i, out));
      const [a, b, c] = pinRefs.current[i];
      a?.setAttribute('d', keyPin);
      b?.setAttribute('d', driver);
      c?.setAttribute('d', spring);
    });
    const f = Math.max(0, Math.min(FRAMES - 1, Math.round(rise * (FRAMES - 1))));
    shackleRefs.current.forEach((el, i) => el?.setAttribute('visibility', i === f ? 'visible' : 'hidden'));
  };

  const toggle = () => {
    const next = !open;
    playSound(next ? 'unlock' : 'lock');
    setOpen(next);
    cancel.current();
    const from = { ...pose.current };
    if (next) {
      const KEY = 320;
      const POP = 460;
      cancel.current = play(KEY + POP, (t) => {
        const out = from.out * (1 - easeOut(t / KEY));
        const rise = t < KEY ? from.rise : from.rise + (1 - from.rise) * springOut((t - KEY) / POP);
        draw(out, rise);
      });
    } else {
      const DROP = 170;
      const KEY = 300;
      cancel.current = play(DROP + KEY, (t) => {
        const rise = from.rise * (1 - easeIn(t / DROP));
        const out = t < DROP ? from.out : from.out + (g.keyOut - from.out) * easeIn((t - DROP) / KEY);
        draw(out, rise);
      });
    }
  };

  const atShear = open ? 5 : 0;
  const w = compact ? 248 : 300;

  return (
    <div data-custom-sound className="anat flex select-none flex-col items-center gap-1.5" style={{ width: w }}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={open}
        aria-label={open ? 'Padlock open. Press to lock' : 'Padlock locked. Press to unlock'}
        className="block w-full cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#ff4a1a]/60"
      >
        <svg viewBox={`0 0 ${A.W} ${A.H}`} className="iso-svg" role="img" aria-label="A laminated padlock with a window cut into its face showing the pin-tumbler cylinder: five pin stacks with springs over the plug, the shear line, the key and the shackle.">
          <defs>
            <clipPath id={`${uid}-key`}>
              <path d={g.winClip} />
              <rect x={0} y={0} width={g.faceClipX} height={A.H} />
            </clipPath>
          </defs>
          <g dangerouslySetInnerHTML={{ __html: A.BACK }} />
          {REST_PINS.map((p, i) => (
            <g key={i}>
              <path ref={(el) => { pinRefs.current[i][2] = el; }} className="anat-spring" d={p.spring} />
              <path ref={(el) => { pinRefs.current[i][1] = el; }} className="anat-driver" d={p.driver} />
              <path ref={(el) => { pinRefs.current[i][0] = el; }} className="anat-keypin" d={p.keyPin} />
            </g>
          ))}
          <g clipPath={`url(#${uid}-key)`}>
            <g ref={keyRef} transform={shift(C, [0, g.keyOut, 0])} dangerouslySetInnerHTML={{ __html: A.KEY }} />
          </g>
          {A.SHACKLE.map((s, i) => (
            <g key={i} ref={(el) => { shackleRefs.current[i] = el; }} visibility={i === 0 ? 'visible' : 'hidden'} dangerouslySetInnerHTML={{ __html: s }} />
          ))}
        </svg>
      </button>
      <div aria-live="polite" aria-label={`${open ? 'Open' : 'Locked'}, ${atShear} of 5 pins at the shear line`} className={`flex w-full items-center justify-center whitespace-nowrap font-mono text-[10px] tracking-[0.14em] tabular-nums ${open ? 'text-[#ff4a1a]' : 'text-white/40'}`}>
        {open ? 'OPEN' : 'LOCKED'}
      </div>
    </div>
  );
}
