'use client';

import * as React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Minus } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import type { Size } from '../../utils/control.js';
import { controlInvalid } from '../../utils/controlState.js';

export interface CheckboxProps extends RadixCheckbox.CheckboxProps {
  /** Box size: `sm` 16px, `md` 18px (default), `lg` 20px. */
  size?: Size;
  /** Error border and `aria-invalid`. */
  invalid?: boolean;
  /** Focusable but cannot change; sets `aria-readonly`. */
  readOnly?: boolean;
}

const boxSize: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-[1.125rem] w-[1.125rem]',
  lg: 'h-5 w-5',
};
const checkSize: Record<Size, number> = { sm: 10, md: 12, lg: 14 };

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, size = 'md', invalid, readOnly, onClick, ...props }, ref) => (
    <RadixCheckbox.Root
      ref={ref}
      className={cn(
        // 2px outline border (>= 3:1), primary when on. Focus = the global ring.
        'nx-hit peer shrink-0 rounded-[var(--checkbox-radius,0.3125rem)] border-2 border-[var(--checkbox-border,var(--color-outline))]',
        boxSize[size],
        'transition-[background-color,border-color] duration-effects-fast ease-effects-fast',
        'hover:border-[var(--color-on-surface)]',
        controlInvalid,
        'aria-readonly:cursor-default',
        'data-[state=checked]:bg-[var(--checkbox-checked-bg,var(--color-primary))] data-[state=checked]:border-[var(--checkbox-checked-bg,var(--color-primary))] data-[state=checked]:text-[var(--checkbox-checked-fg,var(--color-on-primary))]',
        'data-[state=indeterminate]:bg-[var(--checkbox-checked-bg,var(--color-primary))] data-[state=indeterminate]:border-[var(--checkbox-checked-bg,var(--color-primary))] data-[state=indeterminate]:text-[var(--checkbox-checked-fg,var(--color-on-primary))]',
        'disabled:cursor-not-allowed disabled:border-[var(--color-text-disabled)] disabled:data-[state=checked]:bg-[var(--color-text-disabled)] disabled:data-[state=indeterminate]:bg-[var(--color-text-disabled)] disabled:text-[var(--color-surface)]',
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        // Radix skips its toggle when the click is default-prevented.
        if (readOnly) e.preventDefault();
      }}
      {...props}
      aria-invalid={invalid || props['aria-invalid']}
      aria-readonly={readOnly || undefined}
    >
      <RadixCheckbox.Indicator className="flex items-center justify-center">
        {props.checked === 'indeterminate' ? (
          <Minus size="xs" />
        ) : (
          // Drawn inline so the stroke can draw itself in (nx-check-draw).
          <svg width={checkSize[size]} height={checkSize[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path className="nx-check-draw" pathLength={1} d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  ),
);
Checkbox.displayName = 'Checkbox';
