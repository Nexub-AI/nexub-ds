import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable, type DataTableColumn } from './DataTable.js';
import { NexubProvider } from '../NexubProvider/NexubProvider.js';

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

  it('shows the noResults message when data is empty', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
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

  it('translates the empty state through NexubProvider', () => {
    render(
      <NexubProvider locale="fr" messages={{ noResults: 'Aucun résultat.' }}>
        <DataTable columns={columns} data={[]} />
      </NexubProvider>,
    );
    expect(screen.getByText('Aucun résultat.')).toBeInTheDocument();
  });

  it('sorting inside a form does not submit it', async () => {
    const user = userEvent.setup();
    let submitted = false;
    render(
      <form onSubmit={(e) => { e.preventDefault(); submitted = true; }}>
        <DataTable columns={columns} data={data} enableSorting />
      </form>,
    );
    await user.click(screen.getByRole('button', { name: /name/i }));
    expect(submitted).toBe(false);
  });

  it('forwards className', () => {
    render(
      <DataTable columns={columns} data={data} className="custom-class" data-testid="dt" />,
    );
    expect(screen.getByTestId('dt')).toHaveClass('custom-class');
  });

  describe('1.8 adoption', () => {
    interface Row { name: string; mrr: number }
    const cols: DataTableColumn<Row>[] = [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'mrr', header: 'MRR', meta: { align: 'end' } },
    ];
    const rows: Row[] = [{ name: 'Acme', mrr: 1200 }];

    it('aligns header, sort button and cells from meta.align', () => {
      render(<DataTable columns={cols} data={rows} enableSorting />);
      const header = screen.getByRole('columnheader', { name: /mrr/i });
      expect(header).toHaveClass('text-end');
      expect(screen.getByRole('button', { name: /mrr/i })).toHaveClass('justify-end');
      expect(screen.getByRole('cell', { name: '1200' })).toHaveClass('text-end');
      expect(screen.getByRole('cell', { name: 'Acme' })).toHaveClass('text-start');
    });

    it('names the <table> with a caption, visible or sr-only', () => {
      const { rerender } = render(<DataTable columns={cols} data={rows} caption="Accounts" />);
      expect(screen.getByRole('table', { name: 'Accounts' })).toBeInTheDocument();
      expect(screen.getByText('Accounts')).not.toHaveClass('sr-only');
      rerender(<DataTable columns={cols} data={rows} caption="Accounts" captionHidden />);
      expect(screen.getByText('Accounts')).toHaveClass('sr-only');
    });

    it('puts aria-label / aria-labelledby on the table, not the wrapper', () => {
      render(<DataTable columns={cols} data={rows} aria-label="Top accounts" data-testid="dt" />);
      expect(screen.getByRole('table', { name: 'Top accounts' })).toBeInTheDocument();
      expect(screen.getByTestId('dt')).not.toHaveAttribute('aria-label');
    });

    it('translates the pager through NexubProvider', () => {
      render(
        <NexubProvider
          messages={{ pageOf: (n, t) => `Seite ${n} von ${t}`, previous: 'Zurück', next: 'Weiter' }}
        >
          <DataTable columns={cols} data={rows} pagination={{ pageSize: 1 }} />
        </NexubProvider>,
      );
      expect(screen.getByText('Seite 1 von 1')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Zurück' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Weiter' })).toBeInTheDocument();
    });

    it('keeps the English pager by default', () => {
      render(<DataTable columns={cols} data={rows} pagination={{ pageSize: 1 }} />);
      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    });

    it('renders no style attribute (strict CSP)', () => {
      const html = renderToString(
        <DataTable columns={cols} data={rows} caption="Accounts" enableSorting pagination={{ pageSize: 1 }} />,
      );
      expect(html).not.toContain('style=');
    });
  });
});
