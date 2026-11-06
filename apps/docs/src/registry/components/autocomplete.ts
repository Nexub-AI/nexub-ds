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
    updatedIn: '5.2.0',
  },
  props: [
    { name: 'options', type: '{ value: string; label: string }[]', required: true, description: 'Array of options available for selection.' },
    { name: 'value', type: 'string', required: false, description: 'The controlled selected value.' },
    { name: 'onValueChange', type: '(value: string) => void', required: false, description: 'Callback fired when the selected value changes.' },
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text shown in the input when empty.' },
    { name: 'emptyText', type: 'string', required: false, description: 'Text shown when no options match the current search query.' },
    { name: 'loading', type: 'boolean', required: false, description: 'Skeleton rows while options are being fetched (5.2); "Loading" is announced.' },
    { name: 'inputValue', type: 'string', required: false, description: 'Controlled input text (5.1).' },
    { name: 'onInputChange', type: '(text: string) => void', required: false, description: 'Called as the user types, so you can fetch options (5.1). When set, options are shown as given, without built-in filtering.' },
    { name: 'mode', type: "'inline' | 'popover'", default: "'inline'", required: false, description: 'Popover (5.2): a field whose list opens below it while typing. Inline keeps the list always visible; it stays the default until 6.0.' },
    { name: 'onCreate', type: '(text: string) => void', required: false, description: 'Adds a "Create “text”" option when the text matches no option (5.2).' },
    { name: 'aria-label', type: 'string', required: false, description: 'Accessible name of the field when it has no visible label.' },
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
    {
      title: 'Popover, fetch as you type',
      description: '`mode="popover"` with `onInputChange`: the app filters, the list shows skeleton rows while loading.',
    },
  ],
};

export default entry;
