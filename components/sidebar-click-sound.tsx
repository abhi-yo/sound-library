'use client';

import { useEffect, useRef } from 'react';
import { uiSound } from '@/lib/ui-sound';

/**
 * Attaches a crisp, tactile click sound to all sidebar links and buttons in the documentation.
 * Guarantees exactly one sound per user click with deduplication and debouncing.
 */
export function SidebarClickSound() {
  const lastClickTimeRef = useRef(0);
  const lastTargetRef = useRef<Element | null>(null);

  useEffect(() => {
    const handleSidebarClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Do not play sidebar click sound on copy buttons
      if (
        target.closest(
          '[data-copy-button], [data-slot="code-block-copy"], [title*="copy" i], [aria-label*="copy" i], [data-copy]'
        )
      ) {
        return;
      }

      // Match sidebar links and buttons on both desktop and mobile layouts
      const sidebarItem = target.closest<HTMLElement>(
        '#nd-sidebar a, #nd-sidebar button, #nd-sidebar-mobile a, #nd-sidebar-mobile button'
      );

      if (!sidebarItem) return;

      const now = Date.now();

      // Ensure only ONE sound per button click (prevent duplicate triggers from bubbling or rapid multi-events)
      if (
        now - lastClickTimeRef.current < 120 &&
        lastTargetRef.current === sidebarItem
      ) {
        return;
      }

      // General debounce to prevent accidental double-audio triggers
      if (now - lastClickTimeRef.current < 50) {
        return;
      }

      lastClickTimeRef.current = now;
      lastTargetRef.current = sidebarItem;

      // Play the tactile button click sound
      uiSound('tick');
    };

    // Capture phase listener ensures we intercept the primary click cleanly
    document.addEventListener('click', handleSidebarClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleSidebarClick, { capture: true });
    };
  }, []);

  return null;
}
