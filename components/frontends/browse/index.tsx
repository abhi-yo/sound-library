'use client';

/**
 * Frontends 06–15 for /browse.
 *
 * Every demo lives in its own chunk (next/dynamic, ssr: false) and the page
 * mounts it through LazyMount, so neither the demo code nor any sound code is
 * fetched until its card nears the viewport. Sound playback itself still goes
 * through lib/lazy-sounds, which only loads the engine on the first press.
 */

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { SoundName } from '@/lib/sound-names';
import type { DemoProps } from './shared';

export interface ExtraFrontend {
  id: string;
  idx: string;
  sound: SoundName;
  soundAlt?: SoundName;
  soundLabel?: string;
  soundAltLabel?: string;
  code: string;
  /** Drawn as a physical object with the anatomy skill's rules. */
  anatomy?: boolean;
  Component: ComponentType<DemoProps>;
}

function DemoSkeleton() {
  return <div aria-hidden className="h-[120px] w-[180px] rounded-2xl bg-white/[0.02]" />;
}

const CoinSlot = dynamic(() => import('./coin-slot'), { ssr: false, loading: DemoSkeleton });
const Shutter = dynamic(() => import('./shutter'), { ssr: false, loading: DemoSkeleton });
const Typewriter = dynamic(() => import('./typewriter'), { ssr: false, loading: DemoSkeleton });
const Padlock = dynamic(() => import('./padlock'), { ssr: false, loading: DemoSkeleton });
const SendMessage = dynamic(() => import('./send-message'), { ssr: false, loading: DemoSkeleton });
const BubbleWrap = dynamic(() => import('./bubble-wrap'), { ssr: false, loading: DemoSkeleton });
const Checklist = dynamic(() => import('./checklist'), { ssr: false, loading: DemoSkeleton });
const SwipeDelete = dynamic(() => import('./swipe-delete'), { ssr: false, loading: DemoSkeleton });
const PowerButton = dynamic(() => import('./power-button'), { ssr: false, loading: DemoSkeleton });
const MagicGenerate = dynamic(() => import('./magic-generate'), { ssr: false, loading: DemoSkeleton });

export const EXTRA_FRONTENDS: ExtraFrontend[] = [
  {
    id: 'coin-slot',
    idx: '06',
    sound: 'coin',
    soundAlt: 'drop',
    soundLabel: 'coin',
    soundAltLabel: 'return',
    code: `playSound('coin')`,
    anatomy: true,
    Component: CoinSlot,
  },
  {
    id: 'shutter',
    idx: '07',
    sound: 'shutter',
    code: `playSound('shutter')`,
    anatomy: true,
    Component: Shutter,
  },
  {
    id: 'typewriter',
    idx: '08',
    sound: 'typewriter-key',
    soundAlt: 'typewriter-bell',
    soundLabel: 'key',
    soundAltLabel: 'bell',
    code: `playSound(atMargin ? 'typewriter-bell' : 'typewriter-key')`,
    anatomy: true,
    Component: Typewriter,
  },
  {
    id: 'padlock',
    idx: '09',
    sound: 'unlock',
    soundAlt: 'lock',
    code: `playSound(open ? 'unlock' : 'lock')`,
    anatomy: true,
    Component: Padlock,
  },
  {
    id: 'send',
    idx: '10',
    sound: 'send',
    code: `playSound('send')`,
    Component: SendMessage,
  },
  {
    id: 'bubble-wrap',
    idx: '11',
    sound: 'pop',
    soundAlt: 'swipe',
    soundAltLabel: 'reset',
    code: `playSound('pop')`,
    Component: BubbleWrap,
  },
  {
    id: 'checklist',
    idx: '12',
    sound: 'select',
    soundAlt: 'success-fanfare',
    soundLabel: 'check',
    soundAltLabel: 'all done',
    code: `playSound(allDone ? 'success-fanfare' : 'select')`,
    Component: Checklist,
  },
  {
    id: 'swipe-delete',
    idx: '13',
    sound: 'delete',
    soundAlt: 'drop',
    soundAltLabel: 'undo',
    code: `playSound(undo ? 'drop' : 'delete')`,
    Component: SwipeDelete,
  },
  {
    id: 'power',
    idx: '14',
    sound: 'power-up',
    soundAlt: 'power-down',
    code: `playSound(on ? 'power-up' : 'power-down')`,
    Component: PowerButton,
  },
  {
    id: 'generate',
    idx: '15',
    sound: 'magic-sparkle',
    soundLabel: 'sparkle',
    code: `playSound('magic-sparkle')`,
    Component: MagicGenerate,
  },
];
