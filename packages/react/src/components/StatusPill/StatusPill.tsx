import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const statusPillVariants = cva(
  'inline-flex items-center gap-1.5 rounded-shape-control px-2.5 py-1 text-xs font-medium select-none',
  {
    variants: {
      tone: {
        neutral:
          'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)]',
        info:
          'bg-[var(--color-info-container)] text-[var(--color-on-info-container)] border border-[color-mix(in_srgb,var(--color-info)_35%,transparent)]',
        success:
          'bg-[var(--color-success-container)] text-[var(--color-on-success-container)] border border-[color-mix(in_srgb,var(--color-success)_35%,transparent)]',
        warning:
          'bg-[var(--color-warning-container)] text-[var(--color-on-warning-container)] border border-[color-mix(in_srgb,var(--color-warning)_35%,transparent)]',
        danger:
          'bg-[var(--color-error-container)] text-[var(--color-on-error-container)] border border-[color-mix(in_srgb,var(--color-error)_35%,transparent)]',
        leap:
          'bg-[var(--color-leap-container)] text-[var(--color-on-leap-container)] border border-[color-mix(in_srgb,var(--color-leap)_35%,transparent)]',
        bookub:
          'bg-[var(--color-bookub-container)] text-[var(--color-on-bookub-container)] border border-[color-mix(in_srgb,var(--color-bookub)_35%,transparent)]',
        payub:
          'bg-[var(--color-payub-container)] text-[var(--color-on-payub-container)] border border-[color-mix(in_srgb,var(--color-payub)_35%,transparent)]',
        founderub:
          'bg-[var(--color-founderub-container)] text-[var(--color-on-founderub-container)] border border-[color-mix(in_srgb,var(--color-founderub)_35%,transparent)]',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
);

const dotColorMap: Record<ToneValue, string> = {
  neutral: 'bg-[var(--color-outline)]',
  info: 'bg-[var(--color-info)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-error)]',
  leap: 'bg-[var(--color-leap)]',
  bookub: 'bg-[var(--color-bookub)]',
  payub: 'bg-[var(--color-payub)]',
  founderub: 'bg-[var(--color-founderub)]',
};

const pulseTones: ToneValue[] = ['success', 'info'];

export interface StatusPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusPillVariants> {
  tone?: ToneValue;
  label: string;
  dot?: boolean;
}

/** @deprecated Use `Badge` instead: `<Badge variant="soft" leadingIcon={dot}>` covers it. Deprecated since 1.1.0; removal planned in 3.0. */
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
