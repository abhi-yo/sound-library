'use client';

import { useEffect } from 'react';
import { playCopySound } from '@/lib/lazy-sounds';

const COPY_SELECTOR = [
  '[data-copy-button]',
  '[data-slot="code-block-copy"]',
  'button[aria-label*="copy" i]',
  'button[title*="copy" i]',
  'button[aria-label*="copied" i]',
  '[data-copy]',
].join(', ');

/**
 * Global delegated click listener for any copy button in the application.
 * Uses playCopySound() which has strict single-sound deduplication (ignoring duplicate
 * triggers within 120ms), guaranteeing that no two sounds ever play on a single button click.
 */
export function CopyClickSound() {
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const copyBtn = target.closest<HTMLElement>(COPY_SELECTOR);
      if (!copyBtn) return;

      // Play the mechanical unlock sound with strict single-sound deduplication
      playCopySound();
    };

    // Capture phase listener ensures we intercept copy actions cleanly across all components
    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, []);

  return null;
}
