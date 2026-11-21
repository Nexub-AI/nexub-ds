'use client';

import * as React from 'react';
import { MoreHorizontal } from '@nexub/icons';
import { Button, IconButton, TreeView, type TreeNode, type TreeViewHandle } from '@nexub/react';

const folders: TreeNode[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    trailing: '12',
    children: [
      { id: 'work', label: 'Work', trailing: '3', href: '#work' },
      {
        id: 'projects',
        label: 'Projects',
        children: [
          { id: 'atlas', label: 'Atlas', trailing: 'Mar 4', href: '#atlas' },
          { id: 'orbit', label: 'Orbit', trailing: 'Feb 12', href: '#orbit' },
        ],
      },
    ],
  },
  { id: 'sent', label: 'Sent', href: '#sent' },
  { id: 'archive', label: 'Archive', trailing: '1,204', href: '#archive' },
];

export default function Example() {
  const tree = React.useRef<TreeViewHandle>(null);
  const [opened, setOpened] = React.useState<string | null>(null);
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <TreeView
        ref={tree}
        aria-label="Folders"
        nodes={folders}
        defaultExpanded={['inbox']}
        onActivate={(node) => setOpened(String(node.label))}
        renderActions={(node) => (
          <IconButton size="xs" variant="ghost" label={`More for ${String(node.label)}`}>
            <MoreHorizontal size="sm" />
          </IconButton>
        )}
      />
      <Button size="sm" variant="outlined" onClick={() => tree.current?.scrollToNode('orbit', { focus: true })}>
        Reveal Orbit
      </Button>
      <p className="text-body-sm text-on-surface-muted">Opened: {opened ?? 'none (press Enter or double-click)'}</p>
    </div>
  );
}
