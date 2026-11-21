# Resource Timeline

One row per person, days across: rosters, team leave and allocation, with totals in the footer.

- Package: `@nexub/react` · Category: Data Display · Status: alpha
- Import: `import { ResourceTimeline } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/resource-timeline

## When to use

- Who is where, day by day: rosters, leave, shifts, allocation.
- A few weeks across and up to a few dozen people.

## When not to use

- Events at times of day: use EventCalendar.
- Rows with many fields that sort and filter: use DataTable.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the table, e.g. "Team leave, November". |
| `resources` (required) | `TimelineResource[]` |  | `{ id, label, description?, avatar? }`, one row each. The first column stays put while the days scroll. |
| `range` (required) | `{ from: Date; to: Date }` |  | The days shown, both ends included. |
| `getCell` | `(resourceId, date) => { value?, tone? } \| undefined` |  | A cell’s content. `tone` (neutral, primary, success, warning, error, info) colours it; `value` must say what it means too. |
| `onCellActivate` | `(resourceId, date, cell: HTMLElement) => void` |  | Makes the cells a grid: arrow keys move between them, Enter, Space or a click calls this, e.g. to open your editor anchored to `cell`. |
| `footer` | `(date) => ReactNode` |  | A totals row: one cell per day. |
| `rowTotal / grandTotal` | `(resourceId) => ReactNode / ReactNode` |  | A total column at the end, and its footer cell. |
| `resourceHeader` | `ReactNode` | `"Name"` | The first column’s header. |
| `weekend` | `number[]` | `[0, 6]` | Days of the week shaded as weekend (0 = Sunday). |
| `now` | `Date` | `new Date()` | Marks today. Pin it in tests and screenshots. |

## Example: Team leave

Enter or a click on a cell toggles leave; your app opens its own editor there.

```tsx
import * as React from 'react';
import { Avatar, ResourceTimeline, type ResourceCell } from '@nexub/react';

// A fixed fortnight, so the page renders the same on the server and in every time zone.
const range = { from: new Date(2026, 10, 2), to: new Date(2026, 10, 15) };
const people = [
  { id: 'ana', label: 'Ana Lima', description: 'Design' },
  { id: 'ben', label: 'Ben Ode', description: 'Engineering' },
  { id: 'cho', label: 'Cho Park', description: 'Support' },
].map((p) => ({ ...p, avatar: <Avatar size="sm" name={p.label} /> }));
const leave: ResourceCell = { value: 'AL', tone: 'info' };

export default function Example() {
  const [cells, setCells] = React.useState<Record<string, ResourceCell>>({ 'ana-3': leave, 'ana-4': leave, 'ben-10': { value: 'Sick', tone: 'warning' } });
  const count = (match: (key: string) => boolean) => Object.keys(cells).filter(match).length;
  return (
    <div className="w-full">
      <ResourceTimeline
        label="Team leave, November 2026"
        resources={people}
        range={range}
        now={new Date(2026, 10, 9)}
        getCell={(id, date) => cells[`${id}-${date.getDate()}`]}
        onCellActivate={(id, date) =>
          setCells((c) => {
            const key = `${id}-${date.getDate()}`;
            const { [key]: had, ...rest } = c;
            return had ? rest : { ...c, [key]: leave };
          })
        }
        footer={(date) => count((k) => k.endsWith(`-${date.getDate()}`)) || ''}
        rowTotal={(id) => count((k) => k.startsWith(`${id}-`))}
        grandTotal={Object.keys(cells).length}
      />
    </div>
  );
}
```

## Example: Read-only roster

Without `onCellActivate` it is a plain table, and the scroller takes focus so the days can be scrolled.

```tsx
import { ResourceTimeline } from '@nexub/react';

const range = { from: new Date(2026, 10, 9), to: new Date(2026, 10, 15) };
const people = [
  { id: 'ana', label: 'Ana Lima' },
  { id: 'ben', label: 'Ben Ode' },
];
const shifts: Record<string, string> = { 'ana-9': 'Early', 'ana-10': 'Early', 'ben-11': 'Late', 'ben-12': 'Late', 'ben-14': 'On call' };

export default function Example() {
  return (
    <div className="w-full">
      <ResourceTimeline
        label="Support rota"
        resources={people}
        range={range}
        now={new Date(2026, 10, 9)}
        resourceHeader="Agent"
        getCell={(id, date) => {
          const value = shifts[`${id}-${date.getDate()}`];
          return value ? { value, tone: value === 'On call' ? 'warning' : 'neutral' } : undefined;
        }}
      />
    </div>
  );
}
```

## Accessibility

- `Tab`: Enters the grid at the last focused cell (one Tab stop).
- `Arrow keys`: Move between people and days (left and right follow the reading direction).
- `Home / End`: First or last day in the row; with Ctrl, the first or last cell.
- `Enter / Space / F2`: Calls `onCellActivate` for the cell.
- A real table: column headers read the full date, row headers the person, so each cell is announced with both.
- With `onCellActivate` the table has `role="grid"` and roving focus; without it, a plain table in a focusable scroll region.
- Today’s header has `aria-current="date"` and a filled day number; weekends are shaded and still read their weekday.

Related: [event-calendar](event-calendar.md), [data-table](data-table.md)
