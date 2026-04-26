import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface FlagProps extends React.HTMLAttributes<HTMLSpanElement> {
  code: string;
  size?: 'sm' | 'md' | 'lg';
}

function countryCodeToEmoji(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(c.charCodeAt(0) - 65 + 0x1f1e6))
    .join('');
}

const sizeClass: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
};

export const Flag = React.forwardRef<HTMLSpanElement, FlagProps>(
  ({ code, size = 'md', className, ...rest }, ref) => {
    const emoji = countryCodeToEmoji(code);

    return (
      <span
        ref={ref}
        role="img"
        aria-label={code}
        className={cn('inline-block leading-none', sizeClass[size], className)}
        {...rest}
      >
        {emoji}
      </span>
    );
  },
);

Flag.displayName = 'Flag';
