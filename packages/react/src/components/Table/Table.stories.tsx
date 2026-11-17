import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Table } from './Table.js';
import { ErrorState } from '../ErrorState/ErrorState.js';

const meta: Meta = {
  title: 'Components/Table',
  parameters: { layout: 'padded' },
};

export default meta;

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Member', status: 'Inactive' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Editor', status: 'Active' },
];

export const Default: StoryObj = {
  render: () => (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Role</Table.Head>
          <Table.Head>Status</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.id}>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>{user.role}</Table.Cell>
            <Table.Cell>{user.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
};

export const WithCaption: StoryObj = {
  render: () => (
    <Table.Root>
      <Table.Caption>A list of registered users.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Role</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.id}>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
};

export const WithFooter: StoryObj = {
  render: () => (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Role</Table.Head>
          <Table.Head>Status</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.id}>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.role}</Table.Cell>
            <Table.Cell>{user.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={2}>Total users</Table.Cell>
          <Table.Cell>{users.length}</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  ),
};

const stateHead = (
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Role</Table.Head>
    </Table.Row>
  </Table.Header>
);

/** `columns` on the body turns the states on: each one spans the table. */
export const DataStates: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Table.Root aria-label="Users, loading">
        {stateHead}
        <Table.Body columns={2} loadingRows={3} loading />
      </Table.Root>
      <Table.Root aria-label="Users, empty">
        {stateHead}
        <Table.Body columns={2} />
      </Table.Root>
      <Table.Root aria-label="Users, failed">
        {stateHead}
        <Table.Body columns={2} errorState={<ErrorState className="py-4" title="Could not load users" onRetry={() => {}} />} />
      </Table.Root>
    </div>
  ),
};

const people = Array.from({ length: 12 }, (_, i) => ({ name: `Person ${i + 1}`, role: i % 3 === 0 ? 'Admin' : 'Member' }));

/** 10.7: a sticky header inside a capped height, compact density for this table only, and zebra rows. */
export const Options: StoryObj = {
  render: () => (
    <Table.Root aria-label="People" stickyHeader maxHeight={240} density="compact" striped>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Role</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {people.map((p, i) => (
          <Table.Row key={p.name} data-state={i === 2 ? 'selected' : undefined}>
            <Table.Cell>{p.name}</Table.Cell>
            <Table.Cell>{p.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
};
