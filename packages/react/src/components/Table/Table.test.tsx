import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
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

  describe('horizontal overflow', () => {
    const proto = Element.prototype;
    const sw = Object.getOwnPropertyDescriptor(proto, 'scrollWidth')!;
    const cw = Object.getOwnPropertyDescriptor(proto, 'clientWidth')!;
    afterEach(() => {
      Object.defineProperty(proto, 'scrollWidth', sw);
      Object.defineProperty(proto, 'clientWidth', cw);
    });
    const overflow = () => {
      Object.defineProperty(proto, 'scrollWidth', { configurable: true, get: () => 800 });
      Object.defineProperty(proto, 'clientWidth', { configurable: true, get: () => 300 });
    };
    const Wide = (props: React.ComponentProps<typeof Table.Root>) => (
      <Table.Root {...props}>
        <Table.Caption>Invoices</Table.Caption>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Alice</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    );

    it('is not a tab stop when it fits', () => {
      const { container } = render(<Wide />);
      expect(container.firstElementChild).not.toHaveAttribute('tabindex');
      expect(screen.queryByRole('region')).toBeNull();
    });

    it('becomes a focusable region named by the caption when it overflows', () => {
      overflow();
      render(<Wide />);
      const region = screen.getByRole('region', { name: 'Invoices' });
      expect(region).toHaveAttribute('tabindex', '0');
    });

    it('prefers scrollLabel for the region name', () => {
      overflow();
      render(<Wide scrollLabel="Invoice table" />);
      expect(screen.getByRole('region', { name: 'Invoice table' })).toBeInTheDocument();
    });
  });
});
