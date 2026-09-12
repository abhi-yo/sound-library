// bloub / audio — Procedural Micro UX Sound Library
// Standalone Web Audio API sound synthesis with zero runtime dependencies.

export {
  SOUND_NAMES,
  type SoundName,
  type PlaySoundOptions,
} from './sound-names';
import type { SoundName, PlaySoundOptions } from './sound-names';

let audioCtx: AudioContext | null = null;
let masterCompressor: DynamicsCompressorNode | null = null;
export let masterGain: GainNode | null = null;
let masterAnalyser: AnalyserNode | null = null;
let soundEnabled = true;

// Respect prefers-reduced-motion
if (typeof window !== 'undefined') {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  soundEnabled = !mq.matches;
  mq.addEventListener('change', (e) => {
    soundEnabled = !e.matches;
  });
}

/** Programmatically enable or mute sound */
export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

/** Get master analyser node for real-time audio visualization */
export function getAudioAnalyser(): AnalyserNode | null {
  if (!audioCtx) getAudioContext();
  return masterAnalyser;
}

/** Get or initialize the unified AudioContext with dynamics compressor */
export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();

    // Master Dynamics Compressor to prevent clipping & maintain uniform loudness
    masterCompressor = audioCtx.createDynamicsCompressor();
    masterCompressor.threshold.setValueAtTime(-18, audioCtx.currentTime);
    masterCompressor.knee.setValueAtTime(12, audioCtx.currentTime);
    masterCompressor.ratio.setValueAtTime(6, audioCtx.currentTime);
    masterCompressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
    masterCompressor.release.setValueAtTime(0.1, audioCtx.currentTime);

    masterAnalyser = audioCtx.createAnalyser();
    masterAnalyser.fftSize = 256;
    masterAnalyser.smoothingTimeConstant = 0.8;

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);

    masterGain.connect(masterCompressor);
    masterCompressor.connect(masterAnalyser);
    masterAnalyser.connect(audioCtx.destination);
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  return audioCtx;
}

let lastSoundPlayTime = 0;
let lastSoundName = '';
let lastCopySoundTime = 0;

/**
 * Plays the 'unlock' sound specifically for copy button clicks.
 * Enforces strict single-sound deduplication so that no two sounds can fire
 * on a single button click (drops duplicate events within 120ms).
 */
export function playCopySound() {
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  // Prevent duplicate triggers within 120ms window
  if (now - lastCopySoundTime < 120) return;
  lastCopySoundTime = now;
  playSound('unlock');
}

export async function playSound(name: SoundName, options?: PlaySoundOptions) {
  if (!soundEnabled) return;
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();

  // If unlock sound was triggered for a copy button, suppress any conflicting generic sound within 120ms
  if (name !== 'unlock' && now - lastCopySoundTime < 120) {
    return;
  }

  // Prevent accidental duplicate triggering of the exact same sound within 35ms
  if (name === lastSoundName && now - lastSoundPlayTime < 35) return;

  lastSoundPlayTime = now;
  lastSoundName = name;

  try {
    const ctx = getAudioContext();
    const { synthesize } = await import('./synthesis');
    synthesize(ctx, name, options?.volume);
  } catch (err) {
    console.error('Audio playback error:', err);
  }
}

/** Hook for React components */
export function useSound(name: SoundName, options?: PlaySoundOptions) {
  return {
    play: () => playSound(name, options),
  };
}
