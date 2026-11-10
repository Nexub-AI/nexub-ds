import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 rounded-[var(--badge-radius,var(--shape-control))] whitespace-nowrap select-none',
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

// The tone's role colour, for the status dot (neutral reads as outline, as on native).
const dotClasses: Record<ToneValue, string> = {
  neutral: 'bg-[var(--color-outline)]',
  info: 'bg-[var(--color-info)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-error)]',
  leap: 'bg-[var(--color-leap)]',
  bookub: 'bg-[var(--color-bookub)]',
  payub: 'bg-[var(--color-payub)]',
  founderub: 'bg-[var(--color-founderub)]',
};
const dotSizes = { sm: 'size-1.5', md: 'size-2', lg: 'size-2.5' } as const;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  tone?: ToneValue;
  leadingIcon?: React.ReactNode;
  /**
   * A status dot. Before the label when there is one; on its own (no children
   * or count) it is just the dot: give it an `aria-label`, or it's decorative.
   */
  dot?: boolean;
  /** A number to show. Above `max` it reads "99+"; screen readers get the full number. */
  count?: number;
  /** @default 99 */
  max?: number;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, size, variant = 'solid', tone = 'neutral', leadingIcon, dot, count, max = 99, children, ...props }, ref) => {
    const resolvedVariant: 'solid' | 'soft' | 'outline' = variant ?? 'solid';
    const toneStyle = toneClasses[tone][resolvedVariant];
    const dotSize = dotSizes[size ?? 'md'];

    if (dot && children == null && count == null) {
      const labelled = props['aria-label'] != null || props['aria-labelledby'] != null;
      return (
        <span
          ref={ref}
          role={labelled ? 'img' : undefined}
          aria-hidden={labelled ? undefined : true}
          className={cn('inline-block shrink-0 rounded-full', dotSize, dotClasses[tone], className)}
          {...props}
        />
      );
    }

    const capped = count != null && count > max;

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ size, variant: resolvedVariant }), toneStyle, className)}
        {...props}
      >
        {dot && (
          <span
            aria-hidden="true"
            className={cn('shrink-0 rounded-full', dotSize, resolvedVariant === 'solid' ? 'bg-current' : dotClasses[tone])}
          />
        )}
        {leadingIcon && (
          <span className="shrink-0 inline-flex items-center">{leadingIcon}</span>
        )}
        {children}
        {count != null && (
          <span className="tabular-nums">
            {/* Keyed on the count so the CSS tick replays on each change (server-safe, no state). */}
            <span key={count} aria-hidden={capped || undefined} className="nx-tick">
              {capped ? `${max}+` : count}
            </span>
            {capped && <span className="sr-only">{count}</span>}
          </span>
        )}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
