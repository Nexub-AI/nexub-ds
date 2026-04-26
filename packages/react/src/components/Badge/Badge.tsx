import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap',
    'transition-colors select-none',
  ],
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-sm',
      },
      variant: {
        solid: '',
        soft: '',
        outline: 'bg-transparent border',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'solid',
    },
  },
);

const toneClasses: Record<
  ToneValue,
  { solid: string; soft: string; outline: string }
> = {
  neutral: {
    solid:
      'bg-[var(--color-neutral-500)] text-white',
    soft: 'bg-[var(--color-neutral-500)]/10 text-[var(--color-neutral-700)]',
    outline:
      'border-[var(--color-neutral-500)] text-[var(--color-neutral-700)]',
  },
  info: {
    solid:
      'bg-[var(--color-semantic-info-default)] text-white',
    soft: 'bg-[var(--color-semantic-info-default)]/10 text-[var(--color-semantic-info-default)]',
    outline:
      'border-[var(--color-semantic-info-default)] text-[var(--color-semantic-info-default)]',
  },
  success: {
    solid:
      'bg-[var(--color-semantic-success-default)] text-white',
    soft: 'bg-[var(--color-semantic-success-default)]/10 text-[var(--color-semantic-success-default)]',
    outline:
      'border-[var(--color-semantic-success-default)] text-[var(--color-semantic-success-default)]',
  },
  warning: {
    solid:
      'bg-[var(--color-semantic-warning-default)] text-white',
    soft: 'bg-[var(--color-semantic-warning-default)]/10 text-[var(--color-semantic-warning-default)]',
    outline:
      'border-[var(--color-semantic-warning-default)] text-[var(--color-semantic-warning-default)]',
  },
  danger: {
    solid:
      'bg-[var(--color-semantic-error-default)] text-white',
    soft: 'bg-[var(--color-semantic-error-default)]/10 text-[var(--color-semantic-error-default)]',
    outline:
      'border-[var(--color-semantic-error-default)] text-[var(--color-semantic-error-default)]',
  },
  leap: {
    solid:
      'bg-[var(--color-leap-500)] text-white',
    soft: 'bg-[var(--color-leap-500)]/10 text-[var(--color-leap-700)]',
    outline:
      'border-[var(--color-leap-500)] text-[var(--color-leap-700)]',
  },
  bookub: {
    solid:
      'bg-[var(--color-bookub-500)] text-white',
    soft: 'bg-[var(--color-bookub-500)]/10 text-[var(--color-bookub-700)]',
    outline:
      'border-[var(--color-bookub-500)] text-[var(--color-bookub-700)]',
  },
  payub: {
    solid:
      'bg-[var(--color-payub-500)] text-white',
    soft: 'bg-[var(--color-payub-500)]/10 text-[var(--color-payub-700)]',
    outline:
      'border-[var(--color-payub-500)] text-[var(--color-payub-700)]',
  },
  founderub: {
    solid:
      'bg-[var(--color-founderub-500)] text-white',
    soft: 'bg-[var(--color-founderub-500)]/10 text-[var(--color-founderub-700)]',
    outline:
      'border-[var(--color-founderub-500)] text-[var(--color-founderub-700)]',
  },
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  tone?: ToneValue;
  leadingIcon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, size, variant = 'solid', tone = 'neutral', leadingIcon, children, ...props }, ref) => {
    const resolvedVariant: 'solid' | 'soft' | 'outline' = variant ?? 'solid';
    const toneStyle = toneClasses[tone][resolvedVariant];

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ size, variant: resolvedVariant }), toneStyle, className)}
        {...props}
      >
        {leadingIcon && (
          <span className="shrink-0 inline-flex items-center">{leadingIcon}</span>
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
