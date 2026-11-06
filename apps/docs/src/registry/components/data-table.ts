import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'data-table',
    title: 'Data Table',
    description: 'Feature-rich data table with sorting and row selection powered by TanStack Table.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    updatedIn: '5.3.0',
  },
  props: [
    { name: 'columns', type: 'DataTableColumn<TData>[]', required: true, description: 'TanStack Table column definitions (`DataTableColumn` is exported from @nexub/react). Set `meta: { align: \'end\' }` for numeric columns; headers, sort buttons and cells follow it.' },
    { name: 'data', type: 'TData[]', required: true, description: 'Array of row data objects to render.' },
    { name: 'caption', type: 'ReactNode', required: false, description: 'Names the table for assistive tech (and its scroll region). Shown below the table; add `captionHidden` to keep it screen-reader only.' },
    { name: 'enableSorting', type: 'boolean', default: 'false', required: false, description: 'Click a header to sort; Shift+click adds more columns, numbered 1, 2… (5.3).' },
    { name: 'enableRowSelection', type: 'boolean', default: 'false', required: false, description: 'Turns on row selection state.' },
    { name: 'selectionColumn', type: 'boolean', default: 'false', required: false, description: 'With `enableRowSelection` (5.3): a checkbox column, select-page in its header, and "Select all N" across pages. On by default from 6.0.' },
    { name: 'rowSelection / onRowSelectionChange', type: 'Record<string, boolean>', required: false, description: 'Controlled selection keyed by row id (5.3).' },
    { name: 'getRowId', type: '(row: TData, index: number) => string', required: false, description: 'Stable row ids for selection; defaults to the row index (5.3).' },
    { name: 'bulkActions', type: '(rows: TData[], clear: () => void) => ReactNode', required: false, description: 'A floating bar while rows are selected, with the count, your actions and a clear button (5.3).' },
    { name: 'density / defaultDensity / onDensityChange', type: "'comfortable' | 'compact'", default: "'comfortable'", required: false, description: 'Row height (5.3).' },
    { name: 'columnVisibility / onColumnVisibilityChange', type: 'Record<string, boolean>', required: false, description: 'Which columns show, keyed by column id (5.3).' },
    { name: 'viewOptions', type: 'boolean', default: 'false', required: false, description: 'A "View" menu above the table for density and column visibility (5.3).' },
    { name: 'toolbar', type: 'ReactNode', required: false, description: 'Content at the start of the row above the table, e.g. filters (5.3).' },
    { name: 'pagination.pageSize', type: 'number', default: '20', required: false, description: 'Rows per page; pagination is on when `pagination` is set.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'With sorting',
    },
    {
      title: 'Selection, bulk actions and view menu',
      description: 'Select rows with the checkbox column; the bar at the bottom acts on them. The View menu switches density and hides columns.',
    },
  ],
};

export default entry;
