import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'command-list',
    title: 'Command List',
    description: 'A search box over a filtered, grouped list you move through with the keyboard. Inline: put it in a Dialog, Sheet, Drawer or page.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.2.0',
    related: ['command-palette', 'combobox', 'combobox-field', 'dialog', 'drawer'],
  },
  usage: {
    whenToUse: [
      'Picking one item from a long list inside a dialog or sheet: move to folder, assign to, jump to.',
      'A search the server answers (`onSearch` with `loading`).',
    ],
    whenNotToUse: [
      'An app-wide launcher opened with Cmd+K: use CommandPalette.',
      'A form field that shows the picked value: use ComboboxField.',
      'Ten choices or fewer: use a RadioGroup or Select.',
    ],
  },
  props: [
    { name: 'items', type: 'CommandListItem[]', required: true, description: '`{ value, label, description?, keywords?, icon?, group?, disabled?, shortcut? }`. `description` and `keywords` are searched too; `group` lists the item under a heading; `shortcut` shows keys at the end of the row.' },
    { name: 'onSelect', type: '(value: string, item: CommandListItem) => void', description: 'Called when an item is picked with Enter or a click.' },
    { name: 'label', type: 'string', default: "'Search'", description: 'Accessible name of the search box and list.' },
    { name: 'placeholder', type: 'string', default: "'Search…'", description: 'The search box placeholder.' },
    { name: 'emptyText', type: 'ReactNode', default: "'No results found.'", description: 'Shown when the search finds nothing.' },
    { name: 'onSearch / loading', type: '(text: string) => void / boolean', description: 'Server search: while `onSearch` is set the list is not filtered here. `loading` shows a busy row.' },
    { name: 'autoFocus', type: 'boolean', default: 'true', description: 'Focus the search box on mount.' },
    { name: 'maxHeight', type: 'string', default: "'20rem'", description: 'The list scrolls past this height (any CSS length).' },
  ],
  examples: [{ title: 'Default' }, { title: 'In a dialog' }, { title: 'Server search' }],
  a11y: {
    keyboard: [
      { key: 'Arrow Up / Arrow Down', description: 'Moves the highlight; wraps at the ends.' },
      { key: 'Home / End', description: 'Moves to the first or last item.' },
      { key: 'Enter', description: 'Picks the highlighted item.' },
    ],
    notes: [
      'Focus stays in the search box, a `combobox` that points at the highlighted `option` with `aria-activedescendant`.',
      'Group headings name their groups; disabled items are skipped and marked `aria-disabled`.',
      'While loading, the list has `aria-busy`.',
    ],
  },
};

export default entry;
