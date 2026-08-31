'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import { SOUND_NAMES, type SoundName } from '@/lib/sounds';
import { SOUNDS_METADATA, generateSoundLLMPrompt } from './sound-player';
import { AudioVisualizer } from './audio-visualizer';

const CATEGORIES = ['All', 'Interaction', 'Feedback', 'Notification', 'Navigation', 'System'] as const;

export function SoundMatrix() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSound, setActiveSound] = useState<SoundName | null>(null);
  const [copiedSound, setCopiedSound] = useState<string | null>(null);
  const [expandedCodeSound, setExpandedCodeSound] = useState<SoundName | null>(null);

  const filteredSounds = SOUND_NAMES.filter((name) => {
    if (selectedCategory === 'All') return true;
    const meta = SOUNDS_METADATA[name];
    return meta && meta.category === selectedCategory;
  });

  const handleTrigger = useCallback((name: SoundName) => {
    setActiveSound(name);
    playSound(name);
    setTimeout(() => {
      setActiveSound((prev) => (prev === name ? null : prev));
    }, 240);
  }, []);

  const handleCopyCode = useCallback((e: React.MouseEvent, name: SoundName) => {
    e.stopPropagation();
    const meta = SOUNDS_METADATA[name];
    if (!meta) return;
    const prompt = generateSoundLLMPrompt(meta);
    navigator.clipboard.writeText(prompt).then(() => {
      setCopiedSound(name);
      setTimeout(() => setCopiedSound(null), 1600);
    });
  }, []);

  // Keyboard shortcut support (1-9, 0)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= filteredSounds.length) {
        handleTrigger(filteredSounds[num - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredSounds, handleTrigger]);

  return (
    <div className="my-8 flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/20 p-5 shadow-sm">
      {/* Live Real-time Oscilloscope Console */}
      <AudioVisualizer className="h-14 w-full" />

      {/* Control Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground tracking-tight">Audio Console</span>
          <span className="text-[10px] font-mono text-muted-foreground">({filteredSounds.length} sounds)</span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-2.5 py-1 text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selectedCategory === cat
                  ? 'bg-foreground text-background font-medium'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tactile Sound Cells Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 pt-1">
        {filteredSounds.map((name, index) => {
          const meta = SOUNDS_METADATA[name];
          const isActive = activeSound === name;
          const isCopied = copiedSound === name;
          const isExpanded = expandedCodeSound === name;

          return (
            <div
              key={name}
              onClick={() => handleTrigger(name)}
              className={`group relative flex flex-col justify-between rounded-xl border p-3.5 text-left cursor-pointer transition-all duration-150 active:scale-[0.98] select-none ${
                isActive
                  ? 'border-foreground bg-foreground text-background shadow-md'
                  : 'border-border/70 bg-background/60 hover:border-foreground/40 hover:bg-accent/40 text-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-mono uppercase tracking-wider ${
                    isActive ? 'text-background/70' : 'text-muted-foreground'
                  }`}
                >
                  {index < 9 ? `[${index + 1}]` : ''} {meta?.category || 'Sound'}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCodeSound(isExpanded ? null : name);
                    }}
                    title="View code"
                    className={`rounded p-1 text-[10px] font-mono transition-opacity ${
                      isActive
                        ? 'text-background/80 hover:text-background'
                        : 'text-muted-foreground opacity-60 hover:opacity-100 hover:text-foreground'
                    }`}
                  >
                    {isExpanded ? 'hide' : 'code'}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleCopyCode(e, name)}
                    title="Copy code snippet"
                    className={`rounded p-1 text-[10px] font-mono transition-opacity ${
                      isActive
                        ? 'text-background/80 hover:text-background'
                        : 'text-muted-foreground opacity-60 hover:opacity-100 hover:text-foreground'
                    }`}
                  >
                    {isCopied ? 'copied' : 'copy'}
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium tracking-tight truncate">{meta?.title || name}</div>
                <div
                  className={`mt-1 flex items-center justify-between text-[10px] font-mono tabular-nums ${
                    isActive ? 'text-background/80' : 'text-muted-foreground'
                  }`}
                >
                  <span>{name}</span>
                  <span>{meta?.duration || '40ms'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Code View */}
      {expandedCodeSound && (
        <div className="mt-2 rounded-xl border border-border bg-muted/60 p-4 transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-border/40 text-xs font-mono text-muted-foreground">
            <span>{SOUNDS_METADATA[expandedCodeSound]?.title} ({expandedCodeSound}.ts)</span>
            <button
              type="button"
              onClick={() => setExpandedCodeSound(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              close
            </button>
          </div>
          <pre className="mt-3 overflow-x-auto text-[11px] font-mono leading-relaxed text-foreground max-h-52">
            <code>{expandedCodeSound && generateSoundLLMPrompt(SOUNDS_METADATA[expandedCodeSound])}</code>
          </pre>
        </div>
      )}

      {/* Footer bar */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] font-mono text-muted-foreground">
        <span>Click to trigger · Keys 1-9 for instant audition</span>
        <span>Zero runtime dependencies</span>
      </div>
    </div>
  );
}
