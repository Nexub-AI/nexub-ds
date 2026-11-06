import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'filter-bar',
    title: 'FilterBar',
    description: 'Search + filter toolbar pattern for data-heavy list or table views.',
    category: 'Data',
    package: '@nexub/patterns',
    status: 'stable',
    addedIn: '0.0.1',
    updatedIn: '5.1.0',
  },
  props: [
    { name: 'searchPlaceholder', type: 'string', default: "'Search…'", required: false, description: 'Placeholder text for the search input.' },
    { name: 'searchValue', type: 'string', required: false, description: 'Controlled search value.' },
    { name: 'onSearch', type: '(value: string) => void', required: false, description: 'Callback when search value changes.' },
    { name: 'searchLabel', type: 'string', default: "'Search'", required: false, description: 'Accessible name of the search field (5.1). Defaults to the localised `search` message.' },
    { name: 'filters', type: 'React.ReactNode', required: false, description: 'Filter controls rendered to the right of search.' },
    { name: 'actions', type: 'React.ReactNode', required: false, description: 'Action buttons (e.g. "Export") rendered on the far right.' },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
