'use client';

import React, { useState, useCallback } from 'react';
import { playSound } from '@/lib/lazy-sounds';

interface Task {
  id: string;
  title: string;
  tag: string;
  completed: boolean;
}

interface ToastMessage {
  id: number;
  title: string;
  subtitle: string;
  type: 'success' | 'alert' | 'error';
}

export function InteractiveOsMockup() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Implement Web Audio dynamic compressor bus', tag: 'Core', completed: true },
    { id: '2', title: 'Tune frequency ramps for mechanical latch click', tag: 'Acoustics', completed: false },
    { id: '3', title: 'Connect prefers-reduced-motion media query listener', tag: 'a11y', completed: false },
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    'celebrate': 12,
    'love': 34,
    'rocket': 8,
  });

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          if (next) playSound('chime');
          else playSound('snap');
          return { ...t, completed: next };
        }
        return t;
      })
    );
  }, []);

  const addToast = useCallback((title: string, subtitle: string, type: 'success' | 'alert' | 'error', sound: 'chime' | 'ping' | 'error') => {
    playSound(sound);
    const id = Date.now();
    setToasts((prev) => [...prev.slice(-2), { id, title, subtitle, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const handleReaction = useCallback((key: string) => {
    playSound('pop');
    setReactions((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
  }, []);

  return (
    <div className="relative w-full rounded-2xl border border-border bg-card neumorph-card backdrop-blur-xl overflow-hidden transition-all">
      {/* App Topbar */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-muted/20 neumorph-inset">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSound(isLocked ? 'unlock' : 'lock');
              setIsLocked((prev) => !prev);
            }}
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-mono transition-all active:scale-95 neumorph-btn ${
              isLocked
                ? 'border-border bg-card text-foreground'
                : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500 font-semibold shadow-xs'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isLocked ? (
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
            <span>{isLocked ? 'VAULT LOCKED' : 'VAULT OPEN'}</span>
          </button>
        </div>

        {/* Right drawer trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSound(isDrawerOpen ? 'swish' : 'whoosh');
              setIsDrawerOpen((prev) => !prev);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-all active:scale-95 neumorph-btn"
          >
            <span>{isDrawerOpen ? 'Close Drawer' : 'Open Drawer'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="relative p-5 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
        {/* Left Column: Interactive Tasks & Reactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pb-2 border-b border-border">
            <span>TASK ITEMS & CONFIRMATIONS</span>
            <span>STATUS</span>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer select-none transition-all active:scale-[0.98] ${
                  task.completed
                    ? 'border-border/60 bg-muted/40 text-muted-foreground line-through neumorph-inset'
                    : 'border-border bg-card text-foreground neumorph-btn shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors ${
                      task.completed ? 'bg-foreground text-background shadow-xs' : 'border border-muted-foreground/40 neumorph-inset'
                    }`}
                  >
                    {task.completed && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs">{task.title}</span>
                </div>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground neumorph-pill shrink-0">{task.tag}</span>
              </div>
            ))}
          </div>

          {/* Reaction Dock */}
          <div className="pt-2">
            <div className="text-[11px] font-mono text-muted-foreground mb-2">REACTIONS</div>
            <div className="flex items-center gap-2">
              {Object.entries(reactions).map(([key, count]) => (
                <button
                  key={key}
                  onClick={() => handleReaction(key)}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-foreground transition-all hover:scale-105 active:scale-90 neumorph-btn"
                >
                  <span className="capitalize text-xs font-medium">{key}</span>
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Notification Triggers & Toasts */}
        <div className="space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pb-2 border-b border-border mb-3">
              <span>SYSTEM EVENT DISPATCHER</span>
              <span>AUDITIONS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => addToast('Deployment Successful', 'All edge nodes synchronized.', 'success', 'chime')}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-left transition-all active:scale-95 neumorph-btn"
              >
                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Success</div>
                <div className="text-[10px] font-mono text-emerald-600/80 dark:text-emerald-400/80 mt-1">chime</div>
              </button>

              <button
                onClick={() => addToast('Inbound Notification', 'New pull request assigned.', 'alert', 'ping')}
                className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-left transition-all active:scale-95 neumorph-btn"
              >
                <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Message</div>
                <div className="text-[10px] font-mono text-blue-600/80 dark:text-blue-400/80 mt-1">ping</div>
              </button>

              <button
                onClick={() => addToast('Authentication Refused', 'Invalid credentials provided.', 'error', 'error')}
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-left transition-all active:scale-95 neumorph-btn"
              >
                <div className="text-xs font-medium text-red-600 dark:text-red-400">Blocked</div>
                <div className="text-[10px] font-mono text-red-600/80 dark:text-red-400/80 mt-1">error</div>
              </button>
            </div>
          </div>

          {/* Active Toasts Container */}
          <div className="space-y-2 pt-4">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className="rounded-xl border border-border bg-card p-3.5 neumorph-card animate-in slide-in-from-bottom-2 fade-in duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-foreground">{toast.title}</div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">{toast.type}</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{toast.subtitle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sliding Side Drawer Simulation */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-80 border-l border-border bg-card p-5 neumorph-card transition-transform duration-300 ease-out z-20 ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
            <span className="text-xs font-medium text-foreground">Acoustic Inspector</span>
            <button
              onClick={() => {
                playSound('swish');
                setIsDrawerOpen(false);
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3 text-xs text-muted-foreground">
            <p>Spatial slide transitions give weight to modals, floating sheets, and tab indicators.</p>
            <div className="rounded-lg bg-muted/50 p-3 font-mono text-[11px] neumorph-inset">
              <div>Curve: Exponential Ease-out</div>
              <div>Duration: 200ms - 380ms</div>
              <div>Noise Buffer: 0.2s White Noise</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
