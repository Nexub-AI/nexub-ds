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
  },
  props: [
    { name: 'columns', type: 'DataTableColumn<TData>[]', required: true, description: 'TanStack Table column definitions (`DataTableColumn` is exported from @nexub/react). Set `meta: { align: \'end\' }` for numeric columns; headers, sort buttons and cells follow it.' },
    { name: 'caption', type: 'ReactNode', required: false, description: 'Names the table for assistive tech (and its scroll region). Shown below the table; add `captionHidden` to keep it screen-reader only.' },
    { name: 'data', type: 'TData[]', required: true, description: 'Array of row data objects to render.' },
    { name: 'enableSorting', type: 'boolean', default: 'false', required: false, description: 'Enables click-to-sort on column headers.' },
    { name: 'enableRowSelection', type: 'boolean', default: 'false', required: false, description: 'Adds a checkbox column for row selection.' },
    { name: 'pagination.pageSize', type: 'number', default: '10', required: false, description: 'Number of rows per page when pagination is active.' },
    { name: 'pagination.pageIndex', type: 'number', default: '0', required: false, description: 'Zero-based index of the currently visible page.' },
    { name: 'onRowSelectionChange', type: '(selectedRows: TData[]) => void', required: false, description: 'Callback invoked when the row selection state changes.' },
    { name: 'loading', type: 'boolean', default: 'false', required: false, description: 'Shows a skeleton loading state over the table body.' },
    { name: 'emptyState', type: 'React.ReactNode', required: false, description: 'Custom content rendered when the data array is empty.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'With sorting',
    },
  ],
};

export default entry;
