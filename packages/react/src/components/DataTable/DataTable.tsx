'use client';

import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type FilterFnOption,
  type SortingState,
  type RowSelectionState,
  type PaginationState,
  type RowData,
  type Updater,
  type VisibilityState,
  type ColumnSizingState,
  type ColumnOrderState,
  type ColumnPinningState,
  type Column,
  type ExpandedState,
  type Row,
} from '@tanstack/react-table';
import {
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Filter,
  SlidersHorizontal,
  X,
} from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { disabledContainer, pressable } from '../../utils/control.js';
import { floatingSurface } from '../../utils/surface.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Table } from '../Table/Table.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { Button } from '../Button/Button.js';
import { createGridNavigation } from './gridNavigation.js';
import { useReorder } from '../Sortable/reorder.js';
import { Skeleton } from '../Skeleton/Skeleton.js';

type ColumnAlign = 'start' | 'end' | 'center';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Horizontal alignment of the header and cells. Use 'end' for numbers. @default 'start' */
    align?: 'start' | 'end' | 'center';
    /**
     * Adds a filter button to the header (10.7). `text`: contains, ignoring case. `select`: any of
     * the ticked values. `number-range`: between min and max. A column's own `filterFn` wins.
     */
    filter?: 'text' | 'select' | 'number-range';
    /** Choices for `filter: 'select'`. Defaults to the column's distinct values in `data`: pass them when filtering on the server. */
    filterOptions?: readonly string[];
  }
}

/** The filter state: `[{ id: 'status', value: ['Active'] }]`. Values: a string (text), string[] (select), `[min, max]` (number-range). */
export type DataTableColumnFilters = ColumnFiltersState;

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
  'border border-[var(--color-outline-variant)] bg-transparent px-4 py-2 min-h-11 text-label-lg text-[var(--color-on-surface)]',
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
        'border-b border-[var(--color-outline-variant)] transition-colors hover:bg-[var(--row-hover,color-mix(in_srgb,var(--color-on-surface)_8%,transparent))] data-[state=selected]:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]',
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
      'h-10 px-4 text-start align-middle text-label-sm font-medium tracking-normal text-[var(--color-on-surface-muted)] [&:has([role=checkbox])]:pe-0',
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

/** Empty space standing in for rows that aren't rendered (virtual scrolling). */
function Spacer({ height }: { height: number }) {
  return (
    <tr aria-hidden="true" className="border-0">
      <td
        ref={(el) => {
          if (el) el.style.height = px(height);
        }}
        className="p-0"
      />
    </tr>
  );
}

// ---------------------------------------------------------------------------
// DataTable
// ---------------------------------------------------------------------------

export type DataTableDensity = 'comfortable' | 'compact';

/** Which rows to render, and the space to leave above and below them. */
export interface DataTableRowWindow {
  indexes: number[];
  before: number;
  after: number;
  /** Ref for each rendered row, to measure its real height. */
  measure?: (el: HTMLElement | null) => void;
  /** True when rows are windowed: rows get aria-rowindex, the table aria-rowcount. */
  virtual?: boolean;
}

/** A hook choosing the rendered rows. DataTableVirtual passes one; the default renders all. */
export type DataTableRowWindowHook = (
  count: number,
  getScrollElement: () => HTMLElement | null,
) => DataTableRowWindow;

const useAllRows: DataTableRowWindowHook = (count) => ({
  indexes: Array.from({ length: count }, (_, i) => i),
  before: 0,
  after: 0,
});

/** First cell of a tree-table row: indent per level and the expand toggle. */
function TreeCell({
  row,
  expandLabel,
  collapseLabel,
  children,
}: {
  row: {
    depth: number;
    getCanExpand: () => boolean;
    getIsExpanded: () => boolean;
    toggleExpanded: () => void;
  };
  expandLabel: string;
  collapseLabel: string;
  children: React.ReactNode;
}) {
  // TanStack Table mutates `row` in place, so the React Compiler would keep a stale
  // getIsExpanded() for the same row object. Opt out (12.1, `pnpm test:compiler`).
  'use no memo';
  const open = row.getIsExpanded();
  const ref = React.useCallback(
    (el: HTMLDivElement | null) => {
      // CSSOM so strict-CSP pages still get the indent.
      if (el) el.style.paddingInlineStart = `${row.depth * 1.5}rem`;
    },
    [row.depth],
  );
  return (
    <div ref={ref} className="flex items-center gap-1">
      {row.getCanExpand() ? (
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? collapseLabel : expandLabel}
          onClick={row.toggleExpanded}
          className="-ms-1 inline-flex size-6 shrink-0 items-center justify-center rounded-shape-min text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]"
        >
          {open ? (
            <ChevronDown size="xs" aria-hidden="true" />
          ) : (
            <ChevronRight size="xs" aria-hidden="true" className="rtl:-scale-x-100" />
          )}
        </button>
      ) : (
        <span className="-ms-1 size-6 shrink-0" aria-hidden="true" />
      )}
      {children}
    </div>
  );
}

