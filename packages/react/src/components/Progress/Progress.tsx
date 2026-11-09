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
  'h-full rounded-full transition-all duration-spatial-default ease-spatial-default',
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

const ringTone: Record<ToneValue, string> = {
  neutral: 'stroke-[var(--color-outline)]',
  info: 'stroke-[var(--color-info)]',
  success: 'stroke-[var(--color-success)]',
  warning: 'stroke-[var(--color-warning)]',
  danger: 'stroke-[var(--color-error)]',
  leap: 'stroke-[var(--color-leap)]',
  bookub: 'stroke-[var(--color-bookub)]',
  payub: 'stroke-[var(--color-payub)]',
  founderub: 'stroke-[var(--color-founderub)]',
};
const ringSize = { sm: 'size-6', md: 'size-10', lg: 'size-16' } as const;

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof progressTrackVariants> {
  value?: number;
  max?: number;
  tone?: ToneValue;
  animated?: boolean;
  /** `circular` draws a ring; same value/max/indeterminate semantics. @default 'linear' */
  variant?: 'linear' | 'circular';
  /** Linear only: splits the bar into N equal steps, filled up to the value. */
  segments?: number;
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
      variant = 'linear',
      segments,
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

    const aria = {
      role: 'progressbar',
      'aria-valuenow': isIndeterminate ? undefined : clampedValue,
      'aria-valuemin': 0,
      'aria-valuemax': max,
    } as const;

    if (variant === 'circular') {
      return (
        <div ref={ref} {...aria} className={cn('inline-flex', ringSize[size ?? 'md'], className)} {...props}>
          <svg viewBox="0 0 36 36" className={cn('size-full -rotate-90', isIndeterminate && 'animate-spin motion-reduce:animate-none')} aria-hidden="true">
            <circle cx="18" cy="18" r="15" fill="none" strokeWidth="4" className="stroke-[var(--color-surface-container-high)]" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${isIndeterminate ? 25 : percentage} 100`}
              className={cn('transition-all duration-spatial-default ease-spatial-default', ringTone[tone])}
              data-part="fill"
              data-indeterminate={isIndeterminate || undefined}
            />
          </svg>
        </div>
      );
    }

    if (segments && segments > 0 && !isIndeterminate) {
      const filled = Math.round((percentage / 100) * segments);
      return (
        <div
          ref={ref}
          {...aria}
          className={cn(progressTrackVariants({ size }), 'flex gap-1 bg-transparent', className)}
          {...props}
        >
          {Array.from({ length: segments }, (_, i) => (
            <div
              key={i}
              data-part="segment"
              data-filled={i < filled || undefined}
              className={cn(
                'flex-1',
                i < filled ? progressFillVariants({ tone }) : 'rounded-full bg-[var(--color-surface-container-high)]',
              )}
            />
          ))}
        </div>
      );
    }

    return (
      <div ref={ref} {...aria} className={cn(progressTrackVariants({ size }), className)} {...props}>
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
