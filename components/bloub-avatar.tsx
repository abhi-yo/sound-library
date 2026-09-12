'use client';

import React from 'react';
import { SoundBitsLogo } from './sound-bits-logo';
import type { SoundName } from '@/lib/sound-names';

interface BloubAvatarProps {
  size?: number | string;
  className?: string;
  color?: string;
  onInteract?: (sound?: SoundName) => void;
  interactive?: boolean;
}

/**
 * 2D geometric brandmark for Sound Bits.
 * Replaces legacy 3D/Kirby avatars with a bold, minimal, rotating acoustic symbol.
 */
export function BloubAvatar({
  size = 56,
  className = '',
  color = '#ff3700',
  onInteract,
  interactive = true,
}: BloubAvatarProps) {
  return (
    <SoundBitsLogo
      size={size}
      className={className}
      color={color}
      onInteract={onInteract}
      interactive={interactive}
      rotateOnHover={true}
    />
  );
}

// Aliases for backwards compatibility
export { BloubAvatar as KirbyAvatar };
export { BloubAvatar as OneeAvatar };
export { SoundBitsLogo };
