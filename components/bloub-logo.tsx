'use client';

import React from 'react';
import { SoundBitsLogo } from './sound-bits-logo';

export function BloubLogo({
  className = '',
  size = 24,
  color = '#ff3700',
}: {
  className?: string;
  size?: number;
  color?: string;
  filled?: boolean;
}) {
  return <SoundBitsLogo size={size} className={className} color={color} />;
}

export default BloubLogo;
