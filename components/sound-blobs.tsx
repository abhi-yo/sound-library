'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import type { SoundName } from '@/lib/sounds';

interface SoundBlobConfig {
  id: string;
  name: SoundName;
  label: string;
  shapeType: 'circle' | 'cloud' | 'triangle' | 'star' | 'squircle' | 'pebble';
}

const SOUND_BLOBS: SoundBlobConfig[] = [
  { id: 'pop', name: 'pop', label: 'Pop', shapeType: 'circle' },
  { id: 'chime', name: 'chime', label: 'Chime', shapeType: 'cloud' },
  { id: 'snap', name: 'snap', label: 'Snap', shapeType: 'triangle' },
  { id: 'fanfare', name: 'success-fanfare', label: 'Fanfare', shapeType: 'star' },
  { id: 'whoosh', name: 'whoosh', label: 'Whoosh', shapeType: 'squircle' },
  { id: 'lock', name: 'lock', label: 'Lock', shapeType: 'pebble' },
];

export function SoundBlobs() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 300));
    const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 300));
    setMouseOffset({ x: dx * 3.5, y: dy * 3 });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* 6 Interactive Sound Blobs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 items-end justify-center max-w-3xl mx-auto py-6">
        {SOUND_BLOBS.map((blob) => (
          <SoundBlobItem
            key={blob.id}
            config={blob}
            mouseOffset={mouseOffset}
          />
        ))}
      </div>
      <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mt-2 select-none tracking-wide">
        click any blob to trigger its sound
      </p>
    </div>
  );
}

