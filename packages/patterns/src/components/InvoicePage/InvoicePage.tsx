import * as React from 'react';
import { Amount, Badge, Card, DescriptionList, SuccessCheck, Table, cn } from '@nexub/react';
import {
  PageFrame,
  formatMoney,
  usePageStrings,
  useTemplateLocale,
  type PageFrameProps,
  type PageTemplateMessages,
} from '../PageFrame/PageFrame.js';
import { sharedMessages } from '../PageFrame/messages/shared.js';
import { invoiceMessages } from '../PageFrame/messages/invoice.js';

/** The defaults this template shows (11.7: not every template's strings). */
const STRINGS = { ...sharedMessages, ...invoiceMessages };

export interface InvoiceParty {
  name: string;
  /** Address lines, an email. */
  lines?: string[];
  taxId?: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  /** A second, muted line: the period, a SKU. */
  detail?: string;
  quantity: number;
  unitPrice: number;
  /** @default quantity × unitPrice */
  amount?: number;
}

export type InvoiceStatus = 'draft' | 'due' | 'paid' | 'overdue' | 'void';

export interface InvoicePageProps extends Omit<PageFrameProps, 'title' | 'children'> {
  number: string;
  status?: InvoiceStatus;
  /** A Date, or an ISO day ("2026-11-03", read as a local day). */
  issuedOn: Date | string;
  dueOn?: Date | string;
  from: InvoiceParty;
  to: InvoiceParty;
  items: InvoiceItem[];
  /** ISO 4217 code. */
  currency: string;
  /** @default the provider's locale */
  locale?: string;
  /** @default the sum of the items */
  subtotal?: number;
  /** A positive number; it is taken off. */
  discount?: number;
  taxes?: { label: string; amount: number }[];
  /** @default subtotal − discount + taxes */
  total?: number;
  notes?: React.ReactNode;
  /** How to pay, or "Paid on … with …". */
  payment?: React.ReactNode;
  logo?: React.ReactNode;
  /** `receipt`: compact and centred, with a success mark and the amount as the hero. @default 'invoice' */
  variant?: 'invoice' | 'receipt';
  messages?: Partial<PageTemplateMessages>;
}

const tones = { draft: 'neutral', due: 'info', paid: 'success', overdue: 'danger', void: 'neutral' } as const;

function toDate(d: Date | string) {
  if (d instanceof Date) return d;
  // A bare ISO day is UTC midnight to `new Date`: the day before in the Americas.
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  return day ? new Date(+day[1]!, +day[2]! - 1, +day[3]!) : new Date(d);
}

const num = 'text-end tabular-nums whitespace-nowrap';
// Quantity and unit price fold under the description below an @xl container (see the component note).
const wideOnly = 'hidden @xl:table-cell';

function PartyBlock({ label, party, taxId }: { label: string; party: InvoiceParty; taxId: (id: string) => string }) {
  const id = React.useId();
  return (
    <section aria-labelledby={id} className="flex min-w-0 flex-col gap-1">
      <h2 id={id} className="text-label-md text-[var(--color-on-surface-variant)]">
        {label}
      </h2>
      <address className="flex flex-col text-body-md not-italic text-[var(--color-on-surface-muted)]">
        <span className="font-medium text-[var(--color-on-surface)]">{party.name}</span>
        {party.lines?.map((line, i) => (
          <span key={i} className="break-words">
            {line}
          </span>
        ))}
        {party.taxId && <span>{taxId(party.taxId)}</span>}
      </address>
    </section>
  );
}

/**
 * An invoice or a receipt. The items are a real table. At 320px it keeps two columns
 * (description, amount): quantity and unit price move under the description as
 * "2 × $40.00", so no row needs sideways scrolling; if a long amount still overflows,
 * the Table's own labelled region scrolls, never the page.
 */
