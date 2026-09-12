'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { SoundName } from '@/lib/sound-names';
import { playSound, playCopySound } from '@/lib/lazy-sounds';
import { SOUNDS_METADATA, generateSoundLLMPrompt } from '@/lib/sounds-metadata';
import { X, ChevronsUpDown, Copy, Check } from 'lucide-react';

interface SoundActionsProps {
  name: SoundName;
}

type PkgManager = 'pnpm' | 'npm' | 'bun' | 'yarn';

const PKG_MANAGERS: PkgManager[] = ['pnpm', 'npm', 'bun', 'yarn'];

function getInstallCommand(pkg: PkgManager, name: string): string {
  switch (pkg) {
    case 'pnpm':
      return `pnpm dlx sound-library add ${name}`;
    case 'npm':
      return `npx sound-library add ${name}`;
    case 'bun':
      return `bunx sound-library add ${name}`;
    case 'yarn':
      return `yarn dlx sound-library add ${name}`;
  }
}

// 4-corner brackets audition icon (static)
function CornerExpandIcon({ className = '', size = 13 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 8V6a2 2 0 0 1 2-2h2" />
      <path d="M4 16v2a2 2 0 0 0 2 2h2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v2" />
      <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

// Code icon: < / > (static)
function CodeIcon({ className = '', size = 13 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

// Sparkles icon for AI prompt (static, zero bouncy animation)
function SparklesStaticIcon({ className = '', size = 13 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

// Silky liquid spring tuning
const liquidSpring = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 26,
  mass: 0.65,
};

export function SoundActions({ name }: SoundActionsProps) {
  const meta = SOUNDS_METADATA[name];
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<PkgManager>('pnpm');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const cmdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const codeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const promptTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (cmdTimerRef.current) clearTimeout(cmdTimerRef.current);
      if (codeTimerRef.current) clearTimeout(codeTimerRef.current);
      if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, []);

  const command = getInstallCommand(selectedPkg, name);

  const handleCopyCommand = useCallback(() => {
    navigator.clipboard.writeText(command);
    playCopySound();
    setCopiedCmd(true);
    if (cmdTimerRef.current) clearTimeout(cmdTimerRef.current);
    cmdTimerRef.current = setTimeout(() => setCopiedCmd(false), 1400);
  }, [command]);

  const handleAudition = useCallback(() => {
    setIsPlaying(true);
    playSound(name);
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    playTimerRef.current = setTimeout(() => setIsPlaying(false), 400);
  }, [name]);

  const handleCopyCode = useCallback(async () => {
    const { SOUNDS_CODE } = await import('@/lib/sounds-code');
    const code = SOUNDS_CODE[name] || `// Procedural sound: ${name}\nexport function play${name.charAt(0).toUpperCase() + name.slice(1)}() {\n  // Web Audio synthesis\n}`;
    await navigator.clipboard.writeText(code);
    playCopySound();
    setCopiedCode(true);
    if (codeTimerRef.current) clearTimeout(codeTimerRef.current);
    codeTimerRef.current = setTimeout(() => setCopiedCode(false), 1400);
  }, [name]);

  const handleCopyPrompt = useCallback(() => {
    if (!meta) return;
    const prompt = generateSoundLLMPrompt(meta);
    navigator.clipboard.writeText(prompt);
    playCopySound();
    setCopiedPrompt(true);
    if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
    promptTimerRef.current = setTimeout(() => setCopiedPrompt(false), 1400);
  }, [meta]);

  if (!meta) return null;

  return (
    <div className="not-prose my-2.5 flex items-center">
      <motion.div
        layout
        transition={liquidSpring}
        className="relative inline-flex items-center rounded-xl border border-white/[0.08] bg-[#141416] p-1 shadow-sm overflow-visible"
      >
        {/* Left Section: Morphing Install / CLI Pill */}
        <motion.div
          layout
          transition={liquidSpring}
          className={`relative flex items-center h-7 rounded-lg bg-[#222226] transition-colors ${
            dropdownOpen ? 'overflow-visible' : 'overflow-hidden'
          }`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!isExpanded ? (
              <motion.button
                key="collapsed-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                transition={{ duration: 0.14 }}
                type="button"
                onClick={() => setIsExpanded(true)}
                title="Install sound via CLI"
                className="inline-flex h-7 items-center justify-center px-3 text-xs font-medium text-neutral-200 hover:bg-[#2c2c32] hover:text-white cursor-pointer outline-none select-none whitespace-nowrap shrink-0"
              >
                Install
              </motion.button>
            ) : (
              <motion.div
                key="expanded-bar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                transition={{ duration: 0.16, delay: 0.06 }}
                className="flex items-center gap-1.5 px-1 whitespace-nowrap overflow-visible"
              >
                {/* Close / Collapse button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    setDropdownOpen(false);
                  }}
                  title="Close install bar"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-[#2c2c32] hover:text-white cursor-pointer outline-none select-none shrink-0"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>

                {/* Package Manager Selector Dropdown */}
                <div ref={dropdownRef} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    title="Select package manager (pnpm, npm, bun, yarn)"
                    className="inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs font-mono text-neutral-200 transition-colors hover:bg-[#2c2c32] hover:text-white cursor-pointer outline-none select-none"
                  >
                    <span>{selectedPkg}</span>
                    <ChevronsUpDown size={11} className="text-neutral-400 shrink-0" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute left-0 top-full mt-2 z-50 min-w-[110px] rounded-xl border border-white/[0.12] bg-[#18181c] p-1 shadow-2xl backdrop-blur-md">
                      {PKG_MANAGERS.map((pkg) => (
                        <button
                          key={pkg}
                          type="button"
                          onClick={() => {
                            setSelectedPkg(pkg);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between cursor-pointer outline-none ${
                            selectedPkg === pkg
                              ? 'bg-white/[0.1] text-white font-medium'
                              : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span>{pkg}</span>
                          {selectedPkg === pkg && (
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtle Divider */}
                <div className="h-3.5 w-px bg-white/[0.1] mx-0.5 shrink-0" />

                {/* CLI Command Line Text */}
                <span className="font-mono text-xs text-neutral-300 px-1 select-all whitespace-nowrap">
                  {command}
                </span>

                {/* Copy Command Button — flips to check after copy */}
                <div className="relative shrink-0 flex items-center">
                  <button
                    type="button"
                    onClick={handleCopyCommand}
                    data-copy-button="true"
                    title={copiedCmd ? 'Copied' : 'Copy command'}
                    aria-label={copiedCmd ? 'Copied' : 'Copy command'}
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors cursor-pointer outline-none select-none ${
                      copiedCmd
                        ? 'text-emerald-400 bg-white/[0.1]'
                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {copiedCmd ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Subtle Divider */}
        <div className="h-4 w-px bg-white/[0.08] mx-1 shrink-0" />

        {/* Right Section: 3 Action Icon Buttons */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* 1. Audition / Preview Icon Button */}
          <button
            type="button"
            onClick={handleAudition}
            title={isPlaying ? `Playing ${meta.title}...` : `Audition ${meta.title}`}
            className={`relative inline-flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer outline-none select-none ${
              isPlaying
                ? 'bg-white/[0.1] text-white'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <CornerExpandIcon size={13} />
          </button>

          {/* 2. Copy TypeScript Source Code Button with floating Copied badge */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={handleCopyCode}
              data-copy-button="true"
              title="Copy TypeScript code"
              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer outline-none select-none ${
                copiedCode
                  ? 'text-white bg-white/[0.08]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <CodeIcon size={13} />
            </button>
            {copiedCode && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#202024] border border-white/10 text-[10px] font-mono text-neutral-200 shadow-md whitespace-nowrap pointer-events-none z-30">
                Copied
              </div>
            )}
          </div>

          {/* 3. 1-Click AI Prompt Button with floating Copied badge (Static Icon) */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={handleCopyPrompt}
              data-copy-button="true"
              title="Copy AI Prompt (Cursor, Claude, ChatGPT, v0)"
              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer outline-none select-none ${
                copiedPrompt
                  ? 'text-white bg-white/[0.08]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <SparklesStaticIcon size={13} />
            </button>
            {copiedPrompt && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#202024] border border-white/10 text-[10px] font-mono text-neutral-200 shadow-md whitespace-nowrap pointer-events-none z-30">
                Copied
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Alias SoundPlayButton to SoundActions so all existing MDX usages adopt this
export const SoundPlayButton = SoundActions;
