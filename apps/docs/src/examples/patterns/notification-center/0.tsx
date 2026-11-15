'use client';

import * as React from 'react';
import { NotificationCenter, type NotificationCenterItem } from '@nexub/patterns';

export default function Example() {
  const [items, setItems] = React.useState<NotificationCenterItem[]>([
    { id: '1', title: 'Deploy failed on main', description: 'Build step "test" exited with 1.', timestamp: '2 min ago' },
    { id: '2', title: 'Invoice #1042 paid', timestamp: '1 h ago' },
    { id: '3', title: 'Ada commented on Q4 plan', timestamp: 'Yesterday', read: true },
  ]);
  const markRead = (id?: string) => setItems((list) => list.map((n) => (!id || n.id === id ? { ...n, read: true } : n)));
  return (
    <NotificationCenter
      notifications={items}
      onOpen={(id) => markRead(id)}
      onDismiss={(id) => setItems((list) => list.filter((n) => n.id !== id))}
      onMarkAllRead={() => markRead()}
    />
  );
}
