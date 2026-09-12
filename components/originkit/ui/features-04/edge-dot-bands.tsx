// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

/**
 * Figma "Mask group" (2356:132 / 2356:284 / 2356:422) — the dotted column at
 * each frame edge.
 *
 * Figma builds each one as a mask: a field of 12,810 rounded rects masking a
 * solid black bar. The rendered result is therefore just that bar dissolved
 * into 10% black dots, so it is rebuilt here as a tiled background rather than
 * shipped as the flattened 4MB SVG — same pixels, no asset, and it stretches
 * to any height.
 *
 * The bar widens 41 -> 51 -> 71 across the frames while staying flush to the
 * edges (~1.5px in on the left, a hair past 100% on the right). The dot field
 * is the same 12,810 dots every time, so a taller frame does not add rows, it
 * stretches them: the horizontal pitch stays 4.5277 throughout and the
 * vertical one goes 7.2514 -> 6.2024 -> 5.1584. The dot keeps the same share
 * of its cell at every size, which is why one tile serves all three and only
 * the background-size changes.
 *
 * Figma also stops the bars short of the frame bottom, which only reads as a
 * fade-out because of the dead space down there; with that space gone they run
 * the full height instead and keep their ~9px overhang at the top.
 */

const DOT_TILE = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="453" height="725"><rect width="292" height="408" rx="42" fill="#ffffff" fill-opacity="0.08"/></svg>',
)}")`;

const BAR =
  "pointer-events-none absolute bottom-0 w-[41px] bg-[length:4.5277px_7.2514px] ipad:w-[51px] ipad:bg-[length:4.5277px_6.2024px] desktop-sm:w-[71px] desktop-sm:bg-[length:4.5277px_5.1584px]";

export const EdgeDotBands = () => (
  <>
    <div
      aria-hidden
      className={`${BAR} top-[-8.5px] left-[2.36px] ipad:left-[1.51px] desktop-sm:top-[-2.5px] desktop-sm:left-[1.5px]`}
      style={{ backgroundImage: DOT_TILE }}
    />
    {/* The two bars sample the dot field at different phases in Figma, so the
        rows never line up across the frame — the offset keeps that. */}
    <div
      aria-hidden
      className={`${BAR} top-[-9.5px] right-[-1.36px] ipad:top-[-13.5px] ipad:right-[-0.5px] desktop-sm:top-[-2.5px] desktop-sm:right-[0.5px]`}
      style={{ backgroundImage: DOT_TILE, backgroundPosition: "0 3.6px" }}
    />
  </>
);
