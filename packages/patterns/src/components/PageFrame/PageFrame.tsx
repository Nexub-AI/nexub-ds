import * as React from 'react';
import { Badge, cn, useLocale, useNexubMessages } from '@nexub/react';

// Shared pieces of the page templates (ActivityPage, DashboardPage, …).
// Data types mirror @nexub/react-native/patterns so one data layer feeds the
// web page and its native screen.

// ─── Data ────────────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  title: string;
  subtitle?: string;
  /** Negative = money out. */
  amount: number;
  currency: string;
  date: Date;
  status?: 'pending' | 'failed';
  /** Avatar image URL. */
  image?: string;
}

export interface ReviewRow {
  label: string;
  value: string;
}

export interface Quote {
  fee: number;
  /** Units of `to` per unit of `from`. */
  rate: number;
  /** e.g. "In seconds", "By Friday". */
  arrives: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** Still streaming in. */
  streaming?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  /** Preformatted, e.g. "$9.99 / month". */
  price: string;
  features: string[];
  badge?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface Insight {
  id: string;
  title: string;
  body: string;
  action?: { label: string; onSelect: () => void };
}

// ─── Strings ─────────────────────────────────────────────────────────────────

export interface PageTemplateMessages {
  activity: string;
  noActivityTitle: string;
  noActivityDescription: string;
  loadMore: string;
  refresh: string;
  pending: string;
  failed: string;
  completed: string;
  date: string;
  details: string;
  back: string;
  settings: string;
  signIn: string;
  email: string;
  password: string;
  forgotPassword: string;
  createAccount: string;
  howMuch: string;
  amountToSend: string;
  balance: (formatted: string) => string;
  overBalance: (formatted: string) => string;
  fee: string;
  rate: string;
  recipientGets: string;
  arrives: string;
  continue: string;
  checkDetails: string;
  edit: string;
  done: string;
  stepOf: (step: number, total: number) => string;
  sent: string;
  chat: string;
  chatEmpty: string;
  restorePurchases: string;
  choosePlan: string;
  totalBalance: string;
  quickActions: string;
  recentActivity: string;
  seeAll: string;
  insights: string;
}

export const defaultPageTemplateMessages: PageTemplateMessages = {
  activity: 'Activity',
  noActivityTitle: 'No activity yet',
  noActivityDescription: 'Your payments and transfers will show up here.',
  loadMore: 'Load more',
  refresh: 'Refresh',
  pending: 'Pending',
  failed: 'Failed',
  completed: 'Completed',
  date: 'Date',
  details: 'Details',
  back: 'Back',
  settings: 'Settings',
  signIn: 'Sign in',
  email: 'Email',
  password: 'Password',
  forgotPassword: 'Forgot password?',
  createAccount: 'Create an account',
  howMuch: 'How much?',
  amountToSend: 'Amount to send',
  balance: (b) => `Balance ${b}`,
  overBalance: (b) => `More than your balance (${b})`,
  fee: 'Fee',
  rate: 'Rate',
  recipientGets: 'Recipient gets',
  arrives: 'Arrives',
  continue: 'Continue',
  checkDetails: 'Check the details',
  edit: 'Edit',
  done: 'Done',
  stepOf: (s, t) => `Step ${s} of ${t}`,
  sent: 'Sent',
  chat: 'Chat',
  chatEmpty: 'Ask anything to get started.',
  restorePurchases: 'Restore purchases',
  choosePlan: 'Choose a plan',
  totalBalance: 'Total balance',
  quickActions: 'Quick actions',
  recentActivity: 'Recent activity',
  seeAll: 'See all',
  insights: 'Insights',
};

/** Defaults ← NexubProvider `messages` ← the template's own `messages` prop. */
export function usePageMessages(overrides?: Partial<PageTemplateMessages>): PageTemplateMessages {
  const provided = useNexubMessages() as unknown as Partial<PageTemplateMessages>;
  const out = { ...defaultPageTemplateMessages };
  for (const key of Object.keys(out) as (keyof PageTemplateMessages)[]) {
    const v = overrides?.[key] ?? provided[key];
    // Provider messages hold other components' strings too; only take matching kinds.
    if (v !== undefined && typeof v === typeof out[key]) (out as Record<string, unknown>)[key] = v;
  }
  return out;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatMoney(value: number, currency: string, locale: string, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, ...opts }).format(value);
}

/** Newest first, grouped under a medium date heading ("30 Oct 2026"). */
export function groupByDay(transactions: Transaction[], locale: string) {
  const day = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  const map = new Map<string, Transaction[]>();
  for (const t of [...transactions].sort((a, b) => +b.date - +a.date)) {
    const key = day.format(t.date);
    map.set(key, [...(map.get(key) ?? []), t]);
  }
  return [...map].map(([title, data]) => ({ title, data }));
}

export function useTemplateLocale() {
  return useLocale().locale;
}

export function StatusBadge({ status, m, dot }: { status?: Transaction['status']; m: PageTemplateMessages; dot?: boolean }) {
  if (!status) return null;
  return (
    <Badge tone={status === 'failed' ? 'danger' : 'warning'} size="sm">
      {dot && <span aria-hidden="true" className="me-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />}
      {status === 'failed' ? m.failed : m.pending}
    </Badge>
  );
}

// ─── Frame ───────────────────────────────────────────────────────────────────

export interface PageFrameProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Landmark element. Use `div` inside an app shell that already renders `<main>`. @default 'main' */
  as?: 'main' | 'div' | 'section';
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Top-right of the header: buttons, filters. */
  actions?: React.ReactNode;
  /** Above the title, e.g. a back link. */
  eyebrow?: React.ReactNode;
  /** Content width. @default 'md' */
  width?: 'sm' | 'md' | 'lg';
}

const widths = { sm: 'max-w-[480px]', md: 'max-w-3xl', lg: 'max-w-6xl' };

/** Page frame shared by the templates: centred column, h1 header, responsive padding. */
export const PageFrame = React.forwardRef<HTMLElement, PageFrameProps>(function PageFrame(
  { as: Tag = 'main', title, description, actions, eyebrow, width = 'md', className, children, ...props },
  ref,
) {
  const headingId = React.useId();
  return (
    <Tag
      ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
      aria-labelledby={title ? headingId : undefined}
      className={cn('mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:py-10', widths[width], className)}
      {...props}
    >
      {(title || actions || eyebrow) && (
        <header className="flex flex-col gap-2">
          {eyebrow}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {title && (
              <h1 id={headingId} className="text-headline-sm text-[var(--color-on-surface)]">
                {title}
              </h1>
            )}
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {description && <p className="text-body-md text-[var(--color-on-surface-muted)]">{description}</p>}
        </header>
      )}
      {children}
    </Tag>
  );
});
