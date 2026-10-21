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
<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Date</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Alice Johnson</Table.Cell>
      <Table.Cell><StatusPill tone="success" label="Active" /></Table.Cell>
      <Table.Cell>12 Jan 2026</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Bob Martinez</Table.Cell>
      <Table.Cell><StatusPill tone="warning" label="Pending" /></Table.Cell>
      <Table.Cell>18 Feb 2026</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Carol Smith</Table.Cell>
      <Table.Cell><StatusPill tone="neutral" label="Inactive" /></Table.Cell>
      <Table.Cell>03 Mar 2026</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

## Example: With caption

```tsx
<Table.Root>
  <Table.Caption>Recent user activity — last 30 days</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Date</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Alice Johnson</Table.Cell>
      <Table.Cell><StatusPill tone="success" label="Active" /></Table.Cell>
      <Table.Cell>12 Jan 2026</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Bob Martinez</Table.Cell>
      <Table.Cell><StatusPill tone="warning" label="Pending" /></Table.Cell>
      <Table.Cell>18 Feb 2026</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Carol Smith</Table.Cell>
      <Table.Cell><StatusPill tone="neutral" label="Inactive" /></Table.Cell>
      <Table.Cell>03 Mar 2026</Table.Cell>
    </Table.Row>
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colSpan={3} style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
        Showing 3 of 3 users
      </Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table.Root>
```
