"use client";

import type { Transition } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface CommandLineIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CommandLineIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SPRING_TRANSITION: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

export const CommandLineIcon = forwardRef<CommandLineIconHandle, CommandLineIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 16, ...props }, ref) => {
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
          {/* Terminal Box */}
          <rect x="2.5" y="4" width="19" height="16" rx="3.5" />
          {/* Animated Prompt Chevron */}
          <motion.path
            d="m6.5 9 3 3-3 3"
            animate={controls}
            variants={{
              normal: { x: 0 },
              animate: { x: 1.5 },
            }}
            transition={SPRING_TRANSITION}
          />
          {/* Animated Underscore Cursor */}
          <motion.line
            x1="12"
            x2="16.5"
            y1="15"
            y2="15"
            animate={controls}
            variants={{
              normal: { opacity: 0.8, x: 0 },
              animate: { opacity: [0.8, 0.2, 1], x: 1 },
            }}
            transition={{ duration: 0.4, repeat: 0 }}
          />
        </svg>
      </div>
    );
  }
);

CommandLineIcon.displayName = "CommandLineIcon";
