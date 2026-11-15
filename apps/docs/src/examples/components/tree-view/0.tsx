'use client';

import * as React from 'react';
import { TreeView, type TreeNode } from '@nexub/react';

export default function Example() {
  const [nodes, setNodes] = React.useState<TreeNode[]>([
    {
      id: 'eng',
      label: 'Engineering',
      children: [
        { id: 'web', label: 'Web', children: [{ id: 'ada', label: 'Ada Lovelace' }, { id: 'alan', label: 'Alan Turing' }] },
        { id: 'mobile', label: 'Mobile', hasChildren: true },
      ],
    },
    { id: 'design', label: 'Design', children: [{ id: 'grace', label: 'Grace Hopper' }] },
  ]);
  const [selected, setSelected] = React.useState<string | null>('ada');

  // Pretend server call: fills Mobile's children the first time it opens.
  const load = async (node: TreeNode) => {
    await new Promise((r) => setTimeout(r, 700));
    const fill = (list: TreeNode[]): TreeNode[] =>
      list.map((n) =>
        n.id === node.id
          ? { ...n, children: [{ id: 'linus', label: 'Linus Torvalds' }, { id: 'margaret', label: 'Margaret Hamilton' }] }
          : { ...n, children: n.children && fill(n.children) },
      );
    setNodes(fill);
  };

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <TreeView aria-label="Teams" nodes={nodes} defaultExpanded={['eng', 'web']} selected={selected} onSelectedChange={setSelected} onLoadChildren={load} />
      <p className="text-body-sm text-[var(--color-on-surface-muted)]">Selected: {selected ?? 'none'}</p>
    </div>
  );
}
