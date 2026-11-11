import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'toolbar',
    title: 'Toolbar',
    description: 'A row of buttons and toggles with one tab stop and arrow-key movement, built on Radix.',
    category: 'Actions',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['toggle-group', 'button-group', 'action-bar'],
  },
  props: [
    { name: 'floating', type: 'boolean', description: 'A glass capsule for the control layer above content, e.g. editor or selection actions.' },
    { name: 'placement', type: "'bottom'", description: 'With `floating`: pin it to the bottom centre of the viewport.' },
    { name: 'orientation / loop / dir', type: 'Radix Toolbar props', required: false, description: 'Arrow-key direction and wrapping.' },
    { name: 'aria-label', type: 'string', required: false, description: 'Name the toolbar, e.g. "Text formatting".' },
    { name: 'Toolbar.Button', type: 'compound', required: false, description: 'An action button.' },
    { name: 'Toolbar.ToggleGroup / ToggleItem', type: 'compound', required: false, description: "A set of toggles (`type=\"single\" | \"multiple\"`, `value`). Icon-only items need `aria-label`." },
    { name: 'Toolbar.Separator', type: 'compound', required: false, description: 'A divider between groups.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Floating' }],
  a11y: {
    roles: ['toolbar'],
    keyboard: [
      { key: 'Tab', description: 'Moves into and out of the toolbar (one tab stop).' },
      { key: 'Arrow Left / Right', description: 'Moves between controls.' },
      { key: 'Enter / Space', description: 'Activates a button or toggles an item.' },
    ],
  },
};

export default entry;
