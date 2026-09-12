// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

/**
 * Figma "Group 2147241484" (2356:55 / 2356:207 / 2356:339) — the ruled graph
 * paper the section sits on.
 *
 * Figma draws it as two stacks that share one pitch: 18 horizontal rules and
 * 25 vertical ones, both at 80% opacity, on a band that is centred on the
 * frame and far wider than it. The pitch is written as `gap + rule`, and it
 * re-pitches rather than scales between frames — 35.027 + 0.674 on phone,
 * 52 + 1 from tablet up — so the band goes 872.99 wide to 1296 and the rules
 * go 0.674px to a crisp 1px.
 *
 * Through tablet the band is centred and simply overflows the frame, which is
 * why the rules keep meeting both screen edges however wide the window gets.
 * Desktop is the one size where the band is narrower than the frame — Figma
 * runs it 72 -> 1368, i.e. exactly between the two dotted bars — so there it
 * is anchored to the left bar instead of centred, and carries enough extra
 * rules to still reach the right bar on a display much wider than 1440. The
 * rules keep their 53px pitch either way.
 *
 * On desktop the column band also clips itself at the right bar. The bars are
 * only 10% black, so anything running under them shows straight through —
 * Figma stops its rules dead at 1368, and the spare rules that make the band
 * fluid would otherwise read as grid inside the dots. Phone and tablet keep
 * running under their bars, which is what Figma does there.
 *
 * The column rules stop short of the frame — 615px tall on phone, 913 above it
 * — so the grid is the backdrop for the heading rather than for the cards.
 */

/**
 * The grid only reads across the top of every frame and is gone by the time
 * the cards start. Figma gets that by covering it with the blurred washes, but
 * those are ellipses at fixed widths: they stop reaching the sides as soon as
 * the viewport is wider than the frame they were drawn on, and they narrow
 * again lower down, so the rules leak back in at the edges and in the middle.
 *
 * So the fade is cut into the pattern itself. The washes still do their part —
 * their arcs are what clear the centre earlier than the sides — and this
 * guarantees nothing survives below the heading at any width. The stops are
 * measured from each layer's own top, which is why desktop reads 50px higher
 * than the page numbers: that band starts at -50.
 */
const FADE =
  "[mask-image:linear-gradient(to_bottom,#000_250px,transparent_330px)] [-webkit-mask-image:linear-gradient(to_bottom,#000_250px,transparent_330px)] ipad:[mask-image:linear-gradient(to_bottom,#000_260px,transparent_340px)] ipad:[-webkit-mask-image:linear-gradient(to_bottom,#000_260px,transparent_340px)] desktop-sm:[mask-image:linear-gradient(to_bottom,#000_300px,transparent_380px)] desktop-sm:[-webkit-mask-image:linear-gradient(to_bottom,#000_300px,transparent_380px)]";

const ROWS = 18;

/** Rules present at every size — Figma's 25. */
const COLUMNS = 25;

/** Desktop-only rules that carry the band past the right bar on wide screens.
 *  55 rules at a 53px pitch span 2915px, so the grid stays edge to edge up to
 *  roughly a 3000px viewport. */
const WIDE_COLUMNS = 30;

/** Centred through tablet, pinned to the left dot bar on desktop. */
const BAND =
  "left-[calc(50%-8.36px)] -translate-x-1/2 ipad:left-[calc(50%-0.29px)] desktop-sm:left-[72px] desktop-sm:translate-x-0";

export const GridRows = () => (
  <div
    aria-hidden
    className={`pointer-events-none absolute top-0 flex w-[872.99px] flex-col gap-[35.027px] opacity-80 ipad:w-[1296px] ipad:gap-[52px] desktop-sm:-top-[50px] desktop-sm:right-[72px] desktop-sm:w-auto ${FADE} ${BAND}`}
  >
    {Array.from({ length: ROWS }, (_, i) => (
      <span
        key={`row-${i}`}
        className="h-[0.674px] w-full shrink-0 bg-[#2a2a2a] shadow-[0px_0.674px_0px_0px_#000000] ipad:h-px ipad:shadow-[0px_1px_0px_0px_#000000]"
      />
    ))}
  </div>
);

export const GridColumns = () => (
  <div
    aria-hidden
    className={`pointer-events-none absolute top-0 flex h-[615px] w-[872.99px] items-stretch gap-[35.027px] opacity-80 ipad:h-[913px] ipad:w-[1296px] ipad:gap-[52px] desktop-sm:-top-[50px] desktop-sm:right-[72px] desktop-sm:w-auto desktop-sm:overflow-hidden ${FADE} ${BAND}`}
  >
    {Array.from({ length: COLUMNS + WIDE_COLUMNS }, (_, i) => (
      <span
        key={`col-${i}`}
        className={`w-[0.674px] shrink-0 bg-[#2a2a2a] shadow-[0.674px_0px_0px_0px_#000000] ipad:w-px ipad:shadow-[1px_0px_0px_0px_#000000] ${
          i < COLUMNS ? "" : "hidden desktop-sm:block"
        }`}
      />
    ))}
  </div>
);
