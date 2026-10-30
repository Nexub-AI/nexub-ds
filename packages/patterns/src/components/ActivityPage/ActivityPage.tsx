import * as React from 'react';
import { Amount, Avatar, Button, EmptyState, cn } from '@nexub/react';
import {
  PageFrame,
  StatusBadge,
  groupByDay,
  usePageMessages,
  useTemplateLocale,
  type PageFrameProps,
  type PageTemplateMessages,
  type Transaction,
} from '../PageFrame/PageFrame.js';

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
  m: PageTemplateMessages;
  locale: string;
}) {
  const body = (
    <>
      <Avatar name={t.title} src={t.image} />
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
    <li className="flex items-center border-t border-[var(--color-outline-variant)] first:border-t-0">
      {onSelect ? (
        <button type="button" onClick={() => onSelect(t)} className={cn(row, 'nx-state-layer min-h-[56px]')}>
          {body}
        </button>
      ) : (
        <div className={row}>{body}</div>
      )}
      {actions && <div className="shrink-0 pe-2">{actions}</div>}
    </li>
  );
}

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
    title,
    actions,
    messages,
    ...props
  },
  ref,
) {
  const m = usePageMessages(messages);
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
              <Button variant="outline" size="sm" onClick={onRefresh} loading={refreshing}>
                {m.refresh}
              </Button>
            )}
          </>
        )
      }
      {...props}
    >
      {toolbar}
      {sections.length === 0 ? (
        empty ?? (
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
            <Button variant="secondary" className="self-center" onClick={onLoadMore} loading={loadingMore}>
              {m.loadMore}
            </Button>
          )}
        </div>
      )}
    </PageFrame>
  );
});
