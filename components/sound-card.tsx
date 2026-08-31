'use client';

import React, { useState, useCallback } from 'react';
import type { SoundName } from '@/lib/sounds';
import { playSound } from '@/lib/lazy-sounds';
import { SOUNDS_METADATA, generateSoundLLMPrompt } from './sound-player';

interface SoundCardProps {
  name: SoundName;
  label?: string;
  category?: string;
  description?: string;
}

export function SoundCard({ name }: SoundCardProps) {
  const meta = SOUNDS_METADATA[name];
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    playSound(name);
    setTimeout(() => setIsPlaying(false), 300);
  }, [name]);

  const handleCopy = useCallback(() => {
    if (!meta) return;
    const prompt = generateSoundLLMPrompt(meta);
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [meta]);

  if (!meta) return null;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card/40 p-4 transition-colors hover:border-border">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">{meta.title}</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              {name}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {meta.description}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Audition ${meta.title}`}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isPlaying
              ? 'border-foreground bg-foreground text-background'
              : 'border-border bg-background hover:bg-accent text-foreground'
          }`}
        >
          {isPlaying ? (
            <span className="h-1.5 w-1.5 rounded-full bg-background animate-ping" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="translate-x-0.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/50 text-[11px] font-mono text-muted-foreground">
        <span className="tabular-nums">{meta.duration}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied code' : `Copy code for ${meta.title}`}
          className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          {copied ? 'copied' : 'copy snippet'}
        </button>
      </div>
    </div>
  );
}
