import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const chipVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium select-none transition-colors',
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
      },
      tone: {
        neutral:
          'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] border border-[var(--color-neutral-200)]',
        info: 'bg-[var(--color-semantic-info-default)]/10 text-[var(--color-semantic-info-default)] border border-[var(--color-semantic-info-default)]/20',
        success:
          'bg-[var(--color-semantic-success-default)]/10 text-[var(--color-semantic-success-default)] border border-[var(--color-semantic-success-default)]/20',
        warning:
          'bg-[var(--color-semantic-warning-default)]/10 text-[var(--color-semantic-warning-default)] border border-[var(--color-semantic-warning-default)]/20',
        danger:
          'bg-[var(--color-semantic-error-default)]/10 text-[var(--color-semantic-error-default)] border border-[var(--color-semantic-error-default)]/20',
        leap: 'bg-[var(--color-leap-500)]/10 text-[var(--color-leap-700)] border border-[var(--color-leap-500)]/20',
        bookub:
          'bg-[var(--color-bookub-500)]/10 text-[var(--color-bookub-700)] border border-[var(--color-bookub-500)]/20',
        payub:
          'bg-[var(--color-payub-500)]/10 text-[var(--color-payub-700)] border border-[var(--color-payub-500)]/20',
        founderub:
          'bg-[var(--color-founderub-500)]/10 text-[var(--color-founderub-700)] border border-[var(--color-founderub-500)]/20',
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
              'inline-flex items-center justify-center rounded-full transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-1',
              'hover:bg-black/10 text-current opacity-60 hover:opacity-100',
              size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4',
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
