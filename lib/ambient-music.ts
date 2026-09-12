'use client';

import { getAudioContext, masterGain } from './sounds';

let ambientGainNode: GainNode | null = null;
let isPlaying = false;
let generativeTimer: NodeJS.Timeout | null = null;
let activePadOscillators: { osc: OscillatorNode; osc2: OscillatorNode; gain: GainNode }[] = [];
let chordStep = 0;
let chordInterval: NodeJS.Timeout | null = null;
let pausedByVisibility = false;
let visibilityHooked = false;

// Ethereal, floating celestial chord voicings (Major 9th / Lydian)
const ETHEREAL_CHORDS = [
  [116.54, 174.61, 233.08, 293.66, 349.23, 440.00], // Ebmaj9/Bb: Bb2, F3, Bb3, D4, F4, A4
  [103.83, 155.56, 207.65, 261.63, 329.63, 415.30], // Abmaj9#11: Ab2, Eb3, Ab3, C4, E4, Ab4
  [87.31, 130.81, 174.61, 220.00, 261.63, 349.23],  // Fm9: F2, C3, F3, A3, C4, F4
  [138.59, 207.65, 277.18, 329.63, 415.30, 523.25], // Dbmaj9: Db3, Ab3, Db4, E4, Ab4, C5
];

// High crystalline stardust bell frequencies (Pentatonic/Lydian overtones)
const STARDUST_CHIMES = [
  1244.51, 1396.91, 1661.22, 1864.66, 2093.00, 2489.02, 2793.83,
]; // Eb6, F6, Ab6, Bb6, C7, Eb7, F7

type StateListener = (playing: boolean) => void;
const listeners = new Set<StateListener>();

function notifyListeners() {
  listeners.forEach((fn) => fn(isPlaying));
}

export function subscribeAmbientMusic(fn: StateListener) {
  listeners.add(fn);
  fn(isPlaying);
  return () => {
    listeners.delete(fn);
  };
}

export function isAmbientMusicActive(): boolean {
  return isPlaying;
}

function playStardustChime(ctx: AudioContext, destination: AudioNode) {
  if (!isPlaying) return;
  const now = ctx.currentTime;
  const freq = STARDUST_CHIMES[Math.floor(Math.random() * STARDUST_CHIMES.length)];

  const osc = ctx.createOscillator();
  const oscShimmer = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq * (1 + (Math.random() * 2 - 1) * 0.002), now);

  // Subtle airy octave shimmer
  oscShimmer.type = 'triangle';
  oscShimmer.frequency.setValueAtTime(freq * 1.5, now);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(freq, now);
  filter.Q.setValueAtTime(1.8, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.028, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

  osc.connect(filter);
  oscShimmer.connect(filter);
  filter.connect(gain).connect(destination);

  osc.start(now);
  oscShimmer.start(now);
  osc.stop(now + 3.5);
  oscShimmer.stop(now + 3.5);

  // Schedule next stardust chime randomly between 3.5s and 6.5s
  if (isPlaying) {
    const nextDelay = 3500 + Math.random() * 3000;
    generativeTimer = setTimeout(() => {
      playStardustChime(ctx, destination);
    }, nextDelay);
  }
}

function updateEtherealChord(ctx: AudioContext, destination: AudioNode) {
  if (!isPlaying) return;
  const now = ctx.currentTime;
  const chord = ETHEREAL_CHORDS[chordStep % ETHEREAL_CHORDS.length];
  chordStep++;

  // Fade out old oscillators gently over 3.2s
  activePadOscillators.forEach(({ osc, osc2, gain }) => {
    try {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 3.0);
      osc.stop(now + 3.3);
      osc2.stop(now + 3.3);
    } catch {
      // ignore
    }
  });
  activePadOscillators = [];

  // Create ethereal floating voices
  chord.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const hp = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.detune.setValueAtTime(-4 + idx * 1.5, now);

    // Warm second voice for lush dimension
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq, now);
    osc2.detune.setValueAtTime(5 - idx * 1.5, now);

    // Clean low-cut to keep sub frequencies pristine
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(80, now);

    // Breathing lowpass filter with slow undulating sweep
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, now);
    filter.frequency.linearRampToValueAtTime(1050, now + 4.0);
    filter.frequency.linearRampToValueAtTime(450, now + 8.0);
    filter.Q.setValueAtTime(0.7, now);

    // Soft silky 3.2s attack
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.016, now + 3.0);

    osc.connect(hp);
    osc2.connect(hp);
    hp.connect(filter).connect(gain).connect(destination);

    osc.start(now);
    osc2.start(now);

    activePadOscillators.push({ osc, osc2, gain });
  });
}


