"use client";

import type { Transition } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedCopyIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AnimatedCopyIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  copied?: boolean;
}

const SPRING_TRANSITION: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 18,
};

export const AnimatedCopyIcon = forwardRef<AnimatedCopyIconHandle, AnimatedCopyIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 14, copied = false, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
      },
      [controls, onMouseLeave]
    );

    if (copied) {
      return (
        <div
          className={cn("inline-flex items-center justify-center text-emerald-400 select-none", className)}
          {...props}
        >
          <motion.svg
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            fill="none"
            height={size}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
            width={size}
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        </div>
      );
    }

    return (
      <div
        className={cn("inline-flex items-center justify-center select-none", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back Sheet */}
          <rect x="8" y="8" width="12" height="12" rx="2.5" />
          {/* Front Sheet with diagonal slip on hover */}
          <motion.path
            d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
            animate={controls}
            variants={{
              normal: { x: 0, y: 0 },
              animate: { x: -1.5, y: -1.5 },
            }}
            transition={SPRING_TRANSITION}
          />
        </svg>
      </div>
    );
  }
);

AnimatedCopyIcon.displayName = "AnimatedCopyIcon";