function SoundBlobItem({
  config,
  mouseOffset,
}: {
  config: SoundBlobConfig;
  mouseOffset: { x: number; y: number };
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSquished, setIsSquished] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = 2400 + Math.random() * 2000;
    const timer = setInterval(() => {
      if (Math.random() > 0.35) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 130);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setIsSquished(true);
    playSound(config.name);
    setTimeout(() => setIsSquished(false), 260);
  };

  const eyeX = mouseOffset.x;
  const eyeY = mouseOffset.y;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      title={`${config.label} — click to audition`}
      className="group relative flex flex-col items-center cursor-pointer select-none focus:outline-none transition-transform duration-200"
      style={{
        transform: isSquished
          ? 'scale(1.22, 0.78)'
          : isHovered
          ? 'scale(1.1, 0.92) translateY(-4px)'
          : 'scale(1, 1)',
      }}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm pointer-events-none transition-all duration-200">
          {/* Render Unique Geometric Mascot Silhouette based on ShapeType */}
          {config.shapeType === 'circle' && (
            <path
              d={
                isSquished
                  ? 'M 50 14 C 82 12, 98 34, 98 58 C 98 84, 82 96, 50 96 C 18 96, 2 84, 2 58 C 2 34, 18 12, 50 14 Z'
                  : isHovered
                  ? 'M 50 6 C 80 6, 96 24, 96 50 C 96 78, 80 94, 50 94 C 20 94, 4 78, 4 50 C 4 24, 20 6, 50 6 Z'
                  : 'M 50 8 C 76 8, 94 26, 94 50 C 94 76, 76 92, 50 92 C 24 92, 6 76, 6 50 C 6 26, 24 8, 50 8 Z'
              }
              className="fill-black dark:fill-white transition-all duration-200"
            />
          )}

          {config.shapeType === 'cloud' && (
            <path
              d={
                isSquished
                  ? 'M 28 72 C 16 72 10 64 10 54 C 10 44 18 38 26 38 C 30 26 40 18 52 18 C 64 18 74 24 77 34 C 86 35 92 43 92 53 C 92 63 84 72 74 72 Z'
                  : isHovered
                  ? 'M 28 66 C 16 66 10 58 10 48 C 10 38 18 32 26 32 C 30 20 40 12 52 12 C 64 12 74 18 77 28 C 86 29 92 37 92 47 C 92 57 84 66 74 66 Z'
                  : 'M 28 68 C 17 68 12 60 12 51 C 12 43 18 37 26 36 C 29 24 40 16 52 16 C 64 16 74 23 77 33 C 86 34 91 42 91 50 C 91 59 84 68 74 68 Z'
              }
              className="fill-black dark:fill-white transition-all duration-200"
            />
          )}

          {config.shapeType === 'triangle' && (
            <path
              d={
                isSquished
                  ? 'M 50 14 C 58 14, 92 82, 86 92 C 80 98, 20 98, 14 92 C 8 82, 42 14, 50 14 Z'
                  : isHovered
                  ? 'M 50 6 C 58 6, 94 76, 90 86 C 86 94, 14 94, 10 86 C 6 76, 42 6, 50 6 Z'
                  : 'M 50 10 C 58 10, 94 78, 88 88 C 84 94, 16 94, 12 88 C 6 78, 42 10, 50 10 Z'
              }
              className="fill-black dark:fill-white transition-all duration-200"
            />
          )}

          {config.shapeType === 'star' && (
            <path
              d={
                isSquished
                  ? 'M 50 18 L 60 38 L 82 42 L 66 58 L 70 80 L 50 68 L 30 80 L 34 58 L 18 42 L 40 38 Z'
                  : isHovered
                  ? 'M 50 10 L 62 34 L 88 38 L 68 56 L 73 82 L 50 70 L 27 82 L 32 56 L 12 38 L 38 34 Z'
                  : 'M 50 12 L 61 35 L 86 39 L 67 57 L 72 81 L 50 69 L 28 81 L 33 57 L 14 39 L 39 35 Z'
              }
              className="fill-black dark:fill-white transition-all duration-200"
            />
          )}

          {config.shapeType === 'squircle' && (
            <path
              d={
                isSquished
                  ? 'M 24 16 C 42 16, 58 16, 76 16 C 92 16, 96 28, 96 50 C 96 72, 92 84, 76 84 C 58 84, 42 84, 24 84 C 8 84, 4 72, 4 50 C 4 28, 8 16, 24 16 Z'
                  : isHovered
                  ? 'M 24 8 C 42 8, 58 8, 76 8 C 92 8, 96 20, 96 50 C 96 80, 92 92, 76 92 C 58 92, 42 92, 24 92 C 8 92, 4 80, 4 50 C 4 20, 8 8, 24 8 Z'
                  : 'M 24 12 C 42 12, 58 12, 76 12 C 92 12, 96 22, 96 50 C 96 78, 92 88, 76 88 C 58 88, 42 88, 24 88 C 8 88, 4 78, 4 50 C 4 22, 8 12, 24 12 Z'
              }
              className="fill-black dark:fill-white transition-all duration-200"
            />
          )}

          {config.shapeType === 'pebble' && (
            <path
              d={
                isSquished
                  ? 'M 50 18 C 76 18, 92 36, 92 56 C 92 78, 78 88, 50 88 C 22 88, 8 78, 8 56 C 8 36, 24 18, 50 18 Z'
                  : isHovered
                  ? 'M 50 10 C 78 10, 94 28, 94 50 C 94 74, 78 90, 50 90 C 22 90, 6 74, 6 50 C 6 28, 22 10, 50 10 Z'
                  : 'M 50 12 C 76 12, 92 28, 92 50 C 92 72, 76 88, 50 88 C 24 88, 8 72, 8 50 C 8 28, 24 12, 50 12 Z'
              }
              className="fill-black dark:fill-white transition-all duration-200"
            />
          )}

          {/* Expressive Mascot Eyes with Mouse Gaze */}
          <g transform={`translate(${eyeX}, ${eyeY})`} className="transition-transform duration-75">
            <ellipse
              cx="38"
              cy="48"
              rx="4.5"
              ry={isBlinking ? '1' : isSquished ? '3' : '9.5'}
              transform="rotate(-15 38 48)"
              className="fill-white dark:fill-black transition-all duration-100"
            />
            <ellipse
              cx="62"
              cy="48"
              rx="4.5"
              ry={isBlinking ? '1' : isSquished ? '3' : '9.5'}
              transform="rotate(-15 62 48)"
              className="fill-white dark:fill-black transition-all duration-100"
            />
          </g>
        </svg>
      </div>

      <span className="mt-2.5 text-xs font-mono font-medium text-neutral-600 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105 transition-all">
        {config.label}
      </span>
    </div>
  );
}