function clearAmbientTimers() {
  if (chordInterval) {
    clearInterval(chordInterval);
    chordInterval = null;
  }
  if (generativeTimer) {
    clearTimeout(generativeTimer);
    generativeTimer = null;
  }
}

function resumeAmbientTimers(ctx: AudioContext) {
  if (!isPlaying || !ambientGainNode || document.hidden) return;
  clearAmbientTimers();
  chordInterval = setInterval(() => {
    if (isPlaying && ambientGainNode && !document.hidden) {
      updateEtherealChord(ctx, ambientGainNode);
    }
  }, 7800);
  generativeTimer = setTimeout(() => {
    if (isPlaying && ambientGainNode && !document.hidden) {
      playStardustChime(ctx, ambientGainNode);
    }
  }, 1500);
}

function ensureAmbientVisibilityHook() {
  if (visibilityHooked || typeof document === 'undefined') return;
  visibilityHooked = true;
  document.addEventListener('visibilitychange', () => {
    if (!isPlaying || !ambientGainNode) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      if (document.hidden) {
        pausedByVisibility = true;
        clearAmbientTimers();
        ambientGainNode.gain.cancelScheduledValues(now);
        ambientGainNode.gain.setValueAtTime(Math.max(ambientGainNode.gain.value, 0.0001), now);
        ambientGainNode.gain.linearRampToValueAtTime(0.0001, now + 0.25);
      } else if (pausedByVisibility) {
        pausedByVisibility = false;
        ambientGainNode.gain.cancelScheduledValues(now);
        ambientGainNode.gain.setValueAtTime(0.0001, now);
        ambientGainNode.gain.linearRampToValueAtTime(0.65, now + 0.8);
        resumeAmbientTimers(ctx);
      }
    } catch {
      // ignore
    }
  });
}

export function startAmbientMusic() {
  if (isPlaying) return;
  // Strictly enforce that ambient background music only plays on the landing page
  if (typeof window !== 'undefined' && window.location.pathname !== '/') {
    return;
  }

  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (!ambientGainNode) {
      ambientGainNode = ctx.createGain();
      const output = masterGain || ctx.destination;
      ambientGainNode.connect(output);
    }

    isPlaying = true;
    const now = ctx.currentTime;
    ambientGainNode.gain.cancelScheduledValues(now);
    ambientGainNode.gain.setValueAtTime(0.0001, now);
    ambientGainNode.gain.linearRampToValueAtTime(0.65, now + 2.5); // Peaceful 2.5s fade-in

    chordStep = 0;
    ensureAmbientVisibilityHook();
    updateEtherealChord(ctx, ambientGainNode);
    resumeAmbientTimers(ctx);

    notifyListeners();
  } catch (err) {
    console.error('Ambient music startup error:', err);
  }
}

export function stopAmbientMusic() {
  if (!isPlaying) return;
  isPlaying = false;

  pausedByVisibility = false;
  clearAmbientTimers();

  if (ambientGainNode) {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      ambientGainNode.gain.cancelScheduledValues(now);
      ambientGainNode.gain.setValueAtTime(ambientGainNode.gain.value, now);
      ambientGainNode.gain.linearRampToValueAtTime(0.0001, now + 1.2);
    } catch {
      // ignore
    }
  }

  activePadOscillators.forEach(({ osc, osc2, gain }) => {
    try {
      gain.gain.linearRampToValueAtTime(0.0001, Date.now() / 1000 + 1.2);
      osc.stop(Date.now() / 1000 + 1.5);
      osc2.stop(Date.now() / 1000 + 1.5);
    } catch {
      // ignore
    }
  });
  activePadOscillators = [];

  notifyListeners();
}

export function toggleAmbientMusic() {
  if (isPlaying) {
    stopAmbientMusic();
  } else {
    startAmbientMusic();
  }
}

