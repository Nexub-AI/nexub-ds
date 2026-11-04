import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'split-button',
    title: 'Split Button',
    description: 'A primary action with related secondary actions behind a chevron, as one connected control.',
    category: 'Actions',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.5.0',
    related: ['button', 'button-group', 'dropdown-menu'],
  },
  props: [
    { name: 'menuLabel', type: 'string', required: true, description: 'Accessible name of the menu toggle, e.g. "More save options".' },
    { name: 'menu', type: 'ReactNode', required: true, description: '`DropdownMenu.Item`s for the secondary actions.' },
    { name: 'align', type: "'start' | 'end'", default: "'end'", required: false, description: 'Menu alignment against the toggle.' },
    { name: 'variant / size / tone', type: 'Button props', required: false, description: 'Applied to both halves.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Outlined',
    },
  ],
};

export default entry;
