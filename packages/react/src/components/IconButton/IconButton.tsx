'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { disabledContainer, disabledText, pressable } from '../../utils/control.js';
import { spinnerVariants } from '../Spinner/Spinner.js';
// Loaded only when a `tooltip` is used, so plain IconButtons (most of them, e.g.
// inside Input) don't pull Radix Tooltip into the bundle.
const LazyTooltip = React.lazy(() => import('../Tooltip/Tooltip.js').then((m) => ({ default: m.Tooltip })));

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
  /** Spinner replaces the icon (size kept); clicks are blocked, focus stays. */
  loading?: boolean;
  /** Built-in tooltip: content, or `true` to show `label`. No Provider needed. */
  tooltip?: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, label, asChild = false, loading, tooltip, onClick, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const button = (
      <Comp
        ref={ref}
        aria-label={label}
        aria-busy={loading || undefined}
        aria-disabled={loading || props['aria-disabled'] || undefined}
        className={cn(iconButtonVariants({ variant, size }), 'nx-hit', className)}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          // aria-disabled (not disabled) keeps focus; block the action ourselves.
          if (loading) return e.preventDefault();
          onClick?.(e);
        }}
        {...props}
      >
        {loading && !asChild ? (
          <span aria-hidden="true" className={cn(spinnerVariants({ size: size === 'xs' ? 'xs' : 'sm' }), 'border-current border-t-transparent')} />
        ) : (
          children
        )}
      </Comp>
    );
    if (tooltip == null || tooltip === false) return button;
    return (
      <React.Suspense fallback={button}>
        <LazyTooltip label={tooltip === true ? label : tooltip}>{button}</LazyTooltip>
      </React.Suspense>
    );
  },
);

IconButton.displayName = 'IconButton';
