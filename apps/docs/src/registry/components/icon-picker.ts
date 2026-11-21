import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'icon-picker',
    title: 'Icon Picker',
    description: 'Pick an icon from @nexub/icons in a searchable grid with recent picks and optional categories. A popover, a bottom sheet on phones.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.2.0',
    related: ['emoji-picker', 'icon', 'combobox-field'],
  },
  usage: {
    whenToUse: ['An icon for a space, doc, category or saved view.', 'The value is the icon’s export name, so it can be stored and drawn later.'],
    whenNotToUse: ['An emoji: use EmojiPicker.', 'Icons outside @nexub/icons: build a grid of your own.'],
  },
  props: [
    { name: 'value / defaultValue', type: 'string | null', description: 'The picked icon’s export name, e.g. `"CalendarDays"`. `null` for none.' },
    { name: 'onValueChange', type: '(name: string) => void', description: 'Called with the picked name. The picker closes.' },
    { name: 'icons', type: 'string[]', description: 'Only these icons, in this order. Default: every @nexub/icons export, A–Z.' },
    { name: 'categories', type: '{ label: string; icons: string[] }[]', description: 'Icons under headings, with a row of buttons to jump between them. Overrides `icons`.' },
    { name: 'placeholder', type: 'string', default: "'Pick an icon'", description: 'Shown on the trigger when nothing is picked.' },
    { name: 'recent', type: 'string[]', description: 'Recent picks, newest first. Unset: the last 16 picks are kept in localStorage (`nx-icon-recent`).' },
    { name: 'name', type: 'string', description: 'A hidden input posts the value with a plain form.' },
    { name: 'disabled / readOnly / invalid / required', type: 'boolean', description: 'Field states, as on Select. Read-only stays focusable and does not open.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the trigger.' },
    { name: 'sheet', type: "boolean | 'auto'", default: "'auto'", description: 'The grid as a bottom sheet below 768px.' },
    { name: 'IconPicker.Panel', type: 'component', description: 'The grid alone (`value`, `onValueChange`, `icons`, `categories`, `recent`, `autoFocus`), for any popover or page.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Categories' }, { title: 'States' }],
  a11y: {
    roles: ['combobox (trigger)', 'listbox with a group per section', 'option'],
    keyboard: [
      { key: 'Enter / Space / Arrow Down', description: 'On the trigger: opens the picker with focus in the search box.' },
      { key: 'Arrow Down', description: 'From the search box: into the grid.' },
      { key: 'Arrow keys', description: 'Move between icons; Arrow Up from the first row returns to the search box.' },
      { key: 'Home / End', description: 'First or last icon in the row; with Ctrl, in the whole list.' },
      { key: 'Enter / Space', description: 'Picks the focused icon. Enter in the search box picks the first result.' },
      { key: 'Escape', description: 'Closes without changing the value.' },
    ],
    notes: [
      'Each icon is named from its export name ("ArrowUpRight" reads "Arrow up right").',
      'The icon set is loaded with a dynamic import when the picker opens or shows a value.',
    ],
  },
};

export default entry;
