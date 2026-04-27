import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'autocomplete',
    title: 'Autocomplete',
    description: 'Type-to-search input with matching options dropdown.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'options', type: '{ value: string; label: string }[]', required: true, description: 'Array of options available for selection.' },
    { name: 'value', type: 'string', required: false, description: 'The controlled selected value.' },
    { name: 'onValueChange', type: '(value: string) => void', required: false, description: 'Callback fired when the selected value changes.' },
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text shown in the input when empty.' },
    { name: 'emptyText', type: 'string', required: false, description: 'Text shown when no options match the current search query.' },
    { name: 'loading', type: 'boolean', required: false, description: 'Shows a loading indicator while options are being fetched.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Autocomplete
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ]}
  placeholder="Search framework…"
/>`,
    },
    {
      title: 'With loading state',
      code: `<Autocomplete
  options={[]}
  loading
  placeholder="Loading options…"
/>`,
    },
    {
      title: 'Custom empty text',
      code: `<Autocomplete
  options={[
    { value: 'nexub', label: 'Nexub' },
    { value: 'acme', label: 'Acme Corp' },
  ]}
  placeholder="Search company…"
  emptyText="No companies found. Try a different search."
/>`,
    },
  ],
};

export default entry;
