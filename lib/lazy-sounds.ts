import type { SoundName, PlaySoundOptions } from './sound-names';

export type { SoundName, PlaySoundOptions };
export { SOUND_NAMES } from './sound-names';

type SoundsModule = typeof import('./sounds');

let soundsModulePromise: Promise<SoundsModule> | null = null;

/** performance.now() of the most recent playSound/playCopySound request (set synchronously). */
let lastRequestAt = -Infinity;
const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/** Lets the app-wide UI sound layer skip clicks a component already voiced itself. */
export function getLastSoundRequestAt() {
  return lastRequestAt;
}

let loadedModule: SoundsModule | null = null;
/** Mute/unmute requested before the engine loaded; applied once it does. */
let pendingEnabled: boolean | null = null;

function loadSounds(): Promise<SoundsModule> {
  if (!soundsModulePromise) {
    soundsModulePromise = import('./sounds').then((mod) => {
      loadedModule = mod;
      if (pendingEnabled !== null) mod.setSoundEnabled(pendingEnabled);
      return mod;
    });
  }
  return soundsModulePromise;
}

/** True once the engine chunk has been fetched (it never loads on page load). */
export function isSoundEngineLoaded() {
  return loadedModule !== null;
}

/**
 * Warm the sound engine module (no AudioContext, no sound). Only call this on
 * real intent — a pointerdown/keydown, or hover/focus on a CTA — never on load.
 */
export function preloadSounds() {
  void loadSounds().catch(() => {});
}

/**
 * Thin client entry — dynamically imports playback implementation on first call.
 * Importing this module does not pull synthesis or SOUNDS_CODE into the bundle.
 */
export function playSound(name: SoundName, options?: PlaySoundOptions) {
  lastRequestAt = nowMs();
  void loadSounds()
    .then((mod) => mod.playSound(name, options))
    .catch((err) => console.error('Audio playback error:', err));
}

export function playCopySound() {
  lastRequestAt = nowMs();
  void loadSounds()
    .then((mod) => mod.playCopySound())
    .catch((err) => console.error('Audio playback error:', err));
}

export function getAudioContext(): Promise<AudioContext> {
  return loadSounds().then((mod) => mod.getAudioContext());
}

export function getAudioAnalyser(): Promise<AnalyserNode | null> {
  return loadSounds().then((mod) => mod.getAudioAnalyser());
}

/**
 * The analyser only if a sound has already played — synchronous, never loads
 * the engine or creates an AudioContext. Use this from render loops/visualizers.
 */
export function peekAudioAnalyser(): AnalyserNode | null {
  return loadedModule ? loadedModule.peekAudioAnalyser() : null;
}

/** Mute/unmute without forcing the engine to load; applied when it loads. */
export function setSoundEnabled(enabled: boolean) {
  pendingEnabled = enabled;
  if (loadedModule) loadedModule.setSoundEnabled(enabled);
}

export function isSoundEnabled(): Promise<boolean> {
  return loadSounds().then((mod) => mod.isSoundEnabled());
}
