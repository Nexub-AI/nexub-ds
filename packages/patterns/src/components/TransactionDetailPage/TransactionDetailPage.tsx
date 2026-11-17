import * as React from 'react';
import { Amount, Avatar, Badge, Button, EmptyStatePreset, Skeleton } from '@nexub/react';
import { ArrowLeft } from '@nexub/icons';
import { InfoList } from '../InfoList/index.js';
import {
  PageFrame,
  usePageMessages,
  useTemplateLocale,
  type PageFrameProps,
  type PageTemplateMessages,
  type ReviewRow,
  type Transaction,
} from '../PageFrame/PageFrame.js';

export interface TransactionDetailPageProps extends Omit<PageFrameProps, 'title' | 'children'> {
  /** Optional since 10.5: leave it out while `loading`, or when there is nothing to show. */
  transaction?: Transaction;
  /** 10.5: shows skeletons in place of the hero and the rows, and sets aria-busy on the page. */
  loading?: boolean;
  /** Shown when there is no `transaction`. @default the "Nothing here yet" preset */
  emptyState?: React.ReactNode;
  /** Shown in place of the content; wins over `loading` and `emptyState`. */
  errorState?: React.ReactNode;
  /** Extra rows: reference, account, category… */
  rows?: ReviewRow[];
  /** Under the details: "Download receipt", "Report a problem". */
  footer?: React.ReactNode;
  /** Shows a back button above the hero. */
  onBack?: () => void;
  messages?: Partial<PageTemplateMessages>;
}

/** One transaction: hero amount, status and summary rows. Web twin of the native `TransactionDetail`. */
export const TransactionDetailPage = React.forwardRef<HTMLElement, TransactionDetailPageProps>(
  function TransactionDetailPage({ transaction: t, rows = [], footer, onBack, loading, emptyState, errorState, messages, ...props }, ref) {
    const m = usePageMessages(messages);
    const locale = useTemplateLocale();
    const headingId = React.useId();
    const back = onBack && (
      <Button variant="text" size="sm" className="self-start" onClick={onBack} leadingIcon={<ArrowLeft size="sm" className="rtl:-scale-x-100" aria-hidden="true" />}>
        {m.back}
      </Button>
    );
    if (errorState != null || loading || !t)
      return (
        <PageFrame ref={ref} width="sm" aria-busy={(loading && errorState == null) || undefined} {...props}>
          {back}
          {errorState ??
            (loading ? (
              <div aria-hidden="true" className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 py-4">
                  <Skeleton shape="circle" className="size-16" />
                  <Skeleton className="my-1 h-5 w-40" />
                  <Skeleton className="my-1 h-9 w-48" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex flex-col gap-6 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] p-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              (emptyState ?? <EmptyStatePreset kind="noData" />)
            ))}
        </PageFrame>
      );
    const when = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short' }).format(t.date);
    return (
      <PageFrame ref={ref} width="sm" aria-labelledby={headingId} {...props}>
        {back}
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <Avatar name={t.title} src={t.image} size="xl" />
          <h1 id={headingId} className="text-title-lg text-[var(--color-on-surface)]">
            {t.title}
          </h1>
          <Amount value={t.amount} currency={t.currency} locale={locale} size="display" tone="auto" signDisplay="exceptZero" />
          <Badge tone={t.status === 'failed' ? 'danger' : t.status === 'pending' ? 'warning' : 'success'}>
            {t.status === 'failed' ? m.failed : t.status === 'pending' ? m.pending : m.completed}
          </Badge>
        </div>
        <div className="rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] px-4">
          <InfoList.Root>
            <InfoList.Item label={m.date} value={when} />
            {t.subtitle && <InfoList.Item label={m.details} value={t.subtitle} />}
            {rows.map((r) => (
              <InfoList.Item key={r.label} label={r.label} value={r.value} />
            ))}
          </InfoList.Root>
        </div>
        {footer && <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">{footer}</div>}
      </PageFrame>
    );
  },
);
