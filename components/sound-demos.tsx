'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import { type SoundName } from '@/lib/sounds';

/* ─── Shared ─── */
function DemoShell({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative my-4 rounded-2xl border border-border/60 bg-gradient-to-b from-card/80 to-card/40 p-5 ${className}`}>
      <span className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-mono text-muted-foreground/80 tracking-wider uppercase select-none">
        {label}
      </span>
      {children}
    </div>
  );
}

/* ─── 1. Button Trio — tap / thud / snap ─── */
export function ButtonDemo() {
  const [lastTapped, setLastTapped] = useState<string | null>(null);

  const fire = useCallback((name: SoundName, label: string) => {
    playSound(name);
    setLastTapped(label);
    setTimeout(() => setLastTapped(null), 600);
  }, []);

  return (
    <DemoShell label="Buttons">
      <p className="text-xs text-muted-foreground mb-4">Three button weights. Each mapped to a different acoustic profile.</p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => fire('tap', 'tap')}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground transition-all hover:bg-accent active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Light Action
        </button>
        <button
          onClick={() => fire('thud', 'thud')}
          className="rounded-lg bg-foreground px-4 py-2 text-sm text-background transition-all hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Primary Action
        </button>
        <button
          onClick={() => fire('snap', 'snap')}
          className="rounded-lg border-2 border-foreground bg-transparent px-4 py-2 text-sm text-foreground transition-all hover:bg-foreground hover:text-background active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Decisive Action
        </button>
      </div>
      {lastTapped && (
        <div className="mt-3 text-[11px] font-mono text-muted-foreground animate-in fade-in slide-in-from-bottom-1 duration-200">
          triggered → <span className="text-foreground">{lastTapped}</span>
        </div>
      )}
    </DemoShell>
  );
}

/* ─── 2. Toggle Switch — toggle-on / toggle-off ─── */
export function ToggleDemo() {
  const [enabled, setEnabled] = useState(false);

  const toggle = useCallback(() => {
    setEnabled(prev => {
      playSound(prev ? 'toggle-off' : 'toggle-on');
      return !prev;
    });
  }, []);

  return (
    <DemoShell label="Toggle">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-foreground">Enable Sound Effects</div>
          <div className="text-xs text-muted-foreground mt-0.5">Ascending pitch on, descending pitch off.</div>
        </div>
        <button
          role="switch"
          aria-checked={enabled}
          onClick={toggle}
          className={`relative h-7 w-12 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            enabled ? 'bg-foreground' : 'bg-border'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-background shadow-sm transition-transform duration-200 ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </DemoShell>
  );
}

/* ─── 3. Hover Cards — blip / hover-soft ─── */
export function HoverDemo() {
  return (
    <DemoShell label="Hover Interactions">
      <p className="text-xs text-muted-foreground mb-3">Move your cursor over these cards.</p>
      <div className="grid grid-cols-2 gap-3">
        <div
          onMouseEnter={() => playSound('blip')}
          className="rounded-xl border border-border/60 bg-background p-4 transition-all duration-200 hover:border-foreground/30 hover:shadow-md hover:-translate-y-0.5 cursor-default"
        >
          <div className="text-xs font-medium text-foreground">Feature Card</div>
          <div className="text-[11px] text-muted-foreground mt-1">Ascending chirp on hover.</div>
        </div>
        <div
          onMouseEnter={() => playSound('hover-soft')}
          className="rounded-xl border border-border/60 bg-background p-4 transition-all duration-200 hover:border-foreground/30 hover:shadow-md hover:-translate-y-0.5 cursor-default"
        >
          <div className="text-xs font-medium text-foreground">Quiet Card</div>
          <div className="text-[11px] text-muted-foreground mt-1">Subtle sine pulse on hover.</div>
        </div>
      </div>
    </DemoShell>
  );
}

