import * as React from 'react';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

const toneTextMap: Record<ToneValue, string> = {
  neutral: 'text-[var(--color-neutral-700)]',
  info: 'text-[var(--color-semantic-info-default)]',
  success: 'text-[var(--color-semantic-success-default)]',
  warning: 'text-[var(--color-semantic-warning-default)]',
  danger: 'text-[var(--color-semantic-error-default)]',
  leap: 'text-[var(--color-leap-700)]',
  bookub: 'text-[var(--color-bookub-700)]',
  payub: 'text-[var(--color-payub-700)]',
  founderub: 'text-[var(--color-founderub-700)]',
};

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
          'bg-[var(--color-gradient-eyebrow-chip,var(--color-bg-subtle))]',
          toneTextMap[tone],
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
