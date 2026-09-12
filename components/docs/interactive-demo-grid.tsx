'use client';

import React, { useState, useRef, useEffect } from 'react';
import { playSound, playCopySound, type SoundName } from '@/lib/lazy-sounds';
import { SOUNDS_METADATA } from '@/lib/sounds-metadata';
import { AdjustmentsVerticalIcon } from '@/components/ui/adjustments-vertical';
import { SpeakerWaveIcon } from '@/components/ui/speaker-wave';
import { Terminal, Copy, Check, SlidersHorizontal, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';

interface TelemetryState {
  name: SoundName;
  title: string;
  duration: string;
  frequencies: string;
  triggerCount: number;
}

export function InteractiveDemoGrid() {
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    name: 'tap',
    title: 'Capacitive Tap',
    duration: '35ms',
    frequencies: '1800Hz → 700Hz',
    triggerCount: 0,
  });

  const [meterLevels, setMeterLevels] = useState<number[]>([
    20, 35, 60, 45, 80, 65, 90, 75, 60, 85, 70, 50, 40, 60, 30, 20,
  ]);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Module 1: Buttons
  const [primaryPressed, setPrimaryPressed] = useState(false);
  const [destructivePressed, setDestructivePressed] = useState(false);

  // Module 2: Toggle
  const [toggleState, setToggleState] = useState(true);

  // Module 3: Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'synthesizer' | 'export'>('overview');

  // Module 4: Stepper / Slider
  const [detentLevel, setDetentLevel] = useState(70);

  // CLI copy state
  const [copiedCli, setCopiedCli] = useState(false);

  // Trigger sound with audio meter spike and telemetry update
  const trigger = (name: SoundName) => {
    playSound(name);
    const meta = SOUNDS_METADATA[name];

    setIsAudioActive(true);
    setTelemetry((prev) => ({
      name,
      title: meta?.title || name,
      duration: meta?.duration || '35ms',
      frequencies: meta?.frequencies || 'Procedural Web Audio',
      triggerCount: prev.triggerCount + 1,
    }));

    // Randomize meter spikes based on frequency characteristics
    const spikeBase = name === 'thud' ? [90, 85, 75, 60, 40, 30, 20, 15, 10, 10, 10, 10, 10, 10, 10, 10]
      : name === 'tap' ? [20, 30, 40, 55, 70, 85, 95, 90, 80, 65, 45, 30, 20, 15, 10, 10]
      : name === 'pop' ? [15, 25, 45, 80, 95, 85, 60, 40, 30, 20, 15, 15, 10, 10, 10, 10]
      : [30, 45, 60, 75, 85, 90, 85, 75, 65, 55, 45, 35, 30, 25, 20, 15];

    setMeterLevels(spikeBase);

    setTimeout(() => {
      setIsAudioActive(false);
      setMeterLevels([15, 20, 30, 25, 35, 30, 40, 35, 30, 25, 20, 18, 15, 12, 10, 8]);
    }, 280);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npx sound-library add tap thud pop tick toggle-on toggle-off');
    playCopySound();
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 1600);
  };

  return (
    <div className="not-prose my-8 rounded-2xl border border-white/[0.08] bg-[#111114] overflow-hidden shadow-2xl">
      {/* ── Console Header & Realtime Telemetry HUD ── */}
      <div className="border-b border-white/[0.06] bg-[#151518]/90 p-4 sm:px-6 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title & Status */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span
                className={`absolute inline-flex h-full w-full rounded-full transition-opacity duration-300 ${
                  isAudioActive ? 'bg-[#ff3700] opacity-90 scale-125' : 'bg-emerald-500 opacity-60'
                }`}
              />
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                  isAudioActive ? 'bg-[#ff3700]' : 'bg-emerald-400'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Tactile Interaction Bench
                </span>
                <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 border border-white/[0.06]">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Pure Web Audio synthesis · 0ms asset latency
              </p>
            </div>
          </div>

          {/* Real-time Telemetry Readout */}
          <div className="flex items-center gap-3 bg-black/40 rounded-xl px-3.5 py-2 border border-white/[0.05] text-xs font-mono">
            <SpeakerWaveIcon isPlaying={isAudioActive} size={15} className="text-[#ff3700] shrink-0" />
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">LAST TRIGGER:</span>
              <span className="text-white font-medium">play{telemetry.name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}()</span>
            </div>
            <span className="text-neutral-600 hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-2 text-neutral-400">
              <span>{telemetry.duration}</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-500">{telemetry.frequencies}</span>
            </div>
          </div>
        </div>

        {/* 16-Segment Audio Oscilloscope Meter */}
        <div className="mt-3.5 flex items-end gap-1 h-3.5 w-full bg-black/30 rounded-md p-1 border border-white/[0.03]">
          {meterLevels.map((lvl, idx) => (
            <div
              key={idx}
              className="flex-1 rounded-[1px] transition-all duration-150"
              style={{
                height: `${Math.max(lvl, 15)}%`,
                backgroundColor: isAudioActive
                  ? idx > 12 ? '#ff3700' : idx > 8 ? '#ff6633' : '#3b82f6'
                  : 'rgba(255, 255, 255, 0.1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── 4 Modular Interaction Bays ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.06] bg-[#0e0e11]">
        {/* Bay 1: Dual Button Weights (tap vs thud) */}
        <div className="p-6 flex flex-col justify-between min-h-[170px] border-b border-white/[0.06] md:border-b-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
              01 / Tactile Button Weights
            </span>
            <span className="text-[10px] font-mono text-neutral-500">primary vs decisive</span>
          </div>

          <div className="flex items-center gap-3 my-auto">
            {/* Primary Action Button (tap) */}
            <button
              type="button"
              onMouseDown={() => setPrimaryPressed(true)}
              onMouseUp={() => setPrimaryPressed(false)}
              onClick={() => trigger('tap')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-100 cursor-pointer select-none outline-none border flex items-center justify-center gap-2 ${
                primaryPressed
                  ? 'bg-white text-black scale-95 border-white'
                  : 'bg-white text-black hover:bg-neutral-200 border-white active:scale-95'
              }`}
            >
              <span>Confirm Action</span>
              <ArrowRight size={13} className="text-black/70" />
            </button>

            {/* Heavy / Destructive Button (thud) */}
            <button
              type="button"
              onMouseDown={() => setDestructivePressed(true)}
              onMouseUp={() => setDestructivePressed(false)}
              onClick={() => trigger('thud')}
              className={`py-2.5 px-3.5 rounded-xl text-xs font-mono transition-all duration-100 cursor-pointer select-none outline-none border flex items-center justify-center gap-1.5 ${
                destructivePressed
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 scale-95'
                  : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] border-white/[0.08] active:scale-95'
              }`}
            >
              <Trash2 size={13} className="text-neutral-400" />
              <span>Delete</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-4 pt-3 border-t border-white/[0.04]">
            <span>Confirm: <code className="text-[#ff3700]">tap (1.8kHz)</code></span>
            <span>Delete: <code className="text-neutral-300">thud (95Hz)</code></span>
          </div>
        </div>

        {/* Bay 2: Bistable Toggle Switch (toggle-on vs toggle-off) */}
        <div className="p-6 flex flex-col justify-between min-h-[170px] border-b border-white/[0.06] md:border-b-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
              02 / Bistable Haptic Toggle
            </span>
            <span className="text-[10px] font-mono text-neutral-500">ascending / descending</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] my-auto">
            <div>
              <div className="text-xs font-semibold text-white">Audio Confirmation</div>
              <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                {toggleState ? 'Status: Active (520Hz → 820Hz)' : 'Status: Inactive (820Hz → 520Hz)'}
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={toggleState}
              onClick={() => {
                const next = !toggleState;
                setToggleState(next);
                trigger(next ? 'toggle-on' : 'toggle-off');
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                toggleState ? 'bg-[#ff3700]' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  toggleState ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-4 pt-3 border-t border-white/[0.04]">
            <span>Active: <code className="text-[#ff3700]">toggle-on</code></span>
            <span>Muted: <code className="text-neutral-400">toggle-off</code></span>
          </div>
        </div>

        {/* Bay 3: Segmented Tab Strip (pop) */}
        <div className="p-6 flex flex-col justify-between min-h-[170px] border-b border-white/[0.06] md:border-b-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
              03 / Resonant Pill Switcher
            </span>
            <span className="text-[10px] font-mono text-neutral-500">resonant bubble drop</span>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-black/40 border border-white/[0.06] my-auto">
            {(['overview', 'synthesizer', 'export'] as const).map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    if (tab === activeTab) return;
                    setActiveTab(tab);
                    trigger('pop');
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono capitalize transition-all duration-150 cursor-pointer select-none ${
                    active
                      ? 'bg-white/[0.12] text-white font-medium border border-white/[0.1]'
                      : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-4 pt-3 border-t border-white/[0.04]">
            <span>Triggers on switch: <code className="text-[#ff3700]">pop</code></span>
            <span>Profile: 880Hz → 140Hz</span>
          </div>
        </div>

        {/* Bay 4: Detented Stepper / Fader (tick) */}
        <div className="p-6 flex flex-col justify-between min-h-[170px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
              <AdjustmentsVerticalIcon size={14} className="text-neutral-400" />
              04 / Detent Stepper
            </span>
            <span className="text-[10px] font-mono text-neutral-400 font-bold">{detentLevel}%</span>
          </div>

          <div className="my-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const next = Math.max(0, detentLevel - 10);
                setDetentLevel(next);
                trigger('tick');
              }}
              className="h-8 w-8 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 transition-all active:scale-90 cursor-pointer"
            >
              <Minus size={13} />
            </button>

            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={detentLevel}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDetentLevel(val);
                trigger('tick');
              }}
              className="flex-1 accent-[#ff3700] cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
            />

            <button
              type="button"
              onClick={() => {
                const next = Math.min(100, detentLevel + 10);
                setDetentLevel(next);
                trigger('tick');
              }}
              className="h-8 w-8 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 transition-all active:scale-90 cursor-pointer"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-4 pt-3 border-t border-white/[0.04]">
            <span>Detent transient: <code className="text-[#ff3700]">tick (8ms)</code></span>
            <span>4.8kHz → 1.1kHz</span>
          </div>
        </div>
      </div>

      {/* ── Console Footer / Quick CLI Scaffolding ── */}
      <div className="border-t border-white/[0.06] bg-[#141417] px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
          <span className="text-[#ff3700]">●</span>
          <span>Zero external MP3/WAV assets. 100% native math synthesis.</span>
        </div>

        <button
          type="button"
          onClick={handleCopyCommand}
          data-copy-button="true"
          title="Copy install command"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-neutral-300 text-[11px] transition-all cursor-pointer select-none active:scale-95"
        >
          <Terminal size={12} className="text-neutral-400" />
          <span>{copiedCli ? 'copied command!' : 'npx sound-library add all'}</span>
          {copiedCli ? (
            <Check size={12} className="text-emerald-400 shrink-0 ml-0.5" />
          ) : (
            <Copy size={11} className="text-neutral-500 shrink-0 ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
