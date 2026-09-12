'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Check, Copy } from 'lucide-react';
import { playCopySound } from '@/lib/lazy-sounds';

const PixelBlast = dynamic(() => import('@/components/reactbits/PixelBlast'), {
  ssr: false,
  loading: () => null,
});


export interface CtaSectionProps {
  title1?: string;
  title2?: string;
  description?: string;
  command?: string;
  className?: string;
}

export function CtaSection({
  title1 = 'Install Fast.',
  title2 = 'Build Faster.',
  description = 'Install sound-library and start shipping tactile UI audio.',
  command = 'npm install sound-library',
  className = '',
}: CtaSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      playCopySound();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API fails
      const textarea = document.createElement('textarea');
      textarea.value = command;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      playCopySound();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`relative mx-auto w-full max-w-[1192px] px-4 sm:px-6 ${className}`}
    >
      {/* Unified CTA Card with PixelBlast background */}
      <div className="relative flex flex-col items-center justify-center text-center rounded-[20px] bg-[#0c0c0c] border border-[#222222] px-5 sm:px-8 py-14 sm:py-20 md:py-24 overflow-hidden shadow-2xl">
        {/* PixelBlast Background covering 100% of the card with matching fiery orange */}
        <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden opacity-85">
          <PixelBlast
            variant="square"
            pixelSize={4}
            color="#ff3700"
            patternScale={2.2}
            patternDensity={0.76}
            pixelSizeJitter={0}
            enableRipples
            rippleSpeed={0.35}
            rippleThickness={0.12}
            rippleIntensityScale={1.2}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.4}
            edgeFade={0.22}
            transparent
            className="w-full h-full"
          />
        </div>

        {/* Ambient warm glow matching footer aurora atmosphere */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-4/5 h-36 bg-[#ff3700]/[0.06] blur-3xl rounded-full"
        />

        {/* Soft center vignette to keep typography crystal-clear while framing with dithered dots */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(12,12,12,0.6)_0%,rgba(12,12,12,0.18)_55%,transparent_85%)]"
        />

        {/* Subtle Top Specular Ambient Line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#ff3700]/40 to-transparent z-10"
        />

        {/* Heading Stack */}
        <div className="pointer-events-none relative z-10 flex flex-col items-center gap-[10px] text-center text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] select-none">
          <div className="font-helvetica-neue text-[26px] tracking-[-0.5px] sm:text-[34px] sm:tracking-[-0.7px] md:text-[40px] md:tracking-[-0.9px] leading-[1.2]">
            <span className="text-white/80 block">{title1}</span>
            <span className="text-white font-medium block mt-1">{title2}</span>
          </div>

          {/* Subtitle */}
          <p className="font-tight text-[15px] sm:text-[17px] md:text-[18px] tracking-[-0.32px] text-white/70 leading-[1.3] max-w-md mx-auto mt-1 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
            {description}
          </p>
        </div>

        {/* Command Pill Box */}
        <button
          type="button"
          onClick={handleCopy}
          data-copy-button="true"
          title="Click to copy"
          className="relative z-10 mt-7 sm:mt-8 inline-flex items-center gap-[10px] rounded-[100px] bg-[#161616]/90 hover:bg-[#202020] border border-[#2a2a2a] hover:border-[#ff3700]/50 px-[20px] py-[12px] backdrop-blur-md transition-all duration-150 cursor-pointer group shadow-lg pointer-events-auto"
        >
          <span className="font-tight text-[14px] font-semibold text-[#ff3700] select-none">
            $
          </span>
          <span className="font-dm-mono text-[13px] sm:text-[14px] text-white/90 tracking-normal">
            {command}
          </span>
          <span className="ml-[6px] flex items-center text-white/40 group-hover:text-white/80 transition-colors">
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in-50 duration-200" />
            ) : (
              <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

export default CtaSection;
