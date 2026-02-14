// UI Sound Effects - Procedurally generated audio for micro interactions
// Uses Web Audio API for real-time sound synthesis

export const SOUND_NAMES = [
  'button-click',
  'button-click-secondary',
  'hover-blip',
  'hover-soft',
  'success-chime',
  'success-bell',
  'error-buzz',
  'error-beep',
  'notification-ping',
  'notification-subtle',
  'swoosh',
  'pop',
  'slider-tick',
  'key-press',
] as const;

export type SoundName = (typeof SOUND_NAMES)[number];

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

// Respect prefers-reduced-motion (Web Interface Guidelines: Animation)
if (typeof window !== 'undefined') {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  soundEnabled = !mq.matches;
  mq.addEventListener('change', (e) => {
    soundEnabled = !e.matches;
  });
}

/** Programmatically enable/disable all sounds */
export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Sound synthesis definitions using Web Audio API
function synthesizeSound(ctx: AudioContext, name: SoundName) {
  const now = ctx.currentTime;

  switch (name) {
    case 'button-click': {
      // Play click1.mp3 from public folder
      const audio = new Audio('/click1.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
      break;
    }
    case 'button-click-secondary': {
      // Play click2.mp3 from public folder
      const audio = new Audio('/click2.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
      break;
    }
    case 'hover-blip': {
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
      break;
    }
    case 'hover-soft': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
      break;
    }
    case 'success-chime': {
      // Two-note ascending chime
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
      break;
    }
    case 'success-bell': {
      // Three-note ascending bell
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
      break;
    }
    case 'error-buzz': {
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
      break;
    }
    case 'error-beep': {
      // Two descending beeps
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
      break;
    }
    case 'notification-ping': {
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
      break;
    }
    case 'notification-subtle': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
      break;
    }
    case 'swoosh': {
      // Slow fan blade pass — low filtered noise, smooth fade in/out
      const bufferSize = Math.floor(ctx.sampleRate * 0.4);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Low-pass filter — keeps it rumbly and muffled like moving air
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(350, now);
      lp.frequency.linearRampToValueAtTime(500, now + 0.15);
      lp.frequency.linearRampToValueAtTime(250, now + 0.38);
      lp.Q.setValueAtTime(0.5, now);

      // Smooth bell-curve envelope — rises slowly, fades slowly
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.16);
      noiseGain.gain.linearRampToValueAtTime(0.05, now + 0.24);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      noise.connect(lp).connect(noiseGain).connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.4);
      break;
    }
    case 'pop': {
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
      break;
    }
    case 'slider-tick': {
      // Sharp, striking tick — short percussive click
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
      break;
    }
    case 'key-press': {
      // Lubed Cherry MX Brown — deep muted thock, no click
      // Per-key variation for natural typing feel
      const v = () => 0.94 + Math.random() * 0.12; // ±6% pitch drift
      const drift = Math.random() * 0.0015; // 0–1.5ms jitter

      // Layer 1: bottom-out thock (the main sound — stem hitting dampened housing)
      // Low sine thud, fast attack, moderate decay — this IS the brown sound
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
      thud.start(now + drift);
      thud.stop(now + drift + 0.06);

      // Layer 2: tactile bump (barely audible mid-range blip — the brown "bump")
      // Very quiet, short, no sharp attack
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
      bump.start(now);
      bump.stop(now + 0.012);

      // Layer 3: dampened noise (lube kills scratchiness — just a soft low puff)
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
      noise.start(now + drift);
      noise.stop(now + drift + 0.03);
      break;
    }
  }
}

// Helper function to play a sound
export function playSound(soundName: SoundName) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    synthesizeSound(ctx, soundName);
  } catch (err) {
    console.error('Failed to play sound:', err);
  }
}

// Hook for React components
export function useSoundEffects() {
  return {
    play: playSound,
  };
}
