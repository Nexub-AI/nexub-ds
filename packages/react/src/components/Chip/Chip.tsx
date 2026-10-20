import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const chipVariants = cva(
  'inline-flex items-center gap-1 rounded-shape-control select-none',
  {
    variants: {
      size: {
        sm: 'h-6 px-2.5 text-label-md',
        md: 'h-8 px-3 text-label-lg',
      },
      // Containers + on-container text (WCAG AA by construction).
      tone: {
        neutral: 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)]',
        info: 'bg-[var(--color-info-container)] text-[var(--color-on-info-container)]',
        success: 'bg-[var(--color-success-container)] text-[var(--color-on-success-container)]',
        warning: 'bg-[var(--color-warning-container)] text-[var(--color-on-warning-container)]',
        danger: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
        leap: 'bg-[var(--color-leap-container)] text-[var(--color-on-leap-container)]',
        bookub: 'bg-[var(--color-bookub-container)] text-[var(--color-on-bookub-container)]',
        payub: 'bg-[var(--color-payub-container)] text-[var(--color-on-payub-container)]',
        founderub: 'bg-[var(--color-founderub-container)] text-[var(--color-on-founderub-container)]',
      },
    },
    defaultVariants: {
      size: 'md',
      tone: 'neutral',
    },
  },
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  tone?: ToneValue;
  onRemove?: () => void;
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, size, tone = 'neutral', onRemove, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(chipVariants({ size, tone }), className)}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            type="button"
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={cn(
              // State layer for hover/press; focus = the global ring.
              'nx-state-layer inline-flex items-center justify-center rounded-full text-current -mr-1',
              size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
            )}
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 1L1 7M1 1l6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </span>
    );
  },
);

Chip.displayName = 'Chip';
