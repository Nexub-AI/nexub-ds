import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { toneTextClasses, type ToneValue } from '../Button/Button.js';

export interface EyebrowChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: ToneValue;
  leadingIcon?: React.ReactNode;
}

export const EyebrowChip = React.forwardRef<HTMLSpanElement, EyebrowChipProps>(
  ({ className, tone = 'neutral', leadingIcon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1',
          'text-xs font-semibold uppercase tracking-wider select-none',
          'bg-[var(--color-surface-container-low)]',
          toneTextClasses[tone],
          className,
        )}
        {...props}
      >
        {leadingIcon && (
          <span className="shrink-0 inline-flex items-center" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        {children}
      </span>
    );
  },
);

EyebrowChip.displayName = 'EyebrowChip';
