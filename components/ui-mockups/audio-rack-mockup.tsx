'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { playSound, getAudioContext } from '@/lib/lazy-sounds';

type WaveType = 'sine' | 'triangle' | 'square' | 'sawtooth';

interface NotePad {
  note: string;
  freq: number;
  label: string;
  key: string;
}

const NOTE_PADS: NotePad[] = [
  { note: 'C4', freq: 261.63, label: 'Root', key: 'A' },
  { note: 'E4', freq: 329.63, label: 'Third', key: 'S' },
  { note: 'G4', freq: 392.0, label: 'Fifth', key: 'D' },
  { note: 'B4', freq: 493.88, label: 'Maj7', key: 'F' },
  { note: 'C5', freq: 523.25, label: 'Octave', key: 'J' },
  { note: 'E5', freq: 659.25, label: 'Tenth', key: 'K' },
];

export function AudioRackMockup() {
  const [waveType, setWaveType] = useState<WaveType>('sine');
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [cutoffFreq, setCutoffFreq] = useState(3200);
  const [decayTime, setDecayTime] = useState(180); // ms
  const [gainVol, setGainVol] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [lastActuator, setLastActuator] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const audioNodesRef = useRef<{ [key: string]: boolean }>({});

  // Synthesize live note in browser Web Audio
  const playCustomNote = useCallback(
    (freq: number, noteName: string) => {
      if (isMuted) return;
      void (async () => {
      try {
        const ctx = await getAudioContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(cutoffFreq, now);
        filter.Q.setValueAtTime(3.5, now);

        const targetGain = (gainVol / 100) * 0.28;
        const dur = decayTime / 1000;

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(targetGain, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        osc.connect(filter).connect(gain).connect(ctx.destination);

        osc.start(now);
        osc.stop(now + dur + 0.02);

        setActiveNote(noteName);
        setTimeout(() => setActiveNote((prev) => (prev === noteName ? null : prev)), 220);
      } catch (e) {
        console.error(e);
      }
      })();
    },
    [waveType, cutoffFreq, decayTime, gainVol, isMuted]
  );

  // Keyboard shortcut listener for pads (A S D F J K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toUpperCase();
      const match = NOTE_PADS.find((p) => p.key === key);
      if (match) {
        playCustomNote(match.freq, match.note);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playCustomNote]);

  // Integrated OLED Scope Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // CRT Scope Grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);

      [0.25, 0.5, 0.75].forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(0, h * p);
        ctx.lineTo(w, h * p);
        ctx.stroke();
      });
      [0.2, 0.4, 0.6, 0.8].forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(w * p, 0);
        ctx.lineTo(w * p, h);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Dynamic Waveform Drawing based on active state and waveType
      const isPlaying = activeNote !== null || lastActuator !== null;
      phase += isPlaying ? 0.08 : 0.025;

      ctx.lineWidth = isPlaying ? 2 : 1.5;
      ctx.strokeStyle = isPlaying ? '#10b981' : '#059669';
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      ctx.beginPath();
      const midY = h / 2;
      const amp = isPlaying ? h * 0.35 : h * 0.12;

      for (let x = 0; x <= w; x += 3) {
        let y = midY;
        const norm = (x / w) * Math.PI * 8 + phase;

        if (waveType === 'sine') {
          y = midY + Math.sin(norm) * amp;
        } else if (waveType === 'triangle') {
          const mod = norm % (Math.PI * 2);
          y = midY + (mod < Math.PI ? (mod / Math.PI) * 2 - 1 : 1 - ((mod - Math.PI) / Math.PI) * 2) * amp;
        } else if (waveType === 'square') {
          y = midY + (Math.sin(norm) >= 0 ? 1 : -1) * amp * 0.8;
        } else if (waveType === 'sawtooth') {
          const mod = norm % (Math.PI * 2);
          y = midY + ((mod / (Math.PI * 2)) * 2 - 1) * amp;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [waveType, activeNote, lastActuator]);

  const triggerActuator = (name: 'shutter' | 'pulse' | 'lock' | 'bell', sound: 'shutter' | 'pulse' | 'lock' | 'bell') => {
    playSound(sound);
    setLastActuator(name);
    setTimeout(() => setLastActuator(null), 250);
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-2xl neumorph-card p-6 transition-all select-none">
      {/* ── 1. Top Instrument Console Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background font-mono font-bold text-xs shadow-sm">
            TE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isMuted ? 'bg-zinc-500' : 'bg-emerald-500 animate-pulse ring-2 ring-emerald-500/30'}`} />
              <span className="text-sm font-semibold tracking-tight text-foreground">OP-SYNTH // MODEL 01</span>
            </div>
            <p className="text-xs text-muted-foreground">Tactile micro-interaction synthesis workstation</p>
          </div>
        </div>

        {/* Waveform Selector & Mute */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-muted/60 p-1 border border-border neumorph-pill">
            {(['sine', 'triangle', 'square', 'sawtooth'] as WaveType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  playSound('tick');
                  setWaveType(type);
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-mono capitalize transition-all ${
                  waveType === type
                    ? 'bg-background text-foreground font-semibold shadow-xs neumorph-btn'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              playSound('snap');
              setIsMuted((prev) => !prev);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-mono border transition-all active:scale-95 ${
              isMuted
                ? 'border-red-500/40 bg-red-500/10 text-red-500 font-medium'
                : 'border-border bg-card text-foreground neumorph-btn'
            }`}
          >
            {isMuted ? 'MUTED' : 'LIVE'}
          </button>
        </div>
      </div>

      {/* ── 2. Center Integrated CRT Scope Screen ── */}
      <div className="my-5 relative rounded-xl overflow-hidden bg-zinc-950 border border-border neumorph-inset">
        <canvas ref={canvasRef} width={800} height={100} className="w-full h-24 block" />

        {/* OLED Screen Labels */}
        <div className="absolute top-2.5 left-3.5 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>SCOPE // {waveType.toUpperCase()} OSC</span>
        </div>

        <div className="absolute top-2.5 right-3.5 flex items-center gap-3 text-[10px] font-mono text-zinc-400">
          <span>FREQ: {activeNote ? `${NOTE_PADS.find((p) => p.note === activeNote)?.freq}Hz` : `${cutoffFreq}Hz`}</span>
          <span className="text-emerald-400 font-semibold">{activeNote ? `[${activeNote}]` : 'READY'}</span>
        </div>

        <div className="absolute bottom-2 left-3.5 text-[9px] font-mono text-zinc-500">
          CUTOFF {cutoffFreq}Hz · DECAY {decayTime}ms · GAIN {gainVol}%
        </div>
      </div>

      {/* ── 3. Tactile Step Keypad (Harmonic Note Pads) ── */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
          <span>HARMONIC AUDITION PADS</span>
          <span>KEYS [A S D F J K]</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {NOTE_PADS.map((pad) => {
            const isActive = activeNote === pad.note;
            return (
              <button
                key={pad.note}
                onClick={() => playCustomNote(pad.freq, pad.note)}
                className={`group flex flex-col justify-between rounded-xl border p-3 text-left transition-all duration-100 active:scale-95 neumorph-btn ${
                  isActive
                    ? 'border-emerald-500 bg-foreground text-background shadow-md'
                    : 'border-border bg-card text-foreground hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-background' : 'text-muted-foreground'}`}>
                    [{pad.key}]
                  </span>
                  <span className={`h-2 w-2 rounded-full transition-colors ${isActive ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-muted-foreground/30'}`} />
                </div>

                <div className="mt-3">
                  <div className="text-sm font-semibold tracking-tight">{pad.note}</div>
                  <div className={`text-[10px] font-mono ${isActive ? 'text-background/80' : 'text-muted-foreground'}`}>
                    {pad.freq}Hz
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. Knurled Parameter Sliders & Hardware Actuators ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1 border-t border-border">
        {/* Sliders (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between gap-4 rounded-xl border border-border bg-muted/20 p-4 neumorph-card">
          {/* Cutoff Parameter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-foreground font-medium">Biquad Cutoff</span>
              <span className="text-muted-foreground">{cutoffFreq} Hz</span>
            </div>
            <div className="p-1 rounded-xl bg-muted neumorph-inset">
              <input
                type="range"
                min={200}
                max={8000}
                step={100}
                value={cutoffFreq}
                onChange={(e) => {
                  playSound('tick');
                  setCutoffFreq(parseInt(e.target.value, 10));
                }}
                className="w-full h-2 rounded-lg appearance-none bg-transparent cursor-pointer accent-foreground"
              />
            </div>
          </div>

          {/* Decay Parameter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-foreground font-medium">Decay Envelope</span>
              <span className="text-muted-foreground">{decayTime} ms</span>
            </div>
            <div className="p-1 rounded-xl bg-muted neumorph-inset">
              <input
                type="range"
                min={40}
                max={600}
                step={20}
                value={decayTime}
                onChange={(e) => {
                  playSound('tick');
                  setDecayTime(parseInt(e.target.value, 10));
                }}
                className="w-full h-2 rounded-lg appearance-none bg-transparent cursor-pointer accent-foreground"
              />
            </div>
          </div>
        </div>

        {/* Hardware Actuators (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between gap-2.5">
          <div className="grid grid-cols-2 gap-2 h-full">
            {/* Shutter */}
            <button
              onClick={() => triggerActuator('shutter', 'shutter')}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card p-3 text-xs font-medium text-foreground transition-all active:scale-95 neumorph-btn ${
                lastActuator === 'shutter' ? 'ring-2 ring-foreground/40 bg-muted' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              <span>Shutter</span>
            </button>

            {/* Haptic Pulse */}
            <button
              onClick={() => triggerActuator('pulse', 'pulse')}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card p-3 text-xs font-medium text-foreground transition-all active:scale-95 neumorph-btn ${
                lastActuator === 'pulse' ? 'ring-2 ring-foreground/40 bg-muted' : ''
              }`}
            >
              <span className="h-3 w-3 rounded-full bg-foreground" />
              <span>Haptic</span>
            </button>

            {/* Lock Latch */}
            <button
              onClick={() => triggerActuator('lock', 'lock')}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card p-3 text-xs font-medium text-foreground transition-all active:scale-95 neumorph-btn ${
                lastActuator === 'lock' ? 'ring-2 ring-foreground/40 bg-muted' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Lock Latch</span>
            </button>

            {/* Bell Resonance */}
            <button
              onClick={() => triggerActuator('bell', 'bell')}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card p-3 text-xs font-medium text-foreground transition-all active:scale-95 neumorph-btn ${
                lastActuator === 'bell' ? 'ring-2 ring-foreground/40 bg-muted' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span>Bell Chord</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
