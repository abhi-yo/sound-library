import type { SoundName } from './sound-names';
import { masterGain } from './sounds';

export function getMasterOutput(ctx: AudioContext): AudioNode {
  return masterGain || ctx.destination;
}

/** Sound synthesis definitions using native Web Audio API */
export function synthesize(ctx: AudioContext, name: SoundName, volume?: number) {
  const now = ctx.currentTime;
  const masterOut = getMasterOutput(ctx);
  const out =
    volume !== undefined && volume !== 1
      ? (() => {
          const vNode = ctx.createGain();
          vNode.gain.setValueAtTime(Math.max(0, Math.min(2, volume)), now);
          vNode.connect(masterOut);
          return vNode;
        })()
      : masterOut;
  const jitter = (range = 0.04) => 1 + (Math.random() * 2 - 1) * range;

  switch (name) {
    case 'tap': {
      // Clean micro capacitive tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800 * jitter(0.03), now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.035);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.04);
      break;
    }

    case 'thud': {
      // Deep dampened tactile thock
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(95 * jitter(0.02), now);
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.045);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(filter).connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.055);
      break;
    }

    case 'snap': {
      // Crisp finger-snap — sharp noise transient with mid-high resonance
      const bufSize = Math.floor(ctx.sampleRate * 0.025);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(3200 * jitter(0.05), now);
      bp.Q.setValueAtTime(2.5, now);

      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(1200, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      noise.connect(bp).connect(hp).connect(gain).connect(out);
      noise.start(now);
      noise.stop(now + 0.025);
      break;
    }

    case 'pop': {
      // Bubbly pop — quick sine burst with punchy mid-range drop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(720 * jitter(0.03), now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.04);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }

    case 'blip': {
      // Ascending crisp hover blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1150 * jitter(0.02), now);
      osc.frequency.exponentialRampToValueAtTime(2300, now + 0.045);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }

    case 'hover-soft': {
      // Low-energy gentle sine blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(820 * jitter(0.02), now);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.055);
      break;
    }

    case 'chime': {
      // Two-note ascending major harmonic chime
      const note1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      note1.type = 'sine';
      note1.frequency.setValueAtTime(660, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      note1.connect(gain1).connect(out);
      note1.start(now);
      note1.stop(now + 0.14);

      const note2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      note2.type = 'sine';
      note2.frequency.setValueAtTime(990, now + 0.09);
      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.22, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      note2.connect(gain2).connect(out);
      note2.start(now + 0.09);
      note2.stop(now + 0.28);
      break;
    }

    case 'bell': {
      // Resonant 3-tone acoustic chord
      [880, 1100, 1320].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.065, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.18);
        osc.connect(gain).connect(out);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.18);
      });
      break;
    }

    case 'ping': {
      // Bell-curved frequency resonance
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1050, now);
      osc.frequency.exponentialRampToValueAtTime(1750, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(1050, now + 0.12);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.14);
      break;
    }

    case 'tick': {
      // Micro dial tick (8ms)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(4800, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.006);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.009);
      break;
    }

    case 'toggle-on': {
      // Positive switch step (520Hz -> 820Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.06);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.075);
      break;
    }

    case 'toggle-off': {
      // Negative switch step (820Hz -> 520Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.06);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.075);
      break;
    }

    case 'lock': {
      // Mechanical deadbolt latch — two rapid metallic noise clicks
      // Click 1: bolt sliding
      const buf1Size = Math.floor(ctx.sampleRate * 0.02);
      const buf1 = ctx.createBuffer(1, buf1Size, ctx.sampleRate);
      const d1 = buf1.getChannelData(0);
      for (let i = 0; i < buf1Size; i++) d1[i] = Math.random() * 2 - 1;
      const n1 = ctx.createBufferSource();
      n1.buffer = buf1;
      const bp1 = ctx.createBiquadFilter();
      bp1.type = 'bandpass';
      bp1.frequency.setValueAtTime(2800, now);
      bp1.Q.setValueAtTime(2, now);
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.18, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
      n1.connect(bp1).connect(g1).connect(out);
      n1.start(now);
      n1.stop(now + 0.02);

      // Click 2: bolt seating
      const buf2Size = Math.floor(ctx.sampleRate * 0.015);
      const buf2 = ctx.createBuffer(1, buf2Size, ctx.sampleRate);
      const d2 = buf2.getChannelData(0);
      for (let i = 0; i < buf2Size; i++) d2[i] = Math.random() * 2 - 1;
      const n2 = ctx.createBufferSource();
      n2.buffer = buf2;
      const bp2 = ctx.createBiquadFilter();
      bp2.type = 'bandpass';
      bp2.frequency.setValueAtTime(1800, now + 0.025);
      bp2.Q.setValueAtTime(3, now + 0.025);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.001, now);
      g2.gain.setValueAtTime(0.22, now + 0.025);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      n2.connect(bp2).connect(g2).connect(out);
      n2.start(now + 0.025);
      n2.stop(now + 0.045);
      break;
    }

    case 'unlock': {
      // Mechanical deadbolt unlatch — reverse of lock (lower seating click, then higher sliding click)
      // Click 1: bolt unseating
      const buf1Size = Math.floor(ctx.sampleRate * 0.015);
      const buf1 = ctx.createBuffer(1, buf1Size, ctx.sampleRate);
      const d1 = buf1.getChannelData(0);
      for (let i = 0; i < buf1Size; i++) d1[i] = Math.random() * 2 - 1;
      const n1 = ctx.createBufferSource();
      n1.buffer = buf1;
      const bp1 = ctx.createBiquadFilter();
      bp1.type = 'bandpass';
      bp1.frequency.setValueAtTime(1800, now);
      bp1.Q.setValueAtTime(3, now);
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.22, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
      n1.connect(bp1).connect(g1).connect(out);
      n1.start(now);
      n1.stop(now + 0.015);

      // Click 2: bolt sliding back
      const buf2Size = Math.floor(ctx.sampleRate * 0.02);
      const buf2 = ctx.createBuffer(1, buf2Size, ctx.sampleRate);
      const d2 = buf2.getChannelData(0);
      for (let i = 0; i < buf2Size; i++) d2[i] = Math.random() * 2 - 1;
      const n2 = ctx.createBufferSource();
      n2.buffer = buf2;
      const bp2 = ctx.createBiquadFilter();
      bp2.type = 'bandpass';
      bp2.frequency.setValueAtTime(2800, now + 0.02);
      bp2.Q.setValueAtTime(2, now + 0.02);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.001, now);
      g2.gain.setValueAtTime(0.18, now + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      n2.connect(bp2).connect(g2).connect(out);
      n2.start(now + 0.02);
      n2.stop(now + 0.04);
      break;
    }

    case 'swish': {
      // Short filtered friction air swish (200ms)
      const bufSize = Math.floor(ctx.sampleRate * 0.2);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(400, now);
      lp.frequency.linearRampToValueAtTime(650, now + 0.08);
      lp.frequency.linearRampToValueAtTime(280, now + 0.18);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

      noise.connect(lp).connect(gain).connect(out);
      noise.start(now);
      noise.stop(now + 0.2);
      break;
    }

    case 'whoosh': {
      // Atmospheric transition whoosh (380ms)
      const bufSize = Math.floor(ctx.sampleRate * 0.38);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(320, now);
      lp.frequency.linearRampToValueAtTime(520, now + 0.15);
      lp.frequency.linearRampToValueAtTime(220, now + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

      noise.connect(lp).connect(gain).connect(out);
      noise.start(now);
      noise.stop(now + 0.38);
      break;
    }

    case 'shutter': {
      // Authentic mechanical camera shutter — crisp initial mirror lift followed by a snappy mechanical curtain clap ("cha-clap")
      // 1. Initial mirror lift & front curtain (t = 0)
      const buf1Size = Math.floor(ctx.sampleRate * 0.016);
      const buf1 = ctx.createBuffer(1, buf1Size, ctx.sampleRate);
      const d1 = buf1.getChannelData(0);
      for (let i = 0; i < buf1Size; i++) d1[i] = Math.random() * 2 - 1;
      const n1 = ctx.createBufferSource();
      n1.buffer = buf1;
      const bp1 = ctx.createBiquadFilter();
      bp1.type = 'bandpass';
      bp1.frequency.setValueAtTime(3800, now);
      bp1.Q.setValueAtTime(2.0, now);
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.24, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.014);
      n1.connect(bp1).connect(g1).connect(out);
      n1.start(now);
      n1.stop(now + 0.016);

      // 1b. Mirror lift body click
      const osc1 = ctx.createOscillator();
      const oscGain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1100, now);
      osc1.frequency.exponentialRampToValueAtTime(450, now + 0.012);
      oscGain1.gain.setValueAtTime(0.12, now);
      oscGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.014);
      osc1.connect(oscGain1).connect(out);
      osc1.start(now);
      osc1.stop(now + 0.016);

      // 2. Main Shutter Curtain Clap & Mirror Return (t = +38ms)
      const delay = 0.038;
      const buf2Size = Math.floor(ctx.sampleRate * 0.028);
      const buf2 = ctx.createBuffer(1, buf2Size, ctx.sampleRate);
      const d2 = buf2.getChannelData(0);
      for (let i = 0; i < buf2Size; i++) d2[i] = Math.random() * 2 - 1;
      const n2 = ctx.createBufferSource();
      n2.buffer = buf2;
      const bp2 = ctx.createBiquadFilter();
      bp2.type = 'bandpass';
      bp2.frequency.setValueAtTime(2600, now + delay);
      bp2.Q.setValueAtTime(1.6, now + delay);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.001, now);
      g2.gain.setValueAtTime(0.38, now + delay);
      g2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.022);
      n2.connect(bp2).connect(g2).connect(out);
      n2.start(now + delay);
      n2.stop(now + delay + 0.028);

      // 2b. Secondary blade snap (t = +43ms)
      const buf3Size = Math.floor(ctx.sampleRate * 0.012);
      const buf3 = ctx.createBuffer(1, buf3Size, ctx.sampleRate);
      const d3 = buf3.getChannelData(0);
      for (let i = 0; i < buf3Size; i++) d3[i] = Math.random() * 2 - 1;
      const n3 = ctx.createBufferSource();
      n3.buffer = buf3;
      const hp3 = ctx.createBiquadFilter();
      hp3.type = 'highpass';
      hp3.frequency.setValueAtTime(3200, now + delay + 0.005);
      const g3 = ctx.createGain();
      g3.gain.setValueAtTime(0.001, now);
      g3.gain.setValueAtTime(0.26, now + delay + 0.005);
      g3.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.016);
      n3.connect(hp3).connect(g3).connect(out);
      n3.start(now + delay + 0.005);
      n3.stop(now + delay + 0.018);

      // 2c. Damped camera chamber slap resonance
      const osc2 = ctx.createOscillator();
      const oscGain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(580, now + delay);
      osc2.frequency.exponentialRampToValueAtTime(260, now + delay + 0.018);
      oscGain2.gain.setValueAtTime(0.001, now);
      oscGain2.gain.setValueAtTime(0.18, now + delay);
      oscGain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.02);
      osc2.connect(oscGain2).connect(out);
      osc2.start(now + delay);
      osc2.stop(now + delay + 0.022);
      break;
    }

    case 'keystroke': {
      // Cherry MX Red linear bottom-out clack — crisp plastic impact, no bass
      const bufSize = Math.floor(ctx.sampleRate * 0.018);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass to isolate the plasticky clack range
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(4200 * jitter(0.06), now);
      bp.Q.setValueAtTime(1.8, now);

      // Highpass to kill any remaining low end
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(1800, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.014);

      noise.connect(bp).connect(hp).connect(gain).connect(out);
      noise.start(now);
      noise.stop(now + 0.018);
      break;
    }

    case 'pulse': {
      // Sub-bass tactile confirmation pulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.095);
      break;
    }

    case 'error': {
      // Dissonant two-tone warning
      [380, 280].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.12, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.08);
        osc.connect(gain).connect(out);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.085);
      });
      break;
    }

    case 'glissando': {
      // Elegant swipe
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.17);
      break;
    }

    case 'shimmer': {
      // Magical hover
      const freqs = [1200, 1600, 2100, 2800];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.06, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.2);
        osc.connect(gain).connect(out);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.25);
      });
      break;
    }

    case 'bloop': {
      // Cute hollow drop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.09);
      break;
    }

    case 'sub-kick': {
      // Deep satisfying select
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.16);
      break;
    }

    case 'crystal': {
      // Glassy notification
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.45);
      break;
    }

    case 'woosh-deep': {
      // Heavy spatial transition
      const bufSize = Math.floor(ctx.sampleRate * 0.4);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(100, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      noise.connect(filter).connect(gain).connect(out);
      noise.start(now);
      noise.stop(now + 0.45);
      break;
    }

    case 'zap': {
      // Crisp laser interaction
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(filter).connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.11);
      break;
    }

    case 'spring': {
      // Springy boing — rapid oscillating frequency bounce that decays
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      // Rapid pitch oscillation simulating a spring bouncing
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.03);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.07);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(550, now + 0.14);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.17);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.2);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.25);
      break;
    }

    case 'bubble': {
      // Multiple liquid pops
      [400, 600, 800].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.06 + 0.04);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.2, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.06);
        osc.connect(gain).connect(out);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.1);
      });
      break;
    }

    case 'haptic-pop': {
      // Sharp haptic micro-interaction
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.02);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.035);
      break;
    }

    case 'coin': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(988, now); // B5
      osc.frequency.setValueAtTime(1318.5, now + 0.08); // E6
      gain.gain.setValueAtTime(0.085, now);
      gain.gain.setValueAtTime(0.085, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.35);
      break;
    }

    case 'power-up': {
      const freqs = [440, 554.37, 659.25, 880];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.2);
        osc.connect(gain).connect(out);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.25);
      });
      break;
    }

    case 'power-down': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.45);
      break;
    }

    case 'magic-sparkle': {
      for (let i = 0; i < 8; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1500 + Math.random() * 2000, now + i * 0.05);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.1, now + i * 0.05 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.15);
        osc.connect(gain).connect(out);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.2);
      }
      break;
    }

    case 'jump-boing': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.35);
      break;
    }

    case 'arcade-pew': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    }

    case 'heartbeat': {
      [0, 0.2].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(50, now + delay);
        osc.frequency.exponentialRampToValueAtTime(30, now + delay + 0.1);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.4, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);
        osc.connect(gain).connect(out);
        osc.start(now + delay);
        osc.stop(now + delay + 0.2);
      });
      break;
    }

    case 'sonar-ping': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 1.25);
      break;
    }

    case 'typewriter-key': {
      const bufSize = Math.floor(ctx.sampleRate * 0.04);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(2500, now);
      bp.Q.setValueAtTime(1.5, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      noise.connect(bp).connect(gain).connect(out);
      noise.start(now);
      noise.stop(now + 0.04);
      break;
    }

    case 'typewriter-bell': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.85);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1620, now);
      gain2.gain.setValueAtTime(0.1, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2).connect(out);
      osc2.start(now);
      osc2.stop(now + 0.65);
      break;
    }

    case 'synth-sweep': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, now);
      filter.frequency.exponentialRampToValueAtTime(4000, now + 0.3);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.6);
      filter.Q.setValueAtTime(5, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(filter).connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.65);
      break;
    }

    case 'glitch': {
      // 1. Harsh Sawtooth Buzz ("bzzzt")
      const buzz = ctx.createOscillator();
      buzz.type = 'sawtooth';
      // Frequency jumps to simulate digital corruption
      buzz.frequency.setValueAtTime(60, now);
      buzz.frequency.setValueAtTime(120, now + 0.06);
      
      const buzzGain = ctx.createGain();
      buzzGain.gain.setValueAtTime(0.3, now);
      // "chk" stutter
      buzzGain.gain.setValueAtTime(0, now + 0.02);
      buzzGain.gain.setValueAtTime(0.3, now + 0.03);
      buzzGain.gain.setValueAtTime(0, now + 0.05);
      // main buzz
      buzzGain.gain.setValueAtTime(0.3, now + 0.06);
      buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      buzz.connect(buzzGain).connect(out);
      buzz.start(now);
      buzz.stop(now + 0.13);

      // 2. Digital Static ("krrrk")
      const bufSize = Math.floor(ctx.sampleRate * 0.15);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      // Highpass to make it thin and digital
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(3000, now);
      
      const noiseGain = ctx.createGain();
      // Sync the stutters with the buzz
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.setValueAtTime(0, now + 0.02);
      noiseGain.gain.setValueAtTime(0.4, now + 0.03);
      noiseGain.gain.setValueAtTime(0, now + 0.05);
      noiseGain.gain.setValueAtTime(0.2, now + 0.06);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      noise.connect(hp).connect(noiseGain).connect(out);
      noise.start(now);
      noise.stop(now + 0.13);
      break;
    }

    case 'deep-impact': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.85);

      const bufSize = Math.floor(ctx.sampleRate * 0.3);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(400, now);
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.2, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      noise.connect(lp).connect(nGain).connect(out);
      noise.start(now);
      noise.stop(now + 0.35);
      break;
    }

    case 'hollow-thock': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.06);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(300, now);
      osc2.frequency.exponentialRampToValueAtTime(100, now + 0.04);
      gain2.gain.setValueAtTime(0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc2.connect(gain2).connect(out);
      osc2.start(now);
      osc2.stop(now + 0.06);
      break;
    }

    case 'success-fanfare': {
      const freqs = [392.00, 523.25, 659.25]; // G4, C5, E5
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain).connect(out);
        osc.start(now);
        osc.stop(now + 0.65);
      });
      break;
    }

    case 'ethereal-reveal':
    case 'cinematic-reveal': {
      // Multi-layer video-editor style text reveal:
      // Layer 1: Smooth spatial airy whoosh sweep (motion riser)
      const bufSize = Math.floor(ctx.sampleRate * 0.35);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(250 * jitter(0.02), now);
      bp.frequency.exponentialRampToValueAtTime(1800, now + 0.18);
      bp.frequency.exponentialRampToValueAtTime(320, now + 0.35);
      bp.Q.setValueAtTime(1.8, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.linearRampToValueAtTime(0.042, now + 0.14);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      noise.connect(bp).connect(noiseGain).connect(out);
      noise.start(now);
      noise.stop(now + 0.36);

      // Layer 2: Crystalline glass chime accent (reveal transient)
      const chimeTime = now + 0.08;
      const chimeNotes = [1480.0, 1864.0, 2217.0]; // F#6, A#6, C#7
      chimeNotes.forEach((freq, idx) => {
        const t = chimeTime + idx * 0.035;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * jitter(0.005), t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.022, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
        osc.connect(g).connect(out);
        osc.start(t);
        osc.stop(t + 0.5);
      });

      // Layer 3: Warm sub-bass landing bloom (anchors text arrival)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      const subFilter = ctx.createBiquadFilter();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(90 * jitter(0.02), now + 0.05);
      subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.35);
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(150, now);
      subGain.gain.setValueAtTime(0.0001, now + 0.05);
      subGain.gain.linearRampToValueAtTime(0.055, now + 0.12);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      subOsc.connect(subFilter).connect(subGain).connect(out);
      subOsc.start(now + 0.05);
      subOsc.stop(now + 0.4);
      break;
    }

    case 'whoosh-shimmer': {
      // Kinetic airy silk whoosh + multi-tap micro crystal shimmer (perfect for letter-by-letter kinetic reveals)
      const bufSize = Math.floor(ctx.sampleRate * 0.28);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(1200, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.linearRampToValueAtTime(0.038, now + 0.1);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      noise.connect(hp).connect(noiseGain).connect(out);
      noise.start(now);
      noise.stop(now + 0.3);

      // Micro-sparkle cascade (E6, A6, E7, A7)
      const notes = [1318.5, 1760.0, 2637.0, 3520.0];
      notes.forEach((freq, idx) => {
        const t = now + idx * 0.03;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * jitter(0.006), t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.02, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        osc.connect(g).connect(out);
        osc.start(t);
        osc.stop(t + 0.38);
      });
      break;
    }

    case 'tactile-reveal': {
      // Mechanical precision camera/shutter click with filtered air sweep (perfect for zero-deps / tech statements)
      const bufSize = Math.floor(ctx.sampleRate * 0.25);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(800, now);
      bp.frequency.exponentialRampToValueAtTime(2400, now + 0.08);
      bp.frequency.exponentialRampToValueAtTime(400, now + 0.22);
      bp.Q.setValueAtTime(2, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.linearRampToValueAtTime(0.045, now + 0.06);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      noise.connect(bp).connect(noiseGain).connect(out);
      noise.start(now);
      noise.stop(now + 0.26);

      // Mechanical dual-micro click transient
      [now + 0.02, now + 0.07].forEach((t, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(i === 0 ? 1600 : 900, t);
        osc.frequency.exponentialRampToValueAtTime(i === 0 ? 800 : 300, t + 0.015);
        g.gain.setValueAtTime(0.06, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);
        osc.connect(g).connect(out);
        osc.start(t);
        osc.stop(t + 0.022);
      });
      break;
    }

    case 'soothing-tone': {
      // Ethereal, velvety celestial glass chime chord (Ebmaj9/Bb) for signature brand identity
      const chord = [
        { freq: 233.08, delay: 0.00, gain: 0.052 }, // Bb3
        { freq: 293.66, delay: 0.07, gain: 0.046 }, // D4
        { freq: 349.23, delay: 0.14, gain: 0.042 }, // F4
        { freq: 440.00, delay: 0.21, gain: 0.038 }, // A4
        { freq: 587.33, delay: 0.28, gain: 0.032 }, // D5
        { freq: 932.33, delay: 0.36, gain: 0.022 }, // Bb5 stardust shimmer
      ];

      chord.forEach(({ freq, delay, gain: noteVolume }) => {
        const noteTime = now + delay;
        const osc = ctx.createOscillator();
        const oscWarmth = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * jitter(0.002), noteTime);

        // Warm harmonic sub-layer
        oscWarmth.type = 'triangle';
        oscWarmth.frequency.setValueAtTime(freq, noteTime);
        oscWarmth.detune.setValueAtTime(3, noteTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, noteTime);
        filter.frequency.exponentialRampToValueAtTime(520, noteTime + 2.5);
        filter.Q.setValueAtTime(0.8, noteTime);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(noteVolume, noteTime + 0.045);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.6);

        osc.connect(filter);
        oscWarmth.connect(filter);
        filter.connect(gain).connect(out);

        osc.start(noteTime);
        oscWarmth.start(noteTime);
        osc.stop(noteTime + 2.7);
        oscWarmth.stop(noteTime + 2.7);
      });
      break;
    }

    case 'ambient-wash': {
      // Gentle evolving ambient pad — warm, soothing, and relaxing
      const duration = 3.5;
      const padGain = ctx.createGain();
      padGain.gain.setValueAtTime(0.0001, now);
      padGain.gain.linearRampToValueAtTime(0.035, now + 1.0);
      padGain.gain.setValueAtTime(0.035, now + 2.0);
      padGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      padGain.connect(out);

      const chordFreqs = [130.81, 196.00, 261.63, 329.63]; // C3, G3, C4, E4
      chordFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const voiceGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * jitter(0.005), now);
        osc.detune.setValueAtTime((idx - 1.5) * 4, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(550, now);
        filter.frequency.linearRampToValueAtTime(800, now + 1.5);
        filter.frequency.linearRampToValueAtTime(350, now + duration);
        filter.Q.setValueAtTime(0.5, now);
        voiceGain.gain.setValueAtTime(0.025, now);
        osc.connect(filter).connect(voiceGain).connect(padGain);
        osc.start(now);
        osc.stop(now + duration + 0.1);
      });
      break;
    }

    case 'button-click': {
      // Ultra-crisp tactile micro-click (like a premium mechanical switch / haptic motor)
      // 1. High-frequency micro-transient
      const bufSize = Math.floor(ctx.sampleRate * 0.006);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(3400 * jitter(0.02), now);
      bp.Q.setValueAtTime(3, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.09, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.006);
      noise.connect(bp).connect(noiseGain).connect(out);
      noise.start(now);
      noise.stop(now + 0.008);

      // 2. Damped tactile body
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380 * jitter(0.02), now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.016);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.022);
      break;
    }

    case 'button-hover': {
      // Disabled / Silent per user request to remove hover beeps
      break;
    }

    case 'bg-click': {
      // Gentle, deep acoustic cushion tap — quiet sensory feedback for background
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(70 * jitter(0.02), now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.035);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(filter).connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.045);
      break;
    }

    case 'warning': {
      // Soft caution — gentler than error, still attention-grabbing
      [520, 390].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * jitter(0.01), now + idx * 0.11);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.11, now + idx * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.14);
        osc.connect(gain).connect(out);
        osc.start(now + idx * 0.11);
        osc.stop(now + idx * 0.11 + 0.15);
      });
      break;
    }

    case 'success': {
      // Short major confirm (not the long fanfare)
      [523.25, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.055);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.14, now + idx * 0.055);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.16);
        osc.connect(gain).connect(out);
        osc.start(now + idx * 0.055);
        osc.stop(now + idx * 0.055 + 0.18);
      });
      break;
    }

    case 'delete': {
      // Destructive confirm — descending body + thin noise crumb
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220 * jitter(0.02), now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(900, now);
      osc.connect(lp).connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.15);

      const bufSize = Math.floor(ctx.sampleRate * 0.04);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(2500, now);
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.08, now);
      ng.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      noise.connect(hp).connect(ng).connect(out);
      noise.start(now);
      noise.stop(now + 0.045);
      break;
    }

    case 'send': {
      // Message / submit — quick rise whoosh + soft landing blip
      const bufSize = Math.floor(ctx.sampleRate * 0.14);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(500, now);
      bp.frequency.exponentialRampToValueAtTime(2800, now + 0.12);
      bp.Q.setValueAtTime(2.2, now);
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.001, now);
      ng.gain.linearRampToValueAtTime(0.14, now + 0.04);
      ng.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      noise.connect(bp).connect(ng).connect(out);
      noise.start(now);
      noise.stop(now + 0.15);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.setValueAtTime(0.1, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain).connect(out);
      osc.start(now + 0.1);
      osc.stop(now + 0.24);
      break;
    }

    case 'select': {
      // Crisp item / radio / checkbox select
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 * jitter(0.015), now);
      osc.frequency.exponentialRampToValueAtTime(2100, now + 0.03);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.055);
      break;
    }

    case 'drop': {
      // Drag-drop land — soft thud + muted tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180 * jitter(0.02), now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.08);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain).connect(out);
      osc.start(now);
      osc.stop(now + 0.11);

      const tick = ctx.createOscillator();
      const tg = ctx.createGain();
      tick.type = 'square';
      tick.frequency.setValueAtTime(900, now + 0.02);
      tg.gain.setValueAtTime(0.04, now + 0.02);
      tg.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      tick.connect(tg).connect(out);
      tick.start(now + 0.02);
      tick.stop(now + 0.055);
      break;
    }

    case 'swipe': {
      // Horizontal gesture — distinct from swish/glissando
      const bufSize = Math.floor(ctx.sampleRate * 0.22);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(900, now);
      bp.frequency.exponentialRampToValueAtTime(3200, now + 0.1);
      bp.frequency.exponentialRampToValueAtTime(600, now + 0.2);
      bp.Q.setValueAtTime(3.5, now);
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.001, now);
      ng.gain.linearRampToValueAtTime(0.16, now + 0.05);
      ng.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      noise.connect(bp).connect(ng).connect(out);
      noise.start(now);
      noise.stop(now + 0.23);
      break;
    }

    case 'notification': {
      // Soft push notification — two gentle pips
      [880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.13, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.28);
        osc.connect(gain).connect(out);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.3);
      });
      break;
    }
  }
}

/** Trigger sound by identifier */

