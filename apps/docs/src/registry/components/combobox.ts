import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'combobox',
    title: 'Combobox',
    description: 'Command-palette style searchable dropdown built on cmdk.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'Combobox.Root', type: 'compound', required: false, description: 'Root cmdk command container.' },
    { name: 'Combobox.Input', type: 'compound', required: false, description: 'Search input that filters the list.' },
    { name: 'Combobox.List', type: 'compound', required: false, description: 'Scrollable list container for groups and items.' },
    { name: 'Combobox.Group', type: 'compound', required: false, description: 'Labeled group of items within the list.' },
    { name: 'Combobox.Item', type: 'compound', required: false, description: 'Individual selectable option.' },
    { name: 'Combobox.Empty', type: 'compound', required: false, description: 'Content shown when no items match the search query.' },
    { name: 'Combobox.Separator', type: 'compound', required: false, description: 'Visual separator between groups or items.' },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
