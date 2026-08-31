import React from 'react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Callout } from 'fumadocs-ui/components/callout';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { SoundPlayer } from '@/components/sound-player';
import { SoundPlayButton } from '@/components/sound-header';
import { SoundMatrix } from '@/components/sound-matrix';
import { SoundShowcase } from '@/components/sound-showcase';
import { CommandPaletteMockup } from '@/components/ui-mockups/command-palette-mockup';
import { AudioRackMockup } from '@/components/ui-mockups/audio-rack-mockup';
import { InteractiveOsMockup } from '@/components/ui-mockups/interactive-os-mockup';
import { SoundStudio } from '@/components/ui-mockups/sound-studio';

function CompactCards({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={`not-prose grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

function CompactCard({
  title,
  description,
  href,
  children,
  className,
  ...props
}: {
  title: string;
  description?: string;
  href?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const content = (
    <>
      <div className="text-sm font-semibold text-fd-foreground tracking-tight">{title}</div>
      {description && <div className="text-xs text-fd-muted-foreground mt-1 leading-normal">{description}</div>}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`block rounded-xl border border-fd-border/70 bg-fd-card/50 px-3.5 py-2.5 transition-all hover:bg-fd-accent/50 hover:border-fd-border no-underline ${className || ''}`}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={`rounded-xl border border-fd-border/70 bg-fd-card/50 px-3.5 py-2.5 transition-colors ${className || ''}`}
      {...props}
    >
      {content}
    </div>
  );
}

export function getMDXComponents() {
  return {
    ...defaultMdxComponents,
    Callout,
    Tab,
    Tabs,
    Step,
    Steps,
    Card: CompactCard,
    Cards: CompactCards,
    TypeTable,
    Accordion,
    Accordions,
    SoundPlayer,
    SoundPlayButton,
    SoundMatrix,
    SoundShowcase,
    CommandPaletteMockup,
    AudioRackMockup,
    InteractiveOsMockup,
    SoundStudio,
  };
}
