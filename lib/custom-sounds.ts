// Example: Using custom audio files with UIfx library
// Install: npm install uifx

// This is an optional extension - the main sounds.ts uses Web Audio API synthesis
// Use this approach if you want to play custom audio files instead

/**
 * Basic UIfx setup example:
 * 
 * import UIfx from 'uifx';
 * import tickMp3 from './my-sounds/beep.mp3';
 * 
 * const tick = new UIfx(
 *   tickMp3,
 *   {
 *     volume: 0.9,      // value must be between 0.0 ⇔ 1.0
 *     throttleMs: 50    // prevent spam-clicking
 *   }
 * );
 * 
 * // Usage examples:
 * tick.play()           // plays at default volume (0.9)
 * tick.play(0.5)        // temporarily plays at 0.5 volume
 * tick.setVolume(0.2).play()  // permanently changes volume to 0.2
 */

/**
 * Example: Slider/Range input with sound
 * 
 * // Vanilla JS
 * <input onchange="tick.play()" type="range" />
 * 
 * // React
 * <input onChange={tick.play} type="range" />
 * 
 * // React with Slider component
 * <Slider onValueChange={() => tick.play()} />
 */

/**
 * Example: Creating multiple custom sounds
 * 
 * import UIfx from 'uifx';
 * import clickMp3 from './sounds/click.mp3';
 * import successMp3 from './sounds/success.mp3';
 * import errorMp3 from './sounds/error.mp3';
 * 
 * export const customSounds = {
 *   click: new UIfx(clickMp3, { volume: 0.5, throttleMs: 100 }),
 *   success: new UIfx(successMp3, { volume: 0.7, throttleMs: 200 }),
 *   error: new UIfx(errorMp3, { volume: 0.6, throttleMs: 200 }),
 * };
 * 
 * // Usage:
 * customSounds.click.play();
 * customSounds.success.play(0.8); // temporary volume override
 */

/**
 * Example: Combining with synthesized sounds
 * 
 * import { playSound } from '@/lib/sounds';
 * import { customSounds } from '@/lib/custom-sounds';
 * 
 * // Use synthesized sound (no files needed)
 * playSound('button-click');
 * 
 * // Use custom audio file
 * customSounds.click.play();
 */

export const customSoundsExample = `
// Install UIfx first
// npm install uifx

import UIfx from 'uifx';
import tickMp3 from './my-sounds/beep.mp3';

const tick = new UIfx(
  tickMp3,
  {
    volume: 0.9,
    throttleMs: 50
  }
);

// Play with default volume
tick.play();

// Play with temporary volume override
tick.play(0.5);

// Permanently change volume
tick.setVolume(0.2).play();
`;
