# Table

Semantic HTML table with styled variants.

- Package: `@nexub/react` · Category: Data Display · Status: stable
- Import: `import { Table } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/table

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Table.Root striped` | `boolean` | `false` | Applies alternating row background colours. |
| `Table.Root bordered` | `boolean` | `false` | Adds borders between rows and columns. |
| `Table.Root hoverable` | `boolean` | `false` | Highlights rows on mouse hover. |
| `Table.Root stickyHeader` | `boolean` | `false` | Fixes the table header to the top when scrolling inside a scrollable container. |
| `Table.Head align` | `'start' \| 'center' \| 'end'` | `'start'` | Text alignment within the header cell. |
| `Table.Cell align` | `'start' \| 'center' \| 'end'` | `'start'` | Text alignment within the data cell. |
| `Table.Caption side` | `'top' \| 'bottom'` | `'bottom'` | Whether the caption appears above or below the table. |

## Example: Default

```tsx
import { Table, Badge } from '@nexub/react';

export default function Example() {
  const rows = [
    { name: 'Alice Brown', status: 'Active', date: 'Jan 15, 2026' },
    { name: 'Bob Carter', status: 'Pending', date: 'Jan 14, 2026' },
    { name: 'Carol Davis', status: 'Inactive', date: 'Jan 10, 2026' },
  ];
  return (
    <Table.Root className="w-full max-w-[480px]">
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Date</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.name}>
            <Table.Cell>{r.name}</Table.Cell>
            <Table.Cell><Badge tone={r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'neutral'} size="sm">{r.status}</Badge></Table.Cell>
            <Table.Cell>{r.date}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
```

## Example: With caption

```tsx
import { Table, StatusPill } from '@nexub/react';

export default function Example() {
  const rows = [
    { name: 'Alice Brown', status: 'Active', date: 'Jan 15, 2026' },
    { name: 'Bob Carter', status: 'Pending', date: 'Jan 14, 2026' },
    { name: 'Carol Davis', status: 'Inactive', date: 'Jan 10, 2026' },
  ];
  return (
    <Table.Root className="w-full max-w-[480px]">
      <Table.Caption>Recent user activity — last 30 days</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Date</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.name}>
            <Table.Cell>{r.name}</Table.Cell>
            <Table.Cell><StatusPill tone={r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'neutral'} label={r.status} /></Table.Cell>
            <Table.Cell>{r.date}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={3} className="text-[var(--color-on-surface-variant)] text-body-sm">
            Showing {rows.length} of {rows.length} users
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  );
}
```
