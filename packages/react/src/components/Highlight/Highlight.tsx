import * as React from 'react';
import { cn } from '../../utils/cn.js';

export type HighlightTone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'error';

// Container + on-container pairs: AA by construction in both themes and every contrast level
// (checked in visual/contrast.spec.ts and Highlight.test.tsx).
const tones: Record<HighlightTone, string> = {
  neutral: 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)]',
  primary: 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]',
  success: 'bg-[var(--color-success-container)] text-[var(--color-on-success-container)]',
  warning: 'bg-[var(--color-warning-container)] text-[var(--color-on-warning-container)]',
  error: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
  info: 'bg-[var(--color-info-container)] text-[var(--color-on-info-container)]',
};

export interface HighlightProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'neutral' */
  tone?: HighlightTone;
}

/**
 * 12.2: an amount, date or status picked out inside running text, e.g. in a MessageBubble.
 * A plain span, not `<mark>`: screen readers announce `<mark>` as a search highlight, and
 * this is emphasis the text already carries. Say any meaning the colour adds in the words.
 */
export const Highlight = React.forwardRef<HTMLSpanElement, HighlightProps>(
  ({ tone = 'neutral', className, ...props }, ref) => (
    <span
      ref={ref}
      data-tone={tone}
      className={cn(
        'rounded-shape-min px-1 py-px font-medium tabular-nums [box-decoration-break:clone]',
        tones[tone],
        className,
      )}
      {...props}
    />
  ),
);
Highlight.displayName = 'Highlight';
