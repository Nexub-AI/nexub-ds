// 10.5 "Every state": the patterns that show data take the DataTable prop shape
// (loading, emptyState, errorState). The error wins over loading and empty.
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ActivityFeed } from './components/ActivityFeed/index.js';
import { InfoList } from './components/InfoList/index.js';
import { ListDetail } from './components/ListDetail/index.js';
import { NotificationCenter } from './components/NotificationCenter/index.js';
import { StatCard } from './components/StatCard/index.js';
import { UserCard } from './components/UserCard/index.js';
import { ActivityPage } from './components/ActivityPage/index.js';
import { DashboardPage } from './components/DashboardPage/index.js';
import { SettingsPage } from './components/SettingsPage/index.js';
import { TransactionDetailPage } from './components/TransactionDetailPage/index.js';
import type { Transaction } from './components/PageFrame/index.js';

const error = <p role="alert">Could not load</p>;
const empty = <p>Nothing yet</p>;
const tx: Transaction[] = [
  { id: '1', title: 'Coffee Lab', amount: -4.5, currency: 'SGD', date: new Date('2026-10-30T09:00:00Z') },
  { id: '2', title: 'Salary', amount: 5200, currency: 'SGD', date: new Date('2026-10-29T02:00:00Z') },
];
const skeletons = (root: ParentNode = document) => root.querySelectorAll('span[aria-hidden="true"].block, span[aria-hidden="true"].inline-block').length;

