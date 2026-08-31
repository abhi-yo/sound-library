// @ts-nocheck
'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import React from 'react';
import type { JSX } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.04,
    },
  },
};

const generateVariants = (direction: Direction): { hidden: any; visible: any } => {
  const isHorizontal = direction === 'left' || direction === 'right';
  const val = direction === 'right' || direction === 'down' ? 24 : -24;

  return {
    hidden: {
      opacity: 0,
      filter: 'blur(4px)',
      x: isHorizontal ? val : 0,
      y: !isHorizontal ? val : 0,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      x: 0,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
};

const defaultViewport = { amount: 0.25, once: true };

type TextAnimationProps = {
  as?: keyof JSX.IntrinsicElements;
  text: string;
  classname?: string;
  className?: string;
  viewport?: { amount?: number; margin?: string; once?: boolean };
  variants?: { hidden: any; visible: any };
  direction?: Direction;
  letterAnime?: boolean;
  lineAnime?: boolean;
};

const TextAnimation = ({
  as = 'h1',
  text,
  classname = '',
  className = '',
  viewport = defaultViewport,
  variants,
  direction = 'up',
  letterAnime = false,
  lineAnime = false,
}: TextAnimationProps) => {
  const Tag = as as any;
  const finalVariants = variants || generateVariants(direction);
  const finalClassName = cn(classname, className);

  if (letterAnime) {
    const words = text.split(' ');
    let letterIndex = 0;
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={containerVariants}
        className="will-change-transform"
      >
        <Tag className={cn(finalClassName, 'break-words')}>
          {words.map((word, wIdx) => {
            const letters = Array.from(word);
            return (
              <span key={wIdx} className="inline-block whitespace-nowrap">
                {letters.map((letter) => {
                  const key = letterIndex++;
                  return (
                    <motion.span
                      key={key}
                      variants={finalVariants}
                      className="inline-block"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      {letter}
                    </motion.span>
                  );
                })}
                {wIdx < words.length - 1 && '\u00A0'}
              </span>
            );
          })}
        </Tag>
      </motion.div>
    );
  }

  if (lineAnime) {
    const lines = text.split('\n').length > 1 ? text.split('\n') : text.split(' ');
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={containerVariants}
        className="will-change-transform"
      >
        <Tag className={finalClassName}>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              variants={finalVariants}
              style={{ willChange: 'transform, opacity' }}
            >
              {line}
            </motion.div>
          ))}
        </Tag>
      </motion.div>
    );
  }

  // Word-level animation (default)
  const words = text.split(' ');
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={containerVariants}
      className="will-change-transform"
    >
      <Tag className={finalClassName}>
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <motion.span
              variants={finalVariants}
              className="inline-block"
              style={{ willChange: 'transform, opacity' }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </Tag>
    </motion.div>
  );
};

export default TextAnimation;
