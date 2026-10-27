'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { LazyMount } from '@/components/lazy-mount';
import type { SoundName } from '@/lib/sound-names';

export const SoundPlayer = dynamic(
  () => import('@/components/sound-player').then((m) => m.SoundPlayer),
  { ssr: false }
);

export const SoundActions = dynamic(
  () => import('@/components/sound-header').then((m) => m.SoundActions),
  { ssr: false }
);

export const SoundPlayButton = SoundActions;

const SoundMatrixInner = dynamic(
  () => import('@/components/sound-matrix').then((m) => m.SoundMatrix),
  {
    ssr: false,
    loading: () => (
      <div className="my-8 h-64 animate-pulse rounded-2xl border border-border/80 bg-card/20" />
    ),
  }
);

export function SoundMatrix() {
  return (
    <LazyMount minHeight={280}>
      <SoundMatrixInner />
    </LazyMount>
  );
}

const SoundShowcaseInner = dynamic(
  () => import('@/components/sound-showcase').then((m) => m.SoundShowcase),
  { ssr: false }
);

/** Mounted (and its sound code fetched) only when it nears the viewport. */
export function SoundShowcase(props: React.ComponentProps<typeof SoundShowcaseInner>) {
  return (
    <LazyMount minHeight={360}>
      <SoundShowcaseInner {...props} />
    </LazyMount>
  );
}

const CommandPaletteMockupInner = dynamic(
  () =>
    import('@/components/ui-mockups/command-palette-mockup').then(
      (m) => m.CommandPaletteMockup
    ),
  { ssr: false }
);

/** Mounted (and its sound code fetched) only when it nears the viewport. */
export function CommandPaletteMockup(props: React.ComponentProps<typeof CommandPaletteMockupInner>) {
  return (
    <LazyMount minHeight={420}>
      <CommandPaletteMockupInner {...props} />
    </LazyMount>
  );
}

const AudioRackMockupInner = dynamic(
  () =>
    import('@/components/ui-mockups/audio-rack-mockup').then(
      (m) => m.AudioRackMockup
    ),
  { ssr: false }
);

/** Mounted (and its sound code fetched) only when it nears the viewport. */
export function AudioRackMockup(props: React.ComponentProps<typeof AudioRackMockupInner>) {
  return (
    <LazyMount minHeight={420}>
      <AudioRackMockupInner {...props} />
    </LazyMount>
  );
}

const InteractiveOsMockupInner = dynamic(
  () =>
    import('@/components/ui-mockups/interactive-os-mockup').then(
      (m) => m.InteractiveOsMockup
    ),
  { ssr: false }
);

/** Mounted (and its sound code fetched) only when it nears the viewport. */
export function InteractiveOsMockup(props: React.ComponentProps<typeof InteractiveOsMockupInner>) {
  return (
    <LazyMount minHeight={480}>
      <InteractiveOsMockupInner {...props} />
    </LazyMount>
  );
}

const SoundStudioInner = dynamic(
  () => import('@/components/ui-mockups/sound-studio').then((m) => m.SoundStudio),
  { ssr: false }
);

/** Mounted (and its sound code fetched) only when it nears the viewport. */
export function SoundStudio(props: React.ComponentProps<typeof SoundStudioInner>) {
  return (
    <LazyMount minHeight={480}>
      <SoundStudioInner {...props} />
    </LazyMount>
  );
}

const InteractiveDemoGridInner = dynamic(
  () =>
    import('@/components/docs/interactive-demo-grid').then(
      (m) => m.InteractiveDemoGrid
    ),
  {
    ssr: false,
    loading: () => (
      <div className="not-prose my-8 h-[420px] animate-pulse rounded-2xl border border-white/[0.08] bg-[#111114]" />
    ),
  }
);

export function InteractiveDemoGrid() {
  return (
    <LazyMount minHeight={420}>
      <InteractiveDemoGridInner />
    </LazyMount>
  );
}

const SoundPreviewPanelInner = dynamic(
  () =>
    import('@/components/docs/sound-preview-panel').then(
      (m) => m.SoundPreviewPanel
    ),
  {
    ssr: false,
    loading: () => (
      <div className="not-prose my-5 h-28 animate-pulse rounded-2xl border border-white/[0.08] bg-[#141416]" />
    ),
  }
);

export function SoundPreviewPanel(props: {
  sounds?: SoundName[];
  category?: string;
  title?: string;
}) {
  return (
    <LazyMount minHeight={112}>
      <SoundPreviewPanelInner {...props} />
    </LazyMount>
  );
}

export const SoundPillMatrix = SoundPreviewPanel;
