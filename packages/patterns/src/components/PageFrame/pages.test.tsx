import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { NexubProvider, Switch } from '@nexub/react';
import { ActivityPage } from '../ActivityPage/index.js';
import { TransactionDetailPage } from '../TransactionDetailPage/index.js';
import { SettingsPage } from '../SettingsPage/index.js';
import { SignInPage } from '../SignInPage/index.js';
import { CheckoutPage } from '../CheckoutPage/index.js';
import { ChatPage } from '../ChatPage/index.js';
import { PaywallPage } from '../PaywallPage/index.js';
import { DashboardPage } from '../DashboardPage/index.js';
import { groupByDay, usePageMessages, type Transaction } from './PageFrame.js';

const tx: Transaction[] = [
  { id: '1', title: 'Coffee Lab', amount: -4.5, currency: 'SGD', date: new Date('2026-10-30T09:00:00Z') },
  { id: '2', title: 'Salary', subtitle: 'Acme Pte Ltd', amount: 5200, currency: 'SGD', date: new Date('2026-10-29T02:00:00Z') },
  { id: '3', title: 'Grab', amount: -12.3, currency: 'SGD', date: new Date('2026-10-30T12:00:00Z'), status: 'pending' },
];

describe('PageFrame helpers', () => {
  it('groups transactions by day, newest first', () => {
    const groups = groupByDay(tx, 'en-SG');
    expect(groups).toHaveLength(2);
    expect(groups[0]!.data.map((t) => t.id)).toEqual(['3', '1']);
  });

  it('merges messages: defaults ← provider ← prop, ignoring wrong kinds', () => {
    let m: ReturnType<typeof usePageMessages> | undefined;
    function Probe() {
      m = usePageMessages({ seeAll: 'View all' });
      return null;
    }
    render(
      <NexubProvider locale="en" messages={{ activity: 'Aktivität', balance: 'not a function' } as never}>
        <Probe />
      </NexubProvider>,
    );
    expect(m!.activity).toBe('Aktivität');
    expect(m!.seeAll).toBe('View all');
    expect(m!.balance('$1')).toBe('Balance $1');
  });

  it('every template renders on the server', () => {
    const html = renderToString(
      <>
        <ActivityPage transactions={tx} />
        <DashboardPage title="Home" balance={{ value: 10, currency: 'SGD' }} recent={tx} />
      </>,
    );
    expect(html).toContain('Coffee Lab');
  });
});

