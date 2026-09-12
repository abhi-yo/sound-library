'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LazyMountProps {
  children: React.ReactNode;
  /** Approximate reserved height to reduce layout shift before mount */
  minHeight?: number | string;
  rootMargin?: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Mounts children only after the placeholder enters (or nears) the viewport.
 * Useful for heavy docs islands so first paint does not hydrate every sound card.
 */
export function LazyMount({
  children,
  minHeight = 120,
  rootMargin = '200px 0px',
  className,
  fallback = null,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div
      ref={ref}
      className={className}
      style={!visible ? { minHeight } : undefined}
    >
      {visible ? children : fallback}
    </div>
  );
}
