import * as React from 'react';
import type { ToneValue } from '@nexub/react/Button';
import { cn } from '@nexub/react/cn';
import { Container } from '@nexub/react/Container';
import { NumberTicker } from '@nexub/react/NumberTicker';

export interface StatBandProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Optional heading above the stats (h2). */
  title?: React.ReactNode;
}

/** A band of headline numbers. Put StatBandItems inside. Server component. */
export const StatBand = React.forwardRef<HTMLElement, StatBandProps>(({ title, className, children, ...props }, ref) => (
  <section ref={ref} className={cn('py-16', className)} {...props}>
    <Container size="marketing" className="flex flex-col gap-10">
      {title && <h2 className="m-0 text-center font-display text-headline-lg text-[var(--color-on-surface)]">{title}</h2>}
      <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">{children}</dl>
    </Container>
  </section>
));
StatBand.displayName = 'StatBand';

// Accent roles: AA as large text on the page surfaces, light and dark.
const toneClass: Record<ToneValue, string> = {
  neutral: 'text-[var(--color-on-surface)]',
  info: 'text-[var(--color-primary)]',
  success: 'text-[var(--color-success)]',
  warning: 'text-[var(--color-warning)]',
  danger: 'text-[var(--color-error)]',
  leap: 'text-[var(--color-leap)]',
  bookub: 'text-[var(--color-bookub)]',
  payub: 'text-[var(--color-payub)]',
  founderub: 'text-[var(--color-founderub)]',
  matchub: 'text-[var(--color-matchub)]',
};

export interface StatBandItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
  /** A number counts up when it scrolls into view; a string shows as is. */
  value: number | string;
  label: React.ReactNode;
  format?: Intl.NumberFormatOptions;
  /** Shown before / after the number, e.g. "$" or "+". */
  prefix?: string;
  suffix?: string;
  tone?: ToneValue;
}

/** One stat: the number (dd) after its label (dt), shown number first. Named apart from @nexub/patterns' StatCard. */
export const StatBandItem = React.forwardRef<HTMLDivElement, StatBandItemProps>(
  ({ value, label, format, prefix, suffix, tone = 'info', className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col-reverse items-center gap-2 text-center', className)} {...props}>
      <dt className="text-body-md text-[var(--color-on-surface-variant)]">{label}</dt>
      <dd className={cn('m-0 font-display text-display-sm', toneClass[tone])}>
        {prefix}
        {typeof value === 'number' ? <NumberTicker value={value} format={format} countOnView /> : value}
        {suffix}
      </dd>
    </div>
  ),
);
StatBandItem.displayName = 'StatBandItem';
