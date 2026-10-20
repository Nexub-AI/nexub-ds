import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { moneyFormatter } from '../../utils/money.js';
import { NumberTicker } from '../NumberTicker/NumberTicker.js';

export interface AmountProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  value: number;
  /** ISO 4217 code, e.g. 'USD', 'EUR', 'INR'. */
  currency: string;
  /** BCP 47 locale. Defaults to the user's. */
  locale?: string;
  /** `display`: a hero figure in the brand face with a quieter symbol and minor units. */
  size?: 'sm' | 'md' | 'lg' | 'display';
  /** `auto` colours gains success and losses error (use with signDisplay). */
  tone?: 'neutral' | 'auto';
  /** e.g. 'exceptZero' to show "+" on gains. */
  signDisplay?: Intl.NumberFormatOptions['signDisplay'];
  /** Roll digits to new values (NumberTicker). The first render never animates. */
  animate?: boolean;
}

const sizes = {
  sm: 'text-body-sm',
  md: 'text-body-md',
  lg: 'text-title-lg',
  display: 'font-display text-display-sm',
};

const mutedClass = 'text-[0.55em] font-semibold text-[var(--color-on-surface-variant)]';
const muted = (type: Intl.NumberFormatPartTypes) => type === 'currency' || type === 'decimal' || type === 'fraction';

/**
 * A money figure, honest by default (Calm Depth §3.5): tabular numerals, the
 * currency's own minor unit, a true minus sign. Formatting is Intl.NumberFormat.
 */
export const Amount = React.forwardRef<HTMLSpanElement, AmountProps>(
  ({ value, currency, locale, size = 'md', tone = 'neutral', signDisplay, animate = false, className, ...props }, ref) => {
    const parts = moneyFormatter(currency, locale, { signDisplay }).formatToParts(value);
    const quiet = size === 'display';
    return (
      <span
        ref={ref}
        data-value={value}
        className={cn(
          'whitespace-nowrap tabular-nums',
          sizes[size],
          tone === 'auto' && value > 0 && 'text-[var(--color-success)]',
          tone === 'auto' && value < 0 && 'text-[var(--color-error)]',
          className,
        )}
        {...props}
      >
        {animate ? (
          <NumberTicker
            value={parts.map((p) => ({
              value: p.type === 'minusSign' ? '−' : p.value,
              className: quiet && muted(p.type) ? mutedClass : undefined,
            }))}
          />
        ) : (
          parts.map((p, i) => {
            // U+2212 MINUS SIGN: the typographic minus, the width of "+".
            const text = p.type === 'minusSign' ? '−' : p.value;
            return quiet && muted(p.type) ? (
              <span key={i} className={mutedClass}>
                {text}
              </span>
            ) : (
              <React.Fragment key={i}>{text}</React.Fragment>
            );
          })
        )}
      </span>
    );
  },
);
Amount.displayName = 'Amount';
