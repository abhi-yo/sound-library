// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

"use client";

import { useEffect, useRef, useState } from "react";

import AsciiImage from "@/components/originkit/ui/features-04/ascii-reveal";

/**
 * Card artwork — source PNGs are fed through the ascii-reveal canvas so
 * characters are generated at runtime and the photo washes back in under the
 * pointer.
 *
 * Figma also scales those PNGs past their frame and lets the frame crop them —
 * Focus is drawn at 128.71% and pulled up 14.35%, Scale at 124.06% and up
 * 12.99%, Connect at 1:1, and those percentages hold at every breakpoint. The
 * crop only trims the transparent margin around the object, but it is what
 * sets how large the object reads inside the card, so the canvas keeps the
 * oversized box and the frame clips it. It is the one place absolute
 * positioning is unavoidable: the art has to sit outside the box it is
 * measured by. Both rects come in as class names so each card can restate them
 * per breakpoint and Tailwind can still read them.
 *
 * Column count is measured rather than passed. The canvas grows from 242 to
 * 457px across the breakpoints, and what has to stay put is the character
 * pitch — hold that at 1.57px and the texture matches Figma at every size.
 * Figma's PNGs are rendered several times oversampled and scaled down, so
 * matching them also needs an ink lifted off pure black; measured against the
 * Figma frame, #333 lands on the same density.
 */

/** On-screen character pitch, in CSS px. */
const PITCH = 1.57;

/** Reveal blob radius as a share of the canvas, so it scales with the card. */
const REVEAL_RATIO = 6;

interface AsciiArtProps {
  src: string;
  alt: string;
  /** Figma's image frame — the part of the render that stays visible. */
  boxClassName: string;
  /** The render itself, scaled and offset the way Figma crops it. */
  artClassName: string;
}

export const AsciiArt = ({
  src,
  alt,
  boxClassName,
  artClassName,
}: AsciiArtProps) => {
  const artRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const art = artRef.current;
    if (!art) return;
    const measure = () => setWidth(art.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(art);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`relative max-w-full shrink-0 overflow-hidden ${boxClassName}`}
    >
      <div ref={artRef} className={`absolute ${artClassName}`}>
        {width > 0 && (
          <AsciiImage
            image={{ src, alt }}
            fit="contain"
            columns={Math.round(width / PITCH)}
            inkColor="#333333"
            revealOptions={{
              size: Math.round(width / REVEAL_RATIO),
              softness: 12,
            }}
          />
        )}
      </div>
    </div>
  );
};
