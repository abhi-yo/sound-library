# sound-library — agent instructions

# sound-library (Sound Bits)

Procedural micro UX sounds via the Web Audio API. Zero runtime dependencies. Package: [`sound-library`](https://www.npmjs.com/package/sound-library) on npm.

Install this skill (any supported agent):

```bash
npx skills add abhi-yo/sound-library
```

## Install the library

```bash
npm i sound-library
# pnpm add sound-library / yarn add sound-library / bun add sound-library
```

React helpers (optional peer `react >= 18`):

```ts
import { playSound } from 'sound-library';
import { SoundButton, useSound } from 'sound-library/react';
```

CLI (scaffold standalone files, no runtime dep):

```bash
npx sound-library list
npx sound-library add tap chime pop
npx sound-library add all
npx sound-library init
```

## Core API

```ts
import {
  playSound,
  playCopySound,
  setSoundEnabled,
  isSoundEnabled,
  getAudioContext,
  getAudioAnalyser,
  masterGain,
  SOUND_NAMES,
  SOUNDS_METADATA,
  type SoundName,
  type PlaySoundOptions,
} from 'sound-library';

playSound('tap');
playSound('chime', { volume: 0.6 });
playCopySound(); // unlock cue for copy buttons
setSoundEnabled(false);
```

Rules:
- Only call from user gestures (`click` / `pointerdown` / `keydown`) — not on mount.
- Auto-mutes when `prefers-reduced-motion: reduce`.
- Same-sound de-dupe ~35ms; copy unlock suppresses conflicting plays briefly.

## React

```tsx
'use client';
import { SoundButton } from 'sound-library/react';
import { useSound, playSound } from 'sound-library';

<SoundButton sound="chime">Notify</SoundButton>

const { play } = useSound('tap');
<button onClick={() => play()}>Go</button>
```

Next.js App Router: keep in `'use client'` files only.

## Sound mapping cheatsheet

| UI moment | Sound ids |
| --- | --- |
| Button / list select | `tap`, `button-click`, `haptic-pop` |
| Primary confirm | `thud`, `sub-kick`, `success-fanfare` |
| Toggle / checkbox | `toggle-on`, `toggle-off`, `snap` |
| Hover / focus | `blip`, `hover-soft` |
| Toast / success | `chime`, `bell`, `crystal`, `shimmer` |
| Error / validation | `error` |
| Nav / drawer / sheet | `swish`, `whoosh`, `woosh-deep`, `glissando` |
| Copy / unlock | `playCopySound()`, `unlock` |
| Playful / gamey | `coin`, `pop`, `bloop`, `jump-boing` |

## Agent checklist

1. Prefer `npm i sound-library` (or `npx sound-library add <name>` to scaffold files).
2. Use `playSound('…')` / `SoundButton` / `useSound` — do **not** rewrite Web Audio synthesis unless asked.
3. Wire the sound onto the **exact** control(s) the user named.
4. Gesture-only playback; respect mute / reduced motion.
5. Do not add a demo page unless asked.
