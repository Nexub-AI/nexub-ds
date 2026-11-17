import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { NotificationsPage, type NotificationsPageItem } from './index.js';

const now = new Date(2026, 10, 17, 15, 0);
const items: NotificationsPageItem[] = [
  { id: '1', title: 'Invoice paid', description: 'Northwind paid INV-2041.', timestamp: '2:10 pm', date: new Date(2026, 10, 17, 14, 10), href: '/invoices/2041' },
  { id: '2', title: 'New comment', date: new Date(2026, 10, 16, 9, 0), read: true },
  { id: '3', title: 'Export ready', date: new Date(2026, 10, 12, 9, 0), read: true },
];

describe('NotificationsPage', () => {
  it('is a main landmark with day groups; unread is marked with a named dot', async () => {
    const onOpen = vi.fn();
    const onDismiss = vi.fn();
    const onMarkRead = vi.fn();
    render(<NotificationsPage notifications={items} now={now} onOpen={onOpen} onDismiss={onDismiss} onMarkRead={onMarkRead} />);
    expect(screen.getByRole('main', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Today', 'Yesterday', expect.stringContaining('12')]);
    const today = screen.getByRole('region', { name: 'Today' });
    expect(within(today).getByRole('img', { name: 'Unread' })).toBeInTheDocument();
    expect(within(screen.getByRole('region', { name: 'Yesterday' })).queryByRole('img', { name: 'Unread' })).toBeNull();
    const link = within(today).getByRole('link', { name: 'Invoice paid' });
    link.addEventListener('click', (e) => e.preventDefault());
    await userEvent.click(link);
    expect(onOpen).toHaveBeenCalledWith('1');
    await userEvent.click(screen.getByRole('button', { name: 'Mark as read: Invoice paid' }));
    expect(onMarkRead).toHaveBeenCalledWith('1', true);
    await userEvent.click(screen.getByRole('button', { name: 'Mark as unread: New comment' }));
    expect(onMarkRead).toHaveBeenCalledWith('2', false);
    await userEvent.click(screen.getAllByRole('button', { name: 'Dismiss notification' })[0]!);
    expect(onDismiss).toHaveBeenCalledWith('1');
  });

  it('without `now` every group shows its date; undated items come first without a heading', () => {
    render(<NotificationsPage notifications={[...items, { id: '4', title: 'Welcome' }]} />);
    expect(screen.queryByText('Today')).toBeNull();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Welcome');
  });

  it('filters by the Unread tab, reports tab changes and takes custom tabs', async () => {
    const onTabChange = vi.fn();
    const { rerender } = render(<NotificationsPage notifications={items} onTabChange={onTabChange} />);
    expect(screen.getByRole('tab', { name: /Unread/ })).toHaveTextContent('1');
    await userEvent.click(screen.getByRole('tab', { name: /Unread/ }));
    expect(onTabChange).toHaveBeenCalledWith('unread');
    expect(screen.getByText('Invoice paid')).toBeInTheDocument();
    expect(screen.queryByText('New comment')).toBeNull();
    rerender(
      <NotificationsPage
        notifications={items}
        tab="mentions"
        tabs={[
          { id: 'all', label: 'All' },
          { id: 'mentions', label: 'Mentions', count: 0 },
        ]}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Mentions' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('New comment')).toBeInTheDocument();
    rerender(<NotificationsPage notifications={items} tabs={[{ id: 'all', label: 'All' }]} />);
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('header actions: mark all read, settings link or button, and Load more', async () => {
    const onMarkAllRead = vi.fn();
    const onOpenSettings = vi.fn();
    const onLoadMore = vi.fn();
    const { rerender } = render(
      <NotificationsPage notifications={items} onMarkAllRead={onMarkAllRead} onOpenSettings={onOpenSettings} onLoadMore={onLoadMore} hasMore actions={<button type="button">Filter</button>} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Mark all as read' }));
    expect(onMarkAllRead).toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(onOpenSettings).toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(onLoadMore).toHaveBeenCalled();
    rerender(<NotificationsPage notifications={items.slice(1)} onMarkAllRead={onMarkAllRead} settingsHref="/settings/notifications" onLoadMore={onLoadMore} />);
    expect(screen.queryByRole('button', { name: 'Mark all as read' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings/notifications');
    expect(screen.queryByRole('button', { name: 'Load more' })).toBeNull();
  });

  it('data states: loading, the friendly empty state, a custom one, and error wins', () => {
    const { rerender } = render(<NotificationsPage notifications={[]} loading />);
    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull();
    rerender(<NotificationsPage notifications={[]} />);
    expect(screen.getByText('You are all caught up')).toBeInTheDocument();
    rerender(<NotificationsPage notifications={[]} emptyState={<p>Quiet in here</p>} />);
    expect(screen.getByText('Quiet in here')).toBeInTheDocument();
    rerender(<NotificationsPage notifications={items} loading errorState={<p role="alert">Could not load</p>} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByText('Invoice paid')).toBeNull();
  });
});
