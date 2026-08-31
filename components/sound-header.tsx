'use client';

import React, { useState, useCallback } from 'react';
import type { SoundName } from '@/lib/sounds';
import { SOUNDS_METADATA, generateSoundLLMPrompt } from './sound-player';

// Lazy-load the heavy sound synthesis module (39KB) only when user clicks play
let playSoundFn: ((name: SoundName) => void) | null = null;
async function lazyPlaySound(name: SoundName) {
  if (!playSoundFn) {
    const mod = await import('@/lib/sounds');
    playSoundFn = mod.playSound;
  }
  playSoundFn(name);
}

export function SoundPlayButton({ name }: { name: SoundName }) {
  const meta = SOUNDS_METADATA[name];
  const [promptCopied, setPromptCopied] = useState(false);

  const handlePlay = useCallback(() => {
    lazyPlaySound(name);
  }, [name]);

  const handleCopyPrompt = useCallback(() => {
    if (!meta) return;
    const prompt = generateSoundLLMPrompt(meta);
    navigator.clipboard.writeText(prompt).then(() => {
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    });
  }, [meta]);

  if (!meta) return null;

  return (
    <div className="not-prose inline-flex items-center gap-2 my-2.5">
      {/* Clean, Simple Play Button */}
      <button
        type="button"
        onClick={handlePlay}
        aria-label={`Play ${meta.title}`}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-secondary/70 hover:bg-fd-secondary px-3 text-xs font-medium text-fd-foreground transition-all active:scale-95 select-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-fd-muted-foreground"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
        <span>Play</span>
      </button>

      {/* Flat / Ghost Prompt Button — No box or border by default, only on hover */}
      <button
        type="button"
        onClick={handleCopyPrompt}
        aria-label={`Copy LLM prompt for ${meta.title}`}
        className="group inline-flex h-8 items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-2.5 text-xs font-mono text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-secondary hover:border-fd-border transition-all duration-150 active:scale-95 select-none"
      >
        {promptCopied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-fd-foreground"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="shrink-0 text-fd-muted-foreground group-hover:text-fd-foreground transition-transform group-hover:scale-110"
          >
            <path d="M12 22c0-4.97-4.03-9-9-9 4.97 0 9-4.03 9-9 0 4.97 4.03 9 9 9-4.97 0-9 4.03-9 9Z" />
            <path d="M5.5 7.5c0-1.93-1.57-3.5-3.5-3.5 1.93 0 3.5-1.57 3.5-3.5 0 1.93 1.57 3.5 3.5 3.5-1.93 0-3.5 1.57-3.5 3.5Z" />
            <path d="M20 9c0-2.21-1.79-4-4-4 2.21 0 4-1.79 4-4 0 2.21 1.79 4 4 4-2.21 0-4 1.79-4 4Z" />
          </svg>
        )}

        <span className="tracking-tight">{promptCopied ? 'Copied' : 'Prompt'}</span>
      </button>
    </div>
  );
}
