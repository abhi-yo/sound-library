'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { playSound, type SoundName } from '@/lib/lazy-sounds';

interface ActionItem {
  id: string;
  category: 'Actions' | 'Navigation' | 'Preferences';
  title: string;
  subtitle: string;
  icon: 'plus' | 'link' | 'theme' | 'heart' | 'book' | 'archive';
  sound: SoundName;
  execute: () => void;
}

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
}

export function CommandPaletteMockup() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState<string[]>(['sound-library-core', 'tactile-synth-v2']);
  const [particles, setParticles] = useState<Particle[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const newProjectInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global ⌘K / Ctrl+K listener to focus palette
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        playSound('swish');
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Particle animation ticker
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy - 0.2, // float upward
            scale: Math.max(0, p.scale - 0.025),
          }))
          .filter((p) => p.scale > 0.05)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [particles.length]);

  const triggerCelebration = useCallback(() => {
    const emojis = ['🎉', '✨', '🚀', '❤️', '🔥', '👏', '⚡️'];
    const newBatch: Particle[] = [];
    for (let i = 0; i < 14; i++) {
      newBatch.push({
        id: Date.now() + i + Math.random(),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: 40 + Math.random() * 20, // percentage
        y: 60,
        vx: (Math.random() - 0.5) * 4,
        vy: -3 - Math.random() * 4,
        scale: 0.8 + Math.random() * 0.5,
      });
    }
    setParticles((prev) => [...prev, ...newBatch]);
  }, []);

  const showToast = useCallback((msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => setActiveNotification(null), 2500);
  }, []);

  // Define actual actions with real browser/app execution
  const actionItems: ActionItem[] = [
    {
      id: 'create-project',
      category: 'Actions',
      title: 'Create new project',
      subtitle: isCreatingProject ? 'Type project name & press ↵' : `Active workspaces (${projects.length})`,
      icon: 'plus',
      sound: 'tap',
      execute: () => {
        setIsCreatingProject(true);
        setTimeout(() => newProjectInputRef.current?.focus(), 50);
      },
    },
    {
      id: 'copy-link',
      category: 'Actions',
      title: 'Copy share link',
      subtitle: 'Copy application URL to clipboard',
      icon: 'link',
      sound: 'unlock',
      execute: () => {
        const url = typeof window !== 'undefined' ? window.location.href : 'https://sound-library.dev';
        navigator.clipboard.writeText(url).then(() => {
          showToast('Copied URL to clipboard!');
        });
      },
    },
    {
      id: 'send-reaction',
      category: 'Actions',
      title: 'Send reaction',
      subtitle: 'Trigger live celebration reaction burst',
      icon: 'heart',
      sound: 'pop',
      execute: () => {
        triggerCelebration();
        showToast('Reaction sent! 🎉');
      },
    },
    {
      id: 'search-docs',
      category: 'Navigation',
      title: 'Browse documentation',
      subtitle: 'Navigate to sound API references and setup guide',
      icon: 'book',
      sound: 'tap',
      execute: () => {
        showToast('Navigating to documentation...');
        setTimeout(() => {
          router.push('/docs');
        }, 350);
      },
    },
    {
      id: 'archive-project',
      category: 'Actions',
      title: 'Archive project',
      subtitle: projects.length > 0 ? `Archive "${projects[projects.length - 1]}"` : 'No active projects to archive',
      icon: 'archive',
      sound: 'thud',
      execute: () => {
        if (projects.length > 0) {
          const removed = projects[projects.length - 1];
          setProjects((prev) => prev.slice(0, -1));
          showToast(`Archived "${removed}"`);
        } else {
          showToast('Workspace is already empty');
        }
      },
    },
  ];

  const filtered = actionItems.filter((item) => {
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  });

  const handleSelect = useCallback((item: ActionItem) => {
    playSound(item.sound);
    item.execute();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      playSound('blip');
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      playSound('blip');
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      setIsCreatingProject(false);
      return;
    }
    playSound('chime');
    const name = newProjectName.trim();
    setProjects((prev) => [...prev, name]);
    setNewProjectName('');
    setIsCreatingProject(false);
    showToast(`Created project "${name}"`);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <div className="relative w-full rounded-2xl border border-border bg-card neumorph-card backdrop-blur-2xl overflow-hidden transition-all">
      {/* Floating Celebration Particles Container */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-30">
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `scale(${p.scale})`,
              opacity: p.scale,
            }}
            className="absolute text-2xl select-none"
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Integrated Search Header with Subtle Inset */}
      <div className="flex items-center gap-3.5 border-b border-border px-5 py-4 bg-muted/20 dark:bg-zinc-950/40 neumorph-inset">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            playSound('keystroke');
            setQuery(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a command or search..."
          className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-sans"
        />

        {query && (
          <button
            onClick={() => {
              playSound('tap');
              setQuery('');
            }}
            className="text-xs font-mono text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted neumorph-btn transition-colors shrink-0"
          >
            clear
          </button>
        )}
      </div>

      {/* Inline Project Creation Prompt when active */}
      {isCreatingProject && (
        <form onSubmit={handleCreateProjectSubmit} className="flex items-center gap-2 border-b border-border px-5 py-3 bg-muted/40 dark:bg-zinc-900/60 animate-in fade-in slide-in-from-top-1 duration-150">
          <span className="text-xs font-mono text-muted-foreground">New project:</span>
          <input
            ref={newProjectInputRef}
            type="text"
            value={newProjectName}
            onChange={(e) => {
              playSound('keystroke');
              setNewProjectName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsCreatingProject(false);
              }
            }}
            placeholder="e.g. audio-engine-v3"
            className="flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="rounded-md bg-foreground px-3 py-1 text-xs text-background font-medium active:scale-95 neumorph-btn"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingProject(false)}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Results Section */}
      <div className="p-2 min-h-[300px] max-h-[360px] overflow-y-auto space-y-1">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-xs text-muted-foreground font-mono">
            No commands match &ldquo;{query}&rdquo;
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedIndex(idx);
                  handleSelect(item);
                }}
                onMouseEnter={() => {
                  setSelectedIndex(idx);
                }}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 cursor-pointer transition-all duration-120 ${
                  isSelected
                    ? 'bg-muted/80 dark:bg-zinc-800/80 text-foreground neumorph-btn shadow-xs'
                    : 'text-foreground/85 hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Icon Box with Tactile Bevel */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                      isSelected
                        ? 'bg-background shadow-xs text-foreground border border-border/80'
                        : 'bg-muted/60 text-muted-foreground neumorph-pill'
                    }`}
                  >
                    <ActionIcon type={item.icon} isSelected={isSelected} />
                  </div>

                  {/* Text Details */}
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-sm font-medium tracking-tight truncate">
                      {item.title}
                    </div>
                    <p className="text-xs truncate text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Subtle Category Label */}
                <div className="shrink-0 pl-3">
                  <span className="text-[11px] font-mono text-muted-foreground/70">
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Minimal Footer */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-muted/20 text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          {activeNotification ? (
            <span className="text-foreground font-medium animate-in fade-in duration-150">
              ✓ {activeNotification}
            </span>
          ) : (
            <span>Press ⌘K anytime to focus</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span><kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-sans font-medium text-[11px] neumorph-pill">↑↓</kbd> navigate</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-sans font-medium text-[11px] neumorph-pill">↵</kbd> run</span>
        </div>
      </div>
    </div>
  );
}

function ActionIcon({ type, isSelected }: { type: ActionItem['icon']; isSelected: boolean }) {
  const iconClass = `h-4 w-4 transition-colors ${
    isSelected
      ? 'text-foreground'
      : 'text-muted-foreground'
  }`;

  switch (type) {
    case 'plus':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      );
    case 'link':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case 'theme':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      );
    case 'heart':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case 'book':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      );
    case 'archive':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
          <rect width="20" height="5" x="2" y="3" rx="1" />
          <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
          <path d="M10 12h4" />
        </svg>
      );
  }
}
