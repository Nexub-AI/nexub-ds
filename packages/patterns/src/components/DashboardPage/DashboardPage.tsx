import * as React from 'react';
import { Amount, Button, Card, Skeleton } from '@nexub/react';
import { StatCard, type StatCardProps } from '../StatCard/index.js';
import { TransactionRow, TransactionRowSkeleton } from '../ActivityPage/ActivityPage.js';
import {
  PageFrame,
  usePageMessages,
  useTemplateLocale,
  type Insight,
  type PageFrameProps,
  type PageTemplateMessages,
  type QuickAction,
  type Transaction,
} from '../PageFrame/PageFrame.js';

export type DashboardStat = Pick<StatCardProps, 'label' | 'value' | 'delta' | 'deltaType' | 'sentiment' | 'icon' | 'description' | 'category' | 'trend' | 'trendLabel' | 'animate'>;

export interface DashboardPageProps extends Omit<PageFrameProps, 'title' | 'children'> {
  /** Page title, e.g. "Good morning, Mei". */
  title: React.ReactNode;
  balance: { value: number; currency: string; label?: string };
  /** 10.3: a greeting above the balance, usually a `WelcomeBanner`. */
  banner?: React.ReactNode;
  /** 10.3: a chart panel under the key figures, e.g. spending by month. Give it a `title`. */
  chart?: { title: string; content: React.ReactNode; action?: React.ReactNode };
  /** Send, Add money, Request… Keep to four. */
  quickActions?: QuickAction[];
  /** Key figures under the balance. */
  stats?: DashboardStat[];
  /** The latest few transactions. */
  recent?: Transaction[];
  onSelectTransaction?: (t: Transaction) => void;
  /** Shows "See all" beside Recent activity. */
  onSeeAllActivity?: () => void;
  insights?: Insight[];
  /** 10.5: skeletons for the balance, key figures, chart and recent activity; sets aria-busy on the page. */
  loading?: boolean;
  /** Shown in the Recent activity panel when `recent` is empty. Without it the panel is left out. */
  emptyState?: React.ReactNode;
  /** Shown in place of the page content; wins over `loading` and `emptyState`. */
  errorState?: React.ReactNode;
  messages?: Partial<PageTemplateMessages>;
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  const id = React.useId();
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 id={id} className="text-title-md text-[var(--color-on-surface)]">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/**
 * Money-app home: balance with quick actions, key figures, recent activity and
 * insights. Two columns from `lg`, one on phones. Web twin of the native `HomeScreen`.
 */
export const DashboardPage = React.forwardRef<HTMLElement, DashboardPageProps>(function DashboardPage(
  {
    title,
    balance,
    banner,
    chart,
    quickActions = [],
    stats = [],
    recent = [],
    onSelectTransaction,
    onSeeAllActivity,
    insights = [],
    loading: isLoading,
    emptyState,
    errorState,
    messages,
    ...props
  },
  ref,
) {
  const m = usePageMessages(messages);
  const locale = useTemplateLocale();
  const failed = errorState != null;
  const loading = !!isLoading && !failed;
  // While loading, placeholders stand in for figures that are not known yet.
  const statList: DashboardStat[] = loading && !stats.length ? [{ label: '\u00a0', value: '' }, { label: '\u00a0', value: '' }, { label: '\u00a0', value: '' }] : stats;
  return (
    <PageFrame ref={ref} width="lg" title={title} aria-busy={loading || undefined} {...props}>
      {banner}
      {failed ? (
        errorState
      ) : (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <Card className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-1">
              <p className="text-label-lg text-[var(--color-on-surface-variant)]">{balance.label ?? m.totalBalance}</p>
              {loading ? (
                <Skeleton className="my-1 h-9 w-48 max-w-full" />
              ) : (
                <Amount value={balance.value} currency={balance.currency} locale={locale} size="display" />
              )}
            </div>
            {quickActions.length > 0 && (
              <ul aria-label={m.quickActions} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {quickActions.map((a, i) => (
                  <li key={a.id}>
                    {/* The first action is the screen's one main (gradient under vivid) action. */}
                    <Button variant={i === 0 ? 'filled' : 'tonal'} fullWidth onClick={a.onSelect} leadingIcon={a.icon}>
                      {a.label}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {statList.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {statList.map((s, i) => (
                <StatCard key={loading ? i : s.label} {...s} loading={loading} />
              ))}
            </div>
          )}

          {chart && (
            <Panel title={chart.title} action={chart.action}>
              <Card className="p-6">{loading ? <Skeleton shape="rect" className="h-48" /> : chart.content}</Card>
            </Panel>
          )}

          {(loading || recent.length > 0 || emptyState != null) && (
            <Panel
              title={m.recentActivity}
              action={
                onSeeAllActivity && (
                  <Button variant="text" size="sm" onClick={onSeeAllActivity}>
                    {m.seeAll}
                  </Button>
                )
              }
            >
              {!loading && recent.length === 0 ? (
                emptyState
              ) : (
                <ul className="overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)]">
                  {loading
                    ? [0, 1, 2, 3].map((i) => <TransactionRowSkeleton key={i} />)
                    : recent.map((t) => <TransactionRow key={t.id} t={t} onSelect={onSelectTransaction} m={m} locale={locale} />)}
                </ul>
              )}
            </Panel>
          )}
        </div>

        {!loading && insights.length > 0 && (
          <Panel title={m.insights}>
            <ul className="flex flex-col gap-3">
              {insights.map((i) => (
                <li key={i.id}>
                  <Card className="flex flex-col gap-2 p-4">
                    <h3 className="text-title-sm text-[var(--color-on-surface)]">{i.title}</h3>
                    <p className="text-body-sm text-[var(--color-on-surface-muted)]">{i.body}</p>
                    {i.action && (
                      <Button variant="link" size="sm" className="self-start px-0" onClick={i.action.onSelect}>
                        {i.action.label}
                      </Button>
                    )}
                  </Card>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
      )}
    </PageFrame>
  );
});
