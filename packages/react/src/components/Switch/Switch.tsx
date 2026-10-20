import * as React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '../../utils/cn.js';
import { cva, type VariantProps } from 'class-variance-authority';

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
      size: {
        sm: 'h-5 w-9',
        md: 'h-7 w-12',
        lg: 'h-8 w-14',
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

export interface SwitchProps extends RadixSwitch.SwitchProps, VariantProps<typeof switchVariants> {}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, size, ...props }, ref) => (
    <RadixSwitch.Root ref={ref} className={cn(switchVariants({ size }), className)} {...props}>
      <RadixSwitch.Thumb className={cn(thumbVariants({ size }))} />
    </RadixSwitch.Root>
  ),
);
Switch.displayName = 'Switch';
