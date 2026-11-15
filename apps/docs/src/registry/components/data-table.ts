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
    updatedIn: '5.4.0',
  },
  props: [
    { name: 'columns', type: 'DataTableColumn<TData>[]', required: true, description: 'TanStack Table column definitions (`DataTableColumn` is exported from @nexub/react). Set `meta: { align: \'end\' }` for numeric columns; headers, sort buttons and cells follow it.' },
    { name: 'data', type: 'TData[]', required: true, description: 'Array of row data objects to render.' },
    { name: 'getSubRows', type: '(row, index) => TData[] | undefined', required: false, description: 'Nested rows (a tree table). The first column gets an expand toggle (`aria-expanded`) and indents each level; sorting sorts within each level.' },
    { name: 'expanded / defaultExpanded / onExpandedChange', type: 'ExpandedState', required: false, description: 'Expanded rows by row id (see `getRowId`), or `true` for all.' },
    { name: 'onRowOrderChange', type: '(data: TData[]) => void', required: false, description: 'Adds a handle column: drag rows, or Alt+ArrowUp/Down on a handle. Hidden while a column is sorted.' },
    { name: 'getRowLabel', type: '(row) => string', required: false, description: 'Names a row in "Move ‹label›" and the move announcements.' },
    { name: 'caption', type: 'ReactNode', required: false, description: 'Names the table for assistive tech (and its scroll region). Shown below the table; add `captionHidden` to keep it screen-reader only.' },
    { name: 'enableSorting', type: 'boolean', default: 'false', required: false, description: 'Click a header to sort; Shift+click adds more columns, numbered 1, 2… (5.3).' },
    { name: 'enableRowSelection', type: 'boolean', default: 'false', required: false, description: 'Turns on row selection state.' },
    { name: 'selectionColumn', type: 'boolean', default: 'true', required: false, description: 'With `enableRowSelection`: a checkbox column, select-page in its header, and "Select all N" across pages (on by default from 6.0). `false` keeps selection without the column.' },
    { name: 'rowSelection / onRowSelectionChange', type: 'Record<string, boolean>', required: false, description: 'Controlled selection keyed by row id (5.3).' },
    { name: 'getRowId', type: '(row: TData, index: number) => string', required: false, description: 'Stable row ids for selection; defaults to the row index (5.3).' },
    { name: 'bulkActions', type: '(rows: TData[], clear: () => void) => ReactNode', required: false, description: 'A floating bar while rows are selected, with the count, your actions and a clear button (5.3).' },
    { name: 'density / defaultDensity / onDensityChange', type: "'comfortable' | 'compact'", default: "'comfortable'", required: false, description: 'Row height (5.3).' },
    { name: 'columnVisibility / onColumnVisibilityChange', type: 'Record<string, boolean>', required: false, description: 'Which columns show, keyed by column id (5.3).' },
    { name: 'viewOptions', type: 'boolean', default: 'false', required: false, description: 'A "View" menu above the table for density and column visibility (5.3).' },
    { name: 'toolbar', type: 'ReactNode', required: false, description: 'Content at the start of the row above the table, e.g. filters (5.3).' },
    { name: 'enableColumnResizing', type: 'boolean', default: 'false', required: false, description: 'Drag a header edge to resize (5.4). The handle is focusable: Arrow keys resize by 16px, double-click resets.' },
    { name: 'columnSizing / onColumnSizingChange', type: 'Record<string, number>', required: false, description: 'Column widths in px, keyed by column id (5.4).' },
    { name: 'enableColumnReordering', type: 'boolean', default: 'false', required: false, description: 'Drag headers to reorder, or Alt+Arrow on a focused header; the move is announced (5.4).' },
    { name: 'columnOrder / onColumnOrderChange', type: 'string[]', required: false, description: 'Column ids in display order (5.4).' },
    { name: 'columnPinning / onColumnPinningChange', type: '{ left?: string[]; right?: string[] }', required: false, description: 'Columns that stay in view while the rest scroll sideways (5.4). The selection column pins with them.' },
    { name: 'maxHeight', type: 'number | string', required: false, description: 'Caps the height: rows scroll and the header sticks (5.4).' },
    { name: 'grid', type: 'boolean', default: 'false', required: false, description: 'ARIA grid keyboard model for tables whose cells hold actions (5.8): the table is one tab stop; Arrow keys move between cells and the controls in them, Home/End to the row ends, Ctrl+Home/End to the corners.' },
    { name: 'DataTableVirtual', type: "import from '@nexub/react/DataTableVirtual'", required: false, description: 'Same props plus `maxHeight` (required), `estimateRowHeight` and `overscan`: renders only the rows in view, for thousands of rows. Needs `@tanstack/react-virtual` installed (5.4). No pagination.' },
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
    {
      title: 'Resize, reorder and pin',
      description: 'Drag header edges to resize and headers to reorder (or Alt+Arrow). Invoice stays pinned while the rest scroll; the header sticks within `maxHeight`.',
    },
    {
      title: '10,000 rows (DataTableVirtual)',
      description: "`import { DataTableVirtual } from '@nexub/react/DataTableVirtual'` and install `@tanstack/react-virtual`. Only the rows in view are rendered.",
    },
    {
      title: 'Tree rows',
      description: '`getSubRows` nests rows: the first column gets an expand toggle and indents each level. With pages, a parent and its children stay on one page.',
    },
    {
      title: 'Export CSV',
      description: '`toCSV(rows, columns)` quotes and escapes per RFC 4180 and neutralises cells that start like a spreadsheet formula. Pass what the person sees.',
    },
  ],
  a11y: {
    roles: ['table (default)', 'grid (with `grid`)', 'columnheader with aria-sort when sortable'],
    keyboard: [
      { key: 'Tab', description: 'Without `grid`: every control in the table is a tab stop. With `grid`: the table is one tab stop and remembers the last cell.' },
      { key: 'Arrow keys', description: 'With `grid`: move between cells, and between the controls inside a cell. Mirrored in RTL.' },
      { key: 'Home / End', description: 'With `grid`: first or last cell in the row. Ctrl+Home / Ctrl+End: first or last cell in the grid.' },
      { key: 'Space', description: 'Toggles a focused row checkbox.' },
      { key: 'Alt+Arrow', description: 'Moves a focused header when `enableColumnReordering` is on.' },
    ],
    focus: ['With `grid`, focus goes to a cell’s first control, or to the cell itself when it has none.'],
    screenReader: [
      'Name the table with `caption` (or `aria-label`); `captionHidden` keeps it for screen readers only.',
      'Sorting, selection counts and column moves are announced from a polite live region.',
      'DataTableVirtual sets aria-rowcount and aria-rowindex so readers report the full row count.',
    ],
    notes: ['Use `grid` when rows hold actions (edit, menus); plain tables of text read better as a table.'],
  },
};

export default entry;
