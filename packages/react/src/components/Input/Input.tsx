import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { field, fieldDisabledWithin, fieldFocusWithin, fieldInvalid } from '../../utils/control.js';

export const inputVariants = cva(
  [
    // The wrapper owns ALL focus styling (border + ring). Strip every possible
    // focus indicator from the inner <input> so we never get a double ring.
    'flex-1 min-w-0 bg-transparent',
    'border-0 shadow-none',
    'outline-none focus:outline-none focus-visible:outline-none',
    'ring-0 focus:ring-0 focus-visible:ring-0',
    'placeholder:text-[var(--color-on-surface-muted)]',
    'text-[var(--color-on-surface)]',
    'disabled:cursor-not-allowed disabled:text-[var(--color-text-disabled)]',
  ],
  {
    variants: {
      // 16px from md up: readable, and iOS doesn't zoom on focus.
      size: {
        sm: 'text-body-sm',
        md: 'text-body-md',
        lg: 'text-body-md',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const inputWrapperVariants = cva(
  [
    // The wrapper is the field: one border that thickens to 2px primary on focus.
    'flex items-center w-full',
    field,
    fieldFocusWithin,
    fieldDisabledWithin,
  ],
  {
    variants: {
      size: {
        sm: 'h-control-sm px-3 gap-1.5',
        md: 'h-control-md px-3.5 gap-2',
        lg: 'h-control-lg px-4 gap-2',
      },
      invalid: {
        true: fieldInvalid,
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const addonVariants = cva(
  [
    'flex items-center self-stretch px-3 text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-high)]',
    'border-[var(--color-outline-variant)] shrink-0',
  ],
  {
    variants: {
      side: {
        leading: 'border-e',
        trailing: 'border-s',
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
        <div className={cn('flex w-full overflow-hidden', field, fieldFocusWithin, invalid && fieldInvalid)}>
          {leadingAddon && (
            <span className={cn(addonVariants({ side: 'leading' }))}>
              {leadingAddon}
            </span>
          )}
          <div className={cn(inputWrapperVariants({ size, invalid }), 'rounded-none border-0 shadow-none focus-within:shadow-none', wrapperClassName)}>
            {leadingIcon && (
              <span className="shrink-0 text-[var(--color-on-surface-variant)]">{leadingIcon}</span>
            )}
            {inputEl}
            {trailingIcon && (
              <span className="shrink-0 text-[var(--color-on-surface-variant)]">{trailingIcon}</span>
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
          <span className="shrink-0 text-[var(--color-on-surface-variant)]">{leadingIcon}</span>
        )}
        {inputEl}
        {trailingIcon && (
          <span className="shrink-0 text-[var(--color-on-surface-variant)]">{trailingIcon}</span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
