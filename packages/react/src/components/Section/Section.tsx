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
      default: 'bg-[var(--color-bg-default)]',
      subtle: 'bg-[var(--color-bg-subtle)]',
      muted: 'bg-[var(--color-bg-muted)]',
      inverse: 'bg-[var(--color-bg-inverse)] text-[var(--color-text-inverse)]',
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
