'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronsRight, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import HomeHeader from '@/components/home-header';
import NewItemsLoading from '@/components/new-items-loading';
import ShimmerButton from '@/components/ui/shimmer-button';
import { Button } from '@/components/ui/button';
import { BloubAvatar } from '@/components/bloub-avatar';
import TextAnimation from '@/components/ui/scroll-text';
import { SoundBlobs } from '@/components/sound-blobs';
import dynamic from 'next/dynamic';

const BentoFeatures = dynamic(() => import('@/components/bento-features'), {
  ssr: false,
});

export default function Home() {
  const [blocks, setBlocks] = useState<React.ReactNode[]>([]);

  const activeDivs = useMemo(
    () => ({
      0: new Set([4, 1]),
      2: new Set([3]),
      4: new Set([2, 5, 8]),
      5: new Set([4]),
      6: new Set([0]),
      7: new Set([1]),
      10: new Set([3]),
      12: new Set([7]),
      13: new Set([2, 4]),
      14: new Set([1, 5]),
      15: new Set([3, 6]),
    }),
    []
  );

  useEffect(() => {
    const updateBlocks = () => {
      const { innerWidth, innerHeight } = window;
      const blockSize = innerWidth * 0.06;
      const amountOfBlocks = Math.ceil(innerHeight / blockSize);

      const newBlocks = Array.from({ length: 17 }, (_, columnIndex) => (
        <div key={columnIndex} className='w-[6vw] h-full'>
          {Array.from({ length: amountOfBlocks }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className={cn(
                'h-[6vw] w-full border dark:border-[rgba(255,255,255,0.02)] border-gray-100/70',
                activeDivs[columnIndex as keyof typeof activeDivs]?.has(rowIndex)
                  ? 'dark:bg-[rgba(255,255,255,0.035)] bg-gray-50'
                  : ''
              )}
              style={{ height: `${blockSize}px` }}
            ></div>
          ))}
        </div>
      ));
      setBlocks(newBlocks);
    };

    updateBlocks();
    window.addEventListener('resize', updateBlocks);

    return () => window.removeEventListener('resize', updateBlocks);
  }, [activeDivs]);

  return (
    <div className='relative flex min-h-screen flex-col selection:bg-foreground selection:text-background dark:bg-black bg-white'>
      <HomeHeader />
      
      <main className="flex-1">
        {/* ─── Hero Section ─── */}
        <section className='h-screen overflow-hidden relative pb-20 dark:bg-black bg-white'>
          <div className='absolute inset-0 z-0 h-screen w-full dark:bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px]'></div>
          <div className='absolute inset-0 top-0 left-0 h-screen w-full items-center px-5 py-24 bg-gradient-to-t dark:from-black from-white from-0% to-transparent to-60%'></div>

          <div className='pointer-events-none absolute inset-0 flex w-screen justify-end [mask-image:radial-gradient(transparent_5%,white)]'>
            <svg
              width='1512'
              height='1714'
              viewBox='0 0 1512 1714'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='pointer-events-none absolute left-0 top-0 h-auto w-full lg:w-1/2'
            >
              <g clipPath='url(#clip0_143_13)'>
                <g filter='url(#filter0_f_143_13)'>
                  <path
                    d='M1045.18 982.551C1129.83 903.957 204.996 477.237 -235.529 294L-339.645 584.211C59.2367 752.376 960.521 1061.15 1045.18 982.551Z'
                    fill='white'
                    fillOpacity='0.12'
                  ></path>
                </g>
              </g>
              <defs>
                <filter
                  id='filter0_f_143_13'
                  x='-595.645'
                  y='38'
                  width='1902.26'
                  height='1213.13'
                  filterUnits='userSpaceOnUse'
                  colorInterpolationFilters='sRGB'
                >
                  <feFlood floodOpacity='0' result='BackgroundImageFix'></feFlood>
                  <feBlend
                    mode='normal'
                    in='SourceGraphic'
                    in2='BackgroundImageFix'
                    result='shape'
                  ></feBlend>
                  <feGaussianBlur
                    stdDeviation='64'
                    result='effect1_foregroundBlur_143_13'
                  ></feGaussianBlur>
                </filter>
                <clipPath id='clip0_143_13'>
                  <rect width='1512' height='1714' fill='white'></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          
          <article className='grid 2xl:pt-48 2xl:pb-20 py-36 relative z-10 sm:px-0 px-4 mt-10'>
            <NewItemsLoading />
            <h1 className='text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-bold text-black dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto'>
              <span className='block mb-1.5 sm:mb-2'>Don&apos;t Just Ship UIs,</span>
              <span className='relative flex flex-wrap gap-2 justify-center items-center'>
                Ship{' '}
                <span className='italic px-3 py-0.5 rounded-lg text-blue-600 dark:text-blue-400 dark:bg-neutral-900 bg-neutral-100 dark:border-neutral-800 border-neutral-200 border inline-block shadow-xs'>
                  Immersive
                </span>{' '}
                Ones.
              </span>
            </h1>
            <p className='mx-auto max-w-2xl sm:w-[85%] text-center text-sm sm:text-lg md:text-xl mt-6 text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal'>
              Procedural micro-interaction sound effects synthesized directly in the browser with native <strong className="font-semibold text-black dark:text-white">Web Audio API</strong>. Save countless hours, craft tactical UI interactions, and engage your users with <strong className="font-semibold text-black dark:text-white">zero audio files</strong> and <strong className="font-semibold text-black dark:text-white">zero dependencies</strong>.
            </p>
            <div className='flex flex-wrap gap-4 justify-center items-center mt-8'>
              <Link href="/docs/sounds">
                <ShimmerButton
                  borderRadius={'100px'}
                  className='flex items-center gap-2 w-fit rounded-full h-12 px-6'
                  background={'#334cec'}
                >
                  <span className='whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white'>
                    Start Auditioning
                  </span>
                </ShimmerButton>
              </Link>

              <Link href="/docs">
                <Button className='rounded-full px-6 h-12 bg-white text-black hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 shadow-sm text-sm font-medium'>
                  Read Documentation
                  <ChevronsRight className="ml-1 size-4" />
                </Button>
              </Link>
            </div>
          </article>
          <div className='flex h-screen overflow-hidden top-0 left-0 inset-0 z-0 absolute pointer-events-none'>
            {blocks}
          </div>
        </section>

        {/* ─── Apple-Style Scroll Text Sections ─── */}
        {/* ─── Apple-Style Scroll Text Sections ─── */}
        <section className='dark:bg-black bg-white transition-colors overflow-hidden'>
          {/* Story Section 1: Realism & Acoustic Depth */}
          <div className='min-h-[80vh] sm:min-h-[90vh] py-20 sm:py-36 flex flex-col justify-center items-center text-center px-4 sm:px-6'>
            <TextAnimation
              text='Sounds that feel real.'
              classname='xl:text-8xl md:text-7xl sm:text-5xl text-3xl sm:text-4xl max-w-4xl mx-auto font-semibold capitalize tracking-tight text-black dark:text-white'
            />
            <TextAnimation
              as='p'
              text='Procedural waveforms sculpted with physical acoustics. Dynamic pitch decay, harmonic resonance, and instant tactile feedback.'
              classname='mt-6 text-base sm:text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed'
            />
          </div>

          {/* Story Section 2: UI Micro-Interactions */}
          <div className='min-h-[80vh] sm:min-h-[90vh] py-20 sm:py-36 flex flex-col justify-center items-start px-4 sm:px-8 md:px-20'>
            <TextAnimation
              as='h2'
              letterAnime={true}
              text="Every click, toggle, and transition — alive ✨"
              classname='xl:text-7xl md:text-6xl sm:text-4xl text-2xl sm:text-3xl max-w-3xl text-black dark:text-white font-medium tracking-tight'
            />
            <TextAnimation
              as='p'
              text='Turn static components into sensory micro-interactions. Auditory cues built for buttons, switches, modals, sliders, and drag-and-drop workflows.'
              classname='mt-6 text-base sm:text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 max-w-xl font-normal leading-relaxed text-left'
            />
          </div>

          {/* Story Section 3: Zero Overhead & Web Audio */}
          <div className='min-h-[80vh] sm:min-h-[90vh] py-20 sm:py-36 flex flex-col justify-center items-center sm:items-end text-center sm:text-right px-4 sm:px-8 md:px-20'>
            <TextAnimation
              text='Zero files. Pure synthesis.'
              direction='right'
              classname='xl:text-8xl md:text-7xl sm:text-5xl text-3xl sm:text-4xl max-w-3xl sm:ml-auto capitalize font-semibold tracking-tight text-black dark:text-white'
            />
            <TextAnimation
              as='p'
              direction='right'
              text='No audio hosting, no HTTP requests, zero bundler setup. Everything is computed live in milliseconds via browser-native Web Audio API.'
              classname='mt-6 text-base sm:text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 max-w-xl sm:ml-auto font-normal leading-relaxed'
            />
          </div>
        </section>

        {/* ─── Bento Grid Features ─── */}
        <div className='dark:bg-black bg-white transition-colors pb-12'>
          <BentoFeatures />
        </div>

        {/* ─── Interactive Sound Playground / Audition CTA Section with Blobs ─── */}
        <section className="py-24 sm:py-32 dark:bg-black bg-white transition-colors relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 dark:bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="mx-auto max-w-4xl px-6 sm:px-8 relative z-10 text-center">
            <h2 className="text-4xl sm:text-6xl font-bold text-black dark:text-white tracking-tight">
              Ready to make your UI tactile?
            </h2>

            <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mt-4 leading-relaxed">
              Explore 20+ procedural micro-interactions synthesized in real-time. Zero network latency, zero dependencies.
            </p>

            {/* Interactive Sound Blobs */}
            <div className="mt-8">
              <SoundBlobs />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <Link href="/docs/sounds">
                <ShimmerButton
                  borderRadius={'100px'}
                  className='flex items-center gap-2 w-fit rounded-full h-12 px-6'
                  background={'#334cec'}
                >
                  <span className='whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white'>
                    Explore Sound Catalog
                  </span>
                </ShimmerButton>
              </Link>

              <Link href="/docs">
                <Button className='rounded-full px-6 h-12 bg-white text-black hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 shadow-sm text-sm font-medium'>
                  Read Documentation
                  <ChevronsRight className="ml-1 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Clean Minimalist Footer ─── */}
      <footer className="border-t dark:border-neutral-900 border-neutral-200 dark:bg-black bg-white py-14 transition-colors">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b dark:border-neutral-900 border-neutral-100">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <BloubAvatar size={32} />
              <div>
                <span className="text-base font-bold tracking-tight text-black dark:text-white">
                  Sound Library
                </span>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Procedural Web Audio Engine
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
              <Link href="/docs" className="hover:text-black dark:hover:text-white transition-colors">
                Docs
              </Link>
              <Link href="/docs/sounds" className="hover:text-black dark:hover:text-white transition-colors">
                Catalog
              </Link>
              <Link href="/docs/installation" className="hover:text-black dark:hover:text-white transition-colors">
                Installation
              </Link>
              <Link href="/usage" className="hover:text-black dark:hover:text-white transition-colors">
                Usage
              </Link>
              <a
                href="https://github.com/abhi-yo/sound-library"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Github className="size-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://twitter.com/abhi_yo"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 gap-3">
            <div>
              © {new Date().getFullYear()} Sound Library. MIT License · Zero dependencies.
            </div>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-500"></span>
              <span>All sounds synthesized client-side</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
