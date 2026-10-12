import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const calloutVariants = cva(
  'flex gap-2.5 rounded-md px-3 py-2.5 text-sm',
  {
    variants: {
      tone: {
        neutral:
          'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]',
        info: 'bg-[var(--color-semantic-info-default)]/10 text-[var(--color-semantic-info-default)]',
        success:
          'bg-[var(--color-semantic-success-default)]/10 text-[var(--color-semantic-success-default)]',
        warning:
          'bg-[var(--color-semantic-warning-default)]/10 text-[var(--color-semantic-warning-default)]',
        danger:
          'bg-[var(--color-semantic-error-default)]/10 text-[var(--color-semantic-error-default)]',
        leap: 'bg-[var(--color-leap-500)]/10 text-[var(--color-leap-700)]',
        bookub: 'bg-[var(--color-bookub-500)]/10 text-[var(--color-bookub-700)]',
        payub: 'bg-[var(--color-payub-500)]/10 text-[var(--color-payub-700)]',
        founderub: 'bg-[var(--color-founderub-500)]/10 text-[var(--color-founderub-700)]',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
);

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  tone?: ToneValue;
  icon?: React.ReactNode;
}

/** @deprecated Use `Alert` instead: `<Alert>` covers tone + icon. Will be removed in 1.0. */
export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, tone = 'neutral', icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(calloutVariants({ tone }), className)}
        data-tone={tone}
        {...props}
      >
        {icon && (
          <span className="shrink-0 mt-0.5 inline-flex" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    );
  },
);

Callout.displayName = 'Callout';
