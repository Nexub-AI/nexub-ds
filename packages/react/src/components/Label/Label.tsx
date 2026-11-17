import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { Size } from '../../utils/control.js';
import type { ToneValue } from '../Button/Button.js';
import { toneTextClasses } from '../../utils/control.js';

export const labelVariants = cva(
  ['inline-flex items-center gap-1 font-medium leading-none select-none'],
  {
    variants: {
      size: {
        sm: 'text-label-sm',
        md: 'text-body-sm',
        lg: 'text-body-md',
      },
      disabled: {
        true: 'text-[var(--color-text-disabled)] cursor-not-allowed',
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
  size?: Size;
  required?: boolean;
  disabled?: boolean;
  tone?: ToneValue;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size, required, disabled, tone, style, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        data-tone={tone}
        style={style}
        className={cn(
          'text-[var(--color-on-surface)]',
          tone && toneTextClasses[tone],
          // After the colours: disabled wins over tone.
          labelVariants({ size, disabled }),
          className,
        )}
        {...props}
      >
        {children}
        {required && (
          <span
            aria-hidden="true"
            className="text-[var(--color-error)] leading-none"
          >
            *
          </span>
        )}
      </label>
    );
  },
);

Label.displayName = 'Label';
