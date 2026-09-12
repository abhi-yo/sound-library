'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { BloubAvatar } from '@/components/bloub-avatar';
import { playSound } from '@/lib/lazy-sounds';

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="14" height="14" {...props}>
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function useGitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const cacheKey = 'gh-stars-sound-library';
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { count, ts } = JSON.parse(cached);
        if (Date.now() - ts < 10 * 60 * 1000) {
          setStars(count);
          return;
        }
      } catch {
        // ignore parse error
      }
    }

    fetch('https://api.github.com/repos/abhi-yo/sound-library')
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count != null) {
          setStars(data.stargazers_count);
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({ count: data.stargazers_count, ts: Date.now() })
          );
        }
      })
      .catch(() => {});
  }, []);

  return stars;
}

function formatStars(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

import { usePathname } from 'next/navigation';

export default function HomeHeader() {
  const stars = useGitHubStars();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1f1f1f] bg-black/80 backdrop-blur-md select-none">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand with Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <BloubAvatar size={28} className="shrink-0 transition-transform group-hover:scale-105" />
          <span className="font-helvetica-neue text-[18px] font-medium tracking-[-0.3px] text-white leading-none">
            sound bits
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#121214] border border-[#242426] rounded-full px-2 py-1">
          <Link
            href="/"
            onClick={() => playSound('tick')}
            className={`font-tight text-[13px] px-3 py-1 rounded-full transition-colors ${
              pathname === '/'
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            href="/browse"
            onClick={() => playSound('tick')}
            className={`font-tight text-[13px] px-3 py-1 rounded-full transition-colors ${
              pathname === '/browse'
                ? 'bg-[#ff3700]/20 text-[#ff5722] font-medium border border-[#ff3700]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Browse Frontends
          </Link>
          <Link
            href="/docs"
            onClick={() => playSound('tick')}
            className={`font-tight text-[13px] px-3 py-1 rounded-full transition-colors ${
              pathname.startsWith('/docs')
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Docs
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/browse"
            onClick={() => playSound('tick')}
            className="md:hidden inline-flex h-8 items-center rounded-[8px] border border-[#262626] bg-[#121212] px-2.5 text-xs font-medium text-white/90 hover:bg-[#1c1c1c]"
          >
            Frontends
          </Link>
          <a
            href="https://github.com/abhi-yo/sound-library"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound('button-click')}
            className="inline-flex h-8.5 items-center gap-2 rounded-[8px] border border-[#262626] bg-[#121212] px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-[#1c1c1c] hover:border-[#383838] transition-colors"
          >
            <GitHubIcon className="h-3.5 w-3.5 fill-current text-white/80" />
            <span className="hidden sm:inline font-tight text-[13px]">GitHub</span>
            {stars !== null && (
              <span className="flex items-center gap-1 text-[12px] text-white/50 pl-2 border-l border-[#262626]">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {formatStars(stars)}
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}



