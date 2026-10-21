import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 rounded-shape-control whitespace-nowrap select-none',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 px-2 text-label-sm',
        md: 'h-6 px-2.5 text-label-md',
        lg: 'h-7 px-3 text-label-lg',
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

// Role pairs: solid = role / on-role, soft = container / on-container,
// outline = role-coloured text and a half-strength role border. All pairs
// are WCAG AA by construction (see @nexub/tokens generate.test.mjs).
const toneClasses: Record<
  ToneValue,
  { solid: string; soft: string; outline: string }
> = {
  neutral: {
    solid: 'bg-[var(--color-inverse-surface)] text-[var(--color-inverse-on-surface)]',
    soft: 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]',
    outline: 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]',
  },
  info: {
    solid: 'bg-[var(--color-info)] text-[var(--color-on-info)]',
    soft: 'bg-[var(--color-info-container)] text-[var(--color-on-info-container)]',
    outline: 'border-[color-mix(in_srgb,var(--color-info)_50%,transparent)] text-[var(--color-info)]',
  },
  success: {
    solid: 'bg-[var(--color-success)] text-[var(--color-on-success)]',
    soft: 'bg-[var(--color-success-container)] text-[var(--color-on-success-container)]',
    outline: 'border-[color-mix(in_srgb,var(--color-success)_50%,transparent)] text-[var(--color-success)]',
  },
  warning: {
    solid: 'bg-[var(--color-warning)] text-[var(--color-on-warning)]',
    soft: 'bg-[var(--color-warning-container)] text-[var(--color-on-warning-container)]',
    outline: 'border-[color-mix(in_srgb,var(--color-warning)_50%,transparent)] text-[var(--color-warning)]',
  },
  danger: {
    solid: 'bg-[var(--color-error)] text-[var(--color-on-error)]',
    soft: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
    outline: 'border-[color-mix(in_srgb,var(--color-error)_50%,transparent)] text-[var(--color-error)]',
  },
  leap: {
    solid: 'bg-[var(--color-leap)] text-[var(--color-on-leap)]',
    soft: 'bg-[var(--color-leap-container)] text-[var(--color-on-leap-container)]',
    outline: 'border-[color:light-dark(var(--color-palette-leap-80),var(--color-palette-leap-40))] text-[var(--color-leap)]',
  },
  bookub: {
    solid: 'bg-[var(--color-bookub)] text-[var(--color-on-bookub)]',
    soft: 'bg-[var(--color-bookub-container)] text-[var(--color-on-bookub-container)]',
    outline: 'border-[color:light-dark(var(--color-palette-bookub-80),var(--color-palette-bookub-40))] text-[var(--color-bookub)]',
  },
  payub: {
    solid: 'bg-[var(--color-payub)] text-[var(--color-on-payub)]',
    soft: 'bg-[var(--color-payub-container)] text-[var(--color-on-payub-container)]',
    outline: 'border-[color:light-dark(var(--color-palette-payub-80),var(--color-palette-payub-40))] text-[var(--color-payub)]',
  },
  founderub: {
    solid: 'bg-[var(--color-founderub)] text-[var(--color-on-founderub)]',
    soft: 'bg-[var(--color-founderub-container)] text-[var(--color-on-founderub-container)]',
    outline: 'border-[color:light-dark(var(--color-palette-founderub-80),var(--color-palette-founderub-40))] text-[var(--color-founderub)]',
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
