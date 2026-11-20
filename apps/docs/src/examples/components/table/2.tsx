'use client'; // docs preview: server pages import every example

import { Table } from '@nexub/react';

const rows = Array.from({ length: 12 }, (_, i) => ({ name: `Person ${i + 1}`, role: i % 3 === 0 ? 'Admin' : 'Member' }));

export default function Example() {
  return (
    <Table.Root aria-label="People" stickyHeader maxHeight={240} density="compact" striped className="w-full max-w-[30rem]">
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Role</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.name}>
            <Table.Cell>{r.name}</Table.Cell>
            <Table.Cell>{r.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
