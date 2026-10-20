import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { disabledContainer, disabledText, pressable } from '../../utils/control.js';

export const iconButtonVariants = cva(
  [pressable, 'relative inline-flex items-center justify-center flex-shrink-0'],
  {
    variants: {
      variant: {
        ghost: `bg-transparent text-[var(--color-on-surface-variant)] ${disabledText}`,
        solid: `bg-[var(--color-primary)] text-[var(--color-on-primary)] ${disabledContainer}`,
        outline: `bg-transparent border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] ${disabledContainer}`,
        subtle: `bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] ${disabledContainer}`,
      },
      // Square on the control ladder; the capsule shape makes it a circle.
      size: {
        xs: 'h-control-xs w-control-xs text-label-sm',
        sm: 'h-control-sm w-control-sm text-label-md',
        md: 'h-control-md w-control-md text-label-lg',
        lg: 'h-control-lg w-control-lg text-title-md',
        xl: 'h-control-xl w-control-xl text-title-md',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  label: string;
  asChild?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, label, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        aria-label={label}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

IconButton.displayName = 'IconButton';
