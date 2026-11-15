import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { NotificationCenter } from './NotificationCenter.js';

describe('NotificationCenter', () => {
  it('names the unread count, opens the list, opens and marks all read', async () => {
    const onOpen = vi.fn();
    const onMarkAllRead = vi.fn();
    render(
      <NotificationCenter
        notifications={[
          { id: '1', title: 'Invoice paid' },
          { id: '2', title: 'New comment', read: true },
          { id: '3', title: 'Deploy failed' },
        ]}
        onOpen={onOpen}
        onMarkAllRead={onMarkAllRead}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Notifications, 2 unread' }));
    expect(screen.getByRole('dialog', { name: 'Notifications' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Deploy failed' }));
    expect(onOpen).toHaveBeenCalledWith('3');
    await userEvent.click(screen.getByRole('button', { name: 'Mark all as read' }));
    expect(onMarkAllRead).toHaveBeenCalled();
  });

  it('shows the empty text', async () => {
    render(<NotificationCenter notifications={[]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Notifications' }));
    expect(screen.getByText('You’re all caught up')).toBeInTheDocument();
  });
});
