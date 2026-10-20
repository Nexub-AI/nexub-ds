import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { toneTextClasses, type ToneValue } from '../Button/Button.js';

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: ToneValue;
}

export const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ className, tone, style, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        data-tone={tone}
        style={style}
        className={cn(
          'text-sm text-[var(--color-on-surface-muted)] leading-snug',
          tone && toneTextClasses[tone],
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
