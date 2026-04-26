import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from './Table.js';

describe('Table', () => {
  const BasicTable = () => (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Role</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Alice</Table.Cell>
          <Table.Cell>Active</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Bob</Table.Cell>
          <Table.Cell>Inactive</Table.Cell>
          <Table.Cell>Member</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );

  it('renders a table element', () => {
    render(<BasicTable />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<BasicTable />);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Role' })).toBeInTheDocument();
  });

  it('renders rows and cells', () => {
    render(<BasicTable />);
    expect(screen.getByRole('cell', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Bob' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3); // 1 header + 2 body
  });

  it('forwards className to Root table element', () => {
    render(<Table.Root className="custom-table" />);
    expect(screen.getByRole('table')).toHaveClass('custom-table');
  });

  it('forwards ref to table element', () => {
    const ref = React.createRef<HTMLTableElement>();
    render(<Table.Root ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it('renders caption when provided', () => {
    render(
      <Table.Root>
        <Table.Caption>User list</Table.Caption>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Alice</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(screen.getByText('User list')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <Table.Root>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Alice</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>Total: 1</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>,
    );
    expect(screen.getByText('Total: 1')).toBeInTheDocument();
  });
});
