import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'filter-bar',
    title: 'FilterBar',
    description: 'Search + filter toolbar pattern for data-heavy list or table views.',
    category: 'Data',
    package: '@nexub/patterns',
    status: 'stable',
  },
  props: [
    { name: 'searchPlaceholder', type: 'string', default: "'Search…'", required: false, description: 'Placeholder text for the search input.' },
    { name: 'searchValue', type: 'string', required: false, description: 'Controlled search value.' },
    { name: 'onSearch', type: '(value: string) => void', required: false, description: 'Callback when search value changes.' },
    { name: 'filters', type: 'React.ReactNode', required: false, description: 'Filter controls rendered to the right of search.' },
    { name: 'actions', type: 'React.ReactNode', required: false, description: 'Action buttons (e.g. "Export") rendered on the far right.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<FilterBar
  searchPlaceholder="Search users…"
  onSearch={(v) => {}}
  filters={
    <Select.Root>
      <Select.Trigger><Select.Value placeholder="Status" /></Select.Trigger>
      <Select.Content>
        <Select.Item value="active">Active</Select.Item>
        <Select.Item value="inactive">Inactive</Select.Item>
      </Select.Content>
    </Select.Root>
  }
  actions={<Button variant="outline" size="sm">Export</Button>}
/>`,
    },
  ],
};

export default entry;
