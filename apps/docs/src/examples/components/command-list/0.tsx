'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { CommandList } from '@nexub/react';

const items = [
  { value: 'invoice', label: 'New invoice', group: 'Create', keywords: ['bill'] },
  { value: 'customer', label: 'New customer', group: 'Create' },
  { value: 'reports', label: 'Reports', description: 'Revenue, cash flow and tax', group: 'Go to' },
  { value: 'settings', label: 'Settings', group: 'Go to', shortcut: ['⌘', ','] },
];

export default function Example() {
  const [picked, setPicked] = React.useState('');
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <div className="rounded-shape-container border border-outline-variant">
        <CommandList items={items} onSelect={setPicked} autoFocus={false} />
      </div>
      <p className="text-body-sm text-on-surface-muted">Picked: {picked || '—'}</p>
    </div>
  );
}
