// Delivered by Originkit · stack: nextjs · styling: tailwind
// Dark-themed for sound-bits
"use client";

import type { ReactNode } from "react";

import { AsciiArt } from "@/components/originkit/ui/features-04/ascii-art";

export const Plate = ({
  children,
  outerClassName = "",
  innerClassName,
}: {
  children: ReactNode;
  outerClassName?: string;
  innerClassName: string;
}) => (
  <div
    className={`flex flex-col rounded-[20px] bg-[#1a1a1a] p-[8px] ${outerClassName}`}
  >
    <div
      className={`flex rounded-[16px] bg-[#111111] drop-shadow-[0px_0px_6px_rgba(0,0,0,0.5)] ${innerClassName}`}
    >
      {children}
    </div>
  </div>
);

/** Title over body. */
const CardText = ({ title, body }: { title: string; body: string }) => (
  <div className="flex w-full flex-col gap-[12px] font-tight leading-[1.2] text-white">
    <h3 className="text-[18px] font-medium desktop-sm:text-[20px]">{title}</h3>
    <p className="text-[14px] opacity-50 desktop-sm:text-[16px]">{body}</p>
  </div>
);

interface Art {
  src: string;
  alt: string;
  boxClassName: string;
  artClassName: string;
}

export const FeatureCard = ({
  title,
  body,
  art,
}: {
  title: string;
  body: string;
  art: Art;
}) => (
  <Plate
    outerClassName="ipad:h-[373px]"
    innerClassName="flex-col gap-[10px] px-[20px] pt-[12px] pb-[20px] ipad:min-h-px ipad:flex-1 ipad:justify-end"
  >
    <div className="flex w-full flex-col items-center justify-center pb-[20px]">
      <AsciiArt {...art} />
    </div>
    <CardText title={title} body={body} />
  </Plate>
);

export const WideCard = ({
  title,
  body,
  art,
}: {
  title: string;
  body: string;
  art: Art;
}) => (
  <Plate
    outerClassName="desktop-sm:h-full"
    innerClassName="flex-col items-center gap-[10px] px-[20px] pt-[12px] pb-[20px] ipad:pt-[20px] desktop-sm:min-h-px desktop-sm:flex-1 desktop-sm:justify-between desktop-sm:pt-[32px]"
  >
    <div className="flex w-full flex-col items-center justify-center pb-[20px]">
      <AsciiArt {...art} />
    </div>
    <CardText title={title} body={body} />
  </Plate>
);
