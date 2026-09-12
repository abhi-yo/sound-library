'use client';

import React, { useMemo, useState } from 'react';
import { SoundCard } from './sound-card';
import { SOUND_NAMES, type SoundName } from '@/lib/sound-names';
import { SOUNDS_METADATA } from '@/lib/sounds-metadata';
import { playSound } from '@/lib/lazy-sounds';

const CATEGORIES = ['All', 'Interaction', 'Feedback', 'Notification', 'Navigation', 'System'] as const;
const PAGE_SIZE = 12;

export function SoundsGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredSounds: SoundName[] = useMemo(() => {
    return SOUND_NAMES.filter((name) => {
      if (selectedCategory === 'All') return true;
      const meta = SOUNDS_METADATA[name];
      return meta && meta.category === selectedCategory;
    });
  }, [selectedCategory]);

  const visibleSounds = filteredSounds.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSounds.length;

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              playSound('select');
              setSelectedCategory(category);
              setVisibleCount(PAGE_SIZE);
            }}
            className={`rounded-md px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selectedCategory === category
                ? 'bg-foreground text-background font-medium'
                : 'border border-border bg-card/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="sound-card-grid grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleSounds.map((name) => (
          <SoundCard key={name} name={name} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => { playSound('tick'); setVisibleCount((n) => n + PAGE_SIZE); }}
            className="rounded-md border border-border bg-card/60 px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            Show more ({filteredSounds.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
