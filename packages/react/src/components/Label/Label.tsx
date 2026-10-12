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
  ({ className, size, required, disabled, tone, style, children, ...props }, ref) => {
    // Inline var() so Tailwind JIT never sees `${tone}`; only semantic tones
    // resolve a --color-text-* var, brand tones fall back to the primary class.
    const toneStyle: React.CSSProperties = tone ? { color: `var(--color-text-${tone})` } : {};
    return (
      <label
        ref={ref}
        data-tone={tone}
        style={{ ...toneStyle, ...style }}
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
