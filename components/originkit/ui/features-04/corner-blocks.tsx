// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

/**
 * Figma "Group 2147240570" (2356:186 / 2356:197 / 2356:475) and its partner
 * (2356:191 / 2356:202 / 2356:415) — the eight filled cells that zig-zag down
 * the top of the grid.
 *
 * Each group is four squares of #ededed at 80% opacity stepping column to
 * column on every row, which is exactly two columns by four rows of the
 * background grid — so the group is laid out as that grid, cells sized to the
 * rule pitch (34.996 + 0.67 on phone, 52 + 1 above it), instead of four
 * absolutely placed squares.
 *
 * Both groups are measured from the ruled band rather than from the frame
 * edges, and they follow it wherever it goes — centred through tablet, pinned
 * to the left dot bar on desktop. Anchoring them to the frame instead would
 * walk them off their rules the moment the window is not exactly the Figma
 * width. Inside the band the pair starts 286.42 / 319 / 54 in and stands
 * 178.34 / 425 / 1008 apart, which is a whole number of rules every time.
 *
 * Phone and tablet mirror the two groups; desktop does not — there the right
 * group repeats the left one's step, so the second column is the one that
 * leads on both sides.
 */

const LEFT_CELLS = [
  "col-start-2 row-start-1",
  "col-start-1 row-start-2",
  "col-start-2 row-start-3",
  "col-start-1 row-start-4",
];

const RIGHT_CELLS = [
  "col-start-1 row-start-1 desktop-sm:col-start-2",
  "col-start-2 row-start-2 desktop-sm:col-start-1",
  "col-start-1 row-start-3 desktop-sm:col-start-2",
  "col-start-2 row-start-4 desktop-sm:col-start-1",
];

const BlockGrid = ({ cells }: { cells: string[] }) => (
  <div className="grid shrink-0 grid-cols-[repeat(2,34.996px)] grid-rows-[repeat(4,34.996px)] gap-[0.67px] ipad:grid-cols-[repeat(2,52px)] ipad:grid-rows-[repeat(4,52px)] ipad:gap-px">
    {cells.map((cell) => (
      <span key={cell} className={`bg-[#1a1a1a] opacity-80 ${cell}`} />
    ))}
  </div>
);

export const CornerBlocks = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute top-px left-[calc(50%-8.36px)] flex w-[872.99px] -translate-x-1/2 gap-[178.34px] pl-[286.42px] ipad:left-[calc(50%-0.29px)] ipad:w-[1296px] ipad:gap-[425px] ipad:pl-[319px] desktop-sm:top-[4px] desktop-sm:left-[72px] desktop-sm:w-auto desktop-sm:translate-x-0 desktop-sm:gap-[1008px] desktop-sm:pl-[54px]"
  >
    <BlockGrid cells={LEFT_CELLS} />
    <BlockGrid cells={RIGHT_CELLS} />
  </div>
);
