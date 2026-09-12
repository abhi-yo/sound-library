'use client';

import React, { useState, useCallback } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import type { SoundName } from '@/lib/sound-names';

interface SoundBitsLogoProps {
  size?: number | string;
  className?: string;
  color?: string;
  interactive?: boolean;
  onInteract?: (sound?: SoundName) => void;
  rotateOnHover?: boolean;
  showSoundFeedback?: boolean;
}

const PLAYFUL_SOUNDS: SoundName[] = [
  'pop',
  'bubble',
  'blip',
  'tap',
  'bloop',
  'jump-boing',
  'coin',
];

export function SoundBitsLogo({
  size = 28,
  className = '',
  color = '#ff3700', // Electric Vermilion — ultra-high contrast pop
  interactive = true,
  onInteract,
  rotateOnHover = true,
}: SoundBitsLogoProps) {
  const [rotation, setRotation] = useState(0);

  const handleMouseEnter = useCallback(() => {
    if (!rotateOnHover) return;
    // Advance forward by 120° on every hover (3-fold symmetry gives continuous smooth ratcheting)
    setRotation((prev) => prev + 120);
  }, [rotateOnHover]);

  const handleClick = useCallback(() => {
    if (!interactive) return;
    const sound = PLAYFUL_SOUNDS[Math.floor(Math.random() * PLAYFUL_SOUNDS.length)];
    playSound(sound);
    onInteract?.(sound);

    // Spin forward an extra 120° with zero size shrinking
    setRotation((prev) => prev + 120);
  }, [interactive, onInteract]);

  const numericSize = typeof size === 'number' ? size : parseInt(size, 10) || 28;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? 0 : -1}
      aria-label="sound bits logo"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`inline-flex items-center justify-center select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3700] rounded-full ${className}`}
      style={{
        width: numericSize,
        height: numericSize,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 550ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
          transformOrigin: '50% 50%',
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* 
          Sound Bits 2D Brandmark:
          Smooth 3-lobed acoustic rotor with a central core aperture and 3 satellite sound-bit perforations.
          Rendered as a single compound path with evenodd fill rule for pure native transparency.
        */}
        <path
          d="
            M 75.38 45.73 
            A 17 17 0 1 1 59.00 74.11 
            A 14 14 0 0 0 41.00 74.11 
            A 17 17 0 1 1 24.62 45.73 
            A 14 14 0 0 0 33.62 30.15 
            A 17 17 0 1 1 66.38 30.15 
            A 14 14 0 0 0 75.38 45.73 Z
            M 50 40.50 
            A 9.5 9.5 0 1 0 50 59.50 
            A 9.5 9.5 0 1 0 50 40.50 Z
            M 50 21.80 
            A 4.2 4.2 0 1 0 50 30.20 
            A 4.2 4.2 0 1 0 50 21.80 Z
            M 69.92 57.30 
            A 4.2 4.2 0 1 0 69.92 65.70 
            A 4.2 4.2 0 1 0 69.92 57.30 Z
            M 30.08 57.30 
            A 4.2 4.2 0 1 0 30.08 65.70 
            A 4.2 4.2 0 1 0 30.08 57.30 Z
          "
          fill={color}
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default SoundBitsLogo;
