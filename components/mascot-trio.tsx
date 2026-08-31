'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playSound } from '@/lib/lazy-sounds';

export function MascotTrio() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Track cursor position to direct the gaze of all mascots
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 280));
    const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 280));
    setMouseOffset({ x: dx * 4, y: dy * 3.5 });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 w-full">
      {/* Three Mascots with consistent design language & baselines */}
      <div className="flex items-end justify-center gap-6 sm:gap-8 lg:gap-9">
        {/* Mascot 1: The Circle Blob */}
        <CircleBlob mouseOffset={mouseOffset} />

        {/* Mascot 2: The Soft Triangle */}
        <TriangleMascot mouseOffset={mouseOffset} />

        {/* Mascot 3: The Rounded Squircle Pebble */}
        <SquircleMascot mouseOffset={mouseOffset} />
      </div>

      <div className="text-center pt-1">
        <span className="text-xs font-mono text-muted-foreground/80 tracking-wide select-none">
          click any mascot to audition sounds
        </span>
      </div>
    </div>
  );
}

/* ── 1. The Circle Blob (Playful & Bouncy) ── */
function CircleBlob({ mouseOffset }: { mouseOffset: { x: number; y: number } }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSquished, setIsSquished] = useState(false);
  const [isWinking, setIsWinking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.4) {
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 140);
      }
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setIsSquished(true);
    playSound('pop');
    setTimeout(() => setIsSquished(false), 260);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      title="Circle Blob — click for pop"
      className="group relative flex flex-col items-center cursor-pointer select-none focus:outline-none transition-transform duration-200"
      style={{
        transform: isSquished
          ? 'scale(1.25, 0.75)'
          : isHovered
          ? 'scale(1.12, 0.92) translateY(-4px)'
          : 'scale(1, 1)',
      }}
    >
      <svg viewBox="0 0 100 100" className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-sm pointer-events-none">
        {/* Silhouette */}
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

        {/* Eyes */}
        <g transform={`translate(${mouseOffset.x}, ${mouseOffset.y})`} className="transition-transform duration-75">
          <ellipse
            cx="38"
            cy="48"
            rx="5.5"
            ry={isWinking ? '1' : isSquished ? '3.5' : '10.5'}
            transform="rotate(-18 38 48)"
            className="fill-white dark:fill-black transition-all duration-100"
          />
          <ellipse
            cx="62"
            cy="48"
            rx="5.5"
            ry={isWinking ? '1' : isSquished ? '3.5' : '10.5'}
            transform="rotate(-18 62 48)"
            className="fill-white dark:fill-black transition-all duration-100"
          />
        </g>
      </svg>
      <span className="mt-2 text-xs font-mono text-muted-foreground opacity-70 group-hover:opacity-100 group-hover:text-foreground transition-all">
        pop
      </span>
    </div>
  );
}

/* ── 2. The Rounded Triangle (Alert & Sharp) ── */
function TriangleMascot({ mouseOffset }: { mouseOffset: { x: number; y: number } }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.45) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 120);
      }
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setIsTriggered(true);
    playSound('snap');
    setTimeout(() => setIsTriggered(false), 240);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      title="Triangle Mascot — click for snap"
      className="group relative flex flex-col items-center cursor-pointer select-none focus:outline-none transition-transform duration-200"
      style={{
        transform: isTriggered
          ? 'scale(0.88, 1.2) translateY(-8px) rotate(4deg)'
          : isHovered
          ? 'scale(1.08, 1.05) translateY(-6px) rotate(-3deg)'
          : 'scale(1, 1)',
      }}
    >
      <svg viewBox="0 0 100 100" className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-sm pointer-events-none">
        {/* Soft Organic Triangle Path with smoothed round corners */}
        <path
          d={
            isTriggered
              ? 'M 50 6 C 56 6, 92 78, 88 88 C 84 96, 16 96, 12 88 C 8 78, 44 6, 50 6 Z'
              : isHovered
              ? 'M 50 8 C 58 8, 94 76, 90 86 C 86 94, 14 94, 10 86 C 6 76, 42 8, 50 8 Z'
              : 'M 50 10 C 58 10, 94 78, 88 88 C 84 94, 16 94, 12 88 C 6 78, 42 10, 50 10 Z'
          }
          className="fill-black dark:fill-white transition-all duration-200"
        />

        {/* Expressive Wide Eyes */}
        <g transform={`translate(${mouseOffset.x * 1.1}, ${mouseOffset.y * 1.1 + 8})`} className="transition-transform duration-75">
          {/* Left round eye */}
          <circle
            cx="40"
            cy="52"
            r={isBlinking ? '1.5' : isTriggered ? '6.5' : '5'}
            className="fill-white dark:fill-black transition-all duration-100"
          />
          {/* Right round eye */}
          <circle
            cx="60"
            cy="52"
            r={isBlinking ? '1.5' : isTriggered ? '6.5' : '5'}
            className="fill-white dark:fill-black transition-all duration-100"
          />
        </g>
      </svg>
      <span className="mt-2 text-xs font-mono text-muted-foreground opacity-70 group-hover:opacity-100 group-hover:text-foreground transition-all">
        snap
      </span>
    </div>
  );
}

