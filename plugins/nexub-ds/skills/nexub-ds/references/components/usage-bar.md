# Usage Bar

A compact used-of-limit bar with its label inline, for table cells and fact grids.

- Package: `@nexub/react` · Category: Data Display · Status: alpha
- Import: `import { UsageBar } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/usage-bar

## When to use

- A usage column in a table (seats per workspace, quota per key).
- A row in a DescriptionList or fact grid.

## When not to use

- The headline of a tile: use UsageTile.
- A task moving toward done: use Progress.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `used` (required) | `number` |  | The amount used. |
| `limit` (required) | `number \| null` |  | The limit. `null` or `Infinity` shows the value and "Unlimited", no bar. |
| `label` | `ReactNode \| false` | `"used / limit"` | The inline text beside the bar. `false` hides it. |
| `aria-label` | `string` |  | Names the meter, e.g. "Seats". Without it the meter is named by its value. |
| `size` | `'sm' \| 'md'` | `'sm'` | Bar thickness and label size. |
| `warnAt` | `number` | `0.8` | Share of the limit that turns the bar to the warning tone; at or over the limit it is the danger tone. |
| `valueFormat` | `(value: number) => string` | `toLocaleString` | Formats the value and the limit. |

## Example: Levels

```tsx
import { UsageBar } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <UsageBar aria-label="Seats" used={18} limit={50} />
      <UsageBar aria-label="Seats" used={42} limit={50} />
      <UsageBar aria-label="Seats" used={50} limit={50} />
      <UsageBar aria-label="Projects" used={7} limit={null} />
    </div>
  );
}
```

## Example: In a table

```tsx
import { Table, UsageBar } from '@nexub/react';

const workspaces = [
  { name: 'Marketing', seats: 18, limit: 25 },
  { name: 'Finance', seats: 9, limit: 10 },
  { name: 'Support', seats: 30, limit: 30 },
];

export default function Example() {
  return (
    <Table.Root className="w-full max-w-120">
      <Table.Header>
        <Table.Row>
          <Table.Head>Workspace</Table.Head>
          <Table.Head>Seats</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {workspaces.map((w) => (
          <Table.Row key={w.name}>
            <Table.Cell>{w.name}</Table.Cell>
            <Table.Cell>
              <UsageBar aria-label={`${w.name} seats`} used={w.seats} limit={w.limit} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
```

## Accessibility

- Roles: A `meter` with `aria-valuenow` as the percentage and `aria-valuetext` such as "42 of 50, 84% used"; the inline label is hidden from assistive tech so it is not read twice.

Related: [usage-tile](usage-tile.md), [progress](progress.md), [table](table.md)
