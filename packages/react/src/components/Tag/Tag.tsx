import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const tagVariants = cva(
  'inline-flex items-center rounded font-medium select-none whitespace-nowrap',
  {
    variants: {
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
      },
      tone: {
        neutral:
          'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]',
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
