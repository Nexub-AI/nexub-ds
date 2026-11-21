# Tree View

A keyboard-friendly hierarchy (ARIA tree) with lazy children and tri-state checkboxes.

- Package: `@nexub/react` · Category: Navigation · Status: beta
- Import: `import { TreeView } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/tree-view

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` (required) | `TreeNode[]` |  | `{ id, label, textValue?, icon?, children?, hasChildren?, disabled?, trailing?, href? }`. `trailing` (11.5) is meta at the row end, e.g. a count or a date. `href` (11.5) makes the row a link: click and Enter follow it, Cmd/Ctrl-click and middle-click open a new tab. |
| `aria-label / aria-labelledby` (required) | `string` |  | Names the tree. |
| `expanded / defaultExpanded / onExpandedChange` | `string[]` |  | Open node ids. |
| `selected / defaultSelected / onSelectedChange` | `string \| null` |  | Single selection, set by click, Enter or Space. |
| `onActivate` | `(node) => void` |  | 11.5. Opens a node: Enter or double-click. Separate from selection, which click and Space set (Enter selects too). Disabled nodes never activate. |
| `renderActions` | `(node) => ReactNode` |  | 11.5. Row actions, shown on hover and focus and always on touch screens. Their space is always reserved, so rows never shift. Tab from the focused row reaches them; the item is named by its label and `trailing` only. |
| `ref` | `Ref<TreeViewHandle>` |  | 11.5. `scrollToNode(id, { focus? })` opens the node's ancestors, then scrolls its row into view (and focuses it). |
| `checkable` | `boolean` |  | Checkboxes instead of selection. A parent is checked when all its children are and mixed when some are. |
| `checked / defaultChecked / onCheckedChange` | `string[]` |  | Every checked id, parents included. |
| `onLoadChildren` | `(node) => Promise` |  | Called when a `hasChildren` node without `children` opens. Load them and pass the new `nodes`; the item is `aria-busy` meanwhile. |

## Example: Lazy loading and selection

```tsx
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
      <p className="text-body-sm text-on-surface-muted">Selected: {selected ?? 'none'}</p>
    </div>
  );
}
```

## Example: Checkboxes

```tsx
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
      <p className="text-body-sm text-on-surface-muted">Granted: {checked.join(', ') || 'nothing'}</p>
    </div>
  );
}
```

## Example: Actions, meta, links and scrollToNode

```tsx
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
```

## Accessibility

- Roles: tree, treeitem with aria-level, aria-setsize, aria-posinset, aria-expanded, group
- `ArrowDown / ArrowUp`: Next or previous visible item.
- `ArrowRight`: Opens a closed item, or moves to its first child. Mirrored in RTL.
- `ArrowLeft`: Closes an open item, or moves to its parent. Mirrored in RTL.
- `Home / End`: First or last visible item.
- `Enter`: Selects the item (or toggles its checkbox), calls `onActivate` and follows a link node.
- `Space`: Selects the item, or toggles its checkbox.
- `Tab`: From the focused item to its row actions (`renderActions`), then out of the tree.
- `Type a letter`: Moves to the next item starting with the typed text.
- The tree is one tab stop (roving tabindex); it returns to the last focused or the selected item.

Related: [data-table](data-table.md), [sidebar](sidebar.md)
