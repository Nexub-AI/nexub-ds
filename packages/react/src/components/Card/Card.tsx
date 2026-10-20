import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { glassSurfaceClass } from '../../utils/glass.js';
import type { ToneValue } from '../Button/Button.js';

export const cardVariants = cva(
  // In-flow content: tone + a soft alpha hairline, no shadow (shadows are for floating layers).
  'rounded-shape-container bg-[var(--color-surface-elevated)] border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] text-[var(--color-on-surface)]',
  {
    variants: {
      variant: {
        flat: '',
        surface: 'bg-[var(--color-surface-elevated)] shadow-elevation-1',
        interactive:
          'nx-state-layer cursor-pointer bg-[var(--color-surface-elevated)] shadow-elevation-1 transition-[box-shadow,transform] duration-spatial-fast ease-spatial-fast hover:-translate-y-0.5 hover:shadow-elevation-2',
      },
      // Material. 'glass' needs data-material="glass" on the element (set in the
      // component) for the --glass-* vars to resolve. Single box-shadow carries
      // both the inset specular highlight and the drop shadow so neither clobbers
      // the other. Listed after `variant` so tailwind-merge lets it win on bg/border.
      surface: {
        solid: '',
        glass: glassSurfaceClass,
      },
    },
    defaultVariants: {
      variant: 'flat',
      surface: 'solid',
    },
  },
);

const toneBorderMap: Record<ToneValue, string> = {
  neutral: '',
  info: 'border-l-4 border-l-[var(--color-semantic-info-default)]',
  success: 'border-l-4 border-l-[var(--color-semantic-success-default)]',
  warning: 'border-l-4 border-l-[var(--color-semantic-warning-default)]',
  danger: 'border-l-4 border-l-[var(--color-semantic-error-default)]',
  leap: 'border-l-4 border-l-[var(--color-leap-500)]',
  bookub: 'border-l-4 border-l-[var(--color-bookub-500)]',
  payub: 'border-l-4 border-l-[var(--color-payub-500)]',
  founderub: 'border-l-4 border-l-[var(--color-founderub-500)]',
};

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  tone?: ToneValue;
  surface?: 'solid' | 'glass';
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'flat', surface = 'solid', tone, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    const toneStyle = tone ? toneBorderMap[tone] : '';

    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant, surface }), toneStyle, className)}
        data-tone={tone}
        data-material={surface === 'glass' ? 'glass' : undefined}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Card.displayName = 'Card';
