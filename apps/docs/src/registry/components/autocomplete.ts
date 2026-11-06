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
    updatedIn: '5.1.0',
  },
  props: [
    { name: 'options', type: '{ value: string; label: string }[]', required: true, description: 'Array of options available for selection.' },
    { name: 'value', type: 'string', required: false, description: 'The controlled selected value.' },
    { name: 'onValueChange', type: '(value: string) => void', required: false, description: 'Callback fired when the selected value changes.' },
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text shown in the input when empty.' },
    { name: 'emptyText', type: 'string', required: false, description: 'Text shown when no options match the current search query.' },
    { name: 'loading', type: 'boolean', required: false, description: 'Shows a loading indicator while options are being fetched.' },
    { name: 'inputValue', type: 'string', required: false, description: 'Controlled input text (5.1).' },
    { name: 'onInputChange', type: '(text: string) => void', required: false, description: 'Called as the user types, so you can fetch options (5.1). When set, options are shown as given, without built-in filtering.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'With loading state',
    },
    {
      title: 'Custom empty text',
    },
  ],
};

export default entry;