export const InvoicePage = React.forwardRef<HTMLElement, InvoicePageProps>(function InvoicePage(
  {
    number,
    status,
    issuedOn,
    dueOn,
    from,
    to,
    items,
    currency,
    locale: localeProp,
    subtotal: subtotalProp,
    discount,
    taxes = [],
    total: totalProp,
    notes,
    payment,
    actions,
    logo,
    variant = 'invoice',
    messages,
    ...props
  },
  ref,
) {
  const m = usePageStrings(messages, STRINGS);
  const providerLocale = useTemplateLocale();
  const locale = localeProp ?? providerLocale;
  const money = (n: number) => formatMoney(n, currency, locale);
  const day = (d: Date | string) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(toDate(d));
  const headingId = React.useId();
  const receipt = variant === 'receipt';

  const amountOf = (i: InvoiceItem) => i.amount ?? i.quantity * i.unitPrice;
  const subtotal = subtotalProp ?? items.reduce((sum, i) => sum + amountOf(i), 0);
  const total = totalProp ?? subtotal - (discount ?? 0) + taxes.reduce((sum, t) => sum + t.amount, 0);

  const name = `${receipt ? m.receipt : m.invoice} ${number}`;
  const badge = status && <Badge tone={tones[status]}>{m.invoiceStatus(status)}</Badge>;

  const dates = (
    <DescriptionList.Root layout="stacked" columns={2}>
      <DescriptionList.Item label={m.issued}>{day(issuedOn)}</DescriptionList.Item>
      {dueOn != null && <DescriptionList.Item label={m.due}>{day(dueOn)}</DescriptionList.Item>}
    </DescriptionList.Root>
  );

  const table = (
    <Table.Root density={receipt ? 'compact' : undefined}>
      <Table.Caption className="sr-only">{m.lineItems}</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head scope="col">{m.itemDescription}</Table.Head>
          <Table.Head scope="col" className={cn(num, wideOnly)}>
            {m.quantity}
          </Table.Head>
          <Table.Head scope="col" className={cn(num, wideOnly)}>
            {m.unitPrice}
          </Table.Head>
          <Table.Head scope="col" className={num}>
            {m.amount}
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.map((i, index) => (
          <Table.Row key={i.id ?? index}>
            <Table.Cell>
              <span className="block font-medium text-[var(--color-on-surface)]">{i.description}</span>
              {i.detail && <span className="block text-body-sm text-[var(--color-on-surface-muted)]">{i.detail}</span>}
              <span className="block text-body-sm tabular-nums text-[var(--color-on-surface-muted)] @xl:hidden">
                {i.quantity} × {money(i.unitPrice)}
              </span>
            </Table.Cell>
            <Table.Cell className={cn(num, wideOnly)}>{i.quantity}</Table.Cell>
            <Table.Cell className={cn(num, wideOnly)}>{money(i.unitPrice)}</Table.Cell>
            <Table.Cell className={num}>{money(amountOf(i))}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Head scope="row">{m.subtotal}</Table.Head>
          <Table.Cell className={wideOnly} />
          <Table.Cell className={wideOnly} />
          <Table.Cell className={num}>{money(subtotal)}</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  );

  const totals = (
    <div className={cn('w-full', !receipt && 'ms-auto @xl:max-w-xs')}>
      <DescriptionList.Root className="tabular-nums">
        {discount != null && discount !== 0 && <DescriptionList.Item label={m.discount}>{money(-discount)}</DescriptionList.Item>}
        {taxes.map((t) => (
          <DescriptionList.Item key={t.label} label={t.label}>
            {money(t.amount)}
          </DescriptionList.Item>
        ))}
        <DescriptionList.Item label={m.total} emphasis>
          {money(total)}
        </DescriptionList.Item>
      </DescriptionList.Root>
    </div>
  );

  const tail = (
    <>
      {notes && (
        <section aria-label={m.notes} className="flex flex-col gap-1">
          <h2 className="text-label-md text-[var(--color-on-surface-variant)]">{m.notes}</h2>
          <div className="text-body-md text-[var(--color-on-surface-muted)]">{notes}</div>
        </section>
      )}
      {payment && <div className="text-body-md text-[var(--color-on-surface)]">{payment}</div>}
    </>
  );

  if (receipt)
    return (
      <PageFrame ref={ref} width="sm" aria-labelledby={headingId} {...props}>
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          {logo}
          <SuccessCheck size="lg" />
          <h1 id={headingId} className="text-title-lg text-[var(--color-on-surface)]">
            {name}
          </h1>
          <Amount value={total} currency={currency} locale={locale} size="display" />
          {badge}
          <p className="text-body-sm text-[var(--color-on-surface-muted)]">
            {to.name} · {day(issuedOn)}
          </p>
        </div>
        <Card className="flex flex-col gap-4 p-4">
          {table}
          {totals}
          {tail}
        </Card>
        {actions && <div className="flex flex-col gap-2 @xl:flex-row @xl:justify-center">{actions}</div>}
      </PageFrame>
    );

  return (
    <PageFrame
      ref={ref}
      title={name}
      eyebrow={logo}
      actions={
        (badge || actions) && (
          <>
            {badge}
            {actions}
          </>
        )
      }
      {...props}
    >
      <Card className="flex flex-col gap-6 p-4 @xl:p-6">
        {dates}
        <div className="grid gap-6 @xl:grid-cols-2">
          <PartyBlock label={m.billedFrom} party={from} taxId={m.taxId} />
          <PartyBlock label={m.billedTo} party={to} taxId={m.taxId} />
        </div>
        {table}
        {totals}
        {tail}
      </Card>
    </PageFrame>
  );
});
