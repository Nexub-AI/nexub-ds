import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import type { ToneValue } from '../Button/Button.js';

export const spinnerVariants = cva(
  [
    'inline-block rounded-full border-2 border-solid',
    'animate-spin',
    // One transparent segment gives the illusion of rotation
    'border-t-transparent',
  ],
  {
    variants: {
      size: {
        xs: 'h-3 w-3 border-[1.5px]',
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-[3px]',
        xl: 'h-10 w-10 border-4',
      },
      tone: {
        neutral: 'border-[var(--color-on-surface-variant)]',
        info: 'border-[var(--color-info)]',
        success: 'border-[var(--color-success)]',
        warning: 'border-[var(--color-warning)]',
        danger: 'border-[var(--color-error)]',
        leap: 'border-[var(--color-leap)]',
        bookub: 'border-[var(--color-bookub)]',
        payub: 'border-[var(--color-payub)]',
        founderub: 'border-[var(--color-founderub)]',
      },
    },
    defaultVariants: {
      size: 'md',
      tone: 'neutral',
    },
  },
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  tone?: ToneValue;
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, tone = 'neutral', label, ...props }, ref) => {
    const messages = useNexubMessages();
    return (
      <span
        ref={ref}
        role="status"
        aria-label={label ?? messages.loading}
        className={cn('inline-flex items-center justify-center', className)}
        {...props}
      >
        <span
          className={cn(spinnerVariants({ size, tone }))}
          aria-hidden="true"
        />
      </span>
    );
  },
);

Spinner.displayName = 'Spinner';
