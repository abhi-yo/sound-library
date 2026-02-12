import fs from 'fs';

// Simple WAV file generator
function generateWavFile(frequency, duration, type = 'sine') {
  const sampleRate = 44100;
  const samples = sampleRate * duration;
  const audioContext = {
    sampleRate,
    samples: new Float32Array(samples)
  };

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    let sample = 0;
    
    if (type === 'sine') {
      sample = Math.sin(2 * Math.PI * frequency * t);
    } else if (type === 'click') {
      const decay = Math.exp(-5 * t);
      sample = (Math.sin(2 * Math.PI * frequency * t)) * decay;
    } else if (type === 'chirp') {
      const f0 = frequency;
      const f1 = frequency * 2;
      const phase = 2 * Math.PI * (f0 * t + (f1 - f0) * t * t / (2 * duration));
      sample = Math.sin(phase) * Math.exp(-3 * t);
    }
    
    audioContext.samples[i] = sample * 0.3;
  }

  return audioContext;
}

// Convert float samples to WAV buffer
function float32ToWav(float32Samples, sampleRate) {
  const length = float32Samples.length;
  const arrayBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);

  // PCM data
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, float32Samples[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }

  return Buffer.from(arrayBuffer);
}

const sounds = [
  { name: 'button-click', frequency: 800, duration: 0.1, type: 'click' },
  { name: 'button-click-secondary', frequency: 600, duration: 0.08, type: 'click' },
  { name: 'hover-blip', frequency: 1200, duration: 0.05, type: 'chirp' },
  { name: 'hover-soft', frequency: 900, duration: 0.06, type: 'sine' },
  { name: 'success-chime', frequency: 1000, duration: 0.2, type: 'sine' },
  { name: 'success-bell', frequency: 1400, duration: 0.15, type: 'chirp' },
  { name: 'error-buzz', frequency: 400, duration: 0.2, type: 'click' },
  { name: 'error-beep', frequency: 300, duration: 0.15, type: 'sine' },
  { name: 'notification-ping', frequency: 1100, duration: 0.1, type: 'chirp' },
  { name: 'notification-subtle', frequency: 700, duration: 0.08, type: 'sine' },
  { name: 'swoosh', frequency: 1500, duration: 0.12, type: 'chirp' },
  { name: 'pop', frequency: 950, duration: 0.08, type: 'click' },
];

console.log('[v0] Generating sound data...');

const soundsData = {};

sounds.forEach(({ name, frequency, duration, type }) => {
  const audioContext = generateWavFile(frequency, duration, type);
  const wavBuffer = float32ToWav(audioContext.samples, audioContext.sampleRate);
  const base64 = wavBuffer.toString('base64');
  soundsData[name] = `data:audio/wav;base64,${base64}`;
  console.log(`[v0] Generated: ${name}`);
});

// Write to stdout for piping to file
console.log('[v0] SOUNDS_DATA_START');
console.log(JSON.stringify(soundsData, null, 2));
console.log('[v0] SOUNDS_DATA_END');
