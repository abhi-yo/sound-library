'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playSound } from '@/lib/lazy-sounds';

interface BloubAvatarProps {
  size?: number;
  className?: string;
  onInteract?: () => void;
}

export function BloubAvatar({
  size = 56,
  className = '',
  onInteract,
}: BloubAvatarProps) {
  const [isWinking, setIsWinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSquished, setIsSquished] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const avatarRef = useRef<HTMLDivElement>(null);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.35) {
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 140);
      }
    }, 2800);

    return () => clearInterval(blinkInterval);
  }, []);

  // Track cursor position to direct gaze
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!avatarRef.current) return;
    const rect = avatarRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 160));
    const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 160));
    setMouseOffset({ x: dx * 4, y: dy * 3.5 });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleSquish = useCallback(() => {
    setIsSquished(true);
    playSound('pop');
    onInteract?.();
    setTimeout(() => {
      setIsSquished(false);
    }, 260);
  }, [onInteract]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const eyeOffsetX = mouseOffset.x;
  const eyeOffsetY = mouseOffset.y;

  return (
    <div
      ref={avatarRef}
      onClick={handleSquish}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label="Squishy Mascot — click to squish"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSquish();
        }
      }}
      className={`group relative inline-flex items-center justify-center select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full transition-transform duration-200 ease-out ${className}`}
      style={{
        width: size,
        height: size,
        transform: isSquished
          ? 'scale(1.28, 0.72)'
          : isHovered
          ? 'scale(1.12, 0.90) translateY(-2px)'
          : 'scale(1, 1)',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm transition-all duration-200 ease-out pointer-events-none"
      >
        {/* Organic Morphing Silhouette: Solid black in light theme, pure solid white in dark theme */}
        <path
          d={
            isSquished
              ? 'M 50 12 C 82 10, 98 32, 98 56 C 98 84, 82 96, 50 96 C 18 96, 2 84, 2 56 C 2 32, 18 10, 50 12 Z'
              : isHovered
              ? 'M 50 6 C 80 6, 96 24, 96 50 C 96 78, 80 94, 50 94 C 20 94, 4 78, 4 50 C 4 24, 20 6, 50 6 Z'
              : 'M 50 8 C 76 8, 94 26, 94 50 C 94 76, 76 92, 50 92 C 24 92, 6 76, 6 50 C 6 26, 24 8, 50 8 Z'
          }
          className="fill-black dark:fill-white transition-colors duration-200 ease-out"
        />

        {/* Eyes Group with Gaze Direction: Pure white in light theme, solid black in dark theme */}
        <g
          transform={`translate(${eyeOffsetX}, ${eyeOffsetY})`}
          className="transition-transform duration-75 ease-out"
        >
          {/* Left Eye (Tilted capsule) */}
          <ellipse
            cx="38"
            cy="48"
            rx="5.5"
            ry={isWinking ? '1' : isSquished ? '3.5' : '10.5'}
            transform="rotate(-18 38 48)"
            className="fill-white dark:fill-black transition-colors duration-200"
          />

          {/* Right Eye (Tilted capsule) */}
          <ellipse
            cx="62"
            cy="48"
            rx="5.5"
            ry={isWinking ? '1' : isSquished ? '3.5' : '10.5'}
            transform="rotate(-18 62 48)"
            className="fill-white dark:fill-black transition-colors duration-200"
          />
        </g>
      </svg>
    </div>
  );
}
