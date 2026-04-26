import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface TextGradientProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const TextGradient = React.forwardRef<HTMLSpanElement, TextGradientProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'bg-[var(--gradient-brand-horizontal)] bg-clip-text text-transparent',
          className,
        )}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

TextGradient.displayName = 'TextGradient';
