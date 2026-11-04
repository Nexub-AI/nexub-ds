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
