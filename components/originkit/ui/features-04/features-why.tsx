// Delivered by Originkit · stack: nextjs · styling: tailwind
// Dark-themed for sound-bits
"use client";

import { EdgeDotBands } from "@/components/originkit/ui/features-04/edge-dot-bands";
import { FeatureCard, Plate, WideCard } from "@/components/originkit/ui/features-04/cards";
import { CornerBlocks } from "@/components/originkit/ui/features-04/corner-blocks";
import { GridColumns, GridRows } from "@/components/originkit/ui/features-04/grid-pattern";

function asset(file: string) {
  return `/originkit/features-04/${file}`;
}

/** Soft ellipse wash behind the heading on phone/tablet. */
const Glow = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute top-[56px] left-[calc(50%-0.43px)] h-[957px] w-[492px] -translate-x-1/2 rounded-[50%] bg-[#1a1a1a] blur-[26px] ipad:top-[27px] ipad:left-[calc(50%+15.21px)] ipad:w-[689px] desktop-sm:hidden"
  />
);

/** Desktop wash — covers the grid below the heading. */
const DesktopGlow = () => (
  <>
    <div
      aria-hidden
      className="pointer-events-none absolute top-[-17px] left-1/2 hidden h-[267px] w-[660px] -translate-x-1/2 rounded-[50%] bg-[#1a1a1a] blur-[26px] desktop-sm:block"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute top-[90px] left-[calc(50%+42px)] hidden h-[1052px] w-[calc(100%+298px)] -translate-x-1/2 rounded-[50%] bg-[#141414] blur-[26px] desktop-sm:block"
    />
  </>
);

const FEATURES = {
  focus: {
    title: "Procedural",
    body: "Every sound is synthesized live via Web Audio API. No audio files to download, host, or cache. Pure code.",
    art: {
      src: asset("procedural.png"),
      alt: "An isometric oscillator module with an orange sine wave on its screen, knobs, faders and a patch cable, rendered in ASCII characters",
      boxClassName: "h-[150px] w-[200px] ipad:h-[196px] ipad:w-[212px]",
      artClassName: "inset-0 h-full w-full",
      accent: true,
    },
  },
  connect: {
    title: "Framework Agnostic",
    body: "React, Vue, Svelte, vanilla JS — a single import works everywhere. No adapters, no wrappers, no config.",
    art: {
      src: asset("agnostic.png"),
      alt: "One isometric sound core wired into four different framework blocks, rendered in ASCII characters",
      boxClassName: "h-[150px] w-[210px] ipad:h-[196px] ipad:w-[234px]",
      artClassName: "inset-0 h-full w-full",
      accent: true,
    },
  },
  scale: {
    title: "Instant Playback",
    body: "Sub-millisecond latency because there are no network round-trips and no decoding stalls. Sounds fire the instant you call them.",
    art: {
      src: asset("playback.png"),
      alt: "An isometric speaker cabinet beside a glowing play pad sending ripples across the floor, rendered in ASCII characters",
      boxClassName:
        "h-[170px] w-[180px] ipad:h-[213px] ipad:w-[223px] desktop-sm:h-[271px] desktop-sm:w-[283px]",
      artClassName: "inset-0 h-full w-full",
      accent: true,
    },
  },
};

export const FeaturesWhy = () => (
  <section className="ok-f04-why animate-hero-reveal relative w-full overflow-hidden bg-[#0a0a0a] desktop-sm:bg-[#0c0c0c]">
    <div className="relative mx-auto w-full overflow-hidden pt-[56px] ipad:pt-[127px] desktop-sm:pt-[63px] wide-lg:max-w-[1440px]">
      {/* Ruled grid + highlighted cells; hidden on phones (see hero-26.css). */}
      <div aria-hidden className="ok-f04-bg-grid contents">
        <GridRows />
        <GridColumns />
        <CornerBlocks />
      </div>
      <Glow />
      <DesktopGlow />
      <div className="ok-browse-edge-bands">
        <EdgeDotBands />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1192px] flex-col items-center gap-[24px] px-4 sm:px-6 lg:px-8 pb-[60px] ipad:gap-[52px] ipad:pb-[104px] desktop-sm:gap-[72px] desktop-sm:pb-[62px]">
        <header className="flex w-full flex-col items-center gap-[16px] ipad:w-[502px] ipad:gap-[20px]">
          <div className="flex items-center gap-[8px] rounded-[100px] bg-[#1c1c1c] border border-[#2a2a2a] px-[14px] py-[12px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff3700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span className="font-tight text-[12px] leading-[1.2] font-medium tracking-[-0.24px] whitespace-nowrap text-[#ff3700] ipad:text-[14px] ipad:tracking-[-0.28px]">
              Why Sound Bits
            </span>
          </div>
          <div className="flex w-full flex-col items-center gap-[12px] text-center leading-[1.2] text-white">
            <h2 className="max-w-[282px] font-helvetica-neue text-[24px] tracking-[-0.48px] ipad:max-w-none ipad:text-[32px] ipad:tracking-[-0.64px]">
              Sound Without the Weight.
            </h2>
            <p className="max-w-[238px] font-tight text-[16px] tracking-[-0.32px] opacity-50 ipad:max-w-none ipad:text-[18px] ipad:tracking-[-0.36px] ipad:whitespace-nowrap">
              Procedural audio, zero dependencies, instant playback.
            </p>
          </div>
        </header>

        <div className="flex w-full flex-col gap-[12px] ipad:gap-[16px] desktop-sm:grid desktop-sm:grid-cols-3 desktop-sm:items-stretch">
          <div className="flex flex-col gap-[12px] ipad:flex-row ipad:items-center ipad:gap-[16px] desktop-sm:contents">
            <div className="flex flex-col gap-[12px] ipad:w-[286px] ipad:shrink-0 ipad:gap-[16px] desktop-sm:w-auto">
              <Plate innerClassName="h-[64px] items-center gap-[10px] px-[16px] py-[10px] ipad:h-[76px] ipad:px-[20px] ipad:py-[12px]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff3700" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {/* waveform bars */}
                  <line x1="3" y1="10" x2="3" y2="14" />
                  <line x1="7.5" y1="6" x2="7.5" y2="18" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                  <line x1="16.5" y1="7" x2="16.5" y2="17" />
                  <line x1="21" y1="10" x2="21" y2="14" />
                </svg>
                <p className="w-[154px] font-tight text-[15px] leading-[1.2] font-medium text-white ipad:text-[16px] desktop-sm:w-auto desktop-sm:text-[18px] desktop-sm:whitespace-nowrap">
                  60+ Synthesized Sounds
                </p>
              </Plate>

              <FeatureCard {...FEATURES.focus} />
            </div>

            <div className="flex flex-col gap-[12px] ipad:flex-1 ipad:gap-[16px]">
              <FeatureCard {...FEATURES.connect} />

              <Plate innerClassName="h-[64px] items-center gap-[12px] px-[16px] py-[10px] ipad:h-[76px] ipad:px-[20px] ipad:py-[12px]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff3700" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {/* lightning bolt */}
                  <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
                </svg>
                <p className="font-tight text-[15px] leading-[1.2] font-medium whitespace-nowrap text-white ipad:text-[16px] desktop-sm:text-[18px]">
                  Sub-ms Latency
                </p>
              </Plate>
            </div>
          </div>

          <WideCard {...FEATURES.scale} />
        </div>
      </div>
    </div>
  </section>
);
