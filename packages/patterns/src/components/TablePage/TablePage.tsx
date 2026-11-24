import * as React from 'react';
import {
  Badge,
  Button,
  DataTable,
  EmptyStatePreset,
  Tabs,
  VisuallyHidden,
  type DataTableColumn,
  type DataTableProps,
} from '@nexub/react';
import { FilterBar } from '../FilterBar/index.js';
import { PageFrame, usePageStrings, type PageFrameProps, type PageTemplateMessages } from '../PageFrame/PageFrame.js';
import { sharedMessages } from '../PageFrame/messages/shared.js';
import { tableMessages } from '../PageFrame/messages/table.js';

/** The defaults this template shows (11.7: not every template's strings). */
const STRINGS = { ...sharedMessages, ...tableMessages };

export interface TablePageTab {
  id: string;
  label: React.ReactNode;
  count?: number;
}

export interface TablePageProps<TData> extends Omit<PageFrameProps, 'title' | 'children'> {
  title: React.ReactNode;
  columns: DataTableColumn<TData>[];
  data: TData[];
  getRowId?: (row: TData, index: number) => string;
  /** A search field above the table. Your app filters `data`. */
  search?: { value: string; onChange: (value: string) => void; placeholder?: string };
  /** Beside the search: filter chips, a FilterBuilder trigger. */
  filters?: React.ReactNode;
  /** How many filters are on: shows "N filters" with a clear button, and picks the "no results" empty state. */
  activeFilterCount?: number;
  onClearFilters?: () => void;
  /** Actions for the selected rows; turns row selection on. */
  bulkActions?: (rows: TData[], clear: () => void) => React.ReactNode;
  /** A trailing column per row: a menu button, "Edit". */
  rowActions?: (row: TData) => React.ReactNode;
  /** Opens a record: the first cell becomes a button. */
  onRowOpen?: (row: TData) => void;
  pagination?: DataTableProps<TData>['pagination'];
  /** Saved segments above the table: "All", "Active", "Archived". Your app filters `data` by `tab`. */
  tabs?: TablePageTab[];
  tab?: string;
  onTabChange?: (id: string) => void;
  /** Skeleton rows; sets aria-busy on the table. */
  loading?: boolean;
  /** @default the "no data" preset with `actions`, or "no results" with Clear filters while a search or filter is on */
  emptyState?: React.ReactNode;
  /** Shown in the table in place of rows; wins over `loading` and the empty state. */
  errorState?: React.ReactNode;
  /** Anything else DataTable takes: `viewOptions`, `sort`, `density`, `columnFilters`… */
  tableProps?: Partial<Omit<DataTableProps<TData>, 'columns' | 'data'>>;
  messages?: Partial<PageTemplateMessages>;
  ref?: React.Ref<HTMLElement>;
}

type CellContext<TData> = { row: { original: TData }; getValue: () => unknown };

/** The standard "list of records" screen: segments, search and filters, a DataTable, and the data states. */
export function TablePage<TData>({
  title,
  actions,
  columns,
  data,
  getRowId,
  search,
  filters,
  activeFilterCount = 0,
  onClearFilters,
  bulkActions,
  rowActions,
  onRowOpen,
  pagination,
  tabs,
  tab,
  onTabChange,
  loading,
  emptyState,
  errorState,
  tableProps,
  messages,
  ref,
  ...props
}: TablePageProps<TData>) {
  const m = usePageStrings(messages, STRINGS);

  const cols = React.useMemo(() => {
    const out = [...columns];
    const first = out[0] as (DataTableColumn<TData> & { cell?: unknown }) | undefined;
    if (onRowOpen && first) {
      const inner = first.cell;
      out[0] = {
        ...first,
        // A real button in the cell: a click handler on the <tr> alone leaves keyboards out.
        cell: (ctx: CellContext<TData>) => (
          <button
            type="button"
            onClick={() => onRowOpen(ctx.row.original)}
            className="rounded-shape-control text-start font-medium text-[var(--color-on-surface)] underline-offset-[0.2em] hover:underline"
          >
            {typeof inner === 'function' ? (inner as (c: CellContext<TData>) => React.ReactNode)(ctx) : ((inner as React.ReactNode) ?? (ctx.getValue() as React.ReactNode))}
          </button>
        ),
      } as DataTableColumn<TData>;
    }
    if (rowActions)
      out.push({
        id: 'actions',
        header: () => <VisuallyHidden>{m.rowActions}</VisuallyHidden>,
        cell: (ctx: CellContext<TData>) => <div className="flex justify-end gap-1">{rowActions(ctx.row.original)}</div>,
        enableSorting: false,
        enableHiding: false,
        meta: { align: 'end' },
      } as DataTableColumn<TData>);
    return out;
  }, [columns, onRowOpen, rowActions, m.rowActions]);

  const filtered = activeFilterCount > 0 || !!search?.value;
  const empty =
    emptyState ??
    (filtered ? (
      <EmptyStatePreset
        kind="noResults"
        actions={
          onClearFilters && (
            <Button variant="tonal" onClick={onClearFilters}>
              {m.clearFilters}
            </Button>
          )
        }
      />
    ) : (
      <EmptyStatePreset kind="noData" actions={actions} />
    ));

  const body = (
    <div className="flex min-w-0 flex-col gap-4">
      {search ? (
        <FilterBar
          searchValue={search.value}
          onSearch={search.onChange}
          searchPlaceholder={search.placeholder}
          filters={filters}
          activeCount={activeFilterCount}
          onClearAll={onClearFilters}
        />
      ) : (
        filters && (
          <div className="flex flex-wrap items-center gap-2">
            {filters}
            {activeFilterCount > 0 && onClearFilters && (
              <Button variant="link" size="sm" onClick={onClearFilters}>
                {m.clearFilters}
              </Button>
            )}
          </div>
        )
      )}
      <DataTable
        caption={title}
        captionHidden
        columns={cols}
        data={data}
        getRowId={getRowId}
        enableRowSelection={bulkActions ? true : undefined}
        bulkActions={bulkActions}
        pagination={pagination}
        loading={loading}
        emptyState={empty}
        errorState={errorState}
        {...tableProps}
      />
    </div>
  );

  const current = tab ?? tabs?.[0]?.id;
  return (
    <PageFrame ref={ref} width="lg" title={title} actions={actions} {...props}>
      {tabs?.length ? (
        <Tabs.Root value={current} onValueChange={onTabChange} className="flex min-w-0 flex-col gap-4">
          <Tabs.List>
            {tabs.map((t) => (
              <Tabs.Trigger key={t.id} value={t.id}>
                {t.label}
                {t.count != null && (
                  <Badge size="sm" variant="soft">
                    {t.count}
                  </Badge>
                )}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {/* One panel: the app swaps `data` for the chosen segment. */}
          <Tabs.Content value={current!}>{body}</Tabs.Content>
        </Tabs.Root>
      ) : (
        body
      )}
    </PageFrame>
  );
}
