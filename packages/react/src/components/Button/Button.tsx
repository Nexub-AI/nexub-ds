import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from '@nexub/icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export type ToneValue =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'leap'
  | 'bookub'
  | 'payub'
  | 'founderub';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)]',
    'disabled:opacity-50 disabled:pointer-events-none',
    'select-none',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-brand-primary-500)] text-white hover:bg-[var(--color-brand-primary-600)]',
        secondary:
          'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-bg-muted)]',
        subtle:
          'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-muted)]',
        ghost:
          'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
        outline:
          'bg-transparent border border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
        destructive:
          'bg-[var(--color-danger-500)] text-white hover:bg-[var(--color-danger-600)]',
        accent:
          'bg-[var(--color-accent-500)] text-white hover:bg-[var(--color-accent-600)]',
        link: 'bg-transparent text-[var(--color-text-primary)] underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-5 text-base',
        xl: 'h-12 px-6 text-base',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  tone?: ToneValue;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      tone,
      loading = false,
      fullWidth,
      leadingIcon,
      trailingIcon,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const sharedProps = {
      className: cn(buttonVariants({ variant, size, fullWidth }), className),
      'data-tone': tone,
      ...props,
    };

    if (asChild) {
      return (
        <Slot ref={ref} {...sharedProps}>
          {children}
        </Slot>
      );
    }

    return (
      <button ref={ref} disabled={disabled ?? loading} {...sharedProps}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leadingIcon
        )}
        {children}
        {!loading && trailingIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';