/** CSSOM, not a style attribute: strict CSP pages block inline styles. */
const px = (n: number | string) => (typeof n === 'number' ? `${n}px` : n);

const selectFilter: FilterFn<unknown> = (row, id, value: string[]) =>
  value.includes(String(row.getValue(id)));
selectFilter.autoRemove = (value?: string[]) => !value?.length;
const filterFns = {
  text: 'includesString',
  select: selectFilter,
  'number-range': 'inNumberRange',
} as const;

// ponytail: top-level columns only; walk `columns` of group columns if grouped headers ever need filters.
const withFilterFns = <TData,>(columns: DataTableColumn<TData>[]): DataTableColumn<TData>[] =>
  columns.map((c) =>
    c.meta?.filter && !c.filterFn
      ? { ...c, filterFn: filterFns[c.meta.filter] as FilterFnOption<TData> }
      : c,
  );

// Loaded only when a column sets `meta.filter`, so tables without filters don't pull in Radix Popover.
const ColumnFilter = React.lazy(() =>
  import('./ColumnFilter.js').then((m) => ({ default: m.ColumnFilter })),
);

// Loaded only with `viewOptions`, so tables without the menu don't pull in Radix DropdownMenu.
const ViewOptions = React.lazy(() =>
  import('./ViewOptions.js').then((m) => ({ default: m.ViewOptions })),
);

const placeCell =
  <TData,>(column: Column<TData, unknown>, resizable: boolean) =>
  (el: HTMLTableCellElement | null) => {
    if (!el) return;
    el.style.width = resizable ? px(column.getSize()) : '';
    const side = column.getIsPinned();
    el.style.insetInlineStart = side === 'left' ? px(column.getStart('left')) : '';
    el.style.insetInlineEnd = side === 'right' ? px(column.getAfter('right')) : '';
  };

const pinClass = <TData,>(column: Column<TData, unknown>) => {
  const side = column.getIsPinned();
  if (!side) return undefined;
  return cn(
    'sticky z-[1] bg-[var(--color-surface)]',
    '[tr:hover>&]:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,var(--color-surface))]',
    '[tr[data-state=selected]>&]:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))]',
    side === 'left' &&
      column.getIsLastColumn('left') &&
      'border-e border-[var(--color-outline-variant)]',
    side === 'right' &&
      column.getIsFirstColumn('right') &&
      'border-s border-[var(--color-outline-variant)]',
  );
};

interface RowViewProps<TData> {
  row: Row<TData>;
  index: number;
  selected: boolean;
  expanded: boolean;
  /** Changes whenever columns, their order, visibility or pinning change. */
  columns: Column<TData, unknown>[];
  columnSizing: ColumnSizingState;
  compact: boolean;
  pinned: boolean;
  resizable: boolean;
  selectable: boolean;
  tree: boolean;
  virtual: boolean | undefined;
  measure: ((el: HTMLElement | null) => void) | undefined;
  expandLabel: string;
  collapseLabel: string;
  /** Row-reorder drag props: new every render, so reorderable rows always re-render. */
  dragProps: Record<string, unknown> | undefined;
  /** 12.4: the table is streaming; read once, when the row mounts. */
  streaming: boolean;
  /** 12.4: ids of rows the table has already shown (a stable Set). A row not in it enters. */
  seen: Set<string>;
}

