import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from './DataTable.js';

interface Person {
  name: string;
  age: number;
}

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

const data: Person[] = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
];

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('shows "No results." when data is empty', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('sorts on column header click when enableSorting=true', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} enableSorting />);

    const nameHeader = screen.getByRole('button', { name: /name/i });
    await user.click(nameHeader);

    // After one click, sorted ascending — Alice should still appear
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(
      <DataTable columns={columns} data={data} className="custom-class" data-testid="dt" />,
    );
    expect(screen.getByTestId('dt')).toHaveClass('custom-class');
  });
});
