'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { SoundName } from '@/lib/sounds';

// Lazy-load the heavy sound synthesis module only when user clicks play
let playSoundFn: ((name: SoundName) => void) | null = null;
async function lazyPlaySound(name: SoundName) {
  if (!playSoundFn) {
    const mod = await import('@/lib/sounds');
    playSoundFn = mod.playSound;
  }
  playSoundFn(name);
}

export interface SoundMeta {
  name: SoundName;
  title: string;
  category: 'Interaction' | 'Feedback' | 'Navigation' | 'Notification' | 'System';
  description: string;
  synthesisType: string;
  duration: string;
  frequencies: string;
}

export const SOUNDS_METADATA: Record<SoundName, SoundMeta> = {
  tap: { name: 'tap', title: 'Capacitive Tap', category: 'Interaction', description: 'Ultra-clean micro capacitive tap for buttons and list selections.', synthesisType: 'Sine wave exponential pitch ramp (1800Hz to 700Hz)', duration: '35ms', frequencies: '1800Hz → 700Hz' },
  thud: { name: 'thud', title: 'Tactile Thud', category: 'Interaction', description: 'Deep dampened low-frequency thock for solid primary actions.', synthesisType: 'Filtered sine oscillator with lowpass cutoff', duration: '50ms', frequencies: '95Hz → 36Hz (280Hz Lowpass)' },
  snap: { name: 'snap', title: 'Haptic Snap', category: 'Interaction', description: 'Tight square-wave burst mimicking physical toggle engagement.', synthesisType: 'Square wave with hard envelope cutoff', duration: '25ms', frequencies: '240Hz' },
  pop: { name: 'pop', title: 'Bubbly Pop', category: 'Interaction', description: 'Hollow resonant pitch-drop for pill selections and toast pop-ins.', synthesisType: 'Sine with resonant frequency drop', duration: '70ms', frequencies: '880Hz → 140Hz' },
  blip: { name: 'blip', title: 'Hover Blip', category: 'Feedback', description: 'Quick ascending chirp for hover and focus transitions.', synthesisType: 'Sine ascending chirp', duration: '45ms', frequencies: '1150Hz → 2300Hz' },
  'hover-soft': { name: 'hover-soft', title: 'Soft Pulse', category: 'Feedback', description: 'Gentle low-energy sine pulse for hover states.', synthesisType: 'Single sine wave pulse', duration: '50ms', frequencies: '820Hz' },
  chime: { name: 'chime', title: 'Ascending Chime', category: 'Notification', description: 'Dual-tone ascending interval for task completion.', synthesisType: 'Stacked sine oscillators', duration: '280ms', frequencies: '660Hz → 990Hz' },
  bell: { name: 'bell', title: 'Triad Bell', category: 'Notification', description: 'Three-note major arpeggio for achievements and celebrations.', synthesisType: 'Triad sine arpeggio', duration: '300ms', frequencies: '880Hz + 1100Hz + 1320Hz' },
  ping: { name: 'ping', title: 'Resonant Ping', category: 'Notification', description: 'Curved frequency resonance for push notifications.', synthesisType: 'Frequency resonance sweep', duration: '140ms', frequencies: '1050Hz → 1750Hz' },
  tick: { name: 'tick', title: 'Dial Tick', category: 'Interaction', description: 'Precision micro-detent tick for rotary encoders.', synthesisType: 'Square wave fast decay', duration: '8ms', frequencies: '4800Hz → 1100Hz' },
  'toggle-on': { name: 'toggle-on', title: 'Toggle Activate', category: 'Interaction', description: 'Ascending sine glide for toggle-on states.', synthesisType: 'Sine frequency glide up', duration: '75ms', frequencies: '520Hz → 820Hz' },
  'toggle-off': { name: 'toggle-off', title: 'Toggle Deactivate', category: 'Interaction', description: 'Descending sine glide for toggle-off states.', synthesisType: 'Sine frequency glide down', duration: '75ms', frequencies: '820Hz → 520Hz' },
  lock: { name: 'lock', title: 'Mechanical Lock', category: 'System', description: 'Dual-frequency mechanical latch for security actions.', synthesisType: 'Stacked oscillators with mechanical filter', duration: '60ms', frequencies: '200Hz + 600Hz' },
  unlock: { name: 'unlock', title: 'Mechanical Unlock', category: 'System', description: 'Rising triangle sweep for authentication success.', synthesisType: 'Triangle pitch rise', duration: '50ms', frequencies: '600Hz → 1400Hz' },
  swish: { name: 'swish', title: 'Filtered Swish', category: 'Navigation', description: 'Noise sweep for drawer reveals and sheet transitions.', synthesisType: 'Filtered noise sweep', duration: '200ms', frequencies: '3200Hz → 350Hz' },
  whoosh: { name: 'whoosh', title: 'Atmospheric Whoosh', category: 'Navigation', description: 'Spatial air rush for page navigations.', synthesisType: 'Bandpass noise sweep', duration: '380ms', frequencies: '450Hz → 2400Hz → 280Hz' },
  shutter: { name: 'shutter', title: 'Camera Shutter', category: 'Interaction', description: 'Dual mechanical transient for screenshot capture.', synthesisType: 'Dual noise + sine transient', duration: '80ms', frequencies: '3800Hz + 1400Hz' },
  keystroke: { name: 'keystroke', title: 'Mechanical Key', category: 'Interaction', description: 'Cherry MX Red linear switch bottom-out clack.', synthesisType: 'Bandpass noise clack', duration: '60ms', frequencies: '4200Hz (Bandpass)' },
  pulse: { name: 'pulse', title: 'Haptic Pulse', category: 'System', description: 'Sub-bass tactile pulse for haptic feedback.', synthesisType: 'Sub-bass sine with fast decay', duration: '95ms', frequencies: '65Hz' },
  error: { name: 'error', title: 'Dissonant Alert', category: 'System', description: 'Dissonant square-wave alert for validation errors.', synthesisType: 'Square wave with dissonant interval', duration: '180ms', frequencies: '380Hz → 280Hz' },

  // Distributed from former premium category
  glissando: { name: 'glissando', title: 'Elegant Glissando', category: 'Navigation', description: 'Smooth ascending pitch sweep for reveals and luxury menu interactions.', synthesisType: 'Sine exponential pitch sweep', duration: '170ms', frequencies: '400Hz → 1200Hz' },
  shimmer: { name: 'shimmer', title: 'Magical Shimmer', category: 'Notification', description: 'Mystical multi-layered chord shimmer for rewards and special feature unlocks.', synthesisType: 'Multi-layered triangle chord', duration: '250ms', frequencies: '1200Hz / 1600Hz / 2100Hz / 2800Hz' },
  bloop: { name: 'bloop', title: 'Cute Bloop', category: 'Interaction', description: 'Hollow, satisfying liquid drop sound for playful micro-interactions.', synthesisType: 'Sine wave pitch drop', duration: '90ms', frequencies: '600Hz → 150Hz' },
  'sub-kick': { name: 'sub-kick', title: 'Deep Sub-Kick', category: 'Interaction', description: 'Heavy low-frequency kick for confirming major primary actions.', synthesisType: 'Sub-bass sine pitch drop', duration: '160ms', frequencies: '150Hz → 40Hz' },
  crystal: { name: 'crystal', title: 'Glassy Crystal', category: 'Notification', description: 'Long, resonant pure tone perfect for notifications and success states.', synthesisType: 'Pure sine frequency drop', duration: '450ms', frequencies: '2400Hz → 1800Hz' },
  'woosh-deep': { name: 'woosh-deep', title: 'Heavy Woosh', category: 'Navigation', description: 'Cinematic filtered bandpass noise sweep for sheet reveals and page transitions.', synthesisType: 'Bandpass filtered noise sweep', duration: '450ms', frequencies: '100Hz → 800Hz → 100Hz' },
  zap: { name: 'zap', title: 'Laser Zap', category: 'Feedback', description: 'Sharp, futuristic lowpass sawtooth zap for rapid selections and retro cues.', synthesisType: 'Sawtooth pitch drop with lowpass filter', duration: '110ms', frequencies: '1200Hz → 100Hz' },
  spring: { name: 'spring', title: 'Bouncy Spring', category: 'Feedback', description: 'Multi-bounce decaying oscillation for elastic gestures and pull-to-refresh.', synthesisType: 'Sine frequency modulation', duration: '250ms', frequencies: '500Hz - 1100Hz' },
  bubble: { name: 'bubble', title: 'Liquid Bubbles', category: 'Feedback', description: 'Rapid sequence of organic liquid pops for likes and reactions.', synthesisType: 'Multi-stage sine pitch ramps', duration: '100ms', frequencies: '400Hz - 800Hz' },
  'haptic-pop': { name: 'haptic-pop', title: 'Haptic Pop', category: 'Interaction', description: 'Sharp, immediate micro-interaction sound mimicking phone haptic tap motors.', synthesisType: 'Fast-decay square wave pulse', duration: '35ms', frequencies: '120Hz → 40Hz' },

  // Fun & Essentials
  coin: { name: 'coin', title: '8-bit Coin', category: 'Feedback', description: 'Classic 8-bit coin collect sound.', synthesisType: 'Square wave arpeggio', duration: '350ms', frequencies: 'B5 → E6' },
  'power-up': { name: 'power-up', title: 'Power Up', category: 'Feedback', description: 'Ascending major arpeggio for leveling up.', synthesisType: 'Triangle wave chord', duration: '400ms', frequencies: '440Hz → 880Hz' },
  'power-down': { name: 'power-down', title: 'Power Down', category: 'Feedback', description: 'Descending minor sweep for deactivation.', synthesisType: 'Sawtooth sweep', duration: '450ms', frequencies: '300Hz → 40Hz' },
  'magic-sparkle': { name: 'magic-sparkle', title: 'Magic Sparkle', category: 'Feedback', description: 'Shimmering randomized high-frequency fairy dust.', synthesisType: 'Random sine bursts', duration: '500ms', frequencies: '1500Hz - 3500Hz' },
  'jump-boing': { name: 'jump-boing', title: 'Jump Boing', category: 'Feedback', description: 'Comical pitch-bent bouncy jump.', synthesisType: 'Triangle pitch envelope', duration: '350ms', frequencies: '150Hz → 600Hz → 200Hz' },
  'arcade-pew': { name: 'arcade-pew', title: 'Arcade Laser', category: 'Feedback', description: 'Classic retro 8-bit laser shot.', synthesisType: 'Square wave pitch drop', duration: '200ms', frequencies: '880Hz → 110Hz' },
  heartbeat: { name: 'heartbeat', title: 'Heartbeat Pulse', category: 'Feedback', description: 'Deep, dual-stage low-frequency pulse.', synthesisType: 'Sine wave pulse', duration: '500ms', frequencies: '50Hz → 30Hz' },
  'sonar-ping': { name: 'sonar-ping', title: 'Sonar Ping', category: 'Feedback', description: 'High-pitched ping with a long echoing decay.', synthesisType: 'High sine with slow decay', duration: '1250ms', frequencies: '1200Hz' },
  'typewriter-key': { name: 'typewriter-key', title: 'Typewriter Key', category: 'Interaction', description: 'Crisp, vintage mechanical typewriter clack.', synthesisType: 'Bandpassed noise', duration: '40ms', frequencies: '2500Hz' },
  'typewriter-bell': { name: 'typewriter-bell', title: 'Typewriter Bell', category: 'Feedback', description: 'Bright, resonant carriage-return ding.', synthesisType: 'Dual sine ring', duration: '850ms', frequencies: '1600Hz, 1620Hz' },
  'synth-sweep': { name: 'synth-sweep', title: 'Synth Sweep', category: 'Feedback', description: 'Dramatic, resonant low-pass filter sweep.', synthesisType: 'Sawtooth + Lowpass filter sweep', duration: '650ms', frequencies: '100Hz → 4000Hz → 100Hz' },
  glitch: { name: 'glitch', title: 'Digital Glitch', category: 'Feedback', description: 'Deterministic digital dropouts, square wave jumps, and static bursts.', synthesisType: 'Square dropouts + Bandpass Noise', duration: '130ms', frequencies: '60Hz / 3000Hz' },
  'deep-impact': { name: 'deep-impact', title: 'Deep Impact', category: 'Feedback', description: 'Cinematic low-frequency boom with a noise tail.', synthesisType: 'Sine drop + Noise lowpass', duration: '850ms', frequencies: '120Hz → 30Hz' },
  'hollow-thock': { name: 'hollow-thock', title: 'Hollow Thock', category: 'Interaction', description: 'Resonant wooden block percussion sound.', synthesisType: 'Triangle + Sine fast decay', duration: '60ms', frequencies: '600Hz / 300Hz' },
  'success-fanfare': { name: 'success-fanfare', title: 'Success Fanfare', category: 'Feedback', description: 'Short, triumphant multi-tone chord sequence.', synthesisType: 'Triangle major chord', duration: '650ms', frequencies: 'G4, C5, E5' },
};

