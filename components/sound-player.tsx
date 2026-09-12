'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { SoundName } from '@/lib/sound-names';
import { playSound } from '@/lib/lazy-sounds';
import { SOUNDS_METADATA, generateSoundLLMPrompt, type SoundMeta } from '@/lib/sounds-metadata';
export { SOUNDS_METADATA, generateSoundLLMPrompt, type SoundMeta };

export function SoundPlayer({ name }: { name: SoundName }) {
  const meta = SOUNDS_METADATA[name];
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    playSound(name);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsPlaying(false);
    }, 350);
  }, [name]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!meta) return null;

  return (
    <div className="not-prose my-3 flex items-center justify-between gap-3 rounded-xl border border-fd-border/70 bg-fd-card/50 px-3.5 py-2.5 transition-colors hover:border-fd-border">
      {/* Left: Play button + Info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Audition ${meta.title}`}
          className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-150 active:scale-95 focus-visible:outline-none ${
            isPlaying
              ? 'border-fd-foreground bg-fd-foreground text-fd-background'
              : 'border-fd-border bg-fd-secondary/80 hover:bg-fd-secondary text-fd-foreground'
          }`}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="translate-x-0.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-fd-foreground truncate">{meta.title}</span>
            <span className="rounded bg-fd-secondary px-1.5 py-0.5 text-[10px] font-mono text-fd-muted-foreground border border-fd-border/50">
              {meta.name}
            </span>
            <span className="text-[10px] font-mono text-fd-muted-foreground">
              {meta.duration}
            </span>
          </div>
          <p className="text-[11px] text-fd-muted-foreground truncate mt-0.5">
            {meta.description}
          </p>
        </div>
      </div>

      {/* Right: Acoustic Frequency Spec */}
      <div className="shrink-0 text-[11px] font-mono text-fd-muted-foreground hidden sm:block">
        {meta.frequencies}
      </div>
    </div>
  );
}
