# Sonix — UI Sound Effects Library

Micro UX audio for interactive web applications. Zero dependencies. Copy-paste ready.

[Live Demo](https://abhi-yo.github.io/sound-library) · [Browse Sounds](#available-sounds) · [CLI](#cli)

---

## Features

- **14 sounds** — clicks, hovers, success, error, notifications, transitions, and more
- **Zero dependencies** — every snippet is standalone Web Audio API code
- **Copy & paste** — hit the copy button on any card to get production-ready code
- **CLI** — `npx sonix add pop` to scaffold sounds into your project
- **Framework agnostic** — works with React, Vue, Svelte, vanilla JS, anything
- **Dark mode** — with cinematic circular reveal transition
- **`prefers-reduced-motion`** — respects user accessibility preferences

## Quick Start

### Web Audio (no files needed)

```js
const ctx = new AudioContext();
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(800, ctx.currentTime);
gain.gain.setValueAtTime(0.25, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
osc.connect(gain).connect(ctx.destination);
osc.start();
osc.stop(ctx.currentTime + 0.15);
```

### MP3 (for button clicks)

```js
const audio = new Audio('/click1.mp3');
audio.volume = 0.5;
audio.play();
```

### React Hook

```tsx
import { playSound } from './lib/sounds';

function MyButton() {
  return <button onClick={() => playSound('pop')}>Click</button>;
}
```

## CLI

Add sounds to any project with the CLI:

```bash
npx sonix list              # List all available sounds
npx sonix add pop           # Add a single sound
npx sonix add pop swoosh    # Add multiple sounds
```

Sounds are written to `lib/sounds/` as standalone files — no runtime dependency.

## Available Sounds

| Name | Category | Source | Use Case |
|------|----------|--------|----------|
| `button-click` | Interaction | MP3 | Primary button presses |
| `button-click-secondary` | Interaction | MP3 | Secondary / ghost buttons |
| `hover-blip` | Feedback | Web Audio | Hovering over interactive elements |
| `hover-soft` | Feedback | Web Audio | Subtle hover feedback |
| `success-chime` | Notification | Web Audio | Form submissions, saves |
| `success-bell` | Notification | Web Audio | Achievements, milestones |
| `error-buzz` | Alert | Web Audio | Validation errors, failed actions |
| `error-beep` | Alert | Web Audio | Warnings, blocked actions |
| `notification-ping` | Alert | Web Audio | New messages, alerts |
| `notification-subtle` | Alert | Web Audio | Background updates |
| `swoosh` | Transition | Web Audio | Page transitions, panel slides |
| `pop` | Interaction | Web Audio | Tooltips, popovers, reveals |
| `slider-tick` | Interaction | Web Audio | Sliders, range inputs |
| `key-press` | Interaction | Web Audio | Text inputs, keyboards |

## Accessibility

All sounds respect `prefers-reduced-motion: reduce`. When the user has requested reduced motion, sounds are automatically silenced.

To manually control sound:

```js
// Check user preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  playSound('pop');
}
```

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Registry

The project includes a shadcn-style registry at `public/registry/`. To rebuild:

```bash
node scripts/build-registry.mjs
```

## License

MIT — see [LICENSE](./LICENSE).
