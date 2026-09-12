'use client';

import React, { useState } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import type { SoundName } from '@/lib/sound-names';
import { SOUNDS_METADATA } from '@/lib/sounds-metadata';
import { hasSoundCode } from '@/lib/sounds-code-keys';
import { SpeakerWaveIcon } from '@/components/ui/speaker-wave';

interface SoundPreviewPanelProps {
  sounds?: SoundName[];
  category?: string;
  title?: string;
}

export function SoundPreviewPanel({
  sounds,
  category,
  title,
}: SoundPreviewPanelProps) {
  const [activeSound, setActiveSound] = useState<string | null>(null);

  // Filter sounds strictly based on category and ensure they have full code/install implementations
  const availableSounds: SoundName[] = sounds
    ? sounds
    : (Object.keys(SOUNDS_METADATA) as SoundName[]).filter((s) => {
        const meta = SOUNDS_METADATA[s];
        if (!meta || !hasSoundCode(s)) return false;
        if (!category) return true;
        return meta.category.toLowerCase() === category.toLowerCase();
      });

  if (availableSounds.length === 0) {
    return null;
  }

  const panelTitle = title || (category ? category : 'All sounds');

  const handlePlay = (name: SoundName) => {
    setActiveSound(name);
    playSound(name);
    setTimeout(() => {
      setActiveSound((curr) => (curr === name ? null : curr));
    }, 400);
  };

  return (
    <div className="not-prose my-5 rounded-2xl border border-white/[0.08] bg-[#141416] p-4 sm:p-5 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-3.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-white tracking-tight">
          <SpeakerWaveIcon size={16} className="text-[#ff3700]" />
          <span>{panelTitle}</span>
          <span className="text-[11px] font-mono text-neutral-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
            {availableSounds.length} sounds
          </span>
        </div>
        <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
          click to play
        </span>
      </div>

      {/* Pill Grid — Clean audition pills with animated soundwave icons */}
      <div className="flex flex-wrap gap-2">
        {availableSounds.map((name) => {
          const meta = SOUNDS_METADATA[name];
          const isPlaying = activeSound === name;

          return (
            <button
              key={name}
              type="button"
              onClick={() => handlePlay(name)}
              title={meta ? `${meta.title} (${meta.duration}) — click to audition` : name}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-150 cursor-pointer select-none border outline-none ${
                isPlaying
                  ? 'bg-[#ff3700]/20 border-[#ff3700] text-white scale-[1.02]'
                  : 'bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.06] hover:border-white/20'
              }`}
            >
              {/* Animated Wave Icon */}
              <SpeakerWaveIcon
                size={13}
                isPlaying={isPlaying}
                className={`shrink-0 transition-colors ${
                  isPlaying
                    ? 'text-[#ff3700]'
                    : 'text-neutral-400 group-hover:text-white'
                }`}
              />

              <span className="capitalize">{name.replace('-', ' ')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
