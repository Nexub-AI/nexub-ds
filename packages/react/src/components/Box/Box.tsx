import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn.js';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ asChild = false, className, children, ...rest }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp ref={ref} className={cn(className)} {...rest}>
        {children}
      </Comp>
    );
  },
);

Box.displayName = 'Box';
