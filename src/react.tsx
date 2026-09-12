'use client';

import React from 'react';
import { playSound, type SoundName } from './index';

export { useSound } from './index';

export interface SoundButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sound?: SoundName;
}

export function SoundButton({
  sound = 'tap',
  onClick,
  children,
  ...props
}: SoundButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound(sound);
    onClick?.(e);
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
