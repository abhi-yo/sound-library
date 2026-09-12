# sound-library

Procedural micro UX sounds for the web. **Zero runtime dependencies.** Everything is synthesized in the browser with the Web Audio API — no audio files, no CDN assets.

Also known as **Sound Bits** in the site UI.

[npm](https://www.npmjs.com/package/sound-library) · [GitHub](https://github.com/abhi-yo/sound-library)

---

## Install

```bash
npm i sound-library
# pnpm add sound-library / yarn add sound-library / bun add sound-library
```

### Agent skill ([skills.sh](https://skills.sh))

```bash
npx skills add abhi-yo/sound-library
```

## Quick start

```ts
import { playSound, playTap } from 'sound-library';

// Only from a user gesture (click / pointerdown / keydown)
playSound('pop');
playTap();
playSound('chime', { volume: 0.6 });
```

### React / Next.js

```tsx
'use client';

import { playSound } from 'sound-library';
import { SoundButton, useSound } from 'sound-library/react';

export function Example() {
  const { play } = useSound('tap');

  return (
    <>
      <button type="button" onClick={() => playSound('chime')}>
        Chime
      </button>
      <SoundButton sound="tap">Tap</SoundButton>
      <button type="button" onClick={() => play()}>
        Tap via hook
      </button>
    </>
  );
}
```

## CLI

Scaffold standalone sound files into your project (no runtime dependency on this package):

```bash
npx sound-library list
npx sound-library add tap chime pop
npx sound-library add all
npx sound-library init
```

`sound-bits` is an alias for the same CLI:

```bash
npx sound-bits add tap
```

## API

| Export | From | Description |
| --- | --- | --- |
| `playSound(name, options?)` | `sound-library` | Play a named procedural sound |
| `playTap`, `playPop`, `playSuccess`, … | `sound-library` | Convenience wrappers per sound |
| `playCopySound()` | `sound-library` | Unlock cue for copy buttons |
| `setSoundEnabled` / `isSoundEnabled` | `sound-library` | Mute / unmute |
| `SOUND_NAMES` / `SOUNDS_METADATA` | `sound-library` | Typed ids + titles / categories |
| `getAudioContext` / `getAudioAnalyser` | `sound-library` | Shared Web Audio graph |
| `SoundButton` / `useSound` | `sound-library/react` | React helpers |

## Sound mapping cheatsheet

| UI moment | Try |
| --- | --- |
| Button / list select | `tap`, `button-click`, `haptic-pop`, `select` |
| Toggle / switch | `toggle-on`, `toggle-off` |
| Hover / focus | `blip`, `hover-soft` |
| Copy / unlock | `playCopySound()`, `unlock` |
| Success / save | `success`, `success-fanfare`, `chime` |
| Error / validation | `error`, `warning` |
| Delete / remove | `delete` |
| Send / submit | `send` |
| Soft notification | `notification`, `bell`, `ping` |
| Swipe / drop | `swipe`, `drop` |

There are **60+** named sounds across interaction, feedback, notification, navigation, system, and essentials.

## Rules of thumb

- Call audio only from user gestures — never on mount.
- Auto-mutes when `prefers-reduced-motion: reduce`.
- Same-sound de-dupe is ~35ms; wire one fitting sound per control, not a sound on every hover.

## Local site (docs + demos)

```bash
pnpm install
pnpm dev
# http://localhost:3000
```

## License

MIT · Contact: [akshatsing11@gmail.com](mailto:akshatsing11@gmail.com)
