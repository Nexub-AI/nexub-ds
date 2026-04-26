import * as React from 'react';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: ToneValue;
}

export const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ className, tone, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        data-tone={tone}
        className={cn(
          'text-sm text-[var(--color-text-muted)] leading-snug',
          className,
        )}
        {...props}
      >
        {children}
      </p>
    );
  },
);

HelperText.displayName = 'HelperText';
