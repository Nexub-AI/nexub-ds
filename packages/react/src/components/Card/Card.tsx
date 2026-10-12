import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { glassSurfaceClass } from '../../utils/glass.js';
import type { ToneValue } from '../Button/Button.js';

export const cardVariants = cva(
  'rounded-lg bg-[var(--color-bg-default)] border border-[var(--color-border-default)] text-[var(--color-text-primary)]',
  {
    variants: {
      variant: {
        flat: '',
        surface: 'shadow-[var(--shadow-card,0_1px_3px_0_rgb(0_0_0/0.1),0_1px_2px_-1px_rgb(0_0_0/0.1))]',
        interactive:
          'cursor-pointer shadow-[var(--shadow-sm)] transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)]',
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
