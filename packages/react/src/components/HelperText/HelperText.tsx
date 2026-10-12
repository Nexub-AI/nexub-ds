import * as React from 'react';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: ToneValue;
}

export const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ className, tone, style, children, ...props }, ref) => {
    // Inline var() so Tailwind JIT never sees `${tone}`; only semantic tones
    // resolve a --color-text-* var, brand tones fall back to the muted class.
    const toneStyle: React.CSSProperties = tone ? { color: `var(--color-text-${tone})` } : {};
    return (
      <p
        ref={ref}
        data-tone={tone}
        style={{ ...toneStyle, ...style }}
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
