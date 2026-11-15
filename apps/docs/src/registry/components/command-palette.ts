import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'command-palette',
    title: 'Command Palette',
    description: 'A searchable command menu in a modal dialog (cmdk), with nested pages, recents and an optional Cmd+K shortcut.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['keyboard-shortcut', 'dialog', 'search-input'],
  },
  props: [
    { name: 'open / onOpenChange', type: 'boolean / (open: boolean) => void', description: 'Controlled open state.' },
    { name: 'defaultOpen', type: 'boolean', description: 'Uncontrolled initial open state.' },
    { name: 'shortcut', type: 'string', description: "A letter that toggles the palette with Cmd (macOS) or Ctrl anywhere on the page, e.g. `'k'`." },
    { name: 'label', type: 'string', description: 'Accessible name of the dialog. Defaults to the localised "Command palette".' },
    { name: 'shouldFilter', type: 'boolean', description: 'Set `false` when the items are already filtered, e.g. async search results.' },
    { name: 'loading', type: 'boolean', description: 'Shows a loading row and hides `Empty`.' },
    { name: 'pages / defaultPages / onPagesChange', type: 'string[]', description: 'The open page stack (ids of `CommandPalette.Page`), deepest last. Empty = the root page.' },
    { name: 'recentKey / recentLimit', type: 'string / number', description: 'Opt-in recents: the last picks on the root page are kept in localStorage under this key and shown while the query is empty.' },
    { name: 'scrollLock', type: "'class' | 'style'", description: "`'class'` (strict-CSP safe) or Radix's style-tag lock." },
    { name: 'CommandPalette.Input / List / Empty / Group / Separator', type: 'compound', required: false, description: 'Search field, results list, no-results row, a headed group (`heading`), and a decorative divider.' },
    { name: 'CommandPaletteItem page', type: 'string', description: 'Opens the `CommandPalette.Page` with this id when selected. Other props are cmdk `Command.Item` props (`onSelect`, `value`, `keywords`, `disabled`).' },
    { name: 'CommandPalettePage id / title', type: 'string', description: 'Content shown only while this page is on top. No `id` = the root page; `title` shows in the input breadcrumb. Backspace on an empty query goes back.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Nested pages' }],
  usage: {
    whenToUse: ['Power users jumping to pages or running actions by name', 'A global Cmd+K entry point in an app'],
    whenNotToUse: ['Filtering a single list on the page: use `SearchInput` or `Combobox`', 'The only way to reach an action: keep it in the visible UI too'],
  },
  a11y: {
    roles: ['dialog', 'combobox', 'listbox', 'option'],
    keyboard: [
      { key: 'Cmd/Ctrl + shortcut', description: 'Toggles the palette when `shortcut` is set.' },
      { key: 'Arrow Up / Down', description: 'Moves through items (wraps).' },
      { key: 'Enter', description: 'Runs the highlighted item.' },
      { key: 'Backspace', description: 'On an empty query, goes back a page.' },
      { key: 'Escape', description: 'Closes the palette.' },
    ],
    focus: ['Focus moves to the input on open and returns to the previously focused element on close.'],
  },
};

export default entry;