export function generateSoundLLMPrompt(meta: SoundMeta): string {
  const functionName = `play${meta.name.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`;
  return `Implement the "${meta.title}" (${meta.name}) micro-interaction sound effect in my React / Next.js web application.

Acoustic Profile:
- Name: ${meta.name}
- Category: ${meta.category}
- Duration: ${meta.duration}
- Synthesis: ${meta.synthesisType}
- Frequencies: ${meta.frequencies}

1. Create a standalone zero-dependency Web Audio API function called \`${functionName}\` in \`lib/sounds/${meta.name}.ts\`.
2. Wire up \`${functionName}()\` to trigger on the target UI interaction (e.g. onClick, onMouseEnter, or state change).
3. Ensure the browser AudioContext is initialized/resumed on user gesture.`;
}

export function SoundPlayer({ name }: { name: SoundName }) {
  const meta = SOUNDS_METADATA[name];
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    lazyPlaySound(name);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsPlaying(false);
    }, 350);
  }, [name]);

  const handleCopyPrompt = useCallback(() => {
    if (!meta) return;
    const prompt = generateSoundLLMPrompt(meta);
    navigator.clipboard.writeText(prompt).then(() => {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 1800);
    });
  }, [meta]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!meta) return null;

  return (
    <div className="my-2.5 rounded-xl border border-border/60 bg-card/60 hover:bg-card/90 px-3.5 py-2.5 transition-all duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Play button + Meta */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play ${meta.title}`}
            className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden ${
              isPlaying
                ? 'border-foreground bg-foreground text-background shadow-xs'
                : 'border-border/60 bg-muted/60 hover:bg-muted text-foreground'
            }`}
          >
            {/* Speaker Icon */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out ${
                isPlaying
                  ? 'opacity-0 scale-75 rotate-[-8deg] pointer-events-none'
                  : 'opacity-100 scale-100 rotate-0'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </div>

            {/* Sound Wave Dashes */}
            <div
              className={`absolute inset-0 flex items-center justify-center gap-0.5 transition-all duration-200 ease-out ${
                isPlaying
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-50 pointer-events-none'
              }`}
            >
              <span
                className="w-0.5 rounded-full bg-current transition-all duration-200"
                style={{
                  height: isPlaying ? '11px' : '3px',
                  animation: isPlaying ? 'pulse 0.4s ease-in-out infinite alternate' : 'none',
                }}
              />
              <span
                className="w-0.5 rounded-full bg-current transition-all duration-200"
                style={{
                  height: isPlaying ? '6px' : '3px',
                  animation: isPlaying ? 'pulse 0.32s ease-in-out infinite 0.1s alternate' : 'none',
                }}
              />
              <span
                className="w-0.5 rounded-full bg-current transition-all duration-200"
                style={{
                  height: isPlaying ? '13px' : '3px',
                  animation: isPlaying ? 'pulse 0.45s ease-in-out infinite 0.05s alternate' : 'none',
                }}
              />
              <span
                className="w-0.5 rounded-full bg-current transition-all duration-200"
                style={{
                  height: isPlaying ? '8px' : '3px',
                  animation: isPlaying ? 'pulse 0.36s ease-in-out infinite 0.15s alternate' : 'none',
                }}
              />
            </div>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-foreground truncate">{meta.title}</span>
              <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground border border-border/40">
                {meta.name}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/70 hidden sm:inline">
                {meta.duration}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              {meta.description} <span className="opacity-60 hidden md:inline">· {meta.synthesisType}</span>
            </p>
          </div>
        </div>

        {/* Right: Prompt LLM button */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={handleCopyPrompt}
            aria-label={`Copy AI prompt for ${meta.title}`}
            className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-foreground px-2.5 py-1 text-[11px] text-background hover:opacity-90 transition-all active:scale-95 font-medium shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
            </svg>
            <span>{copiedPrompt ? '✓ Prompt Copied!' : 'Prompt LLM'}</span>
          </button>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {copiedPrompt ? `Copied LLM prompt for ${meta.title}` : ''}
      </div>
    </div>
  );
}
