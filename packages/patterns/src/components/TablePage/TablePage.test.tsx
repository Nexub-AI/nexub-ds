import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button, type DataTableColumn } from '@nexub/react';
import { TablePage } from './index.js';

// No pause between keystrokes: on a busy CI runner the default delay let a long
// type() pass the test timeout and leak keys into the next test.
const type = (el: Element, text: string) => userEvent.setup({ delay: null }).type(el, text);

interface Row {
  id: string;
  name: string;
  owner: string;
}
const rows: Row[] = [
  { id: 'a', name: 'Northwind renewal', owner: 'Ada Park' },
  { id: 'b', name: 'Harbour onboarding', owner: 'Idris Cole' },
];
const columns: DataTableColumn<Row>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'owner', header: 'Owner', cell: ({ row }) => <em>{row.original.owner}</em> },
];

describe('TablePage', () => {
  it('is a main landmark with an h1, a named table, row buttons and an actions column', async () => {
    const onRowOpen = vi.fn();
    const onEdit = vi.fn();
    render(
      <TablePage
        title="Projects"
        description="Everything in flight."
        actions={<Button>New project</Button>}
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        onRowOpen={onRowOpen}
        rowActions={(r) => <button type="button" onClick={() => onEdit(r.id)}>{`Edit ${r.name}`}</button>}
      />,
    );
    expect(screen.getByRole('main', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Harbour onboarding' }));
    expect(onRowOpen).toHaveBeenCalledWith(rows[1]);
    await userEvent.click(screen.getByRole('button', { name: 'Edit Northwind renewal' }));
    expect(onEdit).toHaveBeenCalledWith('a');
    // No search or filters given: no stray search field.
    expect(screen.queryByRole('searchbox')).toBeNull();
  });

  it('wraps a custom first cell and a string cell in the open button', async () => {
    const onRowOpen = vi.fn();
    const { rerender } = render(
      <TablePage title="People" columns={[columns[1]!, columns[0]!]} data={rows} onRowOpen={onRowOpen} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Ada Park' }));
    expect(onRowOpen).toHaveBeenCalledWith(rows[0]);
    rerender(<TablePage title="People" columns={[{ id: 'open', header: 'Open', cell: 'Open' } as DataTableColumn<Row>]} data={rows.slice(0, 1)} onRowOpen={onRowOpen} />);
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });

  it('searches, shows filters and clears them', async () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    const { rerender } = render(
      <TablePage
        title="Projects"
        columns={columns}
        data={rows}
        search={{ value: '', onChange, placeholder: 'Search projects…' }}
        filters={<button type="button">Status</button>}
        activeFilterCount={2}
        onClearFilters={onClear}
      />,
    );
    await type(screen.getByRole('searchbox', { name: 'Search projects' }), 'n');
    expect(onChange).toHaveBeenCalledWith('n');
    expect(screen.getByRole('button', { name: 'Status' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onClear).toHaveBeenCalledTimes(1);
    // Filters without a search field.
    rerender(<TablePage title="Projects" columns={columns} data={rows} filters={<button type="button">Status</button>} activeFilterCount={1} onClearFilters={onClear} />);
    expect(screen.queryByRole('searchbox')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onClear).toHaveBeenCalledTimes(2);
    rerender(<TablePage title="Projects" columns={columns} data={rows} filters={<button type="button">Status</button>} />);
    expect(screen.queryByRole('button', { name: 'Clear filters' })).toBeNull();
  });

  it('switches saved segments', async () => {
    const onTabChange = vi.fn();
    render(
      <TablePage
        title="Projects"
        columns={columns}
        data={rows}
        tabs={[
          { id: 'all', label: 'All', count: 12 },
          { id: 'archived', label: 'Archived' },
        ]}
        onTabChange={onTabChange}
      />,
    );
    expect(screen.getByRole('tab', { name: /All/ })).toHaveAttribute('aria-selected', 'true');
    expect(within(screen.getByRole('tabpanel')).getByRole('table')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: 'Archived' }));
    expect(onTabChange).toHaveBeenCalledWith('archived');
  });

  it('offers bulk actions for selected rows', async () => {
    const onArchive = vi.fn();
    render(
      <TablePage
        title="Projects"
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        bulkActions={(selected, clear) => (
          <button
            type="button"
            onClick={() => {
              onArchive(selected.map((r) => r.id));
              clear();
            }}
          >
            Archive
          </button>
        )}
        tableProps={{ density: 'compact' }}
      />,
    );
    await userEvent.click(screen.getAllByRole('checkbox')[1]!);
    await userEvent.click(screen.getByRole('button', { name: 'Archive' }));
    expect(onArchive).toHaveBeenCalledWith(['a']);
  });

  it('data states: loading, empty with the primary action, no results with Clear filters, a custom empty state, and error wins', async () => {
    const onClear = vi.fn();
    const base = { title: 'Projects', columns, data: [] as Row[] };
    const { rerender } = render(<TablePage {...base} loading />);
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    rerender(<TablePage {...base} actions={<Button>New project</Button>} />);
    expect(screen.getAllByRole('button', { name: 'New project' })).toHaveLength(2);
    rerender(<TablePage {...base} search={{ value: 'zzz', onChange: () => {} }} onClearFilters={onClear} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onClear).toHaveBeenCalled();
    rerender(<TablePage {...base} activeFilterCount={1} />);
    expect(screen.queryByRole('button', { name: 'Clear filters' })).toBeNull();
    rerender(<TablePage {...base} emptyState={<p>Nothing here</p>} />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    rerender(<TablePage {...base} loading errorState={<p role="alert">Could not load</p>} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Could not load');
  });
});
