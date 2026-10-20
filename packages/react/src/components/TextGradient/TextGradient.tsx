import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface TextGradientProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const TextGradient = React.forwardRef<HTMLSpanElement, TextGradientProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Keep the `image:` hint: without it the arbitrary value compiles to
          // background-color, which drops the gradient and hides the text.
          'bg-[image:var(--gradient-brand-horizontal)] bg-clip-text text-transparent',
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
