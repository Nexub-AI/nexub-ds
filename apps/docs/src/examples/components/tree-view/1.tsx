'use client';

import * as React from 'react';
import { TreeView, type TreeNode } from '@nexub/react';

const nodes: TreeNode[] = [
  {
    id: 'reports',
    label: 'Reports',
    children: [
      { id: 'revenue', label: 'Revenue' },
      { id: 'churn', label: 'Churn' },
    ],
  },
  { id: 'settings', label: 'Settings', children: [{ id: 'billing', label: 'Billing' }, { id: 'members', label: 'Members' }] },
];

export default function Example() {
  const [checked, setChecked] = React.useState<string[]>(['revenue']);
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <TreeView aria-label="Permissions" nodes={nodes} checkable defaultExpanded={['reports', 'settings']} checked={checked} onCheckedChange={setChecked} />
      <p className="text-body-sm text-[var(--color-on-surface-muted)]">Granted: {checked.join(', ') || 'nothing'}</p>
    </div>
  );
}
