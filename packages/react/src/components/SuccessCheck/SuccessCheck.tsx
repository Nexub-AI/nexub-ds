import * as React from 'react';
import { cn } from '../../utils/cn.js';

const sizes = {
  sm: 'size-8 [&>svg]:size-4',
  md: 'size-12 [&>svg]:size-6',
  lg: 'size-16 [&>svg]:size-8',
} as const;

export interface SuccessCheckProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Accessible name, e.g. "Payment sent". Without it the mark is decorative: say the result in text. */
  label?: string;
  /** @default 'md' */
  size?: keyof typeof sizes;
}

/**
 * A small success moment (10.3): a ring that pops in and a tick that draws.
 * Plays once when it mounts, so render it when the action succeeds. Still under
 * reduced motion. For a bigger win, pair it with `Celebrate`.
 */
export const SuccessCheck = React.forwardRef<HTMLSpanElement, SuccessCheckProps>(
  ({ className, label, size = 'md', ...props }, ref) => (
    <span
      ref={ref}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      className={cn(
        'nx-success-check inline-grid shrink-0 place-items-center rounded-full bg-[var(--color-success-container)] text-[var(--color-on-success-container)]',
        sizes[size],
        className,
      )}
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path className="nx-check-draw" pathLength={1} d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  ),
);
SuccessCheck.displayName = 'SuccessCheck';
