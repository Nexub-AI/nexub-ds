'use client';

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
  type RowData,
  type Updater,
  type VisibilityState,
} from '@tanstack/react-table';
import { ArrowUp, ArrowDown, ChevronsUpDown, SlidersHorizontal, X } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { disabledContainer, pressable } from '../../utils/control.js';
import { floatingSurface } from '../../utils/surface.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Table } from '../Table/Table.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { Button } from '../Button/Button.js';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu.js';

type ColumnAlign = 'start' | 'end' | 'center';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Horizontal alignment of the header and cells. Use 'end' for numbers. @default 'start' */
    align?: 'start' | 'end' | 'center';
  }
}

/** A DataTable column: TanStack's `ColumnDef`, with `meta.align` for numeric columns. */
export type DataTableColumn<TData> = ColumnDef<TData, unknown>;

const alignText: Record<ColumnAlign, string> = {
  start: 'text-start',
  end: 'text-end',
  center: 'text-center',
};
const alignJustify: Record<ColumnAlign, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
};

// Outlined capsules; hover/press = the state layer.
const pagerButton = cn(
  pressable,
  'border border-[var(--color-outline-variant)] bg-transparent px-4 py-2 min-h-[44px] text-label-lg text-[var(--color-on-surface)]',
  disabledContainer,
);

// ---------------------------------------------------------------------------
// Table primitives (Root and Caption come from Table)
// ---------------------------------------------------------------------------

// The scroll wrapper (keyboard-focusable when it overflows), caption and tabular figures come from Table.
const TableRoot = Table.Root;

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
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
TableBody.displayName = 'DataTable.TableBody';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-[var(--color-outline-variant)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)] data-[state=selected]:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]',
        className,
      )}
      {...props}
    />
  ),
);
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

export type DataTableDensity = 'comfortable' | 'compact';

export interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataTableColumn<TData>[];
  /** Names the table for assistive tech (and is shown below it unless `captionHidden`). */
  caption?: React.ReactNode;
  /** Keep the caption for screen readers only. */
  captionHidden?: boolean;
  data: TData[];
  enableSorting?: boolean;
  enableRowSelection?: boolean;
  /**
   * With `enableRowSelection`: a checkbox column with select-page in its
   * header, and "Select all N" across pages. On by default from 6.0.
   */
  selectionColumn?: boolean;
  /** Controlled selection, keyed by row id (see `getRowId`). */
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  /** Stable row ids for selection; defaults to the row index. */
  getRowId?: (row: TData, index: number) => string;
  /** A floating bar while rows are selected: render your actions for the selected rows. */
  bulkActions?: (rows: TData[], clear: () => void) => React.ReactNode;
  density?: DataTableDensity;
  defaultDensity?: DataTableDensity;
  onDensityChange?: (density: DataTableDensity) => void;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  /** A "View" menu above the table: density and which columns show. */
  viewOptions?: boolean;
  /** Content at the start of the row above the table (filters, a title). */
  toolbar?: React.ReactNode;
  pagination?: { pageSize?: number };
}

/** TanStack hands back updaters; apply one to the current value. */
const apply = <T,>(u: Updater<T>, prev: T): T => (typeof u === 'function' ? (u as (p: T) => T)(prev) : u);

const columnLabel = <TData,>(c: { id: string; columnDef: DataTableColumn<TData> }) =>
  typeof c.columnDef.header === 'string' ? c.columnDef.header : c.id;

