'use client';

import * as React from 'react';
import { X } from '@nexub/icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { field, fieldDisabledWithin, fieldFocusWithin, fieldInvalid } from '../../utils/control.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { IconButton } from '../IconButton/IconButton.js';
import { Spinner } from '../Spinner/Spinner.js';

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
  /** Shows a clear button while there is a value. Clearing fires `onChange` with "". */
  clearable?: boolean;
  /** Shows a "12/80" counter; needs `maxLength`. Announced politely near the limit. */
  showCount?: boolean;
  /** Spinner in the trailing slot and `aria-busy` on the input. */
  loading?: boolean;
}

// Near the limit = the last 10% (at least 1 character).
const nearLimit = (length: number, max: number) => length >= max - Math.max(1, Math.ceil(max * 0.1));

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
      clearable,
      showCount,
      loading,
      ...props
    },
    ref,
  ) => {
    const hasAddon = Boolean(leadingAddon ?? trailingAddon);
    const messages = useNexubMessages();
    const innerRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, innerRef);
    const countId = React.useId();

    // Track the length for uncontrolled use; controlled reads `value`.
    const [uncontrolledLength, setLength] = React.useState(String(props.defaultValue ?? '').length);
    const length = props.value !== undefined && props.value !== null ? String(props.value).length : uncontrolledLength;
    const max = props.maxLength;
    const counting = Boolean(showCount && max !== undefined && max >= 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLength(e.target.value.length);
      props.onChange?.(e);
    };

    // Clear through a native input event so React fires onChange for both
    // controlled and uncontrolled inputs.
    const clear = () => {
      const el = innerRef.current;
      if (!el) return;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(el, '');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.focus();
    };

    const inputEl = (
      <input
        className={cn(inputVariants({ size }), className)}
        aria-invalid={invalid ?? undefined}
        aria-busy={loading || undefined}
        disabled={disabled}
        {...props}
        aria-describedby={[props['aria-describedby'], counting && countId].filter(Boolean).join(' ') || undefined}
        onChange={handleChange}
        ref={mergedRef}
      />
    );

    const showClear = clearable && length > 0 && !disabled && !props.readOnly;
    const trailing = (
      <>
        {counting && (
          <span className="shrink-0 text-label-sm tabular-nums text-[var(--color-on-surface-muted)]">
            <span aria-hidden="true">{`${length}/${max}`}</span>
            <span id={countId} className="sr-only" aria-live={nearLimit(length, max!) ? 'polite' : 'off'}>
              {messages.characterCount(length, max!)}
            </span>
          </span>
        )}
        {loading && <Spinner size="sm" className="shrink-0" />}
        {showClear && (
          <IconButton size="xs" label={messages.clear} onClick={clear} className="-me-1.5">
            <X className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        )}
        {trailingIcon && (
          <span className="shrink-0 text-[var(--color-on-surface-variant)]">{trailingIcon}</span>
        )}
      </>
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
            {trailing}
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
        {trailing}
      </div>
    );
  },
);

Input.displayName = 'Input';
