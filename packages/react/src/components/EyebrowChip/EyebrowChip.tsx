import * as React from 'react';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';
import { toneTextClasses } from '../../utils/control.js';

export interface EyebrowChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: ToneValue;
  /** `gradient`: the marketing-mode chip (@nexub/themes/marketing). Elsewhere it looks like `soft`. */
  variant?: 'soft' | 'gradient';
  /** A pinging "live" dot before the label (it pings only in marketing mode). Decorative. */
  live?: boolean;
  leadingIcon?: React.ReactNode;
}

export const EyebrowChip = React.forwardRef<HTMLSpanElement, EyebrowChipProps>(
  ({ className, tone = 'neutral', variant = 'soft', live = false, leadingIcon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1',
          'text-xs font-semibold uppercase tracking-wider select-none',
          'bg-[var(--color-surface-container-low)]',
          toneTextClasses[tone],
          variant === 'gradient' && 'nx-mkt-eyebrow',
          className,
        )}
        {...props}
      >
        {live && <span className="nx-mkt-live-dot shrink-0" aria-hidden="true" />}
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
