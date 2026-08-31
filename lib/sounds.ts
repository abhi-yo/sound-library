// bloub / audio — Procedural Micro UX Sound Library
// Standalone Web Audio API sound synthesis with zero runtime dependencies.

export const SOUND_NAMES = [
  'tap',
  'thud',
  'snap',
  'pop',
  'blip',
  'hover-soft',
  'chime',
  'bell',
  'ping',
  'tick',
  'toggle-on',
  'toggle-off',
  'lock',
  'unlock',
  'swish',
  'whoosh',
  'shutter',
  'keystroke',
  'pulse',
  'error',
  // Premium
  'glissando',
  'shimmer',
  'bloop',
  'sub-kick',
  'crystal',
  'woosh-deep',
  'zap',
  'spring',
  'bubble',
  'haptic-pop',
  // Fun & Essentials
  'coin',
  'power-up',
  'power-down',
  'magic-sparkle',
  'jump-boing',
  'arcade-pew',
  'heartbeat',
  'sonar-ping',
  'typewriter-key',
  'typewriter-bell',
  'synth-sweep',
  'glitch',
  'deep-impact',
  'hollow-thock',
  'success-fanfare',
] as const;

export type SoundName = (typeof SOUND_NAMES)[number];

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

export async function playSound(name: SoundName) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const { synthesize } = await import('./synthesis');
    synthesize(ctx, name);
  } catch (err) {
    console.error('Audio playback error:', err);
  }
}

/** Hook for React components */
export function useSound(name: SoundName) {
  return {
    play: () => playSound(name),
  };
}
