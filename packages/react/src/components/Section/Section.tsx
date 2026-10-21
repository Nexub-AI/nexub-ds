import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export const sectionVariants = cva('w-full', {
  variants: {
    paddingY: {
      sm: 'py-12',
      md: 'py-20',
      lg: 'py-32',
    },
    tone: {
      default: 'bg-[var(--color-surface)]',
      subtle: 'bg-[var(--color-surface-container-low)]',
      muted: 'bg-[var(--color-surface-container-high)]',
      inverse: 'bg-[var(--color-inverse-surface)] text-[var(--color-inverse-on-surface)]',
    },
  },
  defaultVariants: {
    paddingY: 'md',
    tone: 'default',
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  asChild?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ paddingY, tone, asChild = false, className, children, ...rest }, ref) => {
    const Comp = asChild ? (Slot as React.ElementType) : 'section';

    return (
      <Comp
        ref={ref}
        className={cn(sectionVariants({ paddingY, tone }), className)}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

Section.displayName = 'Section';
