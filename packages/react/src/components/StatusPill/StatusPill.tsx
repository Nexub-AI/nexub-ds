import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const statusPillVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium select-none',
  {
    variants: {
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
      tone: 'neutral',
    },
  },
);

const dotColorMap: Record<ToneValue, string> = {
  neutral: 'bg-[var(--color-neutral-500)]',
  info: 'bg-[var(--color-semantic-info-default)]',
  success: 'bg-[var(--color-semantic-success-default)]',
  warning: 'bg-[var(--color-semantic-warning-default)]',
  danger: 'bg-[var(--color-semantic-error-default)]',
  leap: 'bg-[var(--color-leap-500)]',
  bookub: 'bg-[var(--color-bookub-500)]',
  payub: 'bg-[var(--color-payub-500)]',
  founderub: 'bg-[var(--color-founderub-500)]',
};

const pulseTones: ToneValue[] = ['success', 'info'];

export interface StatusPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusPillVariants> {
  tone?: ToneValue;
  label: string;
  dot?: boolean;
}

export const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ className, tone = 'neutral', label, dot = false, ...props }, ref) => {
    const shouldPulse = dot && pulseTones.includes(tone);

    return (
      <span
        ref={ref}
        className={cn(statusPillVariants({ tone }), className)}
        {...props}
      >
        {dot && (
          <span className="relative inline-flex h-2 w-2 shrink-0">
            {shouldPulse && (
              <span
                className={cn(
                  'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                  dotColorMap[tone],
                )}
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                'relative inline-flex rounded-full h-2 w-2',
                dotColorMap[tone],
              )}
            />
          </span>
        )}
        {label}
      </span>
    );
  },
);

StatusPill.displayName = 'StatusPill';
