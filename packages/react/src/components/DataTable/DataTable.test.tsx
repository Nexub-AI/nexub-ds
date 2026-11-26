import { render as renderState, screen as stateScreen } from '@testing-library/react';
import { ErrorState } from '../ErrorState/ErrorState.js';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable, type DataTableColumn } from './DataTable.js';
import { NexubProvider } from '../NexubProvider/NexubProvider.js';

// ColumnFilter and ViewOptions are React.lazy chunks. A cold import can pass 1 s (the default)
// under CI load, more so with the React Compiler transform on (`test:compiler`).
const LAZY = { timeout: 5_000 };

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
  it('grid: one tab stop, arrows move between cells and their controls', async () => {
    const user = userEvent.setup();
    render(
      <>
        <DataTable
          grid
          enableSorting
          aria-label="People"
          columns={[
            ...columns,
            {
              id: 'act',
              header: 'Actions',
              cell: ({ row }) => <button>Edit {row.original.name}</button>,
            },
          ]}
          data={data}
        />
        <button>After</button>
      </>,
    );
    expect(screen.getByRole('grid', { name: 'People' })).toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Name' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Alice')).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('button', { name: 'Edit Alice' })).toHaveFocus();
    await user.keyboard('{ArrowDown}{ArrowLeft}');
    expect(screen.getByText('25')).toHaveFocus();
    await user.keyboard('{Control>}{Home}{/Control}');
    expect(screen.getByRole('button', { name: 'Name' })).toHaveFocus();
    // The grid is one tab stop, and it remembers the last cell.
    await user.keyboard('{Control>}{End}{/Control}');
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Edit Bob' })).toHaveFocus();
  });

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitted = true;
        }}
      >
        <DataTable columns={columns} data={data} enableSorting />
      </form>,
    );
    await user.click(screen.getByRole('button', { name: /name/i }));
    expect(submitted).toBe(false);
  });

  it('forwards className', () => {
    render(<DataTable columns={columns} data={data} className="custom-class" data-testid="dt" />);
    expect(screen.getByTestId('dt')).toHaveClass('custom-class');
  });

  describe('1.8 adoption', () => {
    interface Row {
      name: string;
      mrr: number;
    }
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
        <DataTable
          columns={cols}
          data={rows}
          caption="Accounts"
          enableSorting
          pagination={{ pageSize: 1 }}
        />,
      );
      expect(html).not.toContain('style=');
    });
  });
});

