import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const labelVariants = cva(
  ['inline-flex items-center gap-1 font-medium leading-none select-none'],
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  disabled?: boolean;
  tone?: ToneValue;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size, required, disabled, tone, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        data-tone={tone}
        className={cn(
          labelVariants({ size, disabled }),
          'text-[var(--color-text-primary)]',
          className,
        )}
        {...props}
      >
        {children}
        {required && (
          <span
            aria-hidden="true"
            className="text-[var(--color-danger-500)] leading-none"
          >
            *
          </span>
        )}
      </label>
    );
  },
);

Label.displayName = 'Label';