describe('ActivityPage', () => {
  it('is a main landmark with day sections and selectable rows', async () => {
    const onSelect = vi.fn();
    render(<ActivityPage transactions={tx} onSelect={onSelect} />);
    expect(screen.getByRole('main', { name: 'Activity' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
    await userEvent.click(screen.getByRole('button', { name: /Salary/ }));
    expect(onSelect).toHaveBeenCalledWith(tx[1]);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows the empty state, refresh and load more', async () => {
    const onLoadMore = vi.fn();
    const { rerender } = render(<ActivityPage transactions={[]} />);
    expect(screen.getByText('No activity yet')).toBeInTheDocument();
    rerender(<ActivityPage transactions={tx} onRefresh={() => {}} onLoadMore={onLoadMore} hasMore />);
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(onLoadMore).toHaveBeenCalled();
  });
});

describe('TransactionDetailPage', () => {
  it('names the page by the transaction and lists the rows', async () => {
    const onBack = vi.fn();
    render(<TransactionDetailPage transaction={tx[1]!} rows={[{ label: 'Reference', value: 'PAY-42' }]} onBack={onBack} />);
    expect(screen.getByRole('main', { name: 'Salary' })).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('PAY-42')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalled();
  });
});

describe('SettingsPage', () => {
  it('renders groups with navigation, link, control and destructive rows', async () => {
    const onSelect = vi.fn();
    render(
      <SettingsPage
        groups={[
          {
            header: 'Account',
            footer: 'Visible to your contacts.',
            items: [
              { title: 'Profile', onSelect },
              { title: 'Language', value: 'English', href: '/settings/language' },
              { title: 'Notifications', control: <Switch aria-label="Notifications" /> },
            ],
          },
          { items: [{ title: 'Sign out', destructive: true, onSelect: () => {} }] },
        ]}
      />,
    );
    expect(screen.getByRole('main', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Account' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Profile' }));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.getByRole('link', { name: /Language/ })).toHaveAttribute('href', '/settings/language');
    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument();
  });
});

describe('SignInPage', () => {
  it('submits email and password with autofill hints', async () => {
    const onSubmit = vi.fn();
    render(<SignInPage onSubmit={onSubmit} onBiometric={() => {}} biometricLabel="Sign in with a passkey" error="Wrong password" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Wrong password');
    const email = screen.getByLabelText(/Email/);
    expect(email).toHaveAttribute('autocomplete', 'username webauthn');
    await userEvent.type(email, 'mei@example.com');
    await userEvent.type(screen.getByLabelText(/Password/), 'hunter22');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(onSubmit).toHaveBeenCalledWith('mei@example.com', 'hunter22');
    expect(screen.getByRole('button', { name: 'Sign in with a passkey' })).toBeInTheDocument();
  });
});

describe('CheckoutPage', () => {
  const props = {
    from: 'SGD',
    to: 'MYR',
    balance: 100,
    quote: () => ({ fee: 1, rate: 3.5, arrives: 'In seconds' }),
    confirmLabel: 'Confirm and send',
    onDone: () => {},
  };

  it('blocks amounts over the balance', async () => {
    render(<CheckoutPage {...props} onConfirm={() => {}} />);
    await userEvent.type(screen.getByLabelText('Amount to send'), '150');
    expect(screen.getByText(/More than your balance/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it('goes amount → review → done', async () => {
    const onConfirm = vi.fn();
    render(<CheckoutPage {...props} onConfirm={onConfirm} />);
    await userEvent.type(screen.getByLabelText('Amount to send'), '50');
    expect(screen.getByText('In seconds')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Check the details' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Confirm and send' }));
    expect(onConfirm).toHaveBeenCalledWith(50);
    expect(await screen.findByRole('heading', { name: 'Sent' })).toBeInTheDocument();
  });

  it('stays on review and shows the error when confirming fails', async () => {
    render(<CheckoutPage {...props} onConfirm={() => Promise.reject(new Error('Card declined'))} />);
    await userEvent.type(screen.getByLabelText('Amount to send'), '20');
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await userEvent.click(screen.getByRole('button', { name: 'Confirm and send' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Card declined');
    expect(screen.getByRole('heading', { name: 'Check the details' })).toBeInTheDocument();
  });
});

describe('ChatPage', () => {
  it('lists messages and sends from the composer', async () => {
    const onSend = vi.fn();
    render(
      <div style={{ height: 600 }}>
        <ChatPage
          messages={[
            { id: '1', role: 'user', text: 'Hi' },
            { id: '2', role: 'assistant', text: 'Hello! How can I help?' },
          ]}
          onSend={onSend}
        />
      </div>,
    );
    expect(screen.getByRole('main', { name: 'Chat' })).toBeInTheDocument();
    expect(screen.getByText('Hello! How can I help?')).toBeInTheDocument();
    const box = screen.getByRole('textbox');
    await userEvent.type(box, 'Send SGD 20 to Mei{Enter}');
    expect(onSend).toHaveBeenCalledWith('Send SGD 20 to Mei');
  });

  it('shows the empty message', () => {
    render(<ChatPage messages={[]} onSend={() => {}} empty="Ask about your spending" />);
    expect(screen.getByText('Ask about your spending')).toBeInTheDocument();
  });
});

describe('PaywallPage', () => {
  it('chooses a plan as a radio, then continues', async () => {
    const onSubscribe = vi.fn();
    render(
      <PaywallPage
        title="Go Plus"
        plans={[
          { id: 'm', name: 'Monthly', price: '$9.99 / month', features: ['No fees'] },
          { id: 'y', name: 'Yearly', price: '$99 / year', features: ['No fees', '2 months free'], badge: 'Best value' },
        ]}
        onSubscribe={onSubscribe}
        onRestore={() => {}}
        terms="Renews automatically."
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'Choose a plan' });
    expect(within(group).getAllByRole('radio')).toHaveLength(2);
    await userEvent.click(within(group).getAllByRole('radio')[1]!);
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onSubscribe).toHaveBeenCalledWith('y');
    expect(screen.getByRole('button', { name: 'Restore purchases' })).toBeInTheDocument();
  });
});

describe('DashboardPage', () => {
  it('shows balance, quick actions, stats, recent activity and insights', async () => {
    const send = vi.fn();
    const seeAll = vi.fn();
    render(
      <DashboardPage
        title="Good morning, Mei"
        balance={{ value: 1280.5, currency: 'SGD' }}
        quickActions={[{ id: 'send', label: 'Send', onSelect: send }]}
        stats={[{ label: 'Spent this month', value: '$420' }]}
        recent={tx}
        onSeeAllActivity={seeAll}
        insights={[{ id: 'i1', title: 'Spending is down', body: '12% less than last month.' }]}
      />,
    );
    expect(screen.getByRole('main', { name: 'Good morning, Mei' })).toBeInTheDocument();
    expect(screen.getByText('Total balance')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(send).toHaveBeenCalled();
    expect(screen.getByText('Spent this month')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'See all' }));
    expect(seeAll).toHaveBeenCalled();
    expect(screen.getByRole('heading', { level: 3, name: 'Spending is down' })).toBeInTheDocument();
  });
});