function RowViewImpl<TData>({
  row,
  index,
  selected,
  compact,
  pinned,
  resizable,
  selectable,
  tree,
  virtual,
  measure,
  expandLabel,
  collapseLabel,
  dragProps,
  streaming,
  seen,
}: RowViewProps<TData>) {
  // React.memo with sameRow decides when a row re-renders. Inside, TanStack's row and cells are
  // mutated in place, so compiler memoization keyed on them would render stale cells.
  'use no memo';
  // 12.4: a row that arrives while streaming enters with the 12.3 preset (instant under reduced
  // motion). The class goes once it has played, so a later move (sorting) doesn't replay it.
  const [entering, setEntering] = React.useState(() => streaming && !seen.has(row.id));
  return (
    <TableRow
      ref={measure}
      data-index={index}
      aria-rowindex={virtual ? index + 2 : undefined}
      data-state={selectable && selected ? 'selected' : undefined}
      className={entering ? 'nx-motion-enter' : undefined}
      onAnimationEnd={
        entering
          ? (e: React.AnimationEvent) => {
              if (e.target === e.currentTarget) setEntering(false);
            }
          : undefined
      }
      {...dragProps}
    >
      {row.getVisibleCells().map((cell, _i, cells) => (
        <TableCell
          key={cell.id}
          ref={pinned || resizable ? placeCell(cell.column, resizable) : undefined}
          className={cn(
            alignText[cell.column.columnDef.meta?.align ?? 'start'],
            compact && 'py-1.5',
            pinClass(cell.column),
            resizable && 'truncate',
          )}
        >
          {tree && cell === cells.find((c) => c.column.id !== '__select') ? (
            <TreeCell row={row} expandLabel={expandLabel} collapseLabel={collapseLabel}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TreeCell>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}

// Skip rows whose own props didn't change: a new row object (e.g. the parent
// filtered `data`) for the same original at the same place renders the same.
const sameRow = <TData,>(a: RowViewProps<TData>, b: RowViewProps<TData>) =>
  (Object.keys(a) as (keyof RowViewProps<TData>)[]).every(
    (k) => k === 'row' || k === 'streaming' || a[k] === b[k],
  ) &&
  a.row.id === b.row.id &&
  a.row.original === b.row.original &&
  a.row.index === b.row.index &&
  a.row.depth === b.row.depth;

const RowView = React.memo(RowViewImpl, sameRow) as typeof RowViewImpl;

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
   * header, and "Select all N" across pages. Default true; false keeps selection
   * without the column (you render your own checkboxes).
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
  /** Drag a header's edge, or focus it and press Arrow keys, to resize columns. */
  enableColumnResizing?: boolean;
  columnSizing?: ColumnSizingState;
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;
  /** Drag headers to reorder columns, or press Alt+Arrow on a focused header. */
  enableColumnReordering?: boolean;
  columnOrder?: ColumnOrderState;
  onColumnOrderChange?: (order: ColumnOrderState) => void;
  /** Columns that stay in view while the rest scroll sideways: `{ left: ['name'], right: ['actions'] }`. */
  columnPinning?: ColumnPinningState;
  onColumnPinningChange?: (pinning: ColumnPinningState) => void;
  /** Cap the table's height. Rows scroll and the header stays in view. */
  maxHeight?: number | string;
  /**
   * ARIA grid keyboard model for tables whose cells hold actions: the table is
   * one tab stop, and Arrow keys, Home/End and Ctrl+Home/End move between cells.
   */
  grid?: boolean;
  /** Rows to render; set by DataTableVirtual. */
  rowWindow?: DataTableRowWindowHook;
  pagination?: { pageSize?: number };
  /** Controlled sort (with `enableSorting`): `[{ id: 'name', desc: false }]`. */
  sort?: SortingState;
  onSortChange?: (sort: SortingState) => void;
  /** Rows arrive sorted (server-side): headers still toggle `sort`, but rows aren't reordered. */
  manualSort?: boolean;
  /** Controlled page, zero-based. Turns pagination on. */
  page?: number;
  /** Rows per page; overrides `pagination.pageSize`. Turns pagination on. @default 20 */
  pageSize?: number;
  onPageChange?: (page: number) => void;
  /** `data` is the current page only (server-side); set `rowCount` for the page count. Turns pagination on. */
  manualPagination?: boolean;
  /** Total rows across all pages, with `manualPagination`. */
  rowCount?: number;
  /**
   * Column filters, for columns that set `meta.filter`: `[{ id: 'status', value: ['Active'] }]`.
   * Changing a filter goes back to the first page.
   */
  columnFilters?: DataTableColumnFilters;
  defaultColumnFilters?: DataTableColumnFilters;
  onColumnFiltersChange?: (filters: DataTableColumnFilters) => void;
  /** Rows arrive filtered (server-side): the headers still edit `columnFilters`, but rows aren't filtered here. */
  manualFiltering?: boolean;
  /**
   * Nested rows (a tree table): return a row's children. The first column gets
   * an expand toggle and indents each level. Sorting sorts within each level.
   */
  getSubRows?: (row: TData, index: number) => TData[] | undefined;
  /** Expanded rows by id, or `true` for all. */
  expanded?: ExpandedState;
  defaultExpanded?: ExpandedState;
  onExpandedChange?: (expanded: ExpandedState) => void;
  /**
   * Lets people reorder rows: a handle column (drag, or Alt+ArrowUp/Down on the
   * handle). Called with the reordered data. Hidden while a column is sorted.
   */
  onRowOrderChange?: (data: TData[]) => void;
  /** Names a row in "Move ‹label›" and the move announcements. @default its position */
  getRowLabel?: (row: TData) => string;
  /** Shows skeleton rows (one page's worth) and sets aria-busy on the table. */
  loading?: boolean;
  /**
   * 12.4: rows are still arriving (an agent is producing them). Shows a skeleton row after the
   * last row, sets aria-busy, announces the row count every few seconds and "done" when it turns
   * off. Rows that arrive meanwhile enter with the motion preset. Sorting and selection keep working.
   */
  streaming?: boolean;
  /** Shown in a full-width row when there are no rows. @default messages.noResults */
  emptyState?: React.ReactNode;
  /** Shown in a full-width row when a load failed, e.g. `<ErrorState title="…" onRetry={…} />`. Wins over loading and empty. */
  errorState?: React.ReactNode;
}

/** 12.4: how often, at most, a streaming table announces its row count. */
const STREAM_ANNOUNCE_MS = 3000;

/**
 * 12.4: while `streaming`, announce the count at most every STREAM_ANNOUNCE_MS (not once per
 * row), starting one interval after the stream begins; when it stops, announce "done".
 */
function useStreamingAnnouncements(
  streaming: boolean,
  count: number,
  say: (count: number, done: boolean) => void,
) {
  const latest = React.useRef({ count, say });
  const state = React.useRef<{ on: boolean; last: number; timer?: ReturnType<typeof setTimeout> }>(
    { on: false, last: 0 },
  );
  React.useEffect(() => {
    latest.current = { count, say };
  });
  React.useEffect(() => {
    const s = state.current;
    if (streaming && !s.on) {
      s.on = true;
      s.last = Date.now();
    } else if (!streaming && s.on) {
      s.on = false;
      clearTimeout(s.timer);
      s.timer = undefined;
      say(count, true);
    } else if (streaming && s.timer === undefined) {
      s.timer = setTimeout(
        () => {
          s.timer = undefined;
          s.last = Date.now();
          latest.current.say(latest.current.count, false);
        },
        Math.max(0, s.last + STREAM_ANNOUNCE_MS - Date.now()),
      );
    }
    // `say` is read through `latest`; only the stream and the count drive announcements.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming, count]);
  React.useEffect(() => {
    const s = state.current;
    return () => {
      clearTimeout(s.timer);
      s.timer = undefined;
    };
  }, []);
}

/** TanStack hands back updaters; apply one to the current value. */
const apply = <T,>(u: Updater<T>, prev: T): T =>
  typeof u === 'function' ? (u as (p: T) => T)(prev) : u;

const columnLabel = <TData,>(c: { id: string; columnDef: DataTableColumn<TData> }) =>
  typeof c.columnDef.header === 'string' ? c.columnDef.header : c.id;

export function DataTable<TData>({
  columns,
  data,
  enableSorting = false,
  enableRowSelection = false,
  selectionColumn = true,
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
  enableColumnResizing = false,
  columnSizing: columnSizingProp,
  onColumnSizingChange,
  enableColumnReordering = false,
  columnOrder: columnOrderProp,
  onColumnOrderChange,
  columnPinning: columnPinningProp,
  onColumnPinningChange,
  maxHeight,
  grid = false,
  rowWindow,
  pagination: paginationProp,
  sort,
  onSortChange,
  manualSort = false,
  page,
  pageSize: pageSizeProp,
  onPageChange,
  manualPagination = false,
  rowCount,
  columnFilters: columnFiltersProp,
  defaultColumnFilters,
  onColumnFiltersChange,
  manualFiltering = false,
  getSubRows,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  onRowOrderChange,
  getRowLabel,
  loading = false,
  streaming = false,
  emptyState,
  errorState,
  caption,
  captionHidden = false,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: DataTableProps<TData>) {
  const messages = useNexubMessages();
  const hasError = errorState != null && errorState !== false;
  const { locale, dir } = useLocale();
  const [sorting = [], setSorting] = useControllableState<SortingState>({
    value: sort,
    defaultValue: [],
    onChange: onSortChange,
  });
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
  const [columnSizing = {}, setColumnSizing] = useControllableState<ColumnSizingState>({
    value: columnSizingProp,
    defaultValue: {},
    onChange: onColumnSizingChange,
  });
  const [columnOrder = [], setColumnOrder] = useControllableState<ColumnOrderState>({
    value: columnOrderProp,
    defaultValue: [],
    onChange: onColumnOrderChange,
  });
  const [pinningIn = {}, setColumnPinning] = useControllableState<ColumnPinningState>({
    value: columnPinningProp,
    defaultValue: {},
    onChange: onColumnPinningChange,
  });
  const [expanded = {}, setExpanded] = useControllableState<ExpandedState>({
    value: expandedProp,
    defaultValue: defaultExpanded ?? {},
    onChange: onExpandedChange,
  });
  const [columnFilters = [], setColumnFilters] = useControllableState<ColumnFiltersState>({
    value: columnFiltersProp,
    defaultValue: defaultColumnFilters ?? [],
    onChange: onColumnFiltersChange,
  });
  const [announcement, setAnnouncement] = React.useState('');
  const [seenRows] = React.useState(() => new Set<string>());
  const tableRef = React.useRef<HTMLTableElement>(null);
  const gridNav = React.useMemo(() => createGridNavigation(dir), [dir]);
  const dragged = React.useRef<string | null>(null);
  const pagination =
    !!paginationProp || page !== undefined || pageSizeProp !== undefined || manualPagination;
  const [pageIndex = 0, setPageIndex] = useControllableState<number>({
    value: page,
    defaultValue: 0,
    onChange: onPageChange,
  });
  const pageSize = pageSizeProp ?? paginationProp?.pageSize ?? 20;
  const paginationState = React.useMemo<PaginationState>(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  );

  const withSelectColumn = enableRowSelection && selectionColumn;
  const reorderRows = Boolean(onRowOrderChange) && sorting.length === 0;
  const rowReorder = useReorder({
    lists: [data],
    getId: (r: TData) => (getRowId ? getRowId(r, data.indexOf(r)) : String(data.indexOf(r))),
    getLabel: (r: TData) => getRowLabel?.(r) ?? String(data.indexOf(r) + 1),
    onMove: (next) => onRowOrderChange?.(next[0]!),
  });
  // The checkbox column stays first: pinned along with any left-pinned column.
  const columnPinning = React.useMemo<ColumnPinningState>(
    () =>
      withSelectColumn && pinningIn.left?.length && !pinningIn.left.includes('__select')
        ? { ...pinningIn, left: ['__select', ...pinningIn.left] }
        : pinningIn,
    [withSelectColumn, pinningIn],
  );
  // rowReorder is a new object every render. Cells call it while rendering, so the ref is
  // set during render (not in an effect, which would leave them one render stale) and the
  // columns stay stable.
  const rowReorderRef = React.useRef(rowReorder);
  rowReorderRef.current = rowReorder;
  const withRowHandles = React.useCallback(
    (cols: DataTableColumn<TData>[]): DataTableColumn<TData>[] =>
      reorderRows
        ? [
            {
              id: '__drag',
              enableSorting: false,
              enableHiding: false,
              header: () => null,
              cell: ({ row }) =>
                row.depth === 0 ? rowReorderRef.current.handle([0, row.index]) : null,
            },
            ...cols,
          ]
        : cols,
    [reorderRows],
  );
  const allColumns = React.useMemo<DataTableColumn<TData>[]>(
    () =>
      withRowHandles(
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
                      table.getIsAllPageRowsSelected()
                        ? true
                        : table.getIsSomePageRowsSelected()
                          ? 'indeterminate'
                          : false
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
              ...withFilterFns(columns),
            ]
          : withFilterFns(columns),
      ),
    [withSelectColumn, columns, messages.selectAllOnPage, messages.selectRow, withRowHandles],
  );

  // Memoize the state bag so a parent re-render with stable sort/selection/pagination
  // values doesn't hand a new object reference to TanStack on every render.
  const tableState = React.useMemo(
    () => ({
      sorting: enableSorting ? sorting : undefined,
      rowSelection: enableRowSelection ? rowSelection : undefined,
      pagination: pagination ? paginationState : undefined,
      columnVisibility,
      columnSizing,
      columnOrder,
      columnPinning,
      columnFilters,
      expanded: getSubRows ? expanded : undefined,
    }),

    [
      getSubRows,
      expanded,
      enableSorting,
      sorting,
      enableRowSelection,
      rowSelection,
      pagination,
      paginationState,
      columnVisibility,
      columnSizing,
      columnOrder,
      columnPinning,
      columnFilters,
    ],
  );

  const table = useReactTable({
    data,
    columns: allColumns,
    state: tableState,
    getRowId,
    onSortingChange: enableSorting ? (u) => setSorting(apply(u, sorting)) : undefined,
    manualSorting: manualSort,
    onRowSelectionChange: enableRowSelection
      ? (u) => setRowSelection(apply(u, rowSelection))
      : undefined,
    onColumnVisibilityChange: (u) => setColumnVisibility(apply(u, columnVisibility)),
    onColumnSizingChange: (u) => setColumnSizing(apply(u, columnSizing)),
    onColumnOrderChange: (u) => setColumnOrder(apply(u, columnOrder)),
    onColumnPinningChange: (u) => setColumnPinning(apply(u, columnPinning)),
    onColumnFiltersChange: (u) => {
      setColumnFilters(apply(u, columnFilters));
      // Explicit, because TanStack's own reset doesn't run with manual filtering or pagination.
      if (pagination && pageIndex !== 0) setPageIndex(0);
    },
    manualFiltering,
    enableColumnResizing,
    columnResizeMode: 'onChange',
    columnResizeDirection: dir,
    onPaginationChange: pagination
      ? (u) => {
          const next = apply(u, paginationState).pageIndex;
          if (next !== pageIndex) setPageIndex(next);
        }
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting && !manualSort ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination && !manualPagination ? getPaginationRowModel() : undefined,
    rowCount,
    getSubRows,
    getExpandedRowModel: getSubRows ? getExpandedRowModel() : undefined,
    onExpandedChange: getSubRows ? (u) => setExpanded(apply(u, expanded)) : undefined,
    // With pages, count top-level rows so a parent and its children stay together
    // (TanStack then expands inside the page model; without pages it must not).
    paginateExpandedRows: !pagination,
    enableRowSelection,
    manualPagination,
  });

  const compact = density === 'compact';
  const selectedRows = enableRowSelection ? table.getSelectedRowModel().rows : [];
  const totalRows = table.getCoreRowModel().rows.length;
  const fmt = (n: number) => new Intl.NumberFormat(locale).format(n);

  // 12.4 streaming: remember the rows already shown, so only arrivals enter.
  React.useEffect(() => {
    if (!streaming) {
      seenRows.clear();
      return;
    }
    for (const r of table.getCoreRowModel().flatRows) seenRows.add(r.id);
  });
  useStreamingAnnouncements(streaming, data.length, (count, done) =>
    setAnnouncement(done ? messages.rowsDone(fmt(count)) : messages.rowsSoFar(fmt(count))),
  );

  const multiSort = sorting.length > 1;
  // Whole page selected but more rows exist on other pages: offer the rest.
  const offerAll =
    withSelectColumn &&
    !!pagination &&
    table.getIsAllPageRowsSelected() &&
    totalRows > table.getRowModel().rows.length;
  const clear = () => table.resetRowSelection(true);

  const rows = table.getRowModel().rows;
  const useRowWindow = rowWindow ?? useAllRows;
  const rowWin = useRowWindow(rows.length, () => tableRef.current?.parentElement ?? null);
  const pinned = (columnPinning.left?.length ?? 0) + (columnPinning.right?.length ?? 0) > 0;
  const hasFooter =
    !hasError && !loading && table.getAllLeafColumns().some((c) => c.columnDef.footer != null);

  // Sizes and offsets through the CSSOM (strict CSP: no style attributes).
  useIsomorphicLayoutEffect(() => {
    const t = tableRef.current;
    if (!t) return;
    t.style.width = enableColumnResizing ? px(table.getTotalSize()) : '';
    const scroller = t.parentElement;
    if (scroller) scroller.style.maxHeight = maxHeight == null ? '' : px(maxHeight);
    if (grid) gridNav.sync(t);
  });
  const visibleColumns = table.getVisibleLeafColumns();
  // 12.4: the skeleton row after the last row while more arrive. Hidden from screen readers:
  // aria-busy and the live count say it instead.
  const streamingTail = (
    <TableRow aria-hidden="true" data-streaming="" className="hover:bg-transparent">
      {visibleColumns.map((c) => (
        <TableCell key={c.id} className={cn(compact && 'py-1.5')}>
          <Skeleton />
        </TableCell>
      ))}
    </TableRow>
  );
  const viewButton = (
    <Button variant="outlined" size="sm" className="ms-auto">
      <SlidersHorizontal size="sm" aria-hidden="true" />
      {messages.view}
    </Button>
  );

  // Move a column one step (keyboard) or onto another's place (drag).
  const moveColumn = (id: string, to: number | string) => {
    const ids = table.getAllLeafColumns().map((c) => c.id);
    const order = (columnOrder.length ? columnOrder : ids).filter(
      (c) => c !== '__select' && ids.includes(c),
    );
    for (const c of ids) if (c !== '__select' && !order.includes(c)) order.push(c);
    const from = order.indexOf(id);
    const target = typeof to === 'number' ? from + to : order.indexOf(to);
    if (from < 0 || target < 0 || target >= order.length || target === from) return;
    order.splice(from, 1);
    order.splice(target, 0, id);
    setColumnOrder(withSelectColumn ? ['__select', ...order] : order);
    if (typeof to === 'number') {
      const col = table.getColumn(id);
      setAnnouncement(messages.columnMoved(col ? columnLabel(col) : id, target + 1, order.length));
    }
  };

  return (
    <div className={cn('space-y-4', className)} data-density={density} {...props}>
      {(toolbar != null || viewOptions) && (
        <div className="flex flex-wrap items-center gap-2">
          {toolbar}
          {viewOptions && (
            // The plain button stands in (same size, no layout shift) until the menu loads.
            <React.Suspense fallback={viewButton}>
              <ViewOptions
                trigger={viewButton}
                density={density}
                onDensityChange={setDensity}
                columns={table
                  .getAllLeafColumns()
                  .filter((c) => c.getCanHide())
                  .map((c) => ({
                    id: c.id,
                    label: columnLabel(c),
                    visible: c.getIsVisible(),
                    toggle: (v: boolean) => c.toggleVisibility(v),
                  }))}
              />
            </React.Suspense>
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
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
      {reorderRows && rowReorder.live}
      <TableRoot
        ref={tableRef}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-rowcount={rowWin.virtual ? rows.length + 1 + (hasFooter ? 1 : 0) : undefined}
        aria-busy={((loading || streaming) && !hasError) || undefined}
        role={grid ? 'grid' : undefined}
        onKeyDown={grid ? gridNav.onKeyDown : undefined}
        onFocus={grid ? gridNav.onFocus : undefined}
        className={cn(enableColumnResizing && 'table-fixed')}
      >
        {caption != null && (
          <Table.Caption className={cn(captionHidden && 'sr-only')}>{caption}</Table.Caption>
        )}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const align = header.column.columnDef.meta?.align ?? 'start';
                const col = header.column;
                const reorderable =
                  enableColumnReordering && col.id !== '__select' && !col.getIsPinned();
                const sortable = enableSorting && col.getCanSort();
                const filterType =
                  !header.isPlaceholder && col.getCanFilter()
                    ? col.columnDef.meta?.filter
                    : undefined;
                const filterValue = col.getFilterValue();
                const filterName = filterType ? messages.filterColumn(columnLabel(col)) : '';
                const filterButton = filterType && (
                  <button
                    type="button"
                    aria-label={
                      filterValue === undefined
                        ? filterName
                        : `${filterName}, ${messages.filtersApplied(filterType === 'select' ? (filterValue as string[]).length : 1)}`
                    }
                    data-active={filterValue !== undefined || undefined}
                    className={cn(
                      'relative inline-flex size-6 shrink-0 items-center justify-center rounded-shape-min hover:bg-[var(--color-surface-container-high)]',
                      filterValue === undefined
                        ? 'text-[var(--color-on-surface-variant)]'
                        : 'text-[var(--color-primary)]',
                    )}
                  >
                    <Filter size="xs" aria-hidden="true" />
                    {filterValue !== undefined && (
                      <span
                        aria-hidden="true"
                        className="absolute end-0 top-0 size-1.5 rounded-full bg-[var(--color-primary)]"
                      />
                    )}
                  </button>
                );
                const label = header.isPlaceholder ? null : enableSorting &&
                  header.column.getCanSort() ? (
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
                      <span className="text-[0.625rem] tabular-nums leading-none">
                        <span aria-hidden="true">{header.column.getSortIndex() + 1}</span>
                        <span className="sr-only">
                          {messages.sortOrder(header.column.getSortIndex() + 1)}
                        </span>
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
                );
                return (
                  <TableHead
                    key={header.id}
                    ref={placeCell(col, enableColumnResizing)}
                    className={cn(
                      alignText[align],
                      compact && 'h-8',
                      (col.id === '__select' || col.id === '__drag') && 'w-10',
                      // Anchors the resize handle; sticky (below) wins when set and anchors it too.
                      (enableColumnResizing || reorderable) && 'relative',
                      maxHeight != null && 'sticky top-0 z-[2] bg-[var(--color-surface)]',
                      pinClass(col),
                      maxHeight != null &&
                        col.getIsPinned() &&
                        'z-[3] [tr:hover>&]:bg-[var(--color-surface)]',
                      reorderable && 'cursor-grab',
                    )}
                    tabIndex={reorderable && !sortable ? 0 : undefined}
                    draggable={reorderable || undefined}
                    onDragStart={reorderable ? () => (dragged.current = col.id) : undefined}
                    onDragOver={reorderable ? (e) => e.preventDefault() : undefined}
                    onDrop={
                      reorderable
                        ? (e) => {
                            e.preventDefault();
                            if (dragged.current) moveColumn(dragged.current, col.id);
                            dragged.current = null;
                          }
                        : undefined
                    }
                    onKeyDown={
                      reorderable
                        ? (e) => {
                            if (!e.altKey || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight'))
                              return;
                            e.preventDefault();
                            const forward = (e.key === 'ArrowRight') === (dir !== 'rtl');
                            moveColumn(col.id, forward ? 1 : -1);
                          }
                        : undefined
                    }
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
                    {filterType && filterButton ? (
                      <div className={cn('flex items-center gap-1', alignJustify[align])}>
                        {label}
                        {/* The plain button stands in (same size, no layout shift) until the popover loads. */}
                        <React.Suspense fallback={filterButton}>
                          <ColumnFilter
                            trigger={filterButton}
                            type={filterType}
                            label={columnLabel(col)}
                            value={filterValue}
                            onChange={col.setFilterValue}
                            getOptions={() =>
                              col.columnDef.meta?.filterOptions ??
                              [
                                ...new Set(
                                  table
                                    .getCoreRowModel()
                                    .flatRows.map((r) => String(r.getValue(col.id))),
                                ),
                              ].sort((a, b) => a.localeCompare(b, locale, { numeric: true }))
                            }
                          />
                        </React.Suspense>
                      </div>
                    ) : (
                      label
                    )}
                    {enableColumnResizing && col.getCanResize() && (
                      <div
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={messages.resizeColumn(columnLabel(col))}
                        aria-valuenow={header.getSize()}
                        aria-valuemin={col.columnDef.minSize ?? 20}
                        aria-valuemax={col.columnDef.maxSize ?? 1000}
                        tabIndex={0}
                        draggable={false}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        onDoubleClick={() => col.resetSize()}
                        onKeyDown={(e) => {
                          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
                          e.preventDefault();
                          e.stopPropagation();
                          const grow = (e.key === 'ArrowRight') === (dir !== 'rtl');
                          const min = col.columnDef.minSize ?? 20;
                          const max = col.columnDef.maxSize ?? 1000;
                          const size = Math.min(
                            max,
                            Math.max(min, header.getSize() + (grow ? 16 : -16)),
                          );
                          table.setColumnSizing((s) => ({ ...s, [col.id]: size }));
                        }}
                        className={cn(
                          'absolute inset-y-0 end-0 z-[1] w-2 cursor-col-resize touch-none select-none outline-none',
                          'after:absolute after:inset-y-2 after:end-0 after:w-px after:bg-[var(--color-outline-variant)]',
                          'hover:after:w-0.5 hover:after:bg-[var(--color-primary)] focus-visible:after:w-0.5 focus-visible:after:bg-[var(--color-primary)]',
                          col.getIsResizing() && 'after:w-0.5 after:bg-[var(--color-primary)]',
                        )}
                      />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {hasError ? (
            <TableRow data-error="" className="hover:bg-transparent">
              <TableCell colSpan={table.getVisibleLeafColumns().length}>{errorState}</TableCell>
            </TableRow>
          ) : loading ? (
            Array.from({ length: pagination ? pageSize : 5 }, (_, i) => (
              <TableRow key={i} data-loading="" className="hover:bg-transparent">
                {table.getVisibleLeafColumns().map((c) => (
                  <TableCell key={c.id} className={cn(compact && 'py-1.5')}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length ? (
            <>
              {rowWin.before > 0 && <Spacer height={rowWin.before} />}
              {rowWin.indexes.map((i) => {
                const row = rows[i]!;
                return (
                  <RowView
                    key={row.id}
                    row={row}
                    index={i}
                    selected={enableRowSelection && row.getIsSelected()}
                    expanded={!!getSubRows && row.getIsExpanded()}
                    columns={visibleColumns}
                    columnSizing={columnSizing}
                    compact={compact}
                    pinned={pinned}
                    resizable={enableColumnResizing}
                    selectable={enableRowSelection}
                    tree={!!getSubRows}
                    virtual={rowWin.virtual}
                    measure={rowWin.measure}
                    expandLabel={messages.expandRow}
                    collapseLabel={messages.collapseRow}
                    dragProps={
                      reorderRows && row.depth === 0
                        ? rowReorder.itemProps([0, row.index])
                        : undefined
                    }
                    streaming={streaming}
                    seen={seenRows}
                  />
                );
              })}
              {rowWin.after > 0 && <Spacer height={rowWin.after} />}
              {streaming && streamingTail}
            </>
          ) : streaming ? (
            // Nothing yet, more on the way: the skeleton row, not the empty state.
            streamingTail
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center text-[var(--color-on-surface-muted)]"
              >
                {/* Filters hid every row: that is "no results", not the table's own "no data" state. */}
                {columnFilters.length ? messages.noResults : (emptyState ?? messages.noResults)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {hasFooter && (
          <tfoot className="border-t border-[var(--color-outline-variant)] font-medium tabular-nums">
            {table.getFooterGroups().map((group) => (
              <tr key={group.id} aria-rowindex={rowWin.virtual ? rows.length + 2 : undefined}>
                {group.headers.map((footer) => {
                  const col = footer.column;
                  return (
                    <TableCell
                      key={footer.id}
                      ref={
                        pinned || enableColumnResizing
                          ? placeCell(col, enableColumnResizing)
                          : undefined
                      }
                      className={cn(
                        alignText[col.columnDef.meta?.align ?? 'start'],
                        compact && 'py-1.5',
                        // With a capped height the totals stay in view, like the header.
                        maxHeight != null &&
                          'sticky bottom-0 z-[2] bg-[var(--color-surface)] shadow-[inset_0_1px_0_var(--color-outline-variant)]',
                        pinClass(col),
                        col.getIsPinned() && '[tr:hover>&]:bg-[var(--color-surface)]',
                        maxHeight != null && col.getIsPinned() && 'z-[3]',
                        enableColumnResizing && 'truncate',
                      )}
                    >
                      {footer.isPlaceholder
                        ? null
                        : flexRender(col.columnDef.footer, footer.getContext())}
                    </TableCell>
                  );
                })}
              </tr>
            ))}
          </tfoot>
        )}
      </TableRoot>

      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-body-sm text-[var(--color-on-surface-muted)]">
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
          <Button variant="text" size="sm" onClick={clear} aria-label={messages.clearSelection}>
            <X size="sm" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}
