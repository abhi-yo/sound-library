'use client';

import { useEffect, useState } from 'react';
import { isUiMuted, onUiMuteChange, setUiMuted, uiSound } from '@/lib/ui-sound';

/** Small speaker / mute button for the header. Plays a soft toggle-on when unmuting. */
export function SoundToggle({ className = '' }: { className?: string }) {
  const [muted, setMuted] = useState<boolean | null>(null);

  useEffect(() => {
    setMuted(isUiMuted());
    return onUiMuteChange(setMuted);
  }, []);

  const toggle = () => {
    const next = !(muted ?? false);
    setUiMuted(next);
    setMuted(next);
    if (!next) uiSound('toggle-on', 0.35);
  };

  const label = muted ? 'Turn interface sounds on' : 'Mute interface sounds';

  return (
    <button
      type="button"
      data-no-sound
      onClick={toggle}
      aria-label={label}
      aria-pressed={muted === false}
      title={label}
      className={`inline-flex h-8.5 w-8.5 items-center justify-center rounded-[8px] border border-[#262626] bg-[#121212] text-white/70 transition-colors hover:border-[#383838] hover:bg-[#1c1c1c] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff3700]/60 ${className}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        {muted ? (
          <>
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </>
        ) : (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" stroke="#ff3700" />
          </>
        )}
      </svg>
    </button>
  );
}
