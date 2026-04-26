import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-[var(--container-sm,640px)]',
      md: 'max-w-[var(--container-md,768px)]',
      lg: 'max-w-[var(--container-lg,1024px)]',
      xl: 'max-w-[var(--container-xl,1280px)]',
      '2xl': 'max-w-[var(--container-2xl,1536px)]',
      nexub: 'max-w-[var(--container-nexub,1440px)]',
      prose: 'max-w-[var(--container-prose,65ch)]',
    },
    paddingX: {
      true: 'px-4 sm:px-6 lg:px-8',
      false: '',
    },
  },
  defaultVariants: {
    size: 'xl',
    paddingX: true,
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size, paddingX = true, asChild = false, className, children, ...rest }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp
        ref={ref}
        className={cn(containerVariants({ size, paddingX }), className)}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

Container.displayName = 'Container';
