import * as React from 'react';
import { cn, useLocale, useNexubMessages } from '@nexub/react';

export interface DateSeparatorMessages {
  /** Label for a date that falls on the current day. */
  today: string;
  /** Label for a date that falls on the day before. */
  yesterday: string;
}

const fallback: DateSeparatorMessages = { today: 'Today', yesterday: 'Yesterday' };

export interface DateSeparatorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The day this separator starts. A date-only string ("2026-11-25") is read as a local day. */
  date?: Date | string | number;
  /** Replaces the computed label. */
  children?: React.ReactNode;
  /** "Now" for the Today / Yesterday check. Defaults to the current time; pass one in tests. */
  now?: Date | string | number;
  /** BCP 47 locale for the date. Defaults to the NexubProvider's locale. */
  locale?: string;
  messages?: Partial<DateSeparatorMessages>;
}

const DAY = 86_400_000;

function toDate(value: Date | string | number): Date {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number) as [number, number, number];
    return new Date(y, m - 1, d);
  }
  return value instanceof Date ? value : new Date(value);
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function isoDay(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * 12.2: a day label between messages: "Today", "Yesterday", or a medium date ("25 Nov 2026"
 * in en-GB) in the provider's locale, centred between two hairlines.
 *
 * It is plain text, not `role="separator"`: a separator's children are presentational and
 * screen readers announce a non-focusable one as just "separator" (or skip it), so the date
 * would be lost. As text it is read in order with the messages ("Yesterday", then the
 * messages of that day). The hairlines are hidden from assistive tech.
 */
export const DateSeparator = React.forwardRef<HTMLDivElement, DateSeparatorProps>(
  ({ date, children, now, locale: localeProp, messages, className, ...props }, ref) => {
    const provided = useNexubMessages() as unknown as Partial<DateSeparatorMessages>;
    const { locale: ctxLocale } = useLocale();
    const locale = localeProp ?? ctxLocale;

    let label: React.ReactNode = children;
    let dateTime: string | undefined;
    if (date !== undefined) {
      const d = toDate(date);
      if (!Number.isNaN(d.getTime())) {
        dateTime = isoDay(d);
        if (label === undefined) {
          const days = Math.round((startOfDay(toDate(now ?? Date.now())) - startOfDay(d)) / DAY);
          if (days === 0) label = messages?.today ?? provided.today ?? fallback.today;
          else if (days === 1) label = messages?.yesterday ?? provided.yesterday ?? fallback.yesterday;
          else label = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
        }
      } else if (label === undefined) {
        label = String(date);
      }
    }

    return (
      <div ref={ref} className={cn('flex items-center gap-3', className)} {...props}>
        <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-outline-variant)]" />
        {React.createElement(
          dateTime ? 'time' : 'span',
          { dateTime, suppressHydrationWarning: true, className: 'shrink-0 text-label-sm text-[var(--color-on-surface-variant)]' },
          label,
        )}
        <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-outline-variant)]" />
      </div>
    );
  },
);
DateSeparator.displayName = 'DateSeparator';
