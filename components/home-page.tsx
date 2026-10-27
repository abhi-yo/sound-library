'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const HomeHeader = dynamic(() => import('@/components/home-header'), {
  loading: () => <div className="h-14 w-full" aria-hidden />,
});

const Hero26 = dynamic(() => import('@/components/originkit/hero-26'), {
  ssr: false,
  loading: () => <div className="w-full min-h-[70vh] bg-black" aria-hidden />,
});

const Features04 = dynamic(() => import('@/components/originkit/features-04'), {
  loading: () => <div className="w-full min-h-[40vh] bg-[#0a0a0a]" aria-hidden />,
});

const EdgeDotBands = dynamic(
  () => import('@/components/originkit/ui/features-04/edge-dot-bands').then((m) => m.EdgeDotBands),
  { ssr: false, loading: () => null }
);

const HomeHowItWorks = dynamic(
  () => import('@/components/home-how-it-works').then((m) => m.HomeHowItWorks),
  { loading: () => <div className="min-h-[28vh] w-full" aria-hidden /> }
);

const CtaSection = dynamic(
  () => import('@/components/cta-section').then((m) => m.CtaSection),
  { loading: () => <div className="h-40 w-full" aria-hidden /> }
);

const BigFooter = dynamic(
  () => import('@/components/big-footer').then((m) => m.BigFooter),
  { loading: () => <div className="h-48 w-full" aria-hidden /> }
);

export default function HomePage() {
  return (
    <div className="min-h-screen min-w-0 flex flex-col overflow-x-clip bg-black text-neutral-100 font-sans selection:bg-white selection:text-neutral-900">
      <HomeHeader />
      <Hero26 />
      <Features04 />

      <section className="relative w-full overflow-hidden bg-[#0a0a0a] desktop-sm:bg-[#0c0c0c]">
        <div className="relative mx-auto w-full overflow-hidden wide-lg:max-w-[1440px]">
          <div className="ok-browse-edge-bands">
            <EdgeDotBands />
          </div>
          <HomeHowItWorks />
          <div className="pb-20 sm:pb-24 ipad:pb-28 px-0">
            <CtaSection />
          </div>
        </div>
      </section>

      <BigFooter />
    </div>
  );
}
