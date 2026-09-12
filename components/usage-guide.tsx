'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { playCopySound } from '@/lib/lazy-sounds';

export function UsageGuide() {
  const [copied, setCopied] = useState(false);

  const sampleSnippet = `// Standalone capacitive tap function
export function playTap() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1800, now);
  osc.frequency.exponentialRampToValueAtTime(700, now + 0.035);
  
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
  
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.04);
}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <h2 className="text-sm font-medium text-foreground tracking-tight">Integration Pattern</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Every sound is a zero-dependency function. Paste it into your codebase or invoke from the central dispatcher.
          </p>
        </div>
        <Link
          href="/docs"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Documentation &rarr;
        </Link>
      </div>

      <div className="rounded-xl border border-border/80 bg-card/40 p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/50 text-xs text-muted-foreground font-mono">
          <span>lib/sounds/tap.ts</span>
          <button
            type="button"
            data-copy-button="true"
            title="Copy code snippet"
            onClick={() => {
              navigator.clipboard.writeText(sampleSnippet).then(() => {
                playCopySound();
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              });
            }}
            className="rounded border border-border bg-background px-2 py-0.5 text-[11px] text-foreground hover:bg-accent transition-colors cursor-pointer select-none"
          >
            {copied ? 'copied' : 'copy'}
          </button>
        </div>

        <pre className="overflow-x-auto text-[11px] font-mono leading-relaxed text-foreground max-h-56">
          <code>{sampleSnippet}</code>
        </pre>
      </div>
    </div>
  );
}
