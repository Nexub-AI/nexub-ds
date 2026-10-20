import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';

export const progressTrackVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]',
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
        neutral: 'bg-[var(--color-neutral-500)]',
        info: 'bg-[var(--color-semantic-info-default)]',
        success: 'bg-[var(--color-semantic-success-default)]',
        warning: 'bg-[var(--color-semantic-warning-default)]',
        danger: 'bg-[var(--color-semantic-error-default)]',
        leap: 'bg-[var(--color-leap-500)]',
        bookub: 'bg-[var(--color-bookub-500)]',
        payub: 'bg-[var(--color-payub-500)]',
        founderub: 'bg-[var(--color-founderub-500)]',
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
      value = 0,
      max = 100,
      animated = false,
      ...props
    },
    ref,
  ) => {
    const clampedValue = Math.min(Math.max(value, 0), max);
    const percentage = (clampedValue / max) * 100;
    // Width is set through CSSOM, not a style attribute, so server HTML stays
    // valid under a strict CSP (style-src without 'unsafe-inline').
    const fillRef = React.useRef<HTMLDivElement>(null);
    useIsomorphicLayoutEffect(() => {
      fillRef.current?.style.setProperty('width', `${percentage}%`);
    }, [percentage]);
    const isIndeterminate = value === undefined || value === null;

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
          )}
          ref={fillRef}
          data-part="fill"
        />
      </div>
    );
  },
);

Progress.displayName = 'Progress';
