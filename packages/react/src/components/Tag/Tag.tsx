import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const tagVariants = cva(
  'inline-flex items-center rounded-shape-min font-medium select-none whitespace-nowrap',
  {
    variants: {
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
      },
      tone: {
        neutral:
          'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]',
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
      size: 'md',
      tone: 'neutral',
    },
  },
);

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  tone?: ToneValue;
}

/** @deprecated Use `Badge` instead: `<Badge size="sm">` covers it. Will be removed in 1.0. */
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, size, tone = 'neutral', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(tagVariants({ size, tone }), className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Tag.displayName = 'Tag';
