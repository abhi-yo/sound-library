'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { SoundName } from '@/lib/sounds';
import { playSound } from '@/lib/sounds';

// Standalone copy-paste code for each sound
const soundSnippets: Record<SoundName, string> = {
  'button-click': `// Requires click1.mp3 in your public folder
const audio = new Audio('/click1.mp3');
audio.volume = 0.5;
audio.play();`,

  'button-click-secondary': `// Requires click2.mp3 in your public folder
const audio = new Audio('/click2.mp3');
audio.volume = 0.5;
audio.play();`,

  'hover-blip': `const ctx = new AudioContext();
const now = ctx.currentTime;
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(1200, now);
osc.frequency.exponentialRampToValueAtTime(2400, now + 0.05);
gain.gain.setValueAtTime(0.15, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
osc.connect(gain).connect(ctx.destination);
osc.start(now);
osc.stop(now + 0.05);`,

  'hover-soft': `const ctx = new AudioContext();
const now = ctx.currentTime;
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(900, now);
gain.gain.setValueAtTime(0.08, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
osc.connect(gain).connect(ctx.destination);
osc.start(now);
osc.stop(now + 0.06);`,

  'success-chime': `const ctx = new AudioContext();
const now = ctx.currentTime;
// Note 1
const osc1 = ctx.createOscillator();
const gain1 = ctx.createGain();
osc1.type = 'sine';
osc1.frequency.setValueAtTime(800, now);
gain1.gain.setValueAtTime(0.25, now);
gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
osc1.connect(gain1).connect(ctx.destination);
osc1.start(now);
osc1.stop(now + 0.15);
// Note 2
const osc2 = ctx.createOscillator();
const gain2 = ctx.createGain();
osc2.type = 'sine';
osc2.frequency.setValueAtTime(1200, now + 0.1);
gain2.gain.setValueAtTime(0.001, now);
gain2.gain.setValueAtTime(0.25, now + 0.1);
gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
osc2.connect(gain2).connect(ctx.destination);
osc2.start(now + 0.1);
osc2.stop(now + 0.3);`,

  'success-bell': `const ctx = new AudioContext();
const now = ctx.currentTime;
[1000, 1250, 1500].forEach((freq, i) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now + i * 0.08);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.setValueAtTime(0.2, now + i * 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now + i * 0.08);
  osc.stop(now + i * 0.08 + 0.15);
});`,

  'error-buzz': `const ctx = new AudioContext();
const now = ctx.currentTime;
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sawtooth';
osc.frequency.setValueAtTime(150, now);
gain.gain.setValueAtTime(0.2, now);
gain.gain.setValueAtTime(0.001, now + 0.08);
gain.gain.setValueAtTime(0.2, now + 0.1);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
osc.connect(gain).connect(ctx.destination);
osc.start(now);
osc.stop(now + 0.2);`,

  'error-beep': `const ctx = new AudioContext();
const now = ctx.currentTime;
[500, 350].forEach((freq, i) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, now + i * 0.12);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.setValueAtTime(0.15, now + i * 0.12);
  gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.1);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now + i * 0.12);
  osc.stop(now + i * 0.12 + 0.1);
});`,

  'notification-ping': `const ctx = new AudioContext();
const now = ctx.currentTime;
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(1100, now);
osc.frequency.exponentialRampToValueAtTime(1800, now + 0.05);
osc.frequency.exponentialRampToValueAtTime(1100, now + 0.1);
gain.gain.setValueAtTime(0.25, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
osc.connect(gain).connect(ctx.destination);
osc.start(now);
osc.stop(now + 0.15);`,

  'notification-subtle': `const ctx = new AudioContext();
const now = ctx.currentTime;
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(700, now);
gain.gain.setValueAtTime(0.1, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
osc.connect(gain).connect(ctx.destination);
osc.start(now);
osc.stop(now + 0.12);`,

  'swoosh': `const ctx = new AudioContext();
const now = ctx.currentTime;
const bufferSize = Math.floor(ctx.sampleRate * 0.4);
const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
const data = buffer.getChannelData(0);
for (let i = 0; i < bufferSize; i++) {
  data[i] = Math.random() * 2 - 1;
}
const noise = ctx.createBufferSource();
noise.buffer = buffer;
const lp = ctx.createBiquadFilter();
lp.type = 'lowpass';
lp.frequency.setValueAtTime(350, now);
lp.frequency.linearRampToValueAtTime(500, now + 0.15);
lp.frequency.linearRampToValueAtTime(250, now + 0.38);
lp.Q.setValueAtTime(0.5, now);
const noiseGain = ctx.createGain();
noiseGain.gain.setValueAtTime(0.001, now);
noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.16);
noiseGain.gain.linearRampToValueAtTime(0.05, now + 0.24);
noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
noise.connect(lp).connect(noiseGain).connect(ctx.destination);
noise.start(now);
noise.stop(now + 0.4);`,

  'pop': `const ctx = new AudioContext();
const now = ctx.currentTime;
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(950, now);
osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
gain.gain.setValueAtTime(0.35, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
osc.connect(gain).connect(ctx.destination);
osc.start(now);
osc.stop(now + 0.08);`,

  'slider-tick': `const ctx = new AudioContext();
const now = ctx.currentTime;
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'square';
osc.frequency.setValueAtTime(5000, now);
osc.frequency.exponentialRampToValueAtTime(1200, now + 0.005);
gain.gain.setValueAtTime(0.08, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
osc.connect(gain).connect(ctx.destination);
osc.start(now);
osc.stop(now + 0.01);`,

  'key-press': `// Usage: element.onkeydown = (e) => { if (!e.repeat) playKey(); }
function playKey() {
const ctx = new AudioContext();
const now = ctx.currentTime;
// Lubed Cherry MX Brown — deep muted thock, no click
const v = () => 0.94 + Math.random() * 0.12;
const drift = Math.random() * 0.0015;
// Layer 1: bottom-out thock (main sound)
const thud = ctx.createOscillator();
const thudGain = ctx.createGain();
const thudFilter = ctx.createBiquadFilter();
thud.type = 'sine';
thud.frequency.setValueAtTime(95 * v(), now + drift);
thud.frequency.exponentialRampToValueAtTime(38, now + drift + 0.04);
thudFilter.type = 'lowpass';
thudFilter.frequency.setValueAtTime(300, now + drift);
thudFilter.Q.setValueAtTime(0.5, now + drift);
thudGain.gain.setValueAtTime(0.22, now + drift);
thudGain.gain.exponentialRampToValueAtTime(0.001, now + drift + 0.055);
thud.connect(thudFilter).connect(thudGain).connect(ctx.destination);
thud.start(now + drift); thud.stop(now + drift + 0.06);
// Layer 2: tactile bump (barely audible)
const bump = ctx.createOscillator();
const bumpGain = ctx.createGain();
const bumpFilter = ctx.createBiquadFilter();
bump.type = 'triangle';
bump.frequency.setValueAtTime(420 * v(), now);
bump.frequency.exponentialRampToValueAtTime(180, now + 0.008);
bumpFilter.type = 'lowpass';
bumpFilter.frequency.setValueAtTime(600, now);
bumpGain.gain.setValueAtTime(0.03, now);
bumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
bump.connect(bumpFilter).connect(bumpGain).connect(ctx.destination);
bump.start(now); bump.stop(now + 0.012);
// Layer 3: dampened noise (soft low puff, lube kills scratchiness)
const bufLen = Math.floor(ctx.sampleRate * 0.03);
const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
const d = buf.getChannelData(0);
for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
const noise = ctx.createBufferSource();
noise.buffer = buf;
const noiseLp = ctx.createBiquadFilter();
noiseLp.type = 'lowpass';
noiseLp.frequency.setValueAtTime(400 * v(), now + drift);
noiseLp.Q.setValueAtTime(0.3, now + drift);
const noiseGain = ctx.createGain();
noiseGain.gain.setValueAtTime(0.025, now + drift);
noiseGain.gain.exponentialRampToValueAtTime(0.001, now + drift + 0.025);
noise.connect(noiseLp).connect(noiseGain).connect(ctx.destination);
noise.start(now + drift); noise.stop(now + drift + 0.03);
}`,
};

