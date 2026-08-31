'use client';

import React, { useState } from 'react';
import { SoundCard } from './sound-card';
import { SOUND_NAMES, type SoundName } from '@/lib/sounds';
import { SOUNDS_METADATA } from './sound-player';

const CATEGORIES = ['All', 'Interaction', 'Feedback', 'Notification', 'Navigation', 'System'] as const;

export function SoundsGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredSounds: SoundName[] = SOUND_NAMES.filter((name) => {
    if (selectedCategory === 'All') return true;
    const meta = SOUNDS_METADATA[name];
    return meta && meta.category === selectedCategory;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSounds.map((name) => (
          <SoundCard key={name} name={name} />
        ))}
      </div>
    </div>
  );
}
