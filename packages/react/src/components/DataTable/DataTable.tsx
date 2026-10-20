import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type PaginationState,
} from '@tanstack/react-table';
import { ArrowUp, ArrowDown, ChevronsUpDown } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { disabledContainer, pressable } from '../../utils/control.js';

// Outlined capsules; hover/press = the state layer.
const pagerButton = cn(
  pressable,
  'border border-[var(--color-outline-variant)] bg-transparent px-4 py-2 min-h-[44px] text-label-lg text-[var(--color-on-surface)]',
  disabledContainer,
);

// ---------------------------------------------------------------------------
// Minimal inline table primitives (no external Table component dependency)
// ---------------------------------------------------------------------------

const TableRoot = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
));
TableRoot.displayName = 'DataTable.TableRoot';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('[&_tr]:border-b border-[var(--color-outline-variant)]', className)}
    {...props}
  />
));
TableHeader.displayName = 'DataTable.TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'DataTable.TableBody';

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-[var(--color-outline-variant)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)] data-[state=selected]:bg-[var(--color-surface-container-low)]',
      className,
    )}
    {...props}
  />
));
TableRow.displayName = 'DataTable.TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-4 text-start align-middle text-xs font-medium text-[var(--color-on-surface-muted)] [&:has([role=checkbox])]:pe-0',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'DataTable.TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'px-4 py-3 align-middle text-[var(--color-on-surface)] [&:has([role=checkbox])]:pe-0',
      className,
    )}
    {...props}
  />
));
TableCell.displayName = 'DataTable.TableCell';

// ---------------------------------------------------------------------------
// DataTable
// ---------------------------------------------------------------------------

export interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<TData>[];
  data: TData[];
  enableSorting?: boolean;
  enableRowSelection?: boolean;
  pagination?: { pageSize?: number };
}

export function DataTable<TData>({
  columns,
  data,
  enableSorting = false,
  enableRowSelection = false,
  pagination,
  className,
  ...props
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [paginationState, setPaginationState] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pagination?.pageSize ?? 20,
  });

  // Memoize the state bag so a parent re-render with stable sort/selection/pagination
  // values doesn't hand a new object reference to TanStack on every render.
  const tableState = React.useMemo(
    () => ({
      sorting: enableSorting ? sorting : undefined,
      rowSelection: enableRowSelection ? rowSelection : undefined,
      pagination: pagination ? paginationState : undefined,
    }),
     
    [enableSorting, sorting, enableRowSelection, rowSelection, pagination, paginationState],
  );

  const table = useReactTable({
    data,
    columns,
    state: tableState,
    onSortingChange: enableSorting ? setSorting : undefined,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    onPaginationChange: pagination ? setPaginationState : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    enableRowSelection,
    manualPagination: false,
  });

  return (
    <div className={cn('space-y-4', className)} {...props}>
      <TableRoot>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  aria-sort={
                    enableSorting && header.column.getCanSort()
                      ? header.column.getIsSorted() === 'asc'
                        ? 'ascending'
                        : header.column.getIsSorted() === 'desc'
                        ? 'descending'
                        : 'none'
                      : undefined
                  }
                >
                  {header.isPlaceholder ? null : enableSorting &&
                    header.column.getCanSort() ? (
                    <button
                      onClick={header.column.getToggleSortingHandler()}
                      className="inline-flex items-center gap-1 hover:text-[var(--color-on-surface)]"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' ? (
                        <ArrowUp size="xs" aria-hidden="true" />
                      ) : header.column.getIsSorted() === 'desc' ? (
                        <ArrowDown size="xs" aria-hidden="true" />
                      ) : (
                        <ChevronsUpDown size="xs" className="opacity-40" aria-hidden="true" />
                      )}
                    </button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={enableRowSelection && row.getIsSelected() ? 'selected' : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-[var(--color-on-surface-muted)]"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableRoot>

      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--color-on-surface-muted)]">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={pagerButton}
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={pagerButton}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
