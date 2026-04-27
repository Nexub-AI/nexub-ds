import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'search-input',
    title: 'Search Input',
    description: 'A text input pre-wired with a search icon and a clear button for filtering content.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text shown when empty.' },
    { name: 'value', type: 'string', required: false, description: 'Controlled value of the search field.' },
    { name: 'onClear', type: '() => void', required: false, description: 'Called when the user clicks the clear button.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, description: 'Controls font size and padding.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<SearchInput placeholder="Search…" />`,
    },
  ],
};

export default entry;
