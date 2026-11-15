import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'resizable-panels',
    title: 'Resizable Panels',
    description: 'Panels with draggable separators, for list–detail and editor layouts.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.4.0',
    related: ['sidebar', 'app-shell'],
  },
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'The panels; a separator goes between each pair.' },
    { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Side by side or stacked.' },
    { name: 'sizes / defaultSizes / onSizesChange', type: 'number[]', required: false, description: 'One percentage per panel, adding up to 100. Save them (localStorage, user settings) to restore the layout.' },
    { name: 'minSizes', type: 'number[]', default: '10 each', required: false, description: 'Smallest size per panel, in percent.' },
    { name: 'handleLabel', type: 'string', default: '"Resize panels"', required: false, description: 'Names the separators.' },
  ],
  examples: [{ title: 'List and detail' }],
  a11y: {
    roles: ['separator (focusable, with aria-valuenow / min / max and aria-controls)'],
    keyboard: [
      { key: 'Arrow keys', description: 'Move the focused separator by 5%. Mirrored in RTL.' },
      { key: 'Home / End', description: 'To the smallest or largest size.' },
      { key: 'Enter', description: 'Back to the default split.' },
    ],
  },
};

export default entry;
