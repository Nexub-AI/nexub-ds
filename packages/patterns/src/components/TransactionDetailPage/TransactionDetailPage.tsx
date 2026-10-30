import * as React from 'react';
import { Amount, Avatar, Badge, Button } from '@nexub/react';
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
  transaction: Transaction;
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
  function TransactionDetailPage({ transaction: t, rows = [], footer, onBack, messages, ...props }, ref) {
    const m = usePageMessages(messages);
    const locale = useTemplateLocale();
    const headingId = React.useId();
    const when = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short' }).format(t.date);
    return (
      <PageFrame ref={ref} width="sm" aria-labelledby={headingId} {...props}>
        {onBack && (
          <Button variant="ghost" size="sm" className="self-start" onClick={onBack} leadingIcon={<ArrowLeft size="sm" className="rtl:-scale-x-100" aria-hidden="true" />}>
            {m.back}
          </Button>
        )}
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