describe('data states', () => {
  it('ActivityFeed: loading rows, empty only when given, error wins', () => {
    const { rerender } = render(<ActivityFeed.Root loading loadingRows={2}><ActivityFeed.Item title="First" /></ActivityFeed.Root>);
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-busy', 'true');
    expect(list.children).toHaveLength(2);
    expect(screen.queryByText('First')).toBeNull();
    rerender(<ActivityFeed.Root />);
    expect(list).not.toHaveAttribute('aria-busy');
    expect(list).toBeEmptyDOMElement();
    rerender(<ActivityFeed.Root emptyState={empty} />);
    expect(screen.getByText('Nothing yet').parentElement!.tagName).toBe('LI');
    rerender(<ActivityFeed.Root emptyState={empty}><ActivityFeed.Item title="First" /></ActivityFeed.Root>);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.queryByText('Nothing yet')).toBeNull();
    rerender(<ActivityFeed.Root loading emptyState={empty} errorState={error} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(list).not.toHaveAttribute('aria-busy');
    expect(skeletons()).toBe(0);
  });

  it('InfoList: loading rows, empty only when given, error wins', () => {
    const { container, rerender } = render(<InfoList.Root loading><InfoList.Item label="Plan" value="Pro" /></InfoList.Root>);
    const dl = container.querySelector('dl')!;
    expect(dl).toHaveAttribute('aria-busy', 'true');
    expect(dl.children).toHaveLength(3);
    expect(screen.queryByText('Plan')).toBeNull();
    rerender(<InfoList.Root />);
    expect(container.querySelector('dl')).toBeEmptyDOMElement();
    rerender(<InfoList.Root emptyState={empty} className="box" />);
    expect(container.querySelector('dl')).toBeNull();
    expect(screen.getByText('Nothing yet').parentElement).toHaveClass('box');
    rerender(<InfoList.Root loading emptyState={empty} errorState={error}><InfoList.Item label="Plan" value="Pro" /></InfoList.Root>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(skeletons()).toBe(0);
    expect(screen.queryByText('Plan')).toBeNull();
  });

  it('ListDetail: the states show in the list pane', () => {
    const { rerender } = render(<ListDetail list={<p>Inbox</p>} detail={<p>Message</p>} loading />);
    const list = screen.getByRole('region', { name: 'List' });
    expect(list).toHaveAttribute('aria-busy', 'true');
    expect(list).not.toHaveTextContent('Inbox');
    expect(skeletons(list)).toBeGreaterThan(0);
    expect(screen.getByRole('region', { name: 'Detail', hidden: true })).toHaveTextContent('Message');
    rerender(<ListDetail list={<p>Inbox</p>} detail={<p>Message</p>} emptyState={empty} />);
    expect(list).toHaveTextContent('Nothing yet');
    expect(list).not.toHaveAttribute('aria-busy');
    rerender(<ListDetail list={<p>Inbox</p>} detail={<p>Message</p>} loading emptyState={empty} errorState={error} />);
    expect(list).toHaveTextContent('Could not load');
    expect(list).not.toHaveAttribute('aria-busy');
    expect(skeletons(list)).toBe(0);
  });

  it('NotificationCenter: loading, default and custom empty, error wins', async () => {
    const { rerender } = render(<NotificationCenter notifications={[{ id: '1', title: 'Invoice paid', read: true }]} loading />);
    await userEvent.click(screen.getByRole('button', { name: 'Notifications' }));
    const panel = screen.getByRole('dialog', { name: 'Notifications' });
    expect(panel).toHaveAttribute('aria-busy', 'true');
    expect(skeletons(panel)).toBeGreaterThan(0);
    expect(screen.queryByText('Invoice paid')).toBeNull();
    rerender(<NotificationCenter notifications={[]} emptyText="No news" />);
    expect(screen.getByText('No news')).toBeInTheDocument();
    expect(panel).not.toHaveAttribute('aria-busy');
    rerender(<NotificationCenter notifications={[]} emptyText="No news" emptyState={empty} />);
    expect(screen.getByText('Nothing yet')).toBeInTheDocument();
    expect(screen.queryByText('No news')).toBeNull();
    rerender(<NotificationCenter notifications={[]} loading emptyState={empty} errorState={error} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(panel).not.toHaveAttribute('aria-busy');
    expect(screen.queryByText('Nothing yet')).toBeNull();
  });

  it('StatCard and UserCard: loading keeps the card and hides the data', () => {
    const { container, rerender } = render(<StatCard label="Revenue" value="$12,345" delta="+12%" loading />);
    const card = container.firstElementChild!;
    expect(card).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.queryByText('$12,345')).toBeNull();
    expect(screen.getByText('+12%').parentElement).toHaveClass('invisible');
    expect(skeletons(card)).toBe(1);
    rerender(<StatCard label="Revenue" value="$12,345" delta="+12%" />);
    expect(card).not.toHaveAttribute('aria-busy');
    expect(screen.getByText('+12%').parentElement).not.toHaveClass('invisible');

    rerender(<UserCard name="Alice Smith" role="Admin" email="alice@example.com" size="lg" loading actions={<button type="button">Edit</button>} />);
    const user = container.firstElementChild!;
    expect(user).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Alice Smith')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(skeletons(user)).toBe(4);
    expect(user.querySelector('.rounded-full')).toHaveClass('size-12');
    rerender(<UserCard name="Alice Smith" loading />);
    expect(skeletons(container)).toBe(2);
  });

  it('ActivityPage: loading, default and custom empty (old and new prop), error wins', () => {
    const { rerender } = render(<ActivityPage transactions={tx} loading />);
    expect(screen.getByRole('main').querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(screen.queryByText('Coffee Lab')).toBeNull();
    expect(skeletons()).toBeGreaterThan(5);
    rerender(<ActivityPage transactions={[]} />);
    expect(screen.getByText('No activity yet')).toBeInTheDocument();
    rerender(<ActivityPage transactions={[]} empty={<p>Old empty</p>} />);
    expect(screen.getByText('Old empty')).toBeInTheDocument();
    rerender(<ActivityPage transactions={[]} empty={<p>Old empty</p>} emptyState={empty} />);
    expect(screen.getByText('Nothing yet')).toBeInTheDocument();
    expect(screen.queryByText('Old empty')).toBeNull();
    rerender(<ActivityPage transactions={tx} loading refreshing onRefresh={() => {}} errorState={error} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByText('Coffee Lab')).toBeNull();
    expect(skeletons()).toBe(0);
    expect(screen.getByRole('heading', { level: 1, name: 'Activity' })).toBeInTheDocument();
  });

  it('DashboardPage: loading skeletons for each slot, empty recent, error wins', () => {
    const base = { title: 'Home', balance: { value: 1250, currency: 'SGD' } };
    const chart = { title: 'Spending', content: <p>Chart body</p> };
    const { rerender } = render(<DashboardPage {...base} stats={[{ label: 'Saved', value: 'S$2,400' }]} chart={chart} recent={tx} insights={[{ id: 'i', title: 'Tip', body: 'Save more' }]} loading />);
    const page = screen.getByRole('main');
    expect(page).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.queryByText('S$2,400')).toBeNull();
    expect(screen.queryByText('Chart body')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Spending' })).toBeInTheDocument();
    expect(screen.queryByText('Coffee Lab')).toBeNull();
    expect(screen.queryByText('Tip')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Recent activity' })).toBeInTheDocument();
    // Nothing known yet: three placeholder figures.
    rerender(<DashboardPage {...base} loading />);
    expect(page.querySelectorAll('[data-nx="stat-card"]')).toHaveLength(3);
    rerender(<DashboardPage {...base} />);
    expect(page).not.toHaveAttribute('aria-busy');
    expect(screen.queryByRole('heading', { name: 'Recent activity' })).toBeNull();
    expect(page.querySelectorAll('[data-nx="stat-card"]')).toHaveLength(0);
    rerender(<DashboardPage {...base} emptyState={empty} />);
    expect(screen.getByRole('heading', { name: 'Recent activity' })).toBeInTheDocument();
    expect(screen.getByText('Nothing yet')).toBeInTheDocument();
    rerender(<DashboardPage {...base} recent={tx} emptyState={empty} />);
    expect(screen.queryByText('Nothing yet')).toBeNull();
    expect(screen.getByText('Coffee Lab')).toBeInTheDocument();
    rerender(<DashboardPage {...base} recent={tx} loading emptyState={empty} errorState={error} banner={<p>Banner</p>} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(page).not.toHaveAttribute('aria-busy');
    expect(screen.queryByText('Coffee Lab')).toBeNull();
    expect(screen.getByText('Banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeInTheDocument();
  });

  it('SettingsPage: loading groups, empty only when given, error wins', () => {
    const groups = [{ header: 'Security', items: [{ title: 'Change PIN', href: '#' }] }];
    const { rerender } = render(<SettingsPage groups={groups} header={<p>Profile</p>} loading />);
    const page = screen.getByRole('main');
    expect(page).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Change PIN')).toBeNull();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(skeletons(page)).toBeGreaterThan(4);
    rerender(<SettingsPage groups={[]} />);
    expect(page).not.toHaveAttribute('aria-busy');
    expect(skeletons(page)).toBe(0);
    rerender(<SettingsPage groups={[]} emptyState={empty} />);
    expect(screen.getByText('Nothing yet')).toBeInTheDocument();
    rerender(<SettingsPage groups={groups} emptyState={empty} />);
    expect(screen.getByText('Change PIN')).toBeInTheDocument();
    expect(screen.queryByText('Nothing yet')).toBeNull();
    rerender(<SettingsPage groups={groups} loading emptyState={empty} errorState={error} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(page).not.toHaveAttribute('aria-busy');
    expect(screen.queryByText('Change PIN')).toBeNull();
    expect(screen.getAllByRole('heading')).toHaveLength(1);
  });

  it('TransactionDetailPage: loading, default and custom empty, error wins', async () => {
    const { rerender } = render(<TransactionDetailPage transaction={tx[0]} loading onBack={() => {}} />);
    const page = screen.getByRole('main');
    expect(page).toHaveAttribute('aria-busy', 'true');
    expect(page).not.toHaveAttribute('aria-labelledby');
    expect(screen.queryByText('Coffee Lab')).toBeNull();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(skeletons(page)).toBeGreaterThan(4);
    rerender(<TransactionDetailPage />);
    expect(page).not.toHaveAttribute('aria-busy');
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    rerender(<TransactionDetailPage emptyState={empty} />);
    expect(screen.getByText('Nothing yet')).toBeInTheDocument();
    rerender(<TransactionDetailPage transaction={tx[0]} loading emptyState={empty} errorState={error} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(page).not.toHaveAttribute('aria-busy');
    expect(skeletons(page)).toBe(0);
    rerender(<TransactionDetailPage transaction={tx[0]} emptyState={empty} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Coffee Lab' })).toBeInTheDocument();
    expect(page).toHaveAttribute('aria-labelledby');
  });
});
