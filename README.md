# sound-library

Procedural micro UX sound effects for the web. **Zero runtime dependencies.** Synthesized with the Web Audio API.

Also known as **Sound Bits** in the docs/UI.

[GitHub](https://github.com/abhi-yo/sound-library) · [Live demo](https://abhi-yo.github.io/sound-library)

---

## Install

### Library


```bash
npm install sound-library
# or
pnpm add sound-library
# or
yarn add sound-library
# or
bun add sound-library
```

### Agent skill ([skills.sh](https://skills.sh))

```bash
npx skills add abhi-yo/sound-library
```

## Quick start

```ts
import { playSound, playTap } from 'sound-library';

playSound('pop');
playTap();
```

### React

```tsx
'use client';

import { playSound } from 'sound-library';
import { SoundButton } from 'sound-library/react';

export function Example() {
  return (
    <>
      <button onClick={() => playSound('chime')}>Chime</button>
      <SoundButton sound="tap">Tap</SoundButton>
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

| Export | Description |
| --- | --- |
| `playSound(name, options?)` | Play a named procedural sound |
| `playTap`, `playPop`, … | Convenience wrappers for each sound |
| `useSound(name)` | React-friendly trigger helper |
| `setSoundEnabled` / `isSoundEnabled` | Mute / unmute (also respects `prefers-reduced-motion`) |
| `getAudioContext` / `getAudioAnalyser` | Shared Web Audio graph |
| `SOUNDS_METADATA` | Titles, categories, durations |
| `SOUND_NAMES` | Typed list of sound ids |

React entry: `sound-library/react` → `SoundButton`, `useSound`.

## Accessibility

Playback respects `prefers-reduced-motion: reduce` and stays silent when it matches.

## License

MIT
