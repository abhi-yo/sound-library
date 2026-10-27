'use client';

import { useEffect } from 'react';
import { getLastSoundRequestAt, preloadSounds } from '@/lib/lazy-sounds';
import { applyStoredMute, uiSound } from '@/lib/ui-sound';
import type { SoundName } from '@/lib/sound-names';

const INTERACTIVE = [
  'a[href]',
  'button',
  'summary',
  '[role="button"]',
  '[role="tab"]',
  '[role="switch"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="radio"]',
  '[role="checkbox"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
].join(', ');

/** Elements that voice themselves (auditions, demos, copy buttons) or opt out. */
const SKIP = [
  '[data-no-sound]',
  '[data-no-global-sound]',
  '[data-sound-audition]',
  '[data-custom-sound]',
  '.sound-card',
  '[data-copy-button]',
  '[data-slot="code-block-copy"]',
  '[data-copy]',
  'button[aria-label*="copy" i]',
  'button[title*="copy" i]',
].join(', ');

function pickSound(el: HTMLElement): SoundName {
  const explicit = el.dataset.sound as SoundName | undefined;
  if (explicit) return explicit;

  const role = el.getAttribute('role');
  if (role === 'tab' || role === 'radio' || role === 'option' || role === 'menuitem') return 'tick';

  // State after the click has been handled (this runs in the bubble phase).
  const checked = el.getAttribute('aria-checked') ?? el.getAttribute('aria-pressed');
  if (role === 'switch' || role === 'checkbox' || checked !== null) {
    const on = checked === 'true' || (el as HTMLInputElement).checked === true;
    return on ? 'toggle-on' : 'toggle-off';
  }
  if (el instanceof HTMLInputElement) return el.checked ? 'toggle-on' : 'toggle-off';

  const expanded = el.getAttribute('aria-expanded');
  if (expanded !== null || el.hasAttribute('aria-haspopup') || el.tagName === 'SUMMARY') {
    const open = expanded === 'true' || (el.parentElement as HTMLDetailsElement | null)?.open === true;
    return open ? 'swish' : 'tick';
  }

  if (el.tagName === 'A') return 'tick';
  return 'tap';
}

/**
 * One delegated listener that gives every interactive element in the app a
 * quiet sound from our own library. It listens in the bubble phase, after
 * React handlers, and stays silent if a component already played a sound for
 * this click, so nothing ever double-plays. No hover, scroll or load sounds.
 */
export function UiSoundLayer() {
  useEffect(() => {
    applyStoredMute();
    let last = 0;
    // Start time of the current press (pointer or key). Any sound requested since
    // then — by a component on pointerdown, keydown or click — means this press
    // is already voiced, so the layer stays silent: one press, one sound.
    let pressStart = -Infinity;
    const markPress = (e: Event) => {
      pressStart = performance.now();
      // First genuine intent: fetch the engine chunk (no AudioContext until a sound plays).
      const t = e.target as HTMLElement | null;
      if (t?.closest?.(INTERACTIVE)) preloadSounds();
    };

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>(INTERACTIVE);
      if (!el || el.closest(SKIP)) return;
      if ((el as HTMLButtonElement).disabled || el.getAttribute('aria-disabled') === 'true') return;

      const now = performance.now();
      const voicedAt = getLastSoundRequestAt();
      if (voicedAt >= pressStart - 5 || now - voicedAt < 60) return; // component voiced it already
      if (now - last < 70) return; // rapid-click guard
      last = now;

      uiSound(pickSound(el));
    };

    document.addEventListener('pointerdown', markPress, true);
    document.addEventListener('keydown', markPress, true);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('pointerdown', markPress, true);
      document.removeEventListener('keydown', markPress, true);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
