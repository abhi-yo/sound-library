'use client';

import { cn } from '@/lib/utils';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { type SlotItemMapArray, createSwapy } from 'swapy';

type AnimationType = 'dynamic' | 'spring' | 'none';
type SwapMode = 'hover' | 'drop';

type Config = {
  animation: AnimationType;
  continuousMode: boolean;
  manualSwap: boolean;
  swapMode: SwapMode;
  autoScrollOnDrag: boolean;
};

type SwapyLayoutProps = {
  id: string;
  enable?: boolean;
  onSwap?: (event: { newSlotItemMap: { asArray: SlotItemMapArray } }) => void;
  config?: Partial<Config>;
  className?: string;
  children: React.ReactNode;
};

export const SwapyLayout = ({ id, onSwap, config = {}, className, children }: SwapyLayoutProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const swapyRef = useRef<ReturnType<typeof createSwapy> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Delay initialization to ensure all children are fully mounted
    const raf = requestAnimationFrame(() => {
      try {
        swapyRef.current = createSwapy(container, config);

        if (onSwap) {
          swapyRef.current.onSwap(onSwap);
        }
      } catch (e) {
        console.warn('Swapy init error:', e);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      swapyRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} id={id} className={cn('relative', className)}>
      {children}
    </div>
  );
};

type SwapySlotProps = {
  id: string;
  className?: string;
  children: React.ReactNode;
};

export const SwapySlot = ({ id, className, children }: SwapySlotProps) => {
  return (
    <div data-swapy-slot={id} className={cn('', className)}>
      {children}
    </div>
  );
};

type SwapyItemProps = {
  id: string;
  className?: string;
  children: React.ReactNode;
  dragItemOpacity?: number;
};

export const SwapyItem = ({ id, className, children, dragItemOpacity = 100 }: SwapyItemProps) => {
  return (
    <div
      data-swapy-item={id}
      className={cn('', className)}
      style={
        {
          '--swapy-item-opacity': `${dragItemOpacity}%`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

type DragHandleProps = {
  className?: string;
};

export const DragHandle = ({ className }: DragHandleProps) => {
  return (
    <div data-swapy-handle className={cn('cursor-grab active:cursor-grabbing', className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="12" r="1" />
        <circle cx="9" cy="5" r="1" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="15" cy="5" r="1" />
        <circle cx="15" cy="19" r="1" />
      </svg>
    </div>
  );
};
