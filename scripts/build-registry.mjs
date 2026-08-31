import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const soundEntries = [
  {
    name: 'tap',
    category: 'Interaction',
    description: 'Capacitive micro tap',
    type: 'webaudio',
    code: `export function playTap() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1800, now);
  osc.frequency.exponentialRampToValueAtTime(700, now + 0.035);
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.04);
}`,
  },
  {
    name: 'thud',
    category: 'Interaction',
    description: 'Tactile lowpass thock',
    type: 'webaudio',
    code: `export function playThud() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(95, now);
  osc.frequency.exponentialRampToValueAtTime(36, now + 0.045);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(280, now);
  gain.gain.setValueAtTime(0.24, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  osc.connect(filter).connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.055);
}`,
  },
  {
    name: 'snap',
    category: 'Interaction',
    description: 'Haptic mechanical snap',
    type: 'webaudio',
    code: `export function playSnap() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(3400, now);
  osc.frequency.exponentialRampToValueAtTime(900, now + 0.02);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.028);
}`,
  },
  {
    name: 'pop',
    category: 'Interaction',
    description: 'Liquid bubble pitch drop',
    type: 'webaudio',
    code: `export function playPop() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.07);
  gain.gain.setValueAtTime(0.26, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.075);
}`,
  },
  {
    name: 'blip',
    category: 'Feedback',
    description: 'Ascending micro blip',
    type: 'webaudio',
    code: `export function playBlip() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1150, now);
  osc.frequency.exponentialRampToValueAtTime(2300, now + 0.045);
  gain.gain.setValueAtTime(0.14, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.05);
}`,
  },
  {
    name: 'hover-soft',
    category: 'Feedback',
    description: 'Gentle sine pulse',
    type: 'webaudio',
    code: `export function playHoverSoft() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(820, now);
  gain.gain.setValueAtTime(0.07, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.055);
}`,
  },
  {
    name: 'chime',
    category: 'Notification',
    description: 'Ascending two-note chime',
    type: 'webaudio',
    code: `export function playChime() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const n1 = ctx.createOscillator();
  const g1 = ctx.createGain();
  n1.type = 'sine';
  n1.frequency.setValueAtTime(660, now);
  g1.gain.setValueAtTime(0.2, now);
  g1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  n1.connect(g1).connect(ctx.destination);
  n1.start(now);
  n1.stop(now + 0.14);

  const n2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  n2.type = 'sine';
  n2.frequency.setValueAtTime(990, now + 0.09);
  g2.gain.setValueAtTime(0.001, now);
  g2.gain.setValueAtTime(0.22, now + 0.09);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
  n2.connect(g2).connect(ctx.destination);
  n2.start(now + 0.09);
  n2.stop(now + 0.28);
}`,
  },
  {
    name: 'bell',
    category: 'Notification',
    description: 'Triad chord bell',
    type: 'webaudio',
    code: `export function playBell() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  [880, 1100, 1320].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.07);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.setValueAtTime(0.16, now + i * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.18);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.07);
    osc.stop(now + i * 0.07 + 0.18);
  });
}`,
  },
  {
    name: 'ping',
    category: 'Notification',
    description: 'Resonant notification ping',
    type: 'webaudio',
    code: `export function playPing() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1050, now);
  osc.frequency.exponentialRampToValueAtTime(1750, now + 0.04);
  osc.frequency.exponentialRampToValueAtTime(1050, now + 0.12);
  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.14);
}`,
  },
  {
    name: 'tick',
    category: 'Interaction',
    description: 'Percussive dial tick',
    type: 'webaudio',
    code: `export function playTick() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(4800, now);
  osc.frequency.exponentialRampToValueAtTime(1100, now + 0.006);
  gain.gain.setValueAtTime(0.09, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.009);
}`,
  },
  {
    name: 'toggle-on',
    category: 'Interaction',
    description: 'Switch activate step',
    type: 'webaudio',
    code: `export function playToggleOn() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(820, now + 0.06);
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.075);
}`,
  },
  {
    name: 'toggle-off',
    category: 'Interaction',
    description: 'Switch deactivate step',
    type: 'webaudio',
    code: `export function playToggleOff() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(820, now);
  osc.frequency.exponentialRampToValueAtTime(520, now + 0.06);
  gain.gain.setValueAtTime(0.16, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.075);
}`,
  },
  {
    name: 'lock',
    category: 'System',
    description: 'Mechanical latch lock',
    type: 'webaudio',
    code: `export function playLock() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const o1 = ctx.createOscillator();
  const g1 = ctx.createGain();
  o1.type = 'sine';
  o1.frequency.setValueAtTime(320, now);
  o1.frequency.exponentialRampToValueAtTime(120, now + 0.05);
  g1.gain.setValueAtTime(0.2, now);
  g1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  o1.connect(g1).connect(ctx.destination);
  o1.start(now);
  o1.stop(now + 0.055);

  const o2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  o2.type = 'square';
  o2.frequency.setValueAtTime(1800, now + 0.02);
  g2.gain.setValueAtTime(0.001, now);
  g2.gain.setValueAtTime(0.08, now + 0.02);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  o2.connect(g2).connect(ctx.destination);
  o2.start(now + 0.02);
  o2.stop(now + 0.065);
}`,
  },
  {
    name: 'unlock',
    category: 'System',
    description: 'Mechanical unlatch',
    type: 'webaudio',
    code: `export function playUnlock() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.05);
}`,
  },
  {
    name: 'swish',
    category: 'Navigation',
    description: 'Filtered noise swish',
    type: 'webaudio',
    code: `export function playSwish() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const size = Math.floor(ctx.sampleRate * 0.2);
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(400, now);
  lp.frequency.linearRampToValueAtTime(650, now + 0.08);
  lp.frequency.linearRampToValueAtTime(280, now + 0.18);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.06, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
  src.connect(lp).connect(gain).connect(ctx.destination);
  src.start(now);
  src.stop(now + 0.2);
}`,
  },
  {
    name: 'whoosh',
    category: 'Navigation',
    description: 'Spatial transition whoosh',
    type: 'webaudio',
    code: `export function playWhoosh() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const size = Math.floor(ctx.sampleRate * 0.38);
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(320, now);
  lp.frequency.linearRampToValueAtTime(520, now + 0.15);
  lp.frequency.linearRampToValueAtTime(220, now + 0.35);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.07, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
  src.connect(lp).connect(gain).connect(ctx.destination);
  src.start(now);
  src.stop(now + 0.38);
}`,
  },
  {
    name: 'shutter',
    category: 'Interaction',
    description: 'Camera shutter click',
    type: 'webaudio',
    code: `export function playShutter() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const o1 = ctx.createOscillator();
  const g1 = ctx.createGain();
  o1.type = 'square';
  o1.frequency.setValueAtTime(1400, now);
  g1.gain.setValueAtTime(0.12, now);
  g1.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
  o1.connect(g1).connect(ctx.destination);
  o1.start(now);
  o1.stop(now + 0.03);

  const o2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  o2.type = 'triangle';
  o2.frequency.setValueAtTime(800, now + 0.035);
  g2.gain.setValueAtTime(0.001, now);
  g2.gain.setValueAtTime(0.15, now + 0.035);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
  o2.connect(g2).connect(ctx.destination);
  o2.start(now + 0.035);
  o2.stop(now + 0.08);
}`,
  },
  {
    name: 'keystroke',
    category: 'Interaction',
    description: 'Mechanical keyboard thock',
    type: 'webaudio',
    code: `export function playKeystroke() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const v = 0.96 + Math.random() * 0.08;
  const thud = ctx.createOscillator();
  const thudGain = ctx.createGain();
  const thudFilter = ctx.createBiquadFilter();
  thud.type = 'sine';
  thud.frequency.setValueAtTime(95 * v, now);
  thud.frequency.exponentialRampToValueAtTime(38, now + 0.04);
  thudFilter.type = 'lowpass';
  thudFilter.frequency.setValueAtTime(300, now);
  thudGain.gain.setValueAtTime(0.22, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
  thud.connect(thudFilter).connect(thudGain).connect(ctx.destination);
  thud.start(now);
  thud.stop(now + 0.06);
}`,
  },
  {
    name: 'pulse',
    category: 'System',
    description: 'Sub-bass haptic pulse',
    type: 'webaudio',
    code: `export function playPulse() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(65, now);
  gain.gain.setValueAtTime(0.24, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.095);
}`,
  },
  {
    name: 'error',
    category: 'System',
    description: 'Dissonant alert tone',
    type: 'webaudio',
    code: `export function playError() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  [380, 280].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now + idx * 0.09);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.setValueAtTime(0.12, now + idx * 0.09);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + idx * 0.09);
    osc.stop(now + idx * 0.09 + 0.085);
  });
}`,
  },
];

const outDir = resolve(__dirname, '..', 'public', 'registry', 'sounds');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

for (const sound of soundEntries) {
  const json = JSON.stringify(
    {
      name: sound.name,
      type: sound.type,
      category: sound.category,
      description: sound.description,
      files: [{ name: `${sound.name}.ts`, content: sound.code }],
    },
    null,
    2
  );
  writeFileSync(join(outDir, `${sound.name}.json`), json + '\n');
}

const indexJson = JSON.stringify(
  {
    name: 'bloub-audio',
    version: '1.0.0',
    sounds: soundEntries.map((s) => ({
      name: s.name,
      category: s.category,
      description: s.description,
      type: s.type,
    })),
  },
  null,
  2
);

writeFileSync(resolve(__dirname, '..', 'public', 'registry', 'index.json'), indexJson + '\n');

console.log(`Generated ${soundEntries.length} sound registry entries.`);