/* ── 3. The Rounded Squircle Pebble (Harmonic Chime) ── */
function SquircleMascot({ mouseOffset }: { mouseOffset: { x: number; y: number } }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [isWinking, setIsWinking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.4) {
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 140);
      }
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setIsTriggered(true);
    playSound('chime');
    setTimeout(() => setIsTriggered(false), 280);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      title="Squircle Mascot — click for chime"
      className="group relative flex flex-col items-center cursor-pointer select-none focus:outline-none transition-transform duration-200"
      style={{
        transform: isTriggered
          ? 'scale(1.2, 0.8) translateY(2px)'
          : isHovered
          ? 'scale(1.08, 1.08) translateY(-5px)'
          : 'scale(1, 1)',
      }}
    >
      <svg viewBox="0 0 100 100" className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-sm pointer-events-none">
        {/* Soft Organic Pebble Squircle */}
        <path
          d={
            isTriggered
              ? 'M 25 18 C 50 14, 75 14, 85 24 C 95 36, 95 64, 85 76 C 75 88, 25 88, 15 76 C 5 64, 5 36, 15 24 C 18 20, 22 18, 25 18 Z'
              : isHovered
              ? 'M 24 16 C 50 12, 76 12, 86 22 C 96 34, 96 66, 86 78 C 76 90, 24 90, 14 78 C 4 66, 4 34, 14 22 C 18 18, 20 16, 24 16 Z'
              : 'M 24 18 C 50 14, 76 14, 86 24 C 96 36, 96 64, 86 76 C 76 88, 24 88, 14 76 C 4 64, 4 36, 14 24 C 18 20, 20 18, 24 18 Z'
          }
          className="fill-black dark:fill-white transition-all duration-200"
        />

        {/* Clean Minimalist Capsule Eyes (Consistent with Mascot 1 & 2) */}
        <g transform={`translate(${mouseOffset.x * 0.95}, ${mouseOffset.y * 0.95})`} className="transition-transform duration-75">
          {/* Left capsule eye (tilted slightly inwards) */}
          <ellipse
            cx="38"
            cy="48"
            rx="5.5"
            ry={isWinking ? '1' : isTriggered ? '3.5' : '10'}
            transform="rotate(12 38 48)"
            className="fill-white dark:fill-black transition-all duration-100"
          />

          {/* Right capsule eye (tilted slightly inwards) */}
          <ellipse
            cx="62"
            cy="48"
            rx="5.5"
            ry={isWinking ? '1' : isTriggered ? '3.5' : '10'}
            transform="rotate(12 62 48)"
            className="fill-white dark:fill-black transition-all duration-100"
          />
        </g>
      </svg>
      <span className="mt-2 text-xs font-mono text-muted-foreground opacity-70 group-hover:opacity-100 group-hover:text-foreground transition-all">
        chime
      </span>
    </div>
  );
}
