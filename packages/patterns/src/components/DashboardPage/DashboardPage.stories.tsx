import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { BarChart, Button, EmptyStatePreset } from '@nexub/react';
import { ArrowDown, CreditCard, Plus, Receipt, Send, TrendingUp, Wallet } from '@nexub/icons';
import { WelcomeBanner } from '../WelcomeBanner/index.js';
import { DashboardPage } from './DashboardPage.js';

const meta: Meta<typeof DashboardPage> = {
  title: 'Patterns/Pages/DashboardPage',
  component: DashboardPage,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof DashboardPage>;

const noop = () => {};
const day = (d: number, h = 10) => new Date(2026, 9, 30 - d, h, 12);
const spending = [
  { month: 'May', spent: 1620 },
  { month: 'Jun', spent: 1890 },
  { month: 'Jul', spent: 1740 },
  { month: 'Aug', spent: 2210 },
  { month: 'Sep', spent: 2004 },
  { month: 'Oct', spent: 1842 },
];

/** The 10.3 reference screen: banner, balance, key figures with trends, a chart and recent activity. */
const page = (
  <DashboardPage
    as="div"
    title="Good morning, Mei"
    banner={
      <WelcomeBanner
        title="Two bills are due this week"
        description="Singtel on 2 Nov and SP Services on 4 Nov. Pay both now and you are done for the month."
        actions={<Button variant="tonal">Review bills</Button>}
      />
    }
    balance={{ value: 12480.32, currency: 'SGD', label: 'Total balance' }}
    quickActions={[
      { id: 'send', label: 'Send', icon: <Send size={18} />, onSelect: noop },
      { id: 'add', label: 'Add money', icon: <Plus size={18} />, onSelect: noop },
      { id: 'request', label: 'Request', icon: <ArrowDown size={18} />, onSelect: noop },
      { id: 'card', label: 'Card', icon: <CreditCard size={18} />, onSelect: noop },
    ]}
    stats={[
      { label: 'Spent this month', value: 'S$1,842', delta: '8%', deltaType: 'decrease', sentiment: 'positive', icon: <Receipt size={16} />, category: 'pink', trend: [22, 20, 21, 18, 19, 17, 16] },
      { label: 'Saved', value: 'S$2,400', delta: '12%', deltaType: 'increase', icon: <Wallet size={16} />, category: 'emerald', trend: [10, 12, 13, 15, 16, 19, 22] },
      { label: 'Invested', value: 'S$8,150', delta: '3%', deltaType: 'increase', icon: <TrendingUp size={16} />, category: 'violet', trend: [40, 41, 39, 42, 43, 43, 45] },
    ]}
    chart={{
      title: 'Spending',
      content: <BarChart title="Spending by month" data={spending} index="month" series={[{ key: 'spent', label: 'Spent' }]} size="sm" />,
    }}
    recent={[
      { id: '1', title: 'Grab', subtitle: 'Transport', amount: -18.4, currency: 'SGD', date: day(0, 9) },
      { id: '2', title: 'Salary', subtitle: 'Nexub Pte. Ltd.', amount: 6200, currency: 'SGD', date: day(0, 8) },
      { id: '3', title: 'FairPrice', subtitle: 'Groceries', amount: -86.15, currency: 'SGD', date: day(1) },
      { id: '4', title: 'Mei Tan', subtitle: 'Dinner split', amount: 42.5, currency: 'SGD', date: day(1, 20) },
    ]}
    onSelectTransaction={noop}
    onSeeAllActivity={noop}
    insights={[
      { id: 'i1', title: 'Transport is up 18%', body: 'You took 6 more rides than last month.', action: { label: 'See breakdown', onSelect: noop } },
      { id: 'i2', title: 'Savings goal: 80%', body: 'S$600 more reaches your December goal.' },
    ]}
  />
);

export const Default: Story = { render: () => page };

/** The same page under `data-expression="vivid"`, the default expression in apps. */
export const Vivid: Story = { render: () => <div data-expression="vivid">{page}</div> };

const stateNames = ['Loading', 'Empty', 'Error'] as const;

function DataStatesDemo() {
  const [state, setState] = React.useState<(typeof stateNames)[number]>('Loading');
  return (
    <div>
      <div role="group" aria-label="State" className="flex flex-wrap gap-2 px-4 pt-4">
        {stateNames.map((s) => (
          <Button key={s} size="sm" variant={s === state ? 'tonal' : 'outlined'} aria-pressed={s === state} onClick={() => setState(s)}>
            {s}
          </Button>
        ))}
      </div>
      <DashboardPage
        as="div"
        title="Good morning, Mei"
        balance={{ value: 12480.32, currency: 'SGD', label: 'Total balance' }}
        quickActions={[
          { id: 'send', label: 'Send', icon: <Send size={18} />, onSelect: noop },
          { id: 'add', label: 'Add money', icon: <Plus size={18} />, onSelect: noop },
        ]}
        chart={state === 'Loading' ? { title: 'Spending', content: null } : undefined}
        loading={state === 'Loading'}
        emptyState={<EmptyStatePreset kind="noData" size="sm" title="No activity yet" />}
        errorState={state === 'Error' ? <EmptyStatePreset kind="serverError" actions={<Button variant="tonal">Retry</Button>} /> : undefined}
      />
    </div>
  );
}

/** 10.5: `loading` draws skeletons for the balance, figures, chart and activity; `errorState` replaces the content. */
export const DataStates: Story = { render: () => <DataStatesDemo /> };