describe('DataTable 5.3: selection, bulk actions, density, view menu', () => {
  const many: Person[] = Array.from({ length: 5 }, (_, i) => ({ name: `P${i}`, age: 20 + i }));

  it('selection column: row and page checkboxes, bulk bar with the selected rows', async () => {
    const onBulk = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        enableRowSelection
        selectionColumn
        bulkActions={(rows) => (
          <button type="button" onClick={() => onBulk(rows)}>
            Archive
          </button>
        )}
      />,
    );
    const [all, first] = screen.getAllByRole('checkbox');
    expect(all).toHaveAccessibleName('Select all rows on this page');
    await userEvent.click(first!);
    expect(all).toHaveAttribute('data-state', 'indeterminate');
    expect(screen.getByRole('region', { name: '1 selected' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Archive' }));
    expect(onBulk).toHaveBeenCalledWith([data[0]]);
    await userEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(screen.queryByRole('region', { name: /selected/ })).toBeNull();
  });

  it('offers "Select all N" when a whole page is selected', async () => {
    render(
      <DataTable
        columns={columns}
        data={many}
        enableRowSelection
        selectionColumn
        pagination={{ pageSize: 2 }}
      />,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all rows on this page' }));
    await userEvent.click(screen.getByRole('button', { name: 'Select all 5' }));
    expect(screen.getByText('5 selected')).toBeInTheDocument();
  });

  it('controlled selection with getRowId', async () => {
    const onChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        enableRowSelection
        selectionColumn
        getRowId={(r) => r.name}
        rowSelection={{ Bob: true }}
        onRowSelectionChange={onChange}
      />,
    );
    const rows = screen.getAllByRole('checkbox', { name: 'Select row' });
    expect(rows[1]).toHaveAttribute('data-state', 'checked');
    await userEvent.click(rows[0]!);
    expect(onChange).toHaveBeenCalledWith({ Bob: true, Alice: true });
  });

  it('view menu switches density and hides columns', async () => {
    const { container } = render(<DataTable columns={columns} data={data} viewOptions />);
    // The menu loads lazily; the plain button stands in until then.
    await vi.waitFor(
      () =>
        expect(screen.getByRole('button', { name: 'View' })).toHaveAttribute(
          'aria-haspopup',
          'menu',
        ),
      LAZY,
    );
    await userEvent.click(screen.getByRole('button', { name: 'View' }));
    await userEvent.click(screen.getByRole('menuitemradio', { name: 'Compact' }));
    expect(container.firstElementChild).toHaveAttribute('data-density', 'compact');
    await userEvent.click(screen.getByRole('button', { name: 'View' }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Age' }));
    expect(screen.queryByRole('columnheader', { name: 'Age' })).toBeNull();
  });

  it('numbers sort order when several columns are sorted', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} enableSorting />);
    await user.click(screen.getByRole('button', { name: /Name/ }));
    await user.keyboard('{Shift>}');
    await user.click(screen.getByRole('button', { name: /Age/ }));
    await user.keyboard('{/Shift}');
    expect(screen.getByText('sort 2')).toBeInTheDocument();
  });
});

describe('DataTable 5.4: resize, reorder, pin, sticky header', () => {
  it('resize handles change a column width with the keyboard', async () => {
    const onSizing = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        enableColumnResizing
        onColumnSizingChange={onSizing}
      />,
    );
    const handle = screen.getByRole('separator', { name: 'Resize Name' });
    expect(handle).toHaveAttribute('aria-valuenow', '150');
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onSizing).toHaveBeenLastCalledWith({ name: 166 });
    expect(screen.getByRole('table')).toHaveClass('table-fixed');
    expect(screen.getAllByRole('columnheader')[0]!.style.width).toBe('166px');
  });

  it('Alt+Arrow moves a column and announces it', async () => {
    const onOrder = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        enableColumnReordering
        onColumnOrderChange={onOrder}
      />,
    );
    screen.getByRole('columnheader', { name: 'Name' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowRight}{/Alt}');
    expect(onOrder).toHaveBeenLastCalledWith(['age', 'name']);
    expect(screen.getByText('Name moved to position 2 of 2')).toBeInTheDocument();
  });

  it('pinned columns are sticky at their offset', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        columnPinning={{ left: ['name'] }}
        enableColumnResizing
      />,
    );
    const head = screen.getByRole('columnheader', { name: /Name/ });
    expect(head).toHaveClass('sticky');
    expect(head).not.toHaveClass('relative');
    expect(head.style.insetInlineStart).toBe('0px');
    expect(screen.getByRole('cell', { name: 'Alice' })).toHaveClass('sticky');
  });

  it('maxHeight caps the scroll area and sticks the header', () => {
    render(<DataTable columns={columns} data={data} maxHeight={300} />);
    expect(screen.getByRole('table').parentElement!.style.maxHeight).toBe('300px');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveClass('sticky', 'top-0');
  });
});

describe('DataTable sub-rows', () => {
  it('indents children under an expand toggle', async () => {
    type Row = { name: string; children?: Row[] };
    const data: Row[] = [
      { name: 'Acme', children: [{ name: 'Acme EU' }, { name: 'Acme US' }] },
      { name: 'Globex' },
    ];
    render(
      <DataTable<Row>
        caption="Accounts"
        columns={[{ accessorKey: 'name', header: 'Name' }]}
        data={data}
        getSubRows={(r) => r.children}
      />,
    );
    expect(screen.queryByText('Acme EU')).not.toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: 'Expand row' });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Acme EU')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(5);
  });
});

