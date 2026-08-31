'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import { SOUND_NAMES, type SoundName } from '@/lib/sounds';
import { SOUNDS_METADATA, generateSoundLLMPrompt } from '../sound-player';

const CATEGORIES = ['All', 'Interaction', 'Feedback', 'Notification', 'Navigation', 'System'] as const;

export function SoundStudio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSound, setActiveSound] = useState<SoundName | null>(null);
  const [selectedSound, setSelectedSound] = useState<SoundName>('tap');
  const [copiedSound, setCopiedSound] = useState<string | null>(null);

  const filteredSounds = useMemo(() => {
    return SOUND_NAMES.filter((name) => {
      const meta = SOUNDS_METADATA[name];
      if (!meta) return false;

      const matchesCategory = selectedCategory === 'All' || meta.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        name.toLowerCase().includes(q) ||
        meta.title.toLowerCase().includes(q) ||
        meta.description.toLowerCase().includes(q) ||
        meta.category.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleAudition = useCallback((name: SoundName) => {
    setActiveSound(name);
    setSelectedSound(name);
    playSound(name);
    setTimeout(() => {
      setActiveSound((prev) => (prev === name ? null : prev));
    }, 240);
  }, []);

  const handleCopyCode = useCallback((name: SoundName) => {
    const meta = SOUNDS_METADATA[name];
    if (!meta) return;
    const prompt = generateSoundLLMPrompt(meta);
    navigator.clipboard.writeText(prompt).then(() => {
      setCopiedSound(name);
      setTimeout(() => setCopiedSound(null), 2000);
    });
  }, []);

  const activeMeta = SOUNDS_METADATA[selectedSound] || SOUNDS_METADATA.tap;

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-2xl neumorph-card p-6 transition-all space-y-6">
      {/* ── 1. Sound Studio Top Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Procedural Sounds Matrix
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
              {filteredSounds.length} Sounds
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Zero dependencies · Browser native Web Audio oscillators · 1-click standalone TypeScript code
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 text-muted-foreground pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sounds..."
              className="h-8 pl-8 pr-3 text-xs rounded-xl bg-muted/60 border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground/30 font-sans w-full sm:w-44"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-[10px] text-muted-foreground hover:text-foreground font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="inline-flex flex-wrap gap-1 rounded-xl bg-muted/60 p-1 border border-border neumorph-pill">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playSound('swish');
                  setSelectedCategory(cat);
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Soundboard Grid (Spacious 4-Column Layout) ── */}
      {filteredSounds.length === 0 ? (
        <div className="py-16 text-center text-xs font-mono text-muted-foreground">
          No sounds match &ldquo;{searchQuery}&rdquo; in {selectedCategory}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredSounds.map((name) => {
            const meta = SOUNDS_METADATA[name];
            const isPlaying = activeSound === name;
            const isSelected = selectedSound === name;

            return (
              <div
                key={name}
                onClick={() => handleAudition(name)}
                className={`group relative flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition-all duration-120 select-none ${
                  isPlaying
                    ? 'border-emerald-500 bg-foreground text-background shadow-md scale-[0.98]'
                    : isSelected
                    ? 'border-border bg-muted/80 text-foreground ring-1 ring-foreground/20'
                    : 'border-border bg-card text-foreground hover:bg-muted/40 hover:border-foreground/20'
                }`}
              >
                {/* Card Top Row */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        isPlaying
                          ? 'border-transparent bg-background text-foreground'
                          : 'border-border bg-muted/60 text-muted-foreground group-hover:text-foreground'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`transition-transform ${isPlaying ? 'scale-125' : ''}`}
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </span>
                    <span className="text-sm font-semibold font-mono tracking-tight">{name}</span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isPlaying ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {meta?.duration}
                  </span>
                </div>

                {/* Card Description */}
                <div className="mt-3">
                  <div
                    className={`text-xs font-medium truncate ${
                      isPlaying ? 'text-background/90' : 'text-foreground/80'
                    }`}
                  >
                    {meta?.title}
                  </div>
                  <div
                    className={`text-[10px] truncate mt-0.5 ${
                      isPlaying ? 'text-background/70' : 'text-muted-foreground'
                    }`}
                  >
                    {meta?.category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 3. Full-Fidelity Live Code & Acoustic Inspector Deck ── */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4 neumorph-card">
        {/* Inspector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground font-mono">{activeMeta.name}</span>
              <span className="text-xs text-muted-foreground">({activeMeta.title})</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                {activeMeta.category}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{activeMeta.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAudition(selectedSound)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-all shadow-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Play Sound</span>
            </button>

            <button
              onClick={() => handleCopyCode(selectedSound)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              <span>{copiedSound === selectedSound ? 'Copied Function!' : 'Copy TypeScript Function'}</span>
            </button>
          </div>
        </div>

        {/* Synthesis Profile Metadata Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-card border border-border">
            <span className="text-[10px] text-muted-foreground block">FREQUENCY RAMP</span>
            <span className="text-foreground font-medium">{activeMeta.frequencies}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-card border border-border">
            <span className="text-[10px] text-muted-foreground block">SYNTHESIS METHOD</span>
            <span className="text-foreground font-medium truncate block">{activeMeta.synthesisType}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-card border border-border">
            <span className="text-[10px] text-muted-foreground block">EXECUTION OVERHEAD</span>
            <span className="text-emerald-500 font-medium">0 KB Asset · &lt;2ms Latency</span>
          </div>
        </div>

        {/* Complete Syntax Highlighted Code Terminal */}
        <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-500">
            <span>{activeMeta.name}.ts — zero-dependency standalone function</span>
            <span>Web Audio API</span>
          </div>
          <pre className="text-zinc-200 leading-relaxed overflow-x-auto">
            <code>{generateSoundLLMPrompt(activeMeta)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
