'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';

export const progressTrackVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-[var(--color-surface-container-high)]',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const progressFillVariants = cva(
  'h-full rounded-full transition-all duration-300 ease-in-out',
  {
    variants: {
      tone: {
        neutral: 'bg-[var(--color-outline)]',
        info: 'bg-[var(--color-info)]',
        success: 'bg-[var(--color-success)]',
        warning: 'bg-[var(--color-warning)]',
        danger: 'bg-[var(--color-error)]',
        leap: 'bg-[var(--color-leap)]',
        bookub: 'bg-[var(--color-bookub)]',
        payub: 'bg-[var(--color-payub)]',
        founderub: 'bg-[var(--color-founderub)]',
      },
      animated: {
        true: 'bg-[length:200%_100%] animate-[progress-stripes_1s_linear_infinite]',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
);

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof progressTrackVariants> {
  value?: number;
  max?: number;
  tone?: ToneValue;
  animated?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      size,
      tone = 'neutral',
      value,
      max = 100,
      animated = false,
      ...props
    },
    ref,
  ) => {
    // No value = indeterminate (ARIA: omit aria-valuenow); a sliding segment.
    const isIndeterminate = value === undefined || value === null;
    const clampedValue = isIndeterminate ? 0 : Math.min(Math.max(value, 0), max);
    const percentage = isIndeterminate ? 40 : (clampedValue / max) * 100;
    // Width is set through CSSOM, not a style attribute, so server HTML stays
    // valid under a strict CSP (style-src without 'unsafe-inline').
    const fillRef = React.useRef<HTMLDivElement>(null);
    useIsomorphicLayoutEffect(() => {
      fillRef.current?.style.setProperty('width', `${percentage}%`);
    }, [percentage]);

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(progressTrackVariants({ size }), className)}
        {...props}
      >
        <div
          className={cn(
            progressFillVariants({ tone }),
            animated && 'animate-pulse',
            isIndeterminate && 'animate-[nx-progress-indeterminate_1.4s_ease-in-out_infinite]',
          )}
          ref={fillRef}
          data-part="fill"
          data-indeterminate={isIndeterminate || undefined}
        />
      </div>
    );
  },
);

Progress.displayName = 'Progress';
