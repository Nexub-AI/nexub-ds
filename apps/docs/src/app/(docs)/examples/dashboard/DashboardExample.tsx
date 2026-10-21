'use client';

// A product dashboard built only from public exports of @nexub/react and
// @nexub/patterns, plus Tailwind utilities on role tokens. No private imports,
// no custom CSS. The <Toaster /> lives once in the app's root layout (here: the
// docs' ClientProviders); a second one would show every toast twice.
import * as React from 'react';
import {
  Amount,
  Avatar,
  Button,
  DataTable,
  DropdownMenu,
  IconButton,
  MessageBubble,
  NavigationRail,
  NexubProvider,
  PageHeader,
  PromptInput,
  RadioCard,
  RadioCardGroup,
  SegmentedControl,
  SplitButton,
  StatusPill,
  ThinkingIndicator,
  toast,
  type DataTableProps,
  type StatusPillProps,
  type TextDirection,
} from '@nexub/react';
import { AppHeader, BentoGrid, BentoTile, Conversation, StatCard } from '@nexub/patterns';
import { CreditCard, Home, Menu, Receipt, Settings, Sparkles, Users, Wallet } from '@nexub/icons';

// ─── Data ─────────────────────────────────────────────────────────────────────

type TxStatus = 'paid' | 'pending' | 'failed' | 'refunded';

interface Tx {
  id: string;
  customer: string;
  date: string;
  status: TxStatus;
  amount: number;
}

const transactions: Tx[] = [
  { id: 'tx_1042', customer: 'Aisha Rahman', date: '2026-10-21', status: 'paid', amount: 1290 },
  { id: 'tx_1041', customer: 'Kenji Watanabe', date: '2026-10-20', status: 'pending', amount: 349.5 },
  { id: 'tx_1040', customer: 'Lucía Fernández', date: '2026-10-20', status: 'failed', amount: 89 },
  { id: 'tx_1039', customer: 'Omar Haddad', date: '2026-10-19', status: 'refunded', amount: -240 },
  { id: 'tx_1038', customer: 'Priya Natarajan', date: '2026-10-18', status: 'paid', amount: 4800 },
];

const statusPill: Record<TxStatus, { tone: StatusPillProps['tone']; label: string }> = {
  paid: { tone: 'success', label: 'Paid' },
  pending: { tone: 'warning', label: 'Pending' },
  failed: { tone: 'danger', label: 'Failed' },
  refunded: { tone: 'neutral', label: 'Refunded' },
};

const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const revenue = { thisYear: [42, 48, 45, 56, 61, 68], lastYear: [35, 37, 40, 41, 47, 50] }; // $k

const stats = [
  { label: 'Monthly revenue', value: 68420, delta: '+11.4%', deltaType: 'increase' as const, prefix: '$' },
  { label: 'Active customers', value: 1284, delta: '+32', deltaType: 'increase' as const },
  { label: 'Net revenue retention', value: 104.2, delta: '+1.8 pts', deltaType: 'increase' as const, suffix: '%' },
  { label: 'Average order', value: 53, delta: '−2.1%', deltaType: 'decrease' as const, prefix: '$' },
];
// StatCard's deltaType sets both the arrow and the colour, so a fall that's good
// news (churn, failed payments) can't be shown honestly; these metrics avoid it.

const nav = [
  { label: 'Overview', icon: <Home aria-hidden="true" />, active: true },
  { label: 'Payments', icon: <CreditCard aria-hidden="true" /> },
  { label: 'Customers', icon: <Users aria-hidden="true" /> },
  { label: 'Invoices', icon: <Receipt aria-hidden="true" /> },
  { label: 'Settings', icon: <Settings aria-hidden="true" /> },
];

// ─── Pieces ───────────────────────────────────────────────────────────────────

function RevenueChart() {
  const max = 80;
  const h = 160;
  const slot = 300 / months.length;
  const bar = slot / 3;
  const summary = months
    .map((m, i) => `${m}: $${revenue.thisYear[i]}k (last year $${revenue.lastYear[i]}k)`)
    .join('; ');
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-title-md text-[var(--color-on-surface)]">Revenue</h2>
        <ul className="flex gap-4 text-label-md text-[var(--color-on-surface-variant)]">
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-chart-1" />
            2026
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-chart-2" />
            2025
          </li>
        </ul>
      </div>
      {/* Bars follow reading order: mirrored in RTL, like the month labels below. */}
      <svg
        viewBox={`0 0 300 ${h}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Revenue by month, in thousands of dollars. ${summary}.`}
        className="min-h-40 w-full flex-1 rtl:-scale-x-100"
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2="300" y1={h * f} y2={h * f} className="stroke-[var(--color-outline-variant)]" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        {months.map((m, i) => {
          const a = (revenue.thisYear[i]! / max) * h;
          const b = (revenue.lastYear[i]! / max) * h;
          const x = i * slot + bar / 2;
          return (
            <g key={m}>
              <rect x={x} y={h - a} width={bar} height={a} rx="2" className="fill-chart-1" />
              <rect x={x + bar} y={h - b} width={bar} height={b} rx="2" className="fill-chart-2" />
            </g>
          );
        })}
      </svg>
      <ol aria-hidden="true" className="grid grid-cols-6 text-center text-label-sm text-[var(--color-on-surface-muted)]">
        {months.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ol>
    </div>
  );
}

