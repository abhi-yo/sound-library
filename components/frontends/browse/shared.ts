export type DemoSize = 'compact' | 'default';

export interface DemoProps {
  size?: DemoSize;
}

export const ACCENT = '#ff3700';
export const ACCENT_DEEP = '#cc2d00';

/** True when the user asked for reduced motion; one-shot animations are skipped then. */
export function reducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Run a one-shot Web Animation (never loops), skipped under reduced motion. */
export function animateOnce(
  el: Element | null | undefined,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
) {
  if (!el || reducedMotion() || typeof (el as HTMLElement).animate !== 'function') return null;
  return (el as HTMLElement).animate(keyframes, { fill: 'none', ...options });
}