export function DataTable<TData>({
  columns,
  data,
  enableSorting = false,
  enableRowSelection = false,
  selectionColumn = false,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  getRowId,
  bulkActions,
  density: densityProp,
  defaultDensity = 'comfortable',
  onDensityChange,
  columnVisibility: columnVisibilityProp,
  onColumnVisibilityChange,
  viewOptions = false,
  toolbar,
  pagination,
  caption,
  captionHidden = false,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: DataTableProps<TData>) {
  const messages = useNexubMessages();
  const { locale } = useLocale();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection = {}, setRowSelection] = useControllableState<RowSelectionState>({
    value: rowSelectionProp,
    defaultValue: {},
    onChange: onRowSelectionChange,
  });
  const [density = 'comfortable', setDensity] = useControllableState<DataTableDensity>({
    value: densityProp,
    defaultValue: defaultDensity,
    onChange: onDensityChange,
  });
  const [columnVisibility = {}, setColumnVisibility] = useControllableState<VisibilityState>({
    value: columnVisibilityProp,
    defaultValue: {},
    onChange: onColumnVisibilityChange,
  });
  const [paginationState, setPaginationState] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pagination?.pageSize ?? 20,
  });

  const withSelectColumn = enableRowSelection && selectionColumn;
  const allColumns = React.useMemo<DataTableColumn<TData>[]>(
    () =>
      withSelectColumn
        ? [
            {
              id: '__select',
              enableSorting: false,
              enableHiding: false,
              header: ({ table }) => (
                <Checkbox
                  aria-label={messages.selectAllOnPage}
                  checked={
                    table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false
                  }
                  onCheckedChange={(v) => table.toggleAllPageRowsSelected(v === true)}
                />
              ),
              cell: ({ row }) => (
                <Checkbox
                  aria-label={messages.selectRow}
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  onCheckedChange={(v) => row.toggleSelected(v === true)}
                />
              ),
            },
            ...columns,
          ]
        : columns,
    [withSelectColumn, columns, messages.selectAllOnPage, messages.selectRow],
  );

  // Memoize the state bag so a parent re-render with stable sort/selection/pagination
  // values doesn't hand a new object reference to TanStack on every render.
  const tableState = React.useMemo(
    () => ({
      sorting: enableSorting ? sorting : undefined,
      rowSelection: enableRowSelection ? rowSelection : undefined,
      pagination: pagination ? paginationState : undefined,
      columnVisibility,
    }),

    [enableSorting, sorting, enableRowSelection, rowSelection, pagination, paginationState, columnVisibility],
  );

  const table = useReactTable({
    data,
    columns: allColumns,
    state: tableState,
    getRowId,
    onSortingChange: enableSorting ? setSorting : undefined,
    onRowSelectionChange: enableRowSelection ? (u) => setRowSelection(apply(u, rowSelection)) : undefined,
    onColumnVisibilityChange: (u) => setColumnVisibility(apply(u, columnVisibility)),
    onPaginationChange: pagination ? setPaginationState : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    enableRowSelection,
    manualPagination: false,
  });

  const compact = density === 'compact';
  const selectedRows = enableRowSelection ? table.getSelectedRowModel().rows : [];
  const totalRows = table.getCoreRowModel().rows.length;
  const fmt = (n: number) => new Intl.NumberFormat(locale).format(n);
  const multiSort = sorting.length > 1;
  // Whole page selected but more rows exist on other pages: offer the rest.
  const offerAll =
    withSelectColumn && !!pagination && table.getIsAllPageRowsSelected() && totalRows > table.getRowModel().rows.length;
  const clear = () => table.resetRowSelection(true);

  return (
    <div className={cn('space-y-4', className)} data-density={density} {...props}>
      {(toolbar != null || viewOptions) && (
        <div className="flex flex-wrap items-center gap-2">
          {toolbar}
          {viewOptions && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline" size="sm" className="ms-auto">
                  <SlidersHorizontal size="sm" aria-hidden="true" />
                  {messages.view}
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Label>{messages.density}</DropdownMenu.Label>
                <DropdownMenu.RadioGroup value={density} onValueChange={(v) => setDensity(v as DataTableDensity)}>
                  <DropdownMenu.RadioItem value="comfortable">{messages.comfortable}</DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="compact">{messages.compact}</DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
                <DropdownMenu.Separator />
                <DropdownMenu.Label>{messages.columns}</DropdownMenu.Label>
                {table
                  .getAllLeafColumns()
                  .filter((c) => c.getCanHide())
                  .map((c) => (
                    <DropdownMenu.CheckboxItem
                      key={c.id}
                      checked={c.getIsVisible()}
                      onCheckedChange={(v) => c.toggleVisibility(v === true)}
                      // Keep the menu open while toggling several columns.
                      onSelect={(e) => e.preventDefault()}
                    >
                      {columnLabel(c)}
                    </DropdownMenu.CheckboxItem>
                  ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </div>
      )}
      {offerAll && (
        <div className="flex flex-wrap items-center gap-2 rounded-shape-container bg-[var(--color-surface-container-low)] px-4 py-2 text-body-sm">
          {table.getIsAllRowsSelected() ? (
            <>
              <span>{messages.selectedCount(fmt(totalRows))}</span>
              <Button variant="link" size="sm" onClick={clear}>
                {messages.clearSelection}
              </Button>
            </>
          ) : (
            <>
              <span>{messages.selectedCount(fmt(selectedRows.length))}</span>
              <Button variant="link" size="sm" onClick={() => table.toggleAllRowsSelected(true)}>
                {messages.selectAllRows(fmt(totalRows))}
              </Button>
            </>
          )}
        </div>
      )}
      <TableRoot aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
        {caption != null && (
          <Table.Caption className={cn(captionHidden && 'sr-only')}>{caption}</Table.Caption>
        )}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const align = header.column.columnDef.meta?.align ?? 'start';
                return (
                  <TableHead
                    key={header.id}
                    className={cn(alignText[align], compact && 'h-8', header.column.id === '__select' && 'w-10')}
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
                    {header.isPlaceholder ? null : enableSorting && header.column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          'flex w-full items-center gap-1 hover:text-[var(--color-on-surface)]',
                          alignJustify[align],
                        )}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {multiSort && header.column.getIsSorted() && (
                          <span className="text-[10px] tabular-nums leading-none">
                            <span aria-hidden="true">{header.column.getSortIndex() + 1}</span>
                            <span className="sr-only">{messages.sortOrder(header.column.getSortIndex() + 1)}</span>
                          </span>
                        )}
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
                );
              })}
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
                  <TableCell
                    key={cell.id}
                    className={cn(alignText[cell.column.columnDef.meta?.align ?? 'start'], compact && 'py-1.5')}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center text-[var(--color-on-surface-muted)]"
              >
                {messages.noResults}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableRoot>

      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--color-on-surface-muted)]">
          <span>
            {messages.pageOf(table.getState().pagination.pageIndex + 1, table.getPageCount())}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={pagerButton}
            >
              {messages.previous}
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={pagerButton}
            >
              {messages.next}
            </button>
          </div>
        </div>
      )}

      {bulkActions && selectedRows.length > 0 && (
        <div
          role="region"
          aria-label={messages.selectedCount(fmt(selectedRows.length))}
          className={cn(
            floatingSurface,
            'nx-motion sticky bottom-4 z-10 mx-auto flex w-fit max-w-full flex-wrap items-center gap-3 px-4 py-2',
          )}
          data-state="open"
        >
          <span aria-live="polite" className="text-label-lg tabular-nums">
            {messages.selectedCount(fmt(selectedRows.length))}
          </span>
          {bulkActions(
            selectedRows.map((r) => r.original),
            clear,
          )}
          <Button variant="ghost" size="sm" onClick={clear} aria-label={messages.clearSelection}>
            <X size="sm" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}
