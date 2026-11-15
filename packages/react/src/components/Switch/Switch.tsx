'use client';

import * as React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '../../utils/cn.js';
import { cva, type VariantProps } from 'class-variance-authority';
import { spinnerVariants } from '../Spinner/Spinner.js';

export const switchVariants = cva(
  // Off: tonal track with a 2px outline (>= 3:1, WCAG 1.4.11). On: primary.
  // Focus = the global ring (it follows the capsule).
  [
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2',
    'transition-[background-color,border-color] duration-effects-fast ease-effects-fast',
    'data-[state=unchecked]:bg-[var(--color-surface-container-highest)] data-[state=unchecked]:border-[var(--color-outline)]',
    'data-[state=checked]:bg-[var(--color-primary)] data-[state=checked]:border-[var(--color-primary)]',
    'disabled:cursor-not-allowed disabled:border-[var(--color-text-disabled)] disabled:bg-[color-mix(in_srgb,var(--color-on-surface)_12%,transparent)] disabled:data-[state=checked]:bg-[var(--color-text-disabled)] disabled:data-[state=checked]:border-transparent disabled:data-[state=unchecked]:border-[var(--color-outline-variant)]',
  ],
  {
    variants: {
      // --nx-switch-travel: the Signature full thumb's slide (track width - height).
      size: {
        sm: 'h-5 w-9 [--nx-switch-travel:16px]',
        md: 'h-7 w-12 [--nx-switch-travel:20px]',
        lg: 'h-8 w-14 [--nx-switch-travel:24px]',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

export const thumbVariants = cva(
  // The thumb slides on the expressive spring (a toggle is a key moment).
  [
    'pointer-events-none block rounded-full shadow-elevation-1',
    'transition-[transform,background-color] duration-expressive-fast ease-expressive-fast',
    'translate-x-0.5 rtl:-translate-x-0.5 data-[state=unchecked]:bg-[var(--color-outline)] data-[state=checked]:bg-[var(--color-on-primary)] data-[disabled]:data-[state=unchecked]:bg-[var(--color-outline-variant)]',
  ],
  {
    variants: {
      size: {
        sm: 'h-3 w-3 data-[state=checked]:translate-x-[18px] rtl:data-[state=checked]:-translate-x-[18px]',
        md: 'h-5 w-5 data-[state=checked]:translate-x-[22px] rtl:data-[state=checked]:-translate-x-[22px]',
        lg: 'h-6 w-6 data-[state=checked]:translate-x-[26px] rtl:data-[state=checked]:-translate-x-[26px]',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

export interface SwitchProps extends RadixSwitch.SwitchProps, VariantProps<typeof switchVariants> {
  /** Spinner in the thumb and `aria-busy`; clicks don't toggle while loading. Stays focusable. */
  loading?: boolean;
  /** Small icon inside the thumb while on. */
  checkedIcon?: React.ReactNode;
  /** Small icon inside the thumb while off. */
  uncheckedIcon?: React.ReactNode;
}

// Thumb content inherits the thumb's text colour (the track colour, for contrast).
const thumbSlot = 'hidden h-full w-full items-center justify-center [&>svg]:h-2/3 [&>svg]:w-2/3';

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, size, loading, checkedIcon, uncheckedIcon, onClick, ...props }, ref) => (
    <RadixSwitch.Root
      ref={ref}
      className={cn(switchVariants({ size }), 'nx-switch nx-hit', loading && 'cursor-progress', className)}
      aria-busy={loading || undefined}
      onClick={(e) => {
        onClick?.(e);
        // Radix skips its toggle when the click is default-prevented.
        if (loading) e.preventDefault();
      }}
      {...props}
    >
      <RadixSwitch.Thumb
        className={cn(
          thumbVariants({ size }),
          'nx-switch-thumb',
          (loading || checkedIcon || uncheckedIcon) &&
            'group/thumb flex items-center justify-center data-[state=checked]:text-[var(--color-primary)] data-[state=unchecked]:text-[var(--color-surface-container-highest)]',
        )}
      >
        {loading ? (
          <span aria-hidden="true" className={cn(spinnerVariants({ size: 'xs' }), 'h-2/3 w-2/3 border-current border-t-transparent')} />
        ) : (
          <>
            {checkedIcon && <span aria-hidden="true" className={cn(thumbSlot, 'group-data-[state=checked]/thumb:flex')}>{checkedIcon}</span>}
            {uncheckedIcon && <span aria-hidden="true" className={cn(thumbSlot, 'group-data-[state=unchecked]/thumb:flex')}>{uncheckedIcon}</span>}
          </>
        )}
      </RadixSwitch.Thumb>
    </RadixSwitch.Root>
  ),
);
Switch.displayName = 'Switch';
