'use client';

/**
 * App-level micro UX sounds for sound bits' own interface.
 *
 * - Plays the library's own procedural sounds, but quietly (UI_VOLUME) so the
 *   site's chrome stays subtle while demos/auditions keep full volume.
 * - The AudioContext is created lazily by the engine on the first sound, which
 *   only ever happens inside a user gesture (click / key) — never on load,
 *   scroll or hover.
 * - One global mute, persisted in localStorage. Muting silences everything
 *   (demos included). With no saved choice we keep the engine's default, which
 *   is silent for users who prefer reduced motion.
 */

import { playSound, setSoundEnabled } from '@/lib/lazy-sounds';
import type { SoundName } from '@/lib/sound-names';

export const UI_VOLUME = 0.3;
const STORAGE_KEY = 'sound-bits:muted';
const EVENT = 'sound-bits:mute-change';

function readStored(): boolean | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === null ? null : v === '1';
  } catch {
    return null;
  }
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Effective mute state: saved choice, else reduced-motion users start muted. */
export function isUiMuted(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = readStored();
  return stored ?? prefersReducedMotion();
}

export function setUiMuted(muted: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  } catch {
    /* private mode — keep it in memory only */
  }
  setSoundEnabled(!muted);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: muted }));
}

export function onUiMuteChange(cb: (muted: boolean) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<boolean>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

/** Apply a saved choice to the engine once on startup (no sound is played). */
export function applyStoredMute() {
  const stored = readStored();
  if (stored !== null) setSoundEnabled(!stored);
}

/** Play one of our sounds quietly for interface feedback. */
export function uiSound(name: SoundName, volume = UI_VOLUME) {
  if (isUiMuted()) return;
  playSound(name, { volume });
}