type ChatMessage = { id: number; from: 'user' | 'assistant'; text: string };

function AssistantPanel() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: 0, from: 'assistant', text: 'Hi! Ask me about this month’s revenue, churn or failed payments.' },
  ]);
  const [thinking, setThinking] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const send = (text: string) => {
    setMessages((m) => [...m, { id: m.length, from: 'user', text }]);
    setThinking(true);
    timer.current = setTimeout(() => {
      setThinking(false);
      setMessages((m) => [
        ...m,
        {
          id: m.length,
          from: 'assistant',
          text: 'Revenue is up 11.4% on September, driven by Growth-plan upgrades. Seven payments failed this month; five were expired cards, so a card-update reminder should recover most of them.',
        },
      ]);
    }, 1200);
  };

  return (
    <section
      aria-labelledby="assistant-title"
      className="flex h-[32rem] flex-col rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]"
    >
      <h2 id="assistant-title" className="flex items-center gap-2 px-4 pt-4 text-title-md text-[var(--color-on-surface)]">
        <Sparkles size="sm" aria-hidden="true" className="text-[var(--color-primary)]" />
        Assistant
      </h2>
      <Conversation
        className="min-h-0 flex-1"
        composer={
          <PromptInput
            onSubmit={send}
            status={thinking ? 'submitting' : 'idle'}
            label="Ask about your dashboard"
          />
        }
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} from={msg.from}>
            {msg.text}
          </MessageBubble>
        ))}
        {thinking && <ThinkingIndicator />}
      </Conversation>
    </section>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

