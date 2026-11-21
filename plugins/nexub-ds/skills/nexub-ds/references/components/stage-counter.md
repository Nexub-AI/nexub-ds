# Stage Counter

A row of selectable stat cards, each with a count and a failed count, that filters a list.

- Package: `@nexub/react` · Category: Data Display · Status: alpha
- Import: `import { StageCounter } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/stage-counter

## When to use

- Counts per stage above a list of jobs, imports or orders, where pressing a stage filters the list.

## When not to use

- Counts that do not filter anything: use StatCard.
- Switching between views: use Tabs or SegmentedControl.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `stages` (required) | `StageCounterStage[]` |  | `{ value, label, count, failed?, tone? }`. `failed` shows "3 failed" in the danger tone; `tone` colours the count. |
| `value / defaultValue` | `string \| null` |  | The selected stage, `null` for all. Pressing the selected stage again clears it. |
| `onValueChange` | `(value: string \| null) => void` |  | Called with the new stage, or `null`. |
| `multiple` | `boolean` | `false` | Several stages at once: `value` is a `string[]`, an empty array means all. |
| `aria-label` | `string` |  | Names the group, e.g. "Filter by stage". |

## Example: Filters a list

```tsx
import * as React from 'react';
import { StageCounter } from '@nexub/react';

const stages = [
  { value: 'queued', label: 'Queued', count: 24 },
  { value: 'processing', label: 'Processing', count: 6, tone: 'info' as const },
  { value: 'review', label: 'In review', count: 3, tone: 'warning' as const },
  { value: 'done', label: 'Done', count: 1284, failed: 7 },
];

const jobs = [
  { id: 101, stage: 'queued' },
  { id: 102, stage: 'processing' },
  { id: 103, stage: 'review' },
  { id: 104, stage: 'done' },
  { id: 105, stage: 'queued' },
];

export default function Example() {
  const [stage, setStage] = React.useState<string | null>(null);
  const shown = stage ? jobs.filter((j) => j.stage === stage) : jobs;
  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <StageCounter aria-label="Filter imports by stage" stages={stages} value={stage} onValueChange={setStage} />
      <ul className="m-0 flex flex-col gap-1 ps-4 text-body-md text-on-surface">
        {shown.map((j) => (
          <li key={j.id}>
            Import #{j.id} · {stages.find((s) => s.value === j.stage)?.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Example: Several stages

```tsx
import { StageCounter } from '@nexub/react';

export default function Example() {
  return (
    <StageCounter
      aria-label="Filter orders by stage"
      multiple
      defaultValue={['new', 'packing']}
      stages={[
        { value: 'new', label: 'New', count: 18 },
        { value: 'packing', label: 'Packing', count: 7 },
        { value: 'shipped', label: 'Shipped', count: 342, failed: 2 },
        { value: 'returned', label: 'Returned', count: 4, tone: 'danger' },
      ]}
    />
  );
}
```

## Accessibility

- Roles: `group` named by `aria-label`; each card is a toggle `button` with `aria-pressed`.
- `Tab`: Moves between the stages.
- `Enter / Space`: Selects or clears the stage.
- The failed count is written out ("3 failed"), not shown by colour alone. Cards wrap on small screens.

Related: [stat-card](stat-card.md), [segmented-control](segmented-control.md), [filter-bar](filter-bar.md), [toggle-group](toggle-group.md)
