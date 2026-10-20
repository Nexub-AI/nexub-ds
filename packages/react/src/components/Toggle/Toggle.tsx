import * as React from 'react';
import * as RadixToggle from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export const toggleVariants = cva(
  [
    // Pressable capsule; on = the secondary container (tonal selection).
    'nx-state-layer nx-press relative inline-flex items-center justify-center gap-2 rounded-shape-control select-none',
    'text-[var(--color-on-surface-variant)] transition-[background-color,color] duration-effects-fast ease-effects-fast',
    'data-[state=on]:bg-[var(--color-secondary-container)] data-[state=on]:text-[var(--color-on-secondary-container)]',
    'disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]',
  ],
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-[var(--color-outline-variant)] bg-transparent data-[state=on]:border-transparent',
      },
      size: {
        sm: 'h-control-sm px-3 text-label-md',
        md: 'h-control-md px-4 text-label-lg',
        lg: 'h-control-lg px-5 text-label-lg',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export interface ToggleProps extends RadixToggle.ToggleProps, VariantProps<typeof toggleVariants> {}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => (
    <RadixToggle.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Toggle.displayName = 'Toggle';
