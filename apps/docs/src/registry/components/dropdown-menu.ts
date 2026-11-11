import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'dropdown-menu',
    title: 'Dropdown Menu',
    description: 'A menu of actions opened from a button, built on Radix.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['split-button', 'context-menu', 'popover'],
  },
  props: [
    { name: 'DropdownMenu.Root', type: 'compound', required: false, description: 'Holds the open state (`open`, `onOpenChange`, `defaultOpen`, `modal`).' },
    { name: 'DropdownMenu.Trigger', type: 'compound', required: false, description: 'The button that opens the menu. Use `asChild` with a `Button` or `IconButton`.' },
    { name: 'DropdownMenu.Portal / Content', type: 'compound', required: false, description: 'Renders the floating menu in a portal (`side`, `align`, `sideOffset` default 4).' },
    { name: 'DropdownMenu.Item', type: 'compound', required: false, description: 'An action (`onSelect`, `disabled`).' },
    { name: 'DropdownMenu.CheckboxItem / RadioGroup / RadioItem', type: 'compound', required: false, description: 'Toggle and single-choice items (`checked`, `onCheckedChange`; `value`, `onValueChange`).' },
    { name: 'DropdownMenu.Label / Group / Separator', type: 'compound', required: false, description: 'Section heading, grouping and divider.' },
    { name: 'DropdownMenu.Sub / SubTrigger / SubContent', type: 'compound', required: false, description: 'A nested submenu.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Checkbox and radio items' }],
  usage: {
    whenToUse: ['Secondary actions behind a "More" button', 'A short set of options that change a view'],
    whenNotToUse: ['Picking a form value: use `Select`', 'Site navigation: use `NavigationMenu` or `TopNav`'],
  },
  a11y: {
    roles: ['menu', 'menuitem', 'menuitemcheckbox', 'menuitemradio'],
    keyboard: [
      { key: 'Enter / Space / Arrow Down', description: 'Opens the menu from the trigger.' },
      { key: 'Arrow Up / Down', description: 'Moves between items.' },
      { key: 'Arrow Right / Left', description: 'Opens or closes a submenu.' },
      { key: 'Escape', description: 'Closes the menu and returns focus to the trigger.' },
    ],
  },
};

export default entry;