/* ─── 4. Notification Toasts — chime / bell / ping ─── */
export function NotificationDemo() {
  const [toasts, setToasts] = useState<Array<{ id: number; text: string; type: string }>>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((sound: SoundName, text: string, type: string) => {
    playSound(sound);
    const id = ++counterRef.current;
    setToasts(prev => [...prev.slice(-2), { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800);
  }, []);

  return (
    <DemoShell label="Notifications">
      <p className="text-xs text-muted-foreground mb-3">Trigger contextual notification sounds.</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => addToast('chime', 'Changes saved successfully.', 'success')}
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors active:scale-95"
        >
          Save (chime)
        </button>
        <button
          onClick={() => addToast('bell', 'Achievement unlocked!', 'achievement')}
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors active:scale-95"
        >
          Achievement (bell)
        </button>
        <button
          onClick={() => addToast('ping', 'New message received.', 'message')}
          className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors active:scale-95"
        >
          Message (ping)
        </button>
      </div>
      {toasts.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          {toasts.map(t => (
            <div key={t.id} className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground animate-in slide-in-from-bottom-2 fade-in duration-300 shadow-sm">
              {t.text}
            </div>
          ))}
        </div>
      )}
    </DemoShell>
  );
}

/* ─── 5. Slider / Dial — tick ─── */
export function SliderDemo() {
  const [value, setValue] = useState(50);
  const prevRef = useRef(50);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const next = parseInt(e.target.value, 10);
    if (Math.abs(next - prevRef.current) >= 4) {
      playSound('tick');
      prevRef.current = next;
    }
    setValue(next);
  }, []);

  return (
    <DemoShell label="Range Input">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-muted-foreground">Volume</div>
        <div className="text-sm font-mono text-foreground tabular-nums">{value}%</div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={handleChange}
        className="w-full h-1.5 rounded-full appearance-none bg-border cursor-pointer accent-foreground [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
      />
    </DemoShell>
  );
}

/* ─── 6. Text Input — keystroke ─── */
export function KeystrokeDemo() {
  const [text, setText] = useState('');

  return (
    <DemoShell label="Text Input">
      <p className="text-xs text-muted-foreground mb-3">Each keystroke triggers a lubricated mechanical switch sound.</p>
      <input
        type="text"
        value={text}
        placeholder="Start typing..."
        onChange={e => {
          setText(e.target.value);
          playSound('keystroke');
        }}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring font-mono"
      />
    </DemoShell>
  );
}

/* ─── 7. Like / Pop Button — pop ─── */
export function PopDemo() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(247);

  return (
    <DemoShell label="Like Action">
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            playSound('pop');
            setLiked(prev => !prev);
            setCount(prev => liked ? prev - 1 : prev + 1);
          }}
          className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all active:scale-90 ${
            liked
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-500'
              : 'border-border bg-background text-muted-foreground hover:border-rose-500/30 hover:text-rose-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${liked ? 'scale-110' : 'group-hover:scale-105'}`}>
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span className="font-mono text-xs tabular-nums">{count}</span>
        </button>
        <span className="text-xs text-muted-foreground">Resonant pitch-drop on toggle.</span>
      </div>
    </DemoShell>
  );
}

