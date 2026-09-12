'use client';

import React, { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Volume2, Play, Check, Copy, Terminal, ExternalLink } from 'lucide-react';
import type { SoundName } from '@/lib/sound-names';
import { playSound, playCopySound } from '@/lib/lazy-sounds';
import { SOUNDS_METADATA } from '@/lib/sounds-metadata';
import { cn } from '@/lib/utils';

interface SoundCardProps {
  name: SoundName;
  className?: string;
}

function getCategorySlug(category: string): string {
  switch (category) {
    case 'Interaction':
      return 'interaction';
    case 'Feedback':
      return 'feedback';
    case 'Notification':
      return 'notifications';
    case 'Navigation':
      return 'navigation';
    case 'System':
      return 'system';
    case 'Essentials':
      return 'essentials';
    default:
      return 'interaction';
  }
}

export function SoundCard({ name, className }: SoundCardProps) {
  const meta = SOUNDS_METADATA[name];
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    playSound(name);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsPlaying(false);
    }, 400);
  }, [name]);

  const handleCopyCli = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`npx sound-library add ${name}`);
    playCopySound();
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 1600);
  }, [name]);

  if (!meta) return null;

  const categorySlug = getCategorySlug(meta.category);

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white/60 dark:bg-neutral-900/30 p-4 transition-all duration-150 hover:border-neutral-400 dark:hover:border-neutral-600',
        isPlaying && 'border-neutral-900 dark:border-neutral-100',
        className
      )}
    >
      {/* ── Top Header: Title & Badges ── */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-neutral-950 dark:text-neutral-50 tracking-tight">
                {meta.title}
              </span>
              <code className="rounded px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/60">
                {name}
              </code>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
              {meta.description}
            </p>
          </div>

          {/* Direct Play Trigger */}
          <button
            type="button"
            data-sound-audition
            onClick={handlePlay}
            aria-label={`Play ${meta.title}`}
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-100 active:scale-90 cursor-pointer',
              isPlaying
                ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-black'
                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            )}
          >
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5 px-0.5">
                <span className="w-0.5 bg-current rounded-full h-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-0.5 bg-current rounded-full h-3/4 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-0.5 bg-current rounded-full h-full animate-bounce [animation-delay:-0.45s]" />
              </div>
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Synthesis Detail Bar */}
        <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
          <span className="tabular-nums font-medium text-neutral-700 dark:text-neutral-300">
            {meta.duration}
          </span>
          <span>·</span>
          <span className="truncate">{meta.frequencies}</span>
        </div>
      </div>

      {/* ── Card Footer: 1-Click CLI & Link ── */}
      <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-xs">
        {/* CLI copy button */}
        <button
          type="button"
          onClick={handleCopyCli}
          data-copy-button="true"
          title={`Copy CLI command for ${name}`}
          className={cn(
            'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer',
            copiedCli
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
              : 'bg-neutral-100 dark:bg-neutral-800/70 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/50'
          )}
        >
          {copiedCli ? (
            <>
              <Check className="h-3 w-3 text-emerald-500 shrink-0" />
              <span>copied</span>
            </>
          ) : (
            <>
              <Terminal className="h-3 w-3 text-neutral-400 shrink-0" />
              <span>add {name}</span>
            </>
          )}
        </button>

        <Link
          href={`/docs/sounds/${categorySlug}`}
          className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <span>Docs</span>
          <ExternalLink className="h-2.5 w-2.5" />
        </Link>
      </div>
    </div>
  );
}
