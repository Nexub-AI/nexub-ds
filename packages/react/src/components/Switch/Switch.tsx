import * as React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '../../utils/cn.js';
import { cva, type VariantProps } from 'class-variance-authority';

export const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--color-brand-primary-500)] data-[state=unchecked]:bg-[var(--color-border-default)]',
  {
    variants: {
      size: {
        sm: 'h-4 w-7',
        md: 'h-5 w-9',
        lg: 'h-6 w-11',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

export const thumbVariants = cva(
  'pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0',
  {
    variants: {
      size: {
        sm: 'h-3 w-3 data-[state=checked]:translate-x-3',
        md: 'h-4 w-4 data-[state=checked]:translate-x-4',
        lg: 'h-5 w-5 data-[state=checked]:translate-x-5',
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
