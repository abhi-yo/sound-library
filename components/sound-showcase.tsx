'use client';

import React, { useState } from 'react';
import { CommandPaletteMockup } from './ui-mockups/command-palette-mockup';
import { InteractiveOsMockup } from './ui-mockups/interactive-os-mockup';
import { playSound } from '@/lib/lazy-sounds';

export function SoundShowcase() {
  const [activeView, setActiveView] = useState<'command' | 'workspace'>('command');

  return (
    <div className="flex flex-col gap-6">
      {/* Switcher bar with subtle tactile neumorphic segmented container */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-muted/60 dark:bg-zinc-900/80 p-1.5 border border-border neumorph-pill">
          <button
            onClick={() => {
              playSound('swish');
              setActiveView('command');
            }}
            className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
              activeView === 'command'
                ? 'bg-background text-foreground neumorph-btn font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Command Palette (⌘K)
          </button>
          <button
            onClick={() => {
              playSound('swish');
              setActiveView('workspace');
            }}
            className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
              activeView === 'workspace'
                ? 'bg-background text-foreground neumorph-btn font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Application OS
          </button>
        </div>
      </div>

      {/* Render selected UI experience */}
      <div className="transition-all duration-300">
        {activeView === 'command' && <CommandPaletteMockup />}
        {activeView === 'workspace' && <InteractiveOsMockup />}
      </div>
    </div>
  );
}