interface SoundCardProps {
  name: SoundName;
  label: string;
  category: string;
  description: string;
}

function InteractivePreview({ name }: { name: SoundName }) {
  const [switchOn, setSwitchOn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [sliderVal, setSliderVal] = useState([50]);
  const [notifVisible, setNotifVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  switch (name) {
    case 'button-click':
      return (
        <Button
          size="sm"
          onClick={() => playSound('button-click')}
          className="w-full"
        >
          Click Me
        </Button>
      );

    case 'button-click-secondary':
      return (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => playSound('button-click-secondary')}
          className="w-full"
        >
          Secondary Action
        </Button>
      );

    case 'hover-blip':
      return (
        <div
          onMouseEnter={() => playSound('hover-blip')}
          className="flex w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-border py-3 text-xs text-muted-foreground transition-colors hover:border-primary hover:bg-accent hover:text-foreground"
        >
          Hover over me
        </div>
      );

    case 'hover-soft':
      return (
        <div className="flex w-full gap-2">
          {['Link 1', 'Link 2', 'Link 3'].map((label) => (
            <span
              key={label}
              onMouseEnter={() => playSound('hover-soft')}
              className="flex-1 cursor-pointer rounded-md py-2 text-center text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      );

    case 'success-chime':
      return (
        <div className="flex w-full flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              playSound('success-chime');
              setSuccessVisible(true);
              setTimeout(() => setSuccessVisible(false), 1500);
            }}
            className="w-full"
          >
            Save Changes
          </Button>
          {successVisible && (
            <p className="text-center text-xs text-green-600 dark:text-green-400" aria-live="polite">✓ Saved successfully!</p>
          )}
        </div>
      );

    case 'success-bell':
      return (
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={checked}
              onCheckedChange={() => {
                setChecked(!checked);
                if (!checked) playSound('success-bell');
              }}
            />
            <label className="text-xs text-card-foreground cursor-pointer" onClick={() => {
              setChecked(!checked);
              if (!checked) playSound('success-bell');
            }}>
              Mark as complete
            </label>
          </div>
        </div>
      );

    case 'error-buzz':
      return (
        <div className="flex w-full flex-col gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              playSound('error-buzz');
              setErrorVisible(true);
              setTimeout(() => setErrorVisible(false), 1500);
            }}
            className="w-full"
          >
            Delete Item
          </Button>
          {errorVisible && (
            <p className="text-center text-xs text-red-600 dark:text-red-400" aria-live="polite">✗ Action failed!</p>
          )}
        </div>
      );

    case 'error-beep':
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => playSound('error-beep')}
          className="w-full border-destructive text-destructive hover:bg-destructive/10"
        >
          Invalid Input ✗
        </Button>
      );

    case 'notification-ping':
      return (
        <div className="flex w-full flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              playSound('notification-ping');
              setNotifVisible(true);
              setTimeout(() => setNotifVisible(false), 2000);
            }}
            className="w-full"
          >
            Send Notification
          </Button>
          {notifVisible && (
            <div className="rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground text-center animate-in fade-in slide-in-from-top-1" aria-live="polite">
              New message received
            </div>
          )}
        </div>
      );

    case 'notification-subtle':
      return (
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-card-foreground">Enable notifications</span>
          <Switch
            checked={switchOn}
            onCheckedChange={(val) => {
              setSwitchOn(val);
              playSound('notification-subtle');
            }}
          />
        </div>
      );

    case 'swoosh':
      return (
        <div className="flex w-full gap-2">
          {['Tab 1', 'Tab 2', 'Tab 3'].map((label, i) => (
            <button
              key={label}
              onClick={() => playSound('swoosh')}
              className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors ${
                i === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      );

    case 'pop':
      return (
        <TooltipProvider>
          <Tooltip onOpenChange={(open) => open && playSound('pop')}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
              >
                Hover for Tooltip 💬
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">This is a tooltip!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

    case 'slider-tick':
      return (
        <div className="flex w-full flex-col gap-2 px-1">
          <Slider
            value={sliderVal}
            onValueChange={(val) => {
              setSliderVal(val);
              playSound('slider-tick');
            }}
            max={100}
            step={5}
          />
          <p className="text-center text-xs text-muted-foreground">
            Volume: {sliderVal[0]}%
          </p>
        </div>
      );

    case 'key-press':
      return (
        <input
          type="text"
          placeholder="Type something…"
          onKeyDown={(e) => { if (!e.repeat) playSound('key-press'); }}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
        />
      );

    default:
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => playSound(name)}
          className="w-full"
        >
          Play Sound
        </Button>
      );
  }
}

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

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

const mp3Map: Partial<Record<SoundName, string>> = {
  'button-click': '/click1.mp3',
  'button-click-secondary': '/click2.mp3',
};

export function SoundCard({
  name,
  label,
  category,
  description,
}: SoundCardProps) {
  const [copied, setCopied] = useState(false);
  const isMp3 = name === 'button-click' || name === 'button-click-secondary';

  const handleCopyCode = () => {
    if (isMp3) return;
    playSound('notification-subtle');
    navigator.clipboard.writeText(soundSnippets[name]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    playSound('notification-subtle');
  };

  return (
    <div className="relative flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors">
      {isMp3 ? (
        <a
          href={mp3Map[name]}
          download
          aria-label="Download mp3"
          onClick={handleDownload}
          className="absolute right-3 top-3 rounded-md border border-border bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <DownloadIcon />
        </a>
      ) : (
        <button
          onClick={handleCopyCode}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className="absolute right-3 top-3 rounded-md border border-border bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      )}

      <div className="flex flex-col gap-1 pr-10">
        <h3 className="font-sans text-sm font-semibold text-card-foreground">{label}</h3>
        <p className="text-xs text-muted-foreground">{category}</p>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>

      <InteractivePreview name={name} />
    </div>
  );
}
