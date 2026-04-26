import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const cardVariants = cva(
  'rounded-lg bg-[var(--color-bg-default)] border border-[var(--color-border-default)] text-[var(--color-text-primary)]',
  {
    variants: {
      variant: {
        flat: '',
        surface: 'shadow-[var(--shadow-card,0_1px_3px_0_rgb(0_0_0/0.1),0_1px_2px_-1px_rgb(0_0_0/0.1))]',
        interactive:
          'cursor-pointer shadow-[var(--shadow-card,0_1px_3px_0_rgb(0_0_0/0.1))] transition-all duration-200 hover:shadow-[var(--shadow-card-hover,0_4px_12px_0_rgb(0_0_0/0.15))] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-bg-default)]',
      },
    },
    defaultVariants: {
      variant: 'flat',
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
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'flat', tone, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    const toneStyle = tone ? toneBorderMap[tone] : '';

    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant }), toneStyle, className)}
        data-tone={tone}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Card.displayName = 'Card';
