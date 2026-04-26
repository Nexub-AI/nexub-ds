import * as React from 'react';
import * as RadixToggle from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)] disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-[var(--color-bg-subtle)] data-[state=on]:text-[var(--color-text-primary)]',
  {
    variants: {
      variant: {
        default: 'bg-transparent hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]',
        outline: 'border border-[var(--color-border-default)] bg-transparent hover:bg-[var(--color-bg-subtle)]',
      },
      size: {
        sm: 'h-8 px-2.5',
        md: 'h-9 px-3',
        lg: 'h-10 px-4',
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
