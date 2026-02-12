'use client';

import { useState } from 'react';
import { SoundCard } from './sound-card';
import type { SoundName } from '@/lib/sounds';

const SOUNDS_DATA: Array<{
  name: SoundName;
  label: string;
  category: string;
  description: string;
}> = [
  {
    name: 'button-click',
    label: 'Button Click',
    category: 'Interaction',
    description: 'Classic click sound for button interactions. Crisp and satisfying.',
  },
  {
    name: 'button-click-secondary',
    label: 'Button Click (Secondary)',
    category: 'Interaction',
    description: 'Softer click for secondary actions and alternatives.',
  },
  {
    name: 'hover-blip',
    label: 'Hover Blip',
    category: 'Feedback',
    description: 'Quick chirp when hovering over interactive elements.',
  },
  {
    name: 'hover-soft',
    label: 'Hover Soft',
    category: 'Feedback',
    description: 'Subtle and gentle hover feedback sound.',
  },
  {
    name: 'success-chime',
    label: 'Success Chime',
    category: 'Notification',
    description: 'Pleasant chime to indicate successful completion.',
  },
  {
    name: 'success-bell',
    label: 'Success Bell',
    category: 'Notification',
    description: 'Uplifting bell sound for positive feedback.',
  },
  {
    name: 'error-buzz',
    label: 'Error Buzz',
    category: 'Alert',
    description: 'Attention-grabbing buzz for error states.',
  },
  {
    name: 'error-beep',
    label: 'Error Beep',
    category: 'Alert',
    description: 'Clear beep to signal an error occurred.',
  },
  {
    name: 'notification-ping',
    label: 'Notification Ping',
    category: 'Alert',
    description: 'Quick ping for notifications and messages.',
  },
  {
    name: 'notification-subtle',
    label: 'Notification Subtle',
    category: 'Alert',
    description: 'Quiet notification sound for background alerts.',
  },
  {
    name: 'swoosh',
    label: 'Swoosh',
    category: 'Transition',
    description: 'Smooth whoosh for page transitions and animations.',
  },
  {
    name: 'pop',
    label: 'Pop',
    category: 'Interaction',
    description: 'Playful pop sound for confirmation or reveal.',
  },
  {
    name: 'slider-tick',
    label: 'Slider Tick',
    category: 'Interaction',
    description: 'Subtle tick sound for sliders and range inputs.',
  },
];

export function SoundsGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    ...new Set(SOUNDS_DATA.map(s => s.category)),
  ];

  const filteredSounds =
    selectedCategory === 'All'
      ? SOUNDS_DATA
      : SOUNDS_DATA.filter(s => s.category === selectedCategory);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-card text-card-foreground hover:bg-accent'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSounds.map(sound => (
          <SoundCard key={sound.name} {...sound} />
        ))}
      </div>
    </div>
  );
}
