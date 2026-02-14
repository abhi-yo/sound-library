import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Read sound snippets from sounds.ts to generate registry sound files
// Each sound gets its own JSON file under public/registry/sounds/

const soundSnippets = {
  "hover-blip": `export function playHoverBlip() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(2400, now + 0.05);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.05);
}`,
  "hover-soft": `export function playHoverSoft() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(900, now);
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}`,
  "success-chime": `export function playSuccessChime() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(800, now);
  gain1.gain.setValueAtTime(0.25, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc1.connect(gain1).connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.15);
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1200, now + 0.1);
  gain2.gain.setValueAtTime(0.001, now);
  gain2.gain.setValueAtTime(0.25, now + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(now + 0.1);
  osc2.stop(now + 0.3);
}`,
  "success-bell": `export function playSuccessBell() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  [1000, 1250, 1500].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.08);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.setValueAtTime(0.2, now + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.15);
  });
}`,
  "error-buzz": `export function playErrorBuzz() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, now);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.setValueAtTime(0.001, now + 0.08);
  gain.gain.setValueAtTime(0.2, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}`,
  "error-beep": `export function playErrorBeep() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  [500, 350].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now + i * 0.12);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.setValueAtTime(0.15, now + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.1);
  });
}`,
  "notification-ping": `export function playNotificationPing() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1100, now);
  osc.frequency.exponentialRampToValueAtTime(1800, now + 0.05);
  osc.frequency.exponentialRampToValueAtTime(1100, now + 0.1);
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}`,
  "notification-subtle": `export function playNotificationSubtle() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(700, now);
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.12);
}`,
  swoosh: `export function playSwoosh() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const bufferSize = Math.floor(ctx.sampleRate * 0.4);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(350, now);
  lp.frequency.linearRampToValueAtTime(500, now + 0.15);
  lp.frequency.linearRampToValueAtTime(250, now + 0.38);
  lp.Q.setValueAtTime(0.5, now);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.001, now);
  noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.16);
  noiseGain.gain.linearRampToValueAtTime(0.05, now + 0.24);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
  noise.connect(lp).connect(noiseGain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.4);
}`,
  pop: `export function playPop() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(950, now);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}`,
  "slider-tick": `export function playSliderTick() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(5000, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.005);
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.01);
}`,
  "key-press": `export function playKeyPress() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  // Lubed Cherry MX Brown — deep muted thock, no click
  const v = () => 0.94 + Math.random() * 0.12;
  const drift = Math.random() * 0.0015;
  // Layer 1: bottom-out thock (main sound)
  const thud = ctx.createOscillator();
  const thudGain = ctx.createGain();
  const thudFilter = ctx.createBiquadFilter();
  thud.type = 'sine';
  thud.frequency.setValueAtTime(95 * v(), now + drift);
  thud.frequency.exponentialRampToValueAtTime(38, now + drift + 0.04);
  thudFilter.type = 'lowpass';
  thudFilter.frequency.setValueAtTime(300, now + drift);
  thudFilter.Q.setValueAtTime(0.5, now + drift);
  thudGain.gain.setValueAtTime(0.22, now + drift);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + drift + 0.055);
  thud.connect(thudFilter).connect(thudGain).connect(ctx.destination);
  thud.start(now + drift); thud.stop(now + drift + 0.06);
  // Layer 2: tactile bump (barely audible)
  const bump = ctx.createOscillator();
  const bumpGain = ctx.createGain();
  const bumpFilter = ctx.createBiquadFilter();
  bump.type = 'triangle';
  bump.frequency.setValueAtTime(420 * v(), now);
  bump.frequency.exponentialRampToValueAtTime(180, now + 0.008);
  bumpFilter.type = 'lowpass';
  bumpFilter.frequency.setValueAtTime(600, now);
  bumpGain.gain.setValueAtTime(0.03, now);
  bumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
  bump.connect(bumpFilter).connect(bumpGain).connect(ctx.destination);
  bump.start(now); bump.stop(now + 0.012);
  // Layer 3: dampened noise (soft low puff)
  const bufLen = Math.floor(ctx.sampleRate * 0.03);
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const noiseLp = ctx.createBiquadFilter();
  noiseLp.type = 'lowpass';
  noiseLp.frequency.setValueAtTime(400 * v(), now + drift);
  noiseLp.Q.setValueAtTime(0.3, now + drift);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.025, now + drift);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + drift + 0.025);
  noise.connect(noiseLp).connect(noiseGain).connect(ctx.destination);
  noise.start(now + drift); noise.stop(now + drift + 0.03);
}`,
};

// Generate individual JSON files for each sound
const outDir = resolve(__dirname, "..", "public", "registry", "sounds");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

for (const [name, code] of Object.entries(soundSnippets)) {
  const json = JSON.stringify(
    {
      name,
      type: "webaudio",
      files: [{ name: `${name}.ts`, content: code }],
    },
    null,
    2
  );
  writeFileSync(join(outDir, `${name}.json`), json + "\n");
}

// MP3 sounds (these reference files, not code)
const mp3Sounds = [
  {
    name: "button-click",
    file: "click1.mp3",
    code: `// Requires click1.mp3 in your public folder
const audio = new Audio('/click1.mp3');
audio.volume = 0.5;
audio.play();`,
  },
  {
    name: "button-click-secondary",
    file: "click2.mp3",
    code: `// Requires click2.mp3 in your public folder
const audio = new Audio('/click2.mp3');
audio.volume = 0.5;
audio.play();`,
  },
];

for (const sound of mp3Sounds) {
  const json = JSON.stringify(
    {
      name: sound.name,
      type: "mp3",
      files: [
        { name: `${sound.name}.ts`, content: `export function play() {\n${sound.code}\n}` },
      ],
      assets: [sound.file],
    },
    null,
    2
  );
  writeFileSync(join(outDir, `${sound.name}.json`), json + "\n");
}

console.log(`✅ Generated ${Object.keys(soundSnippets).length + mp3Sounds.length} sound registry files in public/registry/sounds/`);
