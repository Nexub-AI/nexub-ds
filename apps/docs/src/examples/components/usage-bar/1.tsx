'use client'; // docs preview: server pages import every example

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
