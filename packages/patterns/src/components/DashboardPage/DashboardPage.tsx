import * as React from 'react';
import { Amount, Button, Card } from '@nexub/react';
import { StatCard, type StatCardProps } from '../StatCard/index.js';
import { TransactionRow } from '../ActivityPage/ActivityPage.js';
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

export type DashboardStat = Pick<StatCardProps, 'label' | 'value' | 'delta' | 'deltaType' | 'sentiment' | 'icon' | 'description'>;

export interface DashboardPageProps extends Omit<PageFrameProps, 'title' | 'children'> {
  /** Page title, e.g. "Good morning, Mei". */
  title: React.ReactNode;
  balance: { value: number; currency: string; label?: string };
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
    quickActions = [],
    stats = [],
    recent = [],
    onSelectTransaction,
    onSeeAllActivity,
    insights = [],
    messages,
    ...props
  },
  ref,
) {
  const m = usePageMessages(messages);
  const locale = useTemplateLocale();
  return (
    <PageFrame ref={ref} width="lg" title={title} {...props}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <Card className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-1">
              <p className="text-label-lg text-[var(--color-on-surface-variant)]">{balance.label ?? m.totalBalance}</p>
              <Amount value={balance.value} currency={balance.currency} locale={locale} size="display" />
            </div>
            {quickActions.length > 0 && (
              <ul aria-label={m.quickActions} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {quickActions.map((a) => (
                  <li key={a.id}>
                    <Button variant="secondary" fullWidth onClick={a.onSelect} leadingIcon={a.icon}>
                      {a.label}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {stats.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          )}

          {recent.length > 0 && (
            <Panel
              title={m.recentActivity}
              action={
                onSeeAllActivity && (
                  <Button variant="ghost" size="sm" onClick={onSeeAllActivity}>
                    {m.seeAll}
                  </Button>
                )
              }
            >
              <ul className="overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)]">
                {recent.map((t) => (
                  <TransactionRow key={t.id} t={t} onSelect={onSelectTransaction} m={m} locale={locale} />
                ))}
              </ul>
            </Panel>
          )}
        </div>

        {insights.length > 0 && (
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
    </PageFrame>
  );
});
