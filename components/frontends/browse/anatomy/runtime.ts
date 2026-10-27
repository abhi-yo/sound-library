/** Tiny runtime for the anatomy figures: the kit's isometric camera, nothing else. */

export interface Cam {
  ox: number;
  oy: number;
  sinA: number;
  cosA: number;
  sinE: number;
  cosE: number;
  k: number;
}

export type V3 = readonly [number, number, number] | number[];

export function isoOf(c: Cam, p: V3): [number, number] {
  const [x, y, z] = p as number[];
  return [c.ox + (x * c.sinA - y * c.cosA) * c.k, c.oy + ((x * c.cosA + y * c.sinA) * c.sinE - z * c.cosE) * c.k];
}

/** Screen offset of a world displacement, as an SVG transform. */
export function shift(c: Cam, d: V3) {
  const [dx, dy, dz] = d as number[];
  const sx = (dx * c.sinA - dy * c.cosA) * c.k;
  const sy = ((dx * c.cosA + dy * c.sinA) * c.sinE - dz * c.cosE) * c.k;
  return `translate(${sx.toFixed(2)} ${sy.toFixed(2)})`;
}

export function pathOf(c: Cam, pts: V3[], closed = false) {
  let d = '';
  pts.forEach((p, i) => {
    const [x, y] = isoOf(c, p);
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return closed ? d + 'Z' : d;
}

export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeIn = (t: number) => clamp01(t) ** 2;
export const easeInOut = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
/** Damped spring overshoot from 0 to 1. */
export const springOut = (t: number) => {
  const x = clamp01(t);
  return 1 - Math.exp(-6 * x) * Math.cos(9 * x);
};

export function stillPreferred() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** One-shot rAF timeline; returns a cancel function. Never loops past `duration`. */
export function play(duration: number, frame: (ms: number) => void, done?: () => void) {
  if (stillPreferred()) {
    frame(duration);
    done?.();
    return () => {};
  }
  let id = 0;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(duration, now - start);
    frame(t);
    if (t < duration) id = requestAnimationFrame(step);
    else done?.();
  };
  id = requestAnimationFrame(step);
  return () => cancelAnimationFrame(id);
}