function Dashboard() {
  const [rows, setRows] = React.useState(transactions);
  const [plan, setPlan] = React.useState('growth');
  const [exporting, setExporting] = React.useState(false);
  const [tick, setTick] = React.useState(0);
  const txTitle = React.useRef<HTMLHeadingElement>(null);

  const archive = (tx: Tx) => {
    setRows((r) => r.filter((x) => x.id !== tx.id));
    // The focused button leaves with its row; keep focus in the table section.
    txTitle.current?.focus();
    toast.undoable(`${tx.customer}’s payment archived`, {
      onUndo: () => setRows((r) => (r.some((x) => x.id === tx.id) ? r : [...r, tx].sort((a, b) => b.id.localeCompare(a.id)))),
    });
  };

  const exportReport = (format: string) => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      toast.success(`Report exported as ${format}`);
    }, 1200);
  };

  const columns: DataTableProps<Tx>['columns'] = [
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <span className="flex items-center gap-2 whitespace-nowrap">
          <Avatar name={row.original.customer} size="xs" aria-hidden="true" />
          {row.original.customer}
        </span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <span className="whitespace-nowrap">{row.original.date}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusPill {...statusPill[row.original.status]} />,
    },
    {
      accessorKey: 'amount',
      // Sortable headers render a button, which can't be end-aligned (no column alignment API).
      enableSorting: false,
      header: () => <span className="block text-end">Amount</span>,
      cell: ({ row }) => (
        <span className="block text-end">
          <Amount value={row.original.amount} currency="USD" />
        </span>
      ),
    },
    {
      id: 'actions',
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <Button variant="text" size="sm" onClick={() => archive(row.original)} aria-label={`Archive ${row.original.customer}’s payment`}>
          Archive
        </Button>
      ),
    },
  ];

  return (
    <>
      <AppHeader
        productName="Ledger"
        condense
        searchItems={[
          {
            label: 'Go to',
            items: nav.map((n) => ({ id: n.label, label: n.label, icon: n.icon, onSelect: () => toast.info(`${n.label} isn’t part of this example`) })),
          },
        ]}
        orgs={[
          { id: 'acme', name: 'Acme Inc.' },
          { id: 'globex', name: 'Globex' },
        ]}
        currentOrgId="acme"
        user={{ name: 'Sam Rivera', email: 'sam@example.com' }}
        onSignOut={() => { toast.info('Signed out (not really)'); }}
        menu={
          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger asChild>
              <IconButton label="Open navigation">
                <Menu size="md" aria-hidden="true" />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="start">
                {nav.map((n) => (
                  <DropdownMenu.Item key={n.label}>{n.label}</DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        }
      />
      <div className="flex min-w-0">
        <NavigationRail.Root className="hidden h-auto border-e border-[var(--color-outline-variant)] md:flex">
          {nav.map((n) => (
            <NavigationRail.Item key={n.label} href="#" icon={n.icon} label={n.label} active={n.active} onClick={(e) => e.preventDefault()} />
          ))}
        </NavigationRail.Root>

        {/* <main> in your app; a div here because the docs page already has one. */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
          <PageHeader
            title="Overview"
            description="October 2026 · All figures in USD"
            actions={
              <>
                <Button variant="outlined" onClick={() => setTick((t) => t + 1)}>
                  Refresh
                </Button>
                <SplitButton
                  loading={exporting}
                  onClick={() => exportReport('PDF')}
                  menuLabel="More export options"
                  menu={
                    <>
                      <DropdownMenu.Item onSelect={() => exportReport('CSV')}>Export as CSV</DropdownMenu.Item>
                      <DropdownMenu.Item onSelect={() => exportReport('XLSX')}>Export as XLSX</DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item onSelect={() => toast.info('Scheduling isn’t part of this example')}>Schedule…</DropdownMenu.Item>
                    </>
                  }
                >
                  Export PDF
                </SplitButton>
              </>
            }
          />

          <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="flex min-w-0 flex-col gap-6">
              <BentoGrid>
                {stats.map((s, i) => (
                  <StatCard
                    key={s.label}
                    animate
                    label={s.label}
                    // Refresh nudges the numbers so the digits roll.
                    value={`${s.prefix ?? ''}${(s.value + (tick * (i + 1) * (Number.isInteger(s.value) ? 3 : 0.1))).toLocaleString('en-US', { maximumFractionDigits: 1 })}${s.suffix ?? ''}`}
                    delta={s.delta}
                    deltaType={s.deltaType}
                    description="vs last month"
                  />
                ))}
                <BentoTile size="2x2">
                  <RevenueChart />
                </BentoTile>
                <BentoTile size="2x2">
                  <h2 id="plan-title" className="mb-1 text-title-md text-[var(--color-on-surface)]">Plan</h2>
                  <p className="mb-3 text-body-sm text-[var(--color-on-surface-muted)]">Changes apply at the next billing date.</p>
                  <RadioCardGroup
                    aria-labelledby="plan-title"
                    value={plan}
                    onValueChange={(v) => {
                      setPlan(v);
                      toast.success(`Switched to ${v[0]!.toUpperCase()}${v.slice(1)}`);
                    }}
                  >
                    <RadioCard value="starter" icon={<Wallet size="md" aria-hidden="true" />} title="Starter · $29/mo" description="1,000 transactions" />
                    <RadioCard value="growth" icon={<CreditCard size="md" aria-hidden="true" />} title="Growth · $99/mo" description="10,000 transactions, reports" />
                    <RadioCard value="scale" icon={<Sparkles size="md" aria-hidden="true" />} title="Scale · $299/mo" description="Unlimited, assistant, SSO" />
                  </RadioCardGroup>
                </BentoTile>
              </BentoGrid>

              <section aria-labelledby="tx-title" className="flex min-w-0 flex-col gap-3 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] p-4">
                <h2 id="tx-title" ref={txTitle} tabIndex={-1} className="text-title-md text-[var(--color-on-surface)]">Recent transactions</h2>
                <DataTable columns={columns} data={rows} enableSorting />
              </section>
            </div>

            <AssistantPanel />
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * The docs frame: a direction switch, and a transformed container so the
 * AppHeader (position: fixed in a real app) pins to the frame, not the docs page.
 */
export function DashboardExample() {
  const [dir, setDir] = React.useState<TextDirection>('ltr');
  return (
    <div className="flex flex-col gap-3">
      <SegmentedControl.Root
        aria-label="Text direction"
        size="sm"
        value={dir}
        onValueChange={(v) => v && setDir(v as TextDirection)}
        className="self-start"
      >
        <SegmentedControl.Item value="ltr">Left to right</SegmentedControl.Item>
        <SegmentedControl.Item value="rtl">Right to left</SegmentedControl.Item>
      </SegmentedControl.Root>
      <NexubProvider dir={dir} locale={dir === 'rtl' ? 'ar' : 'en-US'}>
        <div
          dir={dir}
          className="transform-gpu overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-on-surface)]"
        >
          <Dashboard />
        </div>
      </NexubProvider>
    </div>
  );
}
