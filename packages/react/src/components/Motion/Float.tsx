import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn.js';

export interface FloatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `slow` drifts on a longer, reversed loop, so two floating cards don't move in step. */
  speed?: 'normal' | 'slow';
  asChild?: boolean;
}

/** Gently bobs its content, in marketing mode (@nexub/themes/marketing). Still under reduced motion. */
export const Float = React.forwardRef<HTMLDivElement, FloatProps>(
  ({ speed = 'normal', asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return <Comp ref={ref} data-speed={speed} className={cn('nx-mkt-float', className)} {...props} />;
  },
);
Float.displayName = 'Float';
