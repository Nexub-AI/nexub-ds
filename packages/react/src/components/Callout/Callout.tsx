import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const calloutVariants = cva(
  'flex gap-2.5 rounded-shape-container px-3 py-2.5 text-sm',
  {
    variants: {
      tone: {
        neutral:
          'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)]',
        info:
          'bg-[var(--color-info-container)] text-[var(--color-on-info-container)]',
        success:
          'bg-[var(--color-success-container)] text-[var(--color-on-success-container)]',
        warning:
          'bg-[var(--color-warning-container)] text-[var(--color-on-warning-container)]',
        danger:
          'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
        leap:
          'bg-[var(--color-leap-container)] text-[var(--color-on-leap-container)]',
        bookub:
          'bg-[var(--color-bookub-container)] text-[var(--color-on-bookub-container)]',
        payub:
          'bg-[var(--color-payub-container)] text-[var(--color-on-payub-container)]',
        founderub:
          'bg-[var(--color-founderub-container)] text-[var(--color-on-founderub-container)]',
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

/** @deprecated Use `Alert` instead: `<Alert>` covers tone + icon. Deprecated since 1.1.0; removal planned in 3.0. */
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
