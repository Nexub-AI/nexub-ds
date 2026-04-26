import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export const inputVariants = cva(
  [
    'flex-1 min-w-0 bg-transparent outline-none placeholder:text-[var(--color-text-placeholder)]',
    'text-[var(--color-text-primary)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const inputWrapperVariants = cva(
  [
    'flex items-center w-full rounded-md border bg-[var(--color-bg-default)] transition-colors',
    'border-[var(--color-border-default)]',
    // ring-offset-[var(--color-ring-offset)] uses the design-system token that
    // matches the page background (#fff in light, #0b1220 in dark) so the gap
    // between the element border and the focus ring is invisible instead of white.
    'focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--color-ring-default)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-ring-offset)]',
    'has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-3 gap-1.5',
        md: 'h-9 px-3 gap-2',
        lg: 'h-10 px-4 gap-2',
      },
      invalid: {
        true: 'border-[var(--color-danger-500)] focus-within:ring-[var(--color-danger-500)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const addonVariants = cva(
  [
    'flex items-center self-stretch px-3 text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)]',
    'border-[var(--color-border-default)] shrink-0',
  ],
  {
    variants: {
      side: {
        leading: 'border-r rounded-l-md',
        trailing: 'border-l rounded-r-md',
      },
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  invalid?: boolean;
  leadingAddon?: string;
  trailingAddon?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      invalid,
      leadingAddon,
      trailingAddon,
      leadingIcon,
      trailingIcon,
      wrapperClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasAddon = Boolean(leadingAddon ?? trailingAddon);

    const inputEl = (
      <input
        ref={ref}
        className={cn(inputVariants({ size }), className)}
        aria-invalid={invalid ?? undefined}
        disabled={disabled}
        {...props}
      />
    );

    if (hasAddon) {
      return (
        <div className={cn('flex w-full rounded-md overflow-hidden border border-[var(--color-border-default)]', invalid && 'border-[var(--color-danger-500)]')}>
          {leadingAddon && (
            <span className={cn(addonVariants({ side: 'leading' }))}>
              {leadingAddon}
            </span>
          )}
          <div className={cn(inputWrapperVariants({ size, invalid }), 'rounded-none border-0 ring-offset-0', wrapperClassName)}>
            {leadingIcon && (
              <span className="shrink-0 text-[var(--color-text-muted)]">{leadingIcon}</span>
            )}
            {inputEl}
            {trailingIcon && (
              <span className="shrink-0 text-[var(--color-text-muted)]">{trailingIcon}</span>
            )}
          </div>
          {trailingAddon && (
            <span className={cn(addonVariants({ side: 'trailing' }))}>
              {trailingAddon}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className={cn(inputWrapperVariants({ size, invalid }), wrapperClassName)}>
        {leadingIcon && (
          <span className="shrink-0 text-[var(--color-text-muted)]">{leadingIcon}</span>
        )}
        {inputEl}
        {trailingIcon && (
          <span className="shrink-0 text-[var(--color-text-muted)]">{trailingIcon}</span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
