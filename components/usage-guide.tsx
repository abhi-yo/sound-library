'use client';

import { useState } from 'react';

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const availableSounds = [
  { name: 'button-click', use: 'Primary button presses', source: 'click1.mp3' },
  { name: 'button-click-secondary', use: 'Secondary / ghost buttons', source: 'click2.mp3' },
  { name: 'hover-blip', use: 'Hovering over interactive elements', source: 'Web Audio API' },
  { name: 'hover-soft', use: 'Subtle hover feedback', source: 'Web Audio API' },
  { name: 'success-chime', use: 'Form submissions, saves', source: 'Web Audio API' },
  { name: 'success-bell', use: 'Achievements, milestones', source: 'Web Audio API' },
  { name: 'error-buzz', use: 'Validation errors, failed actions', source: 'Web Audio API' },
  { name: 'error-beep', use: 'Warnings, blocked actions', source: 'Web Audio API' },
  { name: 'notification-ping', use: 'New messages, alerts', source: 'Web Audio API' },
  { name: 'notification-subtle', use: 'Background updates', source: 'Web Audio API' },
  { name: 'swoosh', use: 'Page transitions, panel slides', source: 'Web Audio API' },
  { name: 'pop', use: 'Tooltips, popovers, reveals', source: 'Web Audio API' },
  { name: 'slider-tick', use: 'Sliders, range inputs', source: 'Web Audio API' },
];

export function UsageGuide() {
  const [copiedQuick, setCopiedQuick] = useState(false);

  const quickStartCode = `const ctx = new AudioContext();
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(800, ctx.currentTime);
gain.gain.setValueAtTime(0.25, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
osc.connect(gain).connect(ctx.destination);
osc.start();
osc.stop(ctx.currentTime + 0.15);`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          How to Use
        </h2>
        <p className="text-sm text-muted-foreground">
          Every Web Audio sound has a <strong>copy</strong> button — it copies standalone code you can paste anywhere, no imports needed. MP3 sounds have a <strong>download</strong> button instead — drop the file in your project and play it with <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">new Audio()</code>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Web Audio example */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-card-foreground">Web Audio sounds</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(quickStartCode).then(() => {
                  setCopiedQuick(true);
                  setTimeout(() => setCopiedQuick(false), 2000);
                });
              }}
              title="Copy code"
              className="rounded-md border border-border bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-accent"
            >
              {copiedQuick ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs leading-relaxed font-mono text-muted-foreground">
            <code>{quickStartCode}</code>
          </pre>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Zero dependencies. Works in any framework. Hit the copy button on any card above to get its snippet.
          </p>
        </div>

        {/* MP3 example */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-card-foreground">MP3 sounds</h3>
          </div>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs leading-relaxed font-mono text-muted-foreground">
            <code>{`// 1. Download the mp3 from the card above
// 2. Put it in your public/ folder
// 3. Play it:

const audio = new Audio('/click1.mp3');
audio.volume = 0.5;
audio.play();`}</code>
          </pre>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Hit the download button on the first two cards to save the mp3 files.
          </p>
        </div>
      </div>

      {/* Sound reference table */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">All Sounds</h3>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Use
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {availableSounds.map((sound) => (
                <tr
                  key={sound.name}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-2.5">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-card-foreground">
                      {sound.name}
                    </code>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">
                    {sound.use}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] font-mono ${sound.source.endsWith('.mp3') ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {sound.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
