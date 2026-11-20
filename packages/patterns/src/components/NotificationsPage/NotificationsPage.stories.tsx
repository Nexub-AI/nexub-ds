import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { NotificationsPage, type NotificationsPageItem } from './NotificationsPage.js';

const meta: Meta<typeof NotificationsPage> = {
  title: 'Patterns/Pages/NotificationsPage',
  component: NotificationsPage,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof NotificationsPage>;

// A fixed "today", so the Today / Yesterday headings and screenshots are stable.
const NOW = new Date(2026, 10, 17, 15, 0);
const initial: NotificationsPageItem[] = [
  { id: '1', title: 'Invoice INV-2041 was paid', description: 'Northwind Traders paid $6,183.00.', timestamp: '2:10 pm', date: new Date(2026, 10, 17, 14, 10) },
  { id: '2', title: 'Idris Cole mentioned you', description: '“Can you check the audit notes before Friday?”', timestamp: '9:42 am', date: new Date(2026, 10, 17, 9, 42) },
  { id: '3', title: 'Your export is ready', description: 'Projects, 214 rows.', timestamp: '4:30 pm', date: new Date(2026, 10, 16, 16, 30), read: true },
  { id: '4', title: 'Mina Sato joined the team', timestamp: '11:05 am', date: new Date(2026, 10, 12, 11, 5), read: true },
];

function Demo() {
  const [items, setItems] = React.useState(initial);
  return (
    <NotificationsPage
      as="div"
      notifications={items}
      now={NOW}
      onOpen={() => {}}
      onMarkRead={(id, read) => setItems((list) => list.map((n) => (n.id === id ? { ...n, read } : n)))}
      onMarkAllRead={() => setItems((list) => list.map((n) => ({ ...n, read: true })))}
      onDismiss={(id) => setItems((list) => list.filter((n) => n.id !== id))}
      onOpenSettings={() => {}}
      onLoadMore={() => {}}
      hasMore
    />
  );
}

/** Tabs, day groups, read toggles and Load more. */
export const Default: Story = { render: () => <Demo /> };

/** Nothing to read: the friendly empty state. */
export const Empty: Story = { render: () => <NotificationsPage as="div" notifications={[]} now={NOW} onOpenSettings={() => {}} /> };
