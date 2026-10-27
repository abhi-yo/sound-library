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

/** Output the voice currently being synthesized connects to (see synthesis.getMasterOutput). */
export let voiceOutput: AudioNode | null = null;

// ---- Overload protection -------------------------------------------------
/** Max sounds playing at once; the oldest is faded out and stopped beyond this. */
export const MAX_VOICES = 6;
/** The same sound can't retrigger faster than this. */
export const SAME_SOUND_THROTTLE_MS = 50;
/** Suspend the AudioContext after this much silence; resumes on the next sound. */
export const IDLE_SUSPEND_MS = 15000;
/** Safety net: force-end a voice whose sources never report 'ended'. */
const VOICE_MAX_LIFETIME_MS = 8000;

interface Voice {
  gain: GainNode;
  sources: AudioScheduledSourceNode[];
  pending: number;
  timer: ReturnType<typeof setTimeout>;
  done: boolean;
}
const voices: Voice[] = [];
let idleTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleIdleSuspend() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    idleTimer = null;
    if (audioCtx && voices.length === 0 && audioCtx.state === 'running') {
      void audioCtx.suspend().catch(() => {});
    }
  }, IDLE_SUSPEND_MS);
}

function endVoice(v: Voice) {
  if (v.done) return;
  v.done = true;
  clearTimeout(v.timer);
  try {
    v.gain.disconnect();
  } catch {
    /* already disconnected */
  }
  const i = voices.indexOf(v);
  if (i >= 0) voices.splice(i, 1);
  if (voices.length === 0) scheduleIdleSuspend();
}

function stealVoice(v: Voice, ctx: AudioContext) {
  const t = ctx.currentTime;
  try {
    v.gain.gain.cancelScheduledValues(t);
    v.gain.gain.setValueAtTime(v.gain.gain.value, t);
    v.gain.gain.linearRampToValueAtTime(0, t + 0.015);
  } catch {
    /* ignore */
  }
  for (const src of v.sources) {
    try {
      src.stop(t + 0.02);
    } catch {
      /* not started / already stopped */
    }
  }
  setTimeout(() => endVoice(v), 40);
}

/** Debug/inspection: how many voices are sounding right now. */
export function getActiveVoiceCount() {
  return voices.length;
}
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

/** The analyser if the context already exists — never creates one (safe at mount). */
export function peekAudioAnalyser(): AnalyserNode | null {
  return masterAnalyser;
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
    void audioCtx.resume().catch(() => {});
  }
  // Any use of the context (our voices or a demo's custom nodes) postpones suspend.
  if (voices.length === 0) scheduleIdleSuspend();

  return audioCtx;
}

const lastPlayedByName = new Map<string, number>();
let lastCopySoundTime = 0;
const COPY_SOUND: SoundName = 'success';

/**
 * Plays the copy-confirmation sound ('success', quietly) for copy button clicks.
 * Enforces strict single-sound deduplication so that no two sounds can fire
 * on a single button click (drops duplicate events within 120ms).
 */
export function playCopySound() {
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  // Prevent duplicate triggers within 120ms window
  if (now - lastCopySoundTime < 120) return;
  lastCopySoundTime = now;
  // A soft "success" confirms the copy without shouting over the page.
  playSound(COPY_SOUND, { volume: 0.4 });
}

export async function playSound(name: SoundName, options?: PlaySoundOptions) {
  if (!soundEnabled) return;
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();

  // If unlock sound was triggered for a copy button, suppress any conflicting generic sound within 120ms
  if (name !== COPY_SOUND && now - lastCopySoundTime < 120) {
    return;
  }

  // Per-sound throttle: the same sound can't retrigger within SAME_SOUND_THROTTLE_MS.
  const lastForName = lastPlayedByName.get(name);
  if (lastForName !== undefined && now - lastForName < SAME_SOUND_THROTTLE_MS) return;
  lastPlayedByName.set(name, now);

  try {
    const ctx = getAudioContext();
    const { synthesize } = await import('./synthesis');
    if (!masterGain) return;

    // Voice cap: steal the oldest voice(s) before starting a new one.
    while (voices.length >= MAX_VOICES) stealVoice(voices[0], ctx);

    const gain = ctx.createGain();
    gain.connect(masterGain);
    const voice: Voice = { gain, sources: [], pending: 0, done: false, timer: setTimeout(() => endVoice(voice), VOICE_MAX_LIFETIME_MS) };

    // Capture the sources this sound creates so we know exactly when it ends.
    const origOsc = ctx.createOscillator;
    const origBuf = ctx.createBufferSource;
    const origConst = ctx.createConstantSource;
    const track = <T extends AudioScheduledSourceNode>(node: T): T => {
      voice.sources.push(node);
      voice.pending++;
      node.addEventListener('ended', () => {
        try {
          node.disconnect();
        } catch {
          /* ignore */
        }
        if (--voice.pending <= 0) endVoice(voice);
      }, { once: true });
      return node;
    };
    ctx.createOscillator = function () { return track(origOsc.call(ctx)); };
    ctx.createBufferSource = function () { return track(origBuf.call(ctx)); };
    if (origConst) ctx.createConstantSource = function () { return track(origConst.call(ctx)); };

    voiceOutput = gain;
    try {
      synthesize(ctx, name, options?.volume);
    } finally {
      voiceOutput = null;
      ctx.createOscillator = origOsc;
      ctx.createBufferSource = origBuf;
      if (origConst) ctx.createConstantSource = origConst;
    }

    if (voice.sources.length === 0) {
      // Nothing scheduled (unknown sound) — release immediately.
      endVoice(voice);
      return;
    }
    voices.push(voice);
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  } catch (err) {
    voiceOutput = null;
    console.error('Audio playback error:', err);
  }
}

/** Hook for React components */
export function useSound(name: SoundName, options?: PlaySoundOptions) {
  return {
    play: () => playSound(name, options),
  };
}
