'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { playSound } from '@/lib/lazy-sounds';

const INTERACTIVE_SELECTORS = 'button:not([data-no-sound]), [role="button"]:not([data-no-sound])';
const CUSTOM_SOUND_SELECTORS = '[data-sound-audition], [data-custom-sound], [data-no-sound], [data-no-global-sound], [data-copy-button], [data-slot="code-block-copy"], [data-copy], .sound-card, [title*="audition"], [title*="play"], [title*="copy" i], [aria-label*="copy" i], [aria-label*="copied" i], [title*="test"]';

export function GlobalClickSound() {
  const pathname = usePathname();
  const lastClickTime = useRef(0);

  useEffect(() => {
    // Landing page handles its own button sounds explicitly — do not double-trigger
    if (pathname === '/') return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Skip elements that manage their own sounds
      if (target.closest(CUSTOM_SOUND_SELECTORS)) {
        return;
      }

      const now = Date.now();
      if (now - lastClickTime.current < 60) return;
      lastClickTime.current = now;

      // Subtle feedback for switches and checkboxes
      const isSwitch = target.closest('[role="switch"], input[type="checkbox"]');
      if (isSwitch) {
        playSound('toggle-on');
        return;
      }

      // Subtle feedback only on explicit button elements
      const isButton = target.closest(INTERACTIVE_SELECTORS);
      if (isButton) {
        playSound('tap');
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, []);

  return null;
}