/* ─── 8. Drawer / Panel — swish / whoosh ─── */
export function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <DemoShell label="Navigation Panel" className="overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground">Side panel with spatial transition audio.</div>
        <button
          onClick={() => {
            playSound(open ? 'swish' : 'whoosh');
            setOpen(prev => !prev);
          }}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors active:scale-95"
        >
          {open ? 'Close Panel' : 'Open Panel'}
        </button>
      </div>
      <div className="relative h-28 rounded-xl border border-border bg-background overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-2/3 p-3 text-[11px] text-muted-foreground">
          <div className="h-2 w-3/4 rounded bg-muted mb-2" />
          <div className="h-2 w-1/2 rounded bg-muted mb-2" />
          <div className="h-2 w-2/3 rounded bg-muted" />
        </div>
        <div
          className={`absolute inset-y-0 right-0 w-1/3 border-l border-border bg-card p-3 transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="text-[10px] font-mono text-muted-foreground mb-2">Panel</div>
          <div className="h-1.5 w-full rounded bg-muted mb-1.5" />
          <div className="h-1.5 w-3/4 rounded bg-muted mb-1.5" />
          <div className="h-1.5 w-1/2 rounded bg-muted" />
        </div>
      </div>
    </DemoShell>
  );
}

/* ─── 9. Lock / Unlock — lock / unlock ─── */
export function LockDemo() {
  const [locked, setLocked] = useState(true);

  return (
    <DemoShell label="Security State">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            playSound(locked ? 'unlock' : 'lock');
            setLocked(prev => !prev);
          }}
          className={`flex items-center gap-2.5 rounded-xl border-2 px-5 py-3 text-sm transition-all active:scale-95 ${
            locked
              ? 'border-foreground/20 bg-foreground/5 text-foreground'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {locked ? (
              <>
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </>
            ) : (
              <>
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </>
            )}
          </svg>
          <span>{locked ? 'Locked' : 'Unlocked'}</span>
        </button>
        <span className="text-xs text-muted-foreground">Mechanical latch click with dual oscillators.</span>
      </div>
    </DemoShell>
  );
}

/* ─── 10. Camera Shutter — shutter ─── */
export function ShutterDemo() {
  const [flash, setFlash] = useState(false);

  return (
    <DemoShell label="Capture">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => {
              playSound('shutter');
              setFlash(true);
              setTimeout(() => setFlash(false), 120);
            }}
            className="h-14 w-14 rounded-full border-4 border-foreground/20 bg-foreground flex items-center justify-center text-background transition-all active:scale-90 hover:border-foreground/40"
          >
            <div className="h-5 w-5 rounded-full border-2 border-background" />
          </button>
          {flash && (
            <div className="absolute inset-0 rounded-full bg-background/80 animate-ping pointer-events-none" />
          )}
        </div>
        <span className="text-xs text-muted-foreground">Dual-blade acoustic shutter for screenshots and captures.</span>
      </div>
    </DemoShell>
  );
}

/* ─── 11. Error Validation — error ─── */
export function ErrorDemo() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <DemoShell label="Form Validation">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="email"
            placeholder="Enter email..."
            readOnly
            value={submitted ? 'not-an-email' : ''}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm bg-background focus:outline-none font-mono ${
              submitted ? 'border-red-500/60 text-red-500' : 'border-border text-foreground placeholder:text-muted-foreground/50'
            }`}
          />
          <button
            onClick={() => {
              playSound('error');
              setSubmitted(true);
              setTimeout(() => setSubmitted(false), 2000);
            }}
            className="rounded-lg bg-foreground px-3 py-2 text-xs text-background hover:opacity-90 active:scale-95 transition-all"
          >
            Submit
          </button>
        </div>
        {submitted && (
          <div className="text-xs text-red-500 font-mono animate-in slide-in-from-top-1 fade-in duration-200">
            Invalid email address. Please try again.
          </div>
        )}
      </div>
    </DemoShell>
  );
}

/* ─── 12. Haptic Pulse — pulse ─── */
export function PulseDemo() {
  const [pulsing, setPulsing] = useState(false);

  return (
    <DemoShell label="Haptic Feedback">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            playSound('pulse');
            setPulsing(true);
            setTimeout(() => setPulsing(false), 400);
          }}
          className={`relative rounded-xl border border-border bg-background px-5 py-3 text-sm text-foreground transition-all active:scale-95 ${
            pulsing ? 'border-foreground/40' : ''
          }`}
        >
          {pulsing && (
            <span className="absolute inset-0 rounded-xl border-2 border-foreground/20 animate-ping pointer-events-none" />
          )}
          Trigger Haptic
        </button>
        <span className="text-xs text-muted-foreground">65Hz sub-bass sine pulse simulating device vibration.</span>
      </div>
    </DemoShell>
  );
}
