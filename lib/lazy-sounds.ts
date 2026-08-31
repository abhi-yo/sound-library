import { playSound as actualPlaySound } from './sounds';
import type { SoundName } from './sounds';

export function playSound(name: SoundName) {
  try {
    actualPlaySound(name);
  } catch (err) {
    console.error('Audio playback error:', err);
  }
}
