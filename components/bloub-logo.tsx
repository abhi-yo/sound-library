import React from 'react';

export function BloubLogo({ className = 'h-5 w-5', filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 3C8.82 3 3 8.82 3 16C3 20.8 5.6 24.9 9.5 27.1C11.4 28.2 13.6 29 16 29C23.18 29 29 23.18 29 16C29 8.82 23.18 3 16 3Z"
        className={filled ? 'fill-foreground' : 'stroke-foreground stroke-[2]'}
      />
      {filled && (
        <>
          <ellipse cx="12.5" cy="15" rx="1.8" ry="3" className="fill-background" />
          <ellipse cx="19.5" cy="15" rx="1.8" ry="3" className="fill-background" />
        </>
      )}
    </svg>
  );
}
