'use client';

import React, { useRef, useEffect } from 'react';
import { getAudioAnalyser } from '@/lib/lazy-sounds';

export function AudioVisualizer({ className = 'h-24 w-full' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    let analyser: AnalyserNode | null = null;
    void getAudioAnalyser().then((a) => {
      analyser = a;
    });

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle CRT Scope Grid
      ctx.strokeStyle = 'rgba(120, 120, 140, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);

      // Horizontal grid lines
      [0.25, 0.5, 0.75].forEach((pos) => {
        ctx.beginPath();
        ctx.moveTo(0, height * pos);
        ctx.lineTo(width, height * pos);
        ctx.stroke();
      });

      // Vertical grid lines
      [0.2, 0.4, 0.6, 0.8].forEach((pos) => {
        ctx.beginPath();
        ctx.moveTo(width * pos, 0);
        ctx.lineTo(width * pos, height);
        ctx.stroke();
      });

      ctx.setLineDash([]); // reset

      let isAudioActive = false;
      const bufferLength = analyser ? analyser.frequencyBinCount : 128;
      const dataArray = new Uint8Array(bufferLength);
      const freqArray = new Uint8Array(bufferLength);

      if (analyser) {
        analyser.getByteTimeDomainData(dataArray);
        analyser.getByteFrequencyData(freqArray);

        for (let i = 0; i < bufferLength; i++) {
          if (Math.abs(dataArray[i] - 128) > 2) {
            isAudioActive = true;
            break;
          }
        }
      }

      // Draw FFT Frequency Spectrum Bars in background
      if (isAudioActive) {
        const barCount = 36;
        const barWidth = width / barCount - 2;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
        for (let i = 0; i < barCount; i++) {
          const freqVal = freqArray[Math.floor((i / barCount) * (bufferLength / 2))] || 0;
          const barHeight = (freqVal / 255) * (height * 0.75);
          ctx.fillRect(i * (barWidth + 2) + 2, height - barHeight - 4, barWidth, barHeight);
        }
      }

      // Draw Oscilloscope Beam (clean crisp line, zero phosphor glow)
      ctx.lineWidth = isAudioActive ? 2 : 1.5;
      ctx.strokeStyle = isAudioActive ? '#10b981' : '#059669';
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      ctx.beginPath();

      if (isAudioActive) {
        // Real-time Audio Waveform from AnalyserNode
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
      } else {
        // Subtle resting organic idle wave
        phase += 0.035;
        const midY = height / 2;
        ctx.moveTo(0, midY);

        for (let x = 0; x <= width; x += 4) {
          const y =
            midY +
            Math.sin(x * 0.02 + phase) * 3.5 +
            Math.sin(x * 0.04 - phase * 0.7) * 1.5;
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow for other renders

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-xl bg-zinc-950/80 border border-border/80 dark:border-white/10 ${className} neumorph-inset`}>
      <canvas
        ref={canvasRef}
        width={720}
        height={96}
        className="w-full h-full block"
      />

      {/* Screen HUD Overlay Labels */}
      <div className="absolute top-2 left-3 flex items-center gap-2 select-none pointer-events-none">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono font-medium text-emerald-500/90 tracking-wider uppercase">
          CH-1 // OSCILLOSCOPE
        </span>
      </div>

      <div className="absolute top-2 right-3 flex items-center gap-3 text-[9px] font-mono text-zinc-400 select-none pointer-events-none">
        <span className="px-1.5 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-300">48.0 kHz</span>
        <span className="px-1.5 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 text-emerald-400">REALTIME</span>
      </div>
    </div>
  );
}
