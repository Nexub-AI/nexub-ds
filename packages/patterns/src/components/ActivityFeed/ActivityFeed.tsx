import * as React from 'react';
import { Skeleton, Tooltip, cn, useLocale, useNexubMessages } from '@nexub/react';

export type ActivityTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface ActivityItemProps {
  avatar?: React.ReactNode;
  /** Block content is fine: rendered in a `div` (11.5; was a `p`). */
  title: React.ReactNode;
  description?: React.ReactNode;
  /**
   * Text as given, or (11.5) a `Date`: rendered in `<time dateTime>` as relative
   * text ("5 minutes ago", a short date after a week) with the full date in a tooltip.
   */
  timestamp?: React.ReactNode | Date;
  /** 11.5: trailing actions, e.g. an IconButton or a menu trigger. */
  actions?: React.ReactNode;
  /** 11.5: a coloured marker: a dot in place of the avatar, or a badge on it. */
  tone?: ActivityTone;
  className?: string;
}

export interface ActivityFeedRootProps extends React.HTMLAttributes<HTMLUListElement> {
  /** 10.5: shows skeleton rows in place of the items and sets aria-busy. */
  loading?: boolean;
  /** Skeleton rows while `loading`. @default 3 */
  loadingRows?: number;
  /** Shown when there are no items. */
  emptyState?: React.ReactNode;
  /** Shown in place of the items; wins over `loading` and `emptyState`. */
  errorState?: React.ReactNode;
}

const Root = React.forwardRef<HTMLUListElement, ActivityFeedRootProps>(
  ({ className, children, loading, loadingRows = 3, emptyState, errorState, ...props }, ref) => {
    const t = useNexubMessages();
    const failed = errorState != null;
    return (
      <ul
        ref={ref}
        aria-label={t.activityFeed}
        aria-busy={(loading && !failed) || undefined}
        className={cn('flex flex-col divide-y divide-[var(--color-outline-variant)]', className)}
        {...props}
      >
        {failed ? (
          <li>{errorState}</li>
        ) : loading ? (
          Array.from({ length: loadingRows }, (_, i) => (
            <li key={i} aria-hidden="true" className="flex items-start gap-3 py-3">
              <Skeleton shape="circle" className="size-8" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Skeleton className="my-0.5 h-4 w-2/5" />
                <Skeleton className="my-0.5 h-4 w-3/5" />
              </div>
            </li>
          ))
        ) : emptyState != null && React.Children.count(children) === 0 ? (
          <li>{emptyState}</li>
        ) : (
          children
        )}
      </ul>
    );
  },
);
Root.displayName = 'ActivityFeed.Root';

const toneDot: Record<ActivityTone, string> = {
  neutral: 'bg-[var(--color-outline)]',
  info: 'bg-[var(--color-info)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-error)]',
};

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['second', 60],
  ['minute', 60],
  ['hour', 24],
  ['day', 7],
];

/** "5 minutes ago" / "yesterday" within a week, then a short date. */
function relativeText(date: Date, locale: string, now = Date.now()): string {
  let diff = (date.getTime() - now) / 1000;
  for (const [unit, size] of UNITS) {
    if (Math.abs(diff) < size) {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(Math.trunc(diff), unit);
    }
    diff /= size;
  }
  const sameYear = date.getFullYear() === new Date(now).getFullYear();
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: sameYear ? undefined : 'numeric' }).format(date);
}

const timeClass = 'shrink-0 text-label-sm font-normal text-[var(--color-on-surface-muted)]';

function Timestamp({ date }: { date: Date }) {
  const { locale } = useLocale();
  return (
    <Tooltip label={new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short' }).format(date)}>
      {/* Focusable so keyboard users can reach the full date too. Relative text differs server vs client. */}
      <time dateTime={date.toISOString()} tabIndex={0} suppressHydrationWarning className={cn(timeClass, 'rounded-shape-control')}>
        {relativeText(date, locale)}
      </time>
    </Tooltip>
  );
}

const Item = ({ avatar, title, description, timestamp, actions, tone, className }: ActivityItemProps) => {
  const dot = tone && <span aria-hidden="true" className={cn('block size-2 rounded-full', toneDot[tone])} />;
  return (
    <li data-tone={tone} className={cn('flex items-start gap-3 py-3', className)}>
      {avatar ? (
        <div className="shrink-0 mt-0.5 relative">
          {avatar}
          {dot && (
            <span className="absolute -bottom-0.5 -end-0.5 rounded-full bg-[var(--color-surface)] p-0.5">{dot}</span>
          )}
        </div>
      ) : (
        dot && <div className="shrink-0 mt-1.5">{dot}</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-body-sm font-medium text-[var(--color-on-surface)]">{title}</div>
        {description && (
          <div className="text-body-sm text-[var(--color-on-surface-muted)] mt-0.5">{description}</div>
        )}
      </div>
      {timestamp instanceof Date ? (
        <Timestamp date={timestamp} />
      ) : (
        timestamp && <time className={timeClass}>{timestamp}</time>
      )}
      {actions && <div className="shrink-0 -my-1 flex items-center gap-1">{actions}</div>}
    </li>
  );
};
Item.displayName = 'ActivityFeed.Item';

export interface ActivityGroupProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
  /** The header, e.g. "Today" or "Yesterday"; it names the group's list. */
  label: React.ReactNode;
  /** Render the header as a heading (h2–h6) for heading navigation. Default: a plain `div`. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** 11.5: a headed run of items inside `ActivityFeed.Root`. */
const Group = ({ label, headingLevel, className, children, ...props }: ActivityGroupProps) => {
  const id = React.useId();
  const Heading = headingLevel ? (`h${headingLevel}` as const) : 'div';
  return (
    <li className={cn('pt-3', className)} {...props}>
      <Heading id={id} className="text-label-md font-medium text-[var(--color-on-surface-variant)]">
        {label}
      </Heading>
      <ul aria-labelledby={id} className="flex flex-col divide-y divide-[var(--color-outline-variant)]">
        {children}
      </ul>
    </li>
  );
};
Group.displayName = 'ActivityFeed.Group';

export const ActivityFeed = { Root, Item, Group };
