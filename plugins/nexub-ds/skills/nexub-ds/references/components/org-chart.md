# Org Chart

People top-down as cards joined by lines, keyboard navigable as a tree. A TreeView on narrow screens.

- Package: `@nexub/react` · Category: Data Display · Status: alpha
- Import: `import { OrgChart } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/org-chart

## When to use

- Reporting lines: a company, a team, a studio.
- Any small hierarchy people scan by face or name.

## When not to use

- Deep or wide data people search or check: use TreeView.
- Free-form graphs and workflows: use DiagramCanvas.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` (required) | `OrgChartNode[]` |  | The TreeView node shape plus `description` (the role line) and `avatar` (photo URL; initials without one). |
| `aria-label / aria-labelledby` (required) | `string` |  | Names the tree. |
| `expanded / defaultExpanded / onExpandedChange` | `string[]` |  | Open node ids. Shared with the narrow-screen TreeView. |
| `onActivate` | `(node) => void` |  | Click or Enter on a card, e.g. to open the profile. |
| `renderCard` | `(node) => ReactNode` |  | Replaces the card content; it also names the item. The reports control stays. |
| `className` | `string` |  | On the scroll box. Wide charts scroll sideways inside it. |

## Example: Default

```tsx
'use client';

import * as React from 'react';
import { OrgChart, type OrgChartNode } from '@nexub/react';

const people: OrgChartNode[] = [
  {
    id: 'ada',
    label: 'Ada Lovelace',
    description: 'Chief Executive',
    children: [
      {
        id: 'alan',
        label: 'Alan Turing',
        description: 'Engineering',
        children: [
          { id: 'grace', label: 'Grace Hopper', description: 'Platform lead' },
          { id: 'margaret', label: 'Margaret Hamilton', description: 'Flight software' },
        ],
      },
      { id: 'mary', label: 'Mary Somerville', description: 'Finance', children: [{ id: 'emmy', label: 'Emmy Noether', description: 'Analyst' }] },
      { id: 'katherine', label: 'Katherine Johnson', description: 'Research' },
    ],
  },
];

export default function Example() {
  const [opened, setOpened] = React.useState<string | null>(null);
  return (
    <div className="flex w-full flex-col gap-2">
      <OrgChart aria-label="Company" nodes={people} defaultExpanded={['ada', 'alan']} onActivate={(p) => setOpened(String(p.label))} />
      <p className="text-body-sm text-on-surface-muted">Opened: {opened ?? 'nobody yet'}</p>
    </div>
  );
}
```

## Example: Custom cards, controlled

```tsx
'use client';

import * as React from 'react';
import { Badge, OrgChart, type OrgChartNode } from '@nexub/react';

const teams: OrgChartNode[] = [
  {
    id: 'studio',
    label: 'Studio',
    description: '24 people',
    children: [
      { id: 'design', label: 'Design', description: '8 people' },
      { id: 'build', label: 'Build', description: '12 people', children: [{ id: 'web', label: 'Web', description: '7 people' }, { id: 'apps', label: 'Apps', description: '5 people' }] },
      { id: 'ops', label: 'Ops', description: '4 people' },
    ],
  },
];

export default function Example() {
  const [expanded, setExpanded] = React.useState<string[]>(['studio']);
  return (
    <OrgChart
      aria-label="Teams"
      nodes={teams}
      expanded={expanded}
      onExpandedChange={setExpanded}
      renderCard={(team) => (
        <span className="flex flex-col items-center gap-1">
          <span className="text-title-sm">{team.label}</span>
          <Badge variant="soft">{team.description}</Badge>
        </span>
      )}
    />
  );
}
```

## Accessibility

- Roles: tree, treeitem with aria-level, aria-setsize, aria-posinset, aria-expanded, group
- `ArrowDown / ArrowUp`: Next or previous visible card in tree order (depth first), as in TreeView, not by position on screen.
- `ArrowRight`: Opens a closed card, or moves to its first report. Mirrored in RTL.
- `ArrowLeft`: Closes an open card, or moves to its manager. Mirrored in RTL.
- `Home / End`: First or last visible card.
- `Enter`: Calls `onActivate`.
- `Space`: Opens or closes the card’s reports.
- The chart is one tab stop (roving tabindex); focus scrolls the card into view.
- Each item is named by its name and role only, not by its reports.
- The "3 reports" control is a pointer shortcut; keyboard and screen readers use the item’s expanded state.
- Below 768px the same nodes render as a TreeView (photo, name and role on one row).
- Connectors are CSS borders on logical sides, so RTL mirrors and forced colours keep them.

Related: [tree-view](tree-view.md), [avatar](avatar.md), [diagram-canvas](diagram-canvas.md)
