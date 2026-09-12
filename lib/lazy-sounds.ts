import type { SoundName, PlaySoundOptions } from './sound-names';

export type { SoundName, PlaySoundOptions };
export { SOUND_NAMES } from './sound-names';

type SoundsModule = typeof import('./sounds');

let soundsModulePromise: Promise<SoundsModule> | null = null;

function loadSounds(): Promise<SoundsModule> {
  if (!soundsModulePromise) {
    soundsModulePromise = import('./sounds');
  }
  return soundsModulePromise;
}

/**
 * Thin client entry — dynamically imports playback implementation on first call.
 * Importing this module does not pull synthesis or SOUNDS_CODE into the bundle.
 */
export function playSound(name: SoundName, options?: PlaySoundOptions) {
  void loadSounds()
    .then((mod) => mod.playSound(name, options))
    .catch((err) => console.error('Audio playback error:', err));
}

export function playCopySound() {
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

export function setSoundEnabled(enabled: boolean) {
  void loadSounds()
    .then((mod) => mod.setSoundEnabled(enabled))
    .catch((err) => console.error('Audio control error:', err));
}

export function isSoundEnabled(): Promise<boolean> {
  return loadSounds().then((mod) => mod.isSoundEnabled());
}
