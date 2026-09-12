---
name: sound-library
description: >-
  Use when adding micro UX / UI sound effects to a web app with sound-library
  (Sound Bits) — install, playSound, React helpers, CLI scaffolding, mute/volume,
  or mapping sounds to buttons, forms, toasts, and navigation.
---

# sound-library (Sound Bits)

Procedural micro UX sounds via the Web Audio API. Zero runtime dependencies. Package: `sound-library` on npm.

## Install

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

const click = useSound('tap');
<button onClick={() => click.play()}>Go</button>
```

Next.js App Router: keep in `'use client'` files only.

## Sound mapping cheatsheet

| Moment | Sound ids |
| --- | --- |
| Primary click | `tap`, `button-click`, `haptic-pop` |
| Destructive | `thud`, `sub-kick` |
| Toggle | `toggle-on`, `toggle-off` |
| Hover | `blip`, `hover-soft`, `button-hover` (keep volume low) |
| Success | `chime`, `bell`, `ping`, `success-fanfare` |
| Error | `error` |
| Copy | `unlock` / `playCopySound()` |
| Transition | `swish`, `whoosh`, `woosh-deep` |
| Stepper / dial | `tick` |

## Customization

```ts
playSound('tap', { volume: 0.35 });
setSoundEnabled(userPref);
const ctx = getAudioContext();
masterGain?.gain.setTargetAtTime(0.5, ctx.currentTime, 0.01);
```

Custom cue sharing the library graph:

```ts
import { getAudioContext } from 'sound-library';
export function playBrand() {
  const ctx = getAudioContext();
  // your oscillators…
}
```

## Agent checklist

1. Prefer `sound-library` package unless the user wants zero deps → then CLI `add`.
2. Wire sounds in event handlers, not `useEffect` mount.
3. Offer a mute setting; respect reduced motion.
4. Match sound to UI intent using the cheatsheet.
5. Do not invent sound names — use `SOUND_NAMES` / `npx sound-library list`.
