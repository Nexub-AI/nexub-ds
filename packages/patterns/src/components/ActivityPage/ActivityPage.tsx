import * as React from 'react';
import { Amount, Avatar, Button, EmptyState, Skeleton, cn } from '@nexub/react';
import {
  PageFrame,
  StatusBadge,
  groupByDay,
  usePageStrings,
  useTemplateLocale,
  type PageFrameProps,
  type PageStrings,
  type PageTemplateMessages,
  type Transaction,
} from '../PageFrame/PageFrame.js';
import { sharedMessages } from '../PageFrame/messages/shared.js';
import { activityMessages } from '../PageFrame/messages/activity.js';

/** The defaults this template shows (11.7: not every template's strings). */
const STRINGS = { ...sharedMessages, ...activityMessages };

export interface ActivityPageProps extends Omit<PageFrameProps, 'title' | 'children' | 'onSelect'> {
  transactions: Transaction[];
  /** Open one transaction. Rows become buttons when set. */
  onSelect?: (t: Transaction) => void;
  /** Shows a "Refresh" button (the web stand-in for pull-to-refresh). */
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Shows "Load more" under the list while `hasMore`. */
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  /** Per-row actions (the web stand-in for swipe actions), e.g. a menu button. */
  rowActions?: (t: Transaction) => React.ReactNode;
  /** Between the header and the list: filters, search. */
  toolbar?: React.ReactNode;
  empty?: React.ReactNode;
  /** 10.5: shows skeleton rows in place of the list (the first load) and sets aria-busy. */
  loading?: boolean;
  /** Shown when there are no transactions. Same as `empty`, under the name the other patterns use. */
  emptyState?: React.ReactNode;
  /** Shown in place of the list; wins over `loading` and the empty state. */
  errorState?: React.ReactNode;
  /** @default messages.activity */
  title?: React.ReactNode;
  messages?: Partial<PageTemplateMessages>;
}

/** One transaction row: avatar, title, amount coloured by direction, status. */
export function TransactionRow({
  t,
  onSelect,
  actions,
  m,
  locale,
}: {
  t: Transaction;
  onSelect?: (t: Transaction) => void;
  actions?: React.ReactNode;
  m: PageStrings<'pending' | 'failed'>;
  locale: string;
}) {
  const body = (
    <>
      <Avatar name={t.title} src={t.image} category="auto" />
      <span className="flex min-w-0 flex-1 flex-col text-start">
        <span className="truncate text-body-md font-medium text-[var(--color-on-surface)]">{t.title}</span>
        {t.subtitle && <span className="truncate text-body-sm text-[var(--color-on-surface-muted)]">{t.subtitle}</span>}
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <Amount value={t.amount} currency={t.currency} locale={locale} tone="auto" signDisplay="exceptZero" />
        <StatusBadge status={t.status} m={m} />
      </span>
    </>
  );
  const row = 'flex w-full items-center gap-3 px-4 py-3';
  return (
    <li data-nx="row" className="flex items-center border-t border-[var(--color-outline-variant)] first:border-t-0">
      {onSelect ? (
        <button type="button" onClick={() => onSelect(t)} className={cn(row, 'nx-state-layer min-h-14')}>
          {body}
        </button>
      ) : (
        <div className={row}>{body}</div>
      )}
      {actions && <div className="shrink-0 pe-2">{actions}</div>}
    </li>
  );
}

/** The shape of a TransactionRow while its data loads (same paddings and line heights). */
export function TransactionRowSkeleton() {
  return (
    <li aria-hidden="true" className="flex items-center gap-3 border-t border-[var(--color-outline-variant)] px-4 py-3 first:border-t-0">
      <Skeleton shape="circle" className="shrink-0" />
      <span className="flex min-w-0 flex-1 flex-col">
        <Skeleton className="my-1 h-4 w-2/5" />
        <Skeleton className="my-0.5 h-4 w-1/4" />
      </span>
      <Skeleton className="h-4 w-16 shrink-0" />
    </li>
  );
}

const listBox = 'overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)]';

/**
 * Transactions grouped by day, newest first. Web twin of the native
 * `ActivityList`: pull-to-refresh becomes a Refresh button, paging a
 * "Load more" button and swipe actions `rowActions`.
 */
export const ActivityPage = React.forwardRef<HTMLElement, ActivityPageProps>(function ActivityPage(
  {
    transactions,
    onSelect,
    onRefresh,
    refreshing,
    onLoadMore,
    hasMore,
    loadingMore,
    rowActions,
    toolbar,
    empty,
    loading,
    emptyState,
    errorState,
    title,
    actions,
    messages,
    ...props
  },
  ref,
) {
  const m = usePageStrings(messages, STRINGS);
  const locale = useTemplateLocale();
  const sections = React.useMemo(() => groupByDay(transactions, locale), [transactions, locale]);

  return (
    <PageFrame
      ref={ref}
      title={title ?? m.activity}
      actions={
        (actions || onRefresh) && (
          <>
            {actions}
            {onRefresh && (
              <Button variant="outlined" size="sm" onClick={onRefresh} loading={refreshing}>
                {m.refresh}
              </Button>
            )}
          </>
        )
      }
      {...props}
    >
      {toolbar}
      {errorState != null ? (
        errorState
      ) : loading ? (
        <div className="flex flex-col gap-2" aria-busy="true">
          <Skeleton aria-hidden="true" className="mx-1 my-0.5 h-4 w-28" />
          <ul className={listBox}>
            {[0, 1, 2, 3, 4].map((i) => (
              <TransactionRowSkeleton key={i} />
            ))}
          </ul>
        </div>
      ) : sections.length === 0 ? (
        emptyState ?? empty ?? (
          <EmptyState.Root>
            <EmptyState.Title>{m.noActivityTitle}</EmptyState.Title>
            <EmptyState.Description>{m.noActivityDescription}</EmptyState.Description>
          </EmptyState.Root>
        )
      ) : (
        <div className="flex flex-col gap-6" aria-busy={refreshing || undefined}>
          {sections.map((s) => (
            <section key={s.title} aria-label={s.title} className="flex flex-col gap-2">
              <h2 className="px-1 text-title-sm text-[var(--color-on-surface-variant)]">{s.title}</h2>
              <ul className="overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)]">
                {s.data.map((t) => (
                  <TransactionRow key={t.id} t={t} onSelect={onSelect} actions={rowActions?.(t)} m={m} locale={locale} />
                ))}
              </ul>
            </section>
          ))}
          {onLoadMore && hasMore && (
            <Button variant="tonal" className="self-center" onClick={onLoadMore} loading={loadingMore}>
              {m.loadMore}
            </Button>
          )}
        </div>
      )}
    </PageFrame>
  );
});
