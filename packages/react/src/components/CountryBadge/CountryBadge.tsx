import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Flag } from '../Flag/Flag.js';

export interface CountryBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  code: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClass: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-base gap-2',
};

export const CountryBadge = React.forwardRef<HTMLSpanElement, CountryBadgeProps>(
  ({ code, label, size = 'md', className, ...rest }, ref) => {
    const displayLabel = label ?? code;

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)]',
          'border border-[var(--color-outline-variant)]',
          sizeClass[size],
          className,
        )}
        {...rest}
      >
        <Flag code={code} size={size} />
        <span>{displayLabel}</span>
      </span>
    );
  },
);

CountryBadge.displayName = 'CountryBadge';