describe('DataTable 7.4: loading and emptyState', () => {
  it('loading shows skeleton rows (pageSize) and sets aria-busy', () => {
    const { container } = render(
      <DataTable columns={columns} data={data} loading pagination={{ pageSize: 3 }} />,
    );
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    const skel = container.querySelectorAll('tbody tr[data-loading]');
    expect(skel).toHaveLength(3);
    expect(skel[0]!.children).toHaveLength(columns.length);
    expect(screen.queryByText(data[0]!.name)).not.toBeInTheDocument();
  });

  it('renders emptyState in a full-width row when there are no rows', () => {
    render(<DataTable columns={columns} data={[]} emptyState={<p>Nothing here</p>} />);
    expect(screen.getByText('Nothing here').closest('td')).toHaveAttribute(
      'colspan',
      String(columns.length),
    );
    expect(screen.getByRole('table')).not.toHaveAttribute('aria-busy');
  });
});

describe('DataTable 7.7: memoised rows, controlled and manual sort/pagination', () => {
  const many: Person[] = Array.from({ length: 5 }, (_, i) => ({ name: `P${i}`, age: 20 + i }));

  it('selecting one row re-renders only that row', async () => {
    const cell = vi.fn(({ row }: { row: { original: Person } }) => row.original.name);
    const cols: DataTableColumn<Person>[] = [
      { accessorKey: 'name', header: 'Name', cell },
      { accessorKey: 'age', header: 'Age' },
    ];
    render(<DataTable columns={cols} data={many} enableRowSelection />);
    expect(cell).toHaveBeenCalledTimes(5);
    cell.mockClear();
    await userEvent.click(screen.getAllByRole('checkbox', { name: 'Select row' })[2]!);
    expect(cell).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole('row')[3]).toHaveAttribute('data-state', 'selected');
  });

  it('a parent re-render with a new but equal data array re-renders no rows', () => {
    const cell = vi.fn(({ row }: { row: { original: Person } }) => row.original.name);
    const cols: DataTableColumn<Person>[] = [{ accessorKey: 'name', header: 'Name', cell }];
    const { rerender } = render(<DataTable columns={cols} data={[...many]} />);
    cell.mockClear();
    rerender(<DataTable columns={cols} data={[...many]} />);
    expect(cell).not.toHaveBeenCalled();
  });

  it('controlled sort: reports header clicks, renders the given sort', async () => {
    const onSortChange = vi.fn();
    const { rerender } = render(
      <DataTable
        columns={columns}
        data={data}
        enableSorting
        sort={[]}
        onSortChange={onSortChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Age/ }));
    expect(onSortChange).toHaveBeenCalledWith([{ id: 'age', desc: true }]); // numbers sort descending first
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Alice'); // still unsorted: controlled
    rerender(
      <DataTable
        columns={columns}
        data={data}
        enableSorting
        sort={[{ id: 'age', desc: false }]}
        onSortChange={onSortChange}
      />,
    );
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Bob');
    expect(screen.getByRole('columnheader', { name: /Age/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
  });

  it('manualSort: shows the sort but keeps the given row order', async () => {
    const onSortChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        enableSorting
        manualSort
        onSortChange={onSortChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Age/ }));
    expect(onSortChange).toHaveBeenCalledWith([{ id: 'age', desc: true }]); // numbers sort descending first
    expect(screen.getByRole('columnheader', { name: /Age/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Alice');
  });

  it('controlled page and pageSize', async () => {
    const onPageChange = vi.fn();
    render(
      <DataTable columns={columns} data={many} page={1} pageSize={2} onPageChange={onPageChange} />,
    );
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('P2');
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument(); // controlled
  });

  it('manualPagination: renders data as the page, counts pages from rowCount', async () => {
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={many.slice(0, 2)}
        manualPagination
        rowCount={50}
        pageSize={2}
        onPageChange={onPageChange}
      />,
    );
    expect(screen.getByText('Page 1 of 25')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(screen.getByText('Page 2 of 25')).toBeInTheDocument(); // uncontrolled page
  });
});

describe('DataTable 10.5: errorState', () => {
  it('shows in one full-width row and wins over loading and the rows', () => {
    const { container } = renderState(
      <DataTable
        columns={columns}
        data={data}
        loading
        errorState={<ErrorState title="Failed" />}
      />,
    );
    const cell = stateScreen.getByRole('heading', { name: 'Failed' }).closest('td')!;
    expect(cell.getAttribute('colspan')).toBe(String(columns.length));
    expect(container.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(container.querySelector('table')!.hasAttribute('aria-busy')).toBe(false);
    expect(container.querySelectorAll('[role="alert"]')).toHaveLength(0);
  });
});

describe('DataTable 10.7: footer and column filters', () => {
  interface Member extends Person {
    role: string;
  }
  const members: Member[] = [
    { name: 'Alice', age: 30, role: 'Admin' },
    { name: 'Bob', age: 25, role: 'Member' },
    { name: 'Carol', age: 41, role: 'Member' },
  ];
  const memberColumns: DataTableColumn<Member>[] = [
    { accessorKey: 'name', header: 'Name', footer: 'Total', meta: { filter: 'text' } },
    { accessorKey: 'role', header: 'Role', meta: { filter: 'select' } },
    {
      accessorKey: 'age',
      header: 'Age',
      meta: { align: 'end', filter: 'number-range' },
      footer: ({ table }) =>
        table.getFilteredRowModel().rows.reduce((sum, r) => sum + r.original.age, 0),
    },
  ];
  const bodyNames = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('tbody tr')).map((r) => r.firstElementChild!.textContent);
  /** The popover loads lazily; the plain button stands in until then. */
  const openFilter = async (name: string | RegExp) => {
    await vi.waitFor(
      () => expect(screen.getByRole('button', { name })).toHaveAttribute('aria-haspopup', 'dialog'),
      LAZY,
    );
    await userEvent.click(screen.getByRole('button', { name }));
    return screen.getByRole('dialog');
  };

  it('no footer and no filter button unless a column asks for them', () => {
    const { container } = render(<DataTable columns={columns} data={data} />);
    expect(container.querySelector('tfoot')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('footer: a tfoot row aligned like its column, hidden while loading', () => {
    const footerColumns = memberColumns.map((c) => ({ ...c, meta: { align: c.meta?.align } }));
    const { container, rerender } = render(<DataTable columns={footerColumns} data={members} />);
    const cells = container.querySelectorAll('tfoot td');
    expect(Array.from(cells).map((c) => c.textContent)).toEqual(['Total', '', '96']);
    expect(cells[2]).toHaveClass('text-end');
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
    rerender(<DataTable columns={footerColumns} data={members} loading />);
    expect(container.querySelector('tfoot')).toBeNull();
  });

  it('text filter: narrows the rows and the footer sum, marks the button, and Clear restores them', async () => {
    const { container } = render(
      <DataTable columns={memberColumns} data={members} emptyState="No members yet" />,
    );
    const dialog = await openFilter('Filter Name');
    await userEvent.type(within(dialog).getByRole('textbox', { name: 'Filter Name' }), 'BO');
    expect(bodyNames(container)).toEqual(['Bob']);
    expect(container.querySelector('tfoot td:last-child')).toHaveTextContent('25');
    expect(screen.getByRole('button', { name: 'Filter Name, 1 filter' })).toHaveAttribute(
      'data-active',
    );
    // Filters hid every row: "no results", not the table's empty state.
    await userEvent.type(within(dialog).getByRole('textbox'), 'zz');
    expect(screen.getByText('No results found.')).toBeInTheDocument();
    expect(screen.queryByText('No members yet')).toBeNull();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Clear filter' }));
    expect(bodyNames(container)).toEqual(['Alice', 'Bob', 'Carol']);
    expect(screen.getByRole('button', { name: 'Filter Name' })).not.toHaveAttribute('data-active');
  });

  it('select filter: a checkbox per distinct value', async () => {
    const { container } = render(<DataTable columns={memberColumns} data={members} />);
    const dialog = await openFilter('Filter Role');
    expect(
      within(dialog)
        .getAllByRole('checkbox')
        .map((c) => c.closest('label')!.textContent),
    ).toEqual(['Admin', 'Member']);
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Member' }));
    expect(bodyNames(container)).toEqual(['Bob', 'Carol']);
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Admin' }));
    expect(bodyNames(container)).toEqual(['Alice', 'Bob', 'Carol']);
    expect(screen.getByRole('button', { name: 'Filter Role, 2 filters' })).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Member' }));
    expect(bodyNames(container)).toEqual(['Alice']);
  });

  it('number-range filter: min, max or both', async () => {
    const { container } = render(<DataTable columns={memberColumns} data={members} />);
    const dialog = await openFilter('Filter Age');
    await userEvent.type(within(dialog).getByRole('spinbutton', { name: 'Min' }), '26');
    expect(bodyNames(container)).toEqual(['Alice', 'Carol']);
    await userEvent.type(within(dialog).getByRole('spinbutton', { name: 'Max' }), '35');
    expect(bodyNames(container)).toEqual(['Alice']);
    await userEvent.clear(within(dialog).getByRole('spinbutton', { name: 'Min' }));
    expect(bodyNames(container)).toEqual(['Alice', 'Bob']);
  });

  it('controlled: rows follow `columnFilters`, edits go to onColumnFiltersChange', async () => {
    const onColumnFiltersChange = vi.fn();
    const { container } = render(
      <DataTable
        columns={memberColumns}
        data={members}
        columnFilters={[{ id: 'role', value: ['Admin'] }]}
        onColumnFiltersChange={onColumnFiltersChange}
      />,
    );
    expect(bodyNames(container)).toEqual(['Alice']);
    const dialog = await openFilter(/Filter Role/);
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Member' }));
    expect(onColumnFiltersChange).toHaveBeenCalledWith([
      { id: 'role', value: ['Admin', 'Member'] },
    ]);
    expect(bodyNames(container)).toEqual(['Alice']);
    await userEvent.click(within(dialog).getByRole('button', { name: 'Clear filter' }));
    expect(onColumnFiltersChange).toHaveBeenLastCalledWith([]);
  });

  it('manualFiltering: the state changes but rows are left to the server; filterOptions lists the choices', async () => {
    const onColumnFiltersChange = vi.fn();
    const serverColumns = memberColumns.map((c, i) =>
      i === 1 ? { ...c, meta: { ...c.meta, filterOptions: ['Admin', 'Member', 'Owner'] } } : c,
    );
    const { container } = render(
      <DataTable
        columns={serverColumns}
        data={members}
        manualFiltering
        defaultColumnFilters={[{ id: 'name', value: 'bob' }]}
        onColumnFiltersChange={onColumnFiltersChange}
      />,
    );
    expect(bodyNames(container)).toEqual(['Alice', 'Bob', 'Carol']);
    const dialog = await openFilter('Filter Role');
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Owner' }));
    expect(onColumnFiltersChange).toHaveBeenCalledWith([
      { id: 'name', value: 'bob' },
      { id: 'role', value: ['Owner'] },
    ]);
    expect(bodyNames(container)).toEqual(['Alice', 'Bob', 'Carol']);
  });

  it('a filter change goes back to the first page; sorting and aria-sort still work beside the filter', async () => {
    const { container } = render(
      <DataTable columns={memberColumns} data={members} pageSize={1} enableSorting />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    const dialog = await openFilter('Filter Role');
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Member' }));
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    expect(bodyNames(container)).toEqual(['Carol']);
  });

  it('grid: the filter button is a stop in its header cell, and keys inside the popover stay there', async () => {
    const user = userEvent.setup();
    render(<DataTable grid aria-label="Members" columns={memberColumns} data={members} />);
    await vi.waitFor(
      () =>
        expect(screen.getByRole('button', { name: 'Filter Name' })).toHaveAttribute(
          'aria-haspopup',
          'dialog',
        ),
      LAZY,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Filter Name' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Filter Role' })).toHaveFocus();
    await user.keyboard('{Enter}');
    const first = within(screen.getByRole('dialog')).getAllByRole('checkbox')[0]!;
    first.focus();
    await user.keyboard('{ArrowDown}{End}');
    expect(first).toHaveFocus();
  });
});
