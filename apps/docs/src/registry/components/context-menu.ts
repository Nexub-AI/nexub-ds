import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'context-menu',
    title: 'Context Menu',
    description: 'A menu that opens at the pointer on right-click (or long-press), built on Radix.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['dropdown-menu', 'menubar'],
  },
  props: [
    { name: 'ContextMenu.Root', type: 'compound', required: false, description: 'Holds the open state (`onOpenChange`, `modal`).' },
    { name: 'ContextMenu.Trigger', type: 'compound', required: false, description: 'The area that opens the menu on right-click. Use `asChild` to make your element the area.' },
    { name: 'ContextMenu.Portal / Content', type: 'compound', required: false, description: 'Renders the floating menu in a portal.' },
    { name: 'ContextMenu.Item', type: 'compound', required: false, description: 'An action (`onSelect`, `disabled`).' },
    { name: 'ContextMenu.CheckboxItem / RadioGroup / RadioItem', type: 'compound', required: false, description: 'Toggle and single-choice items (`checked`, `onCheckedChange`; `value`, `onValueChange`).' },
    { name: 'ContextMenu.Label / Group / Separator', type: 'compound', required: false, description: 'Section heading, grouping and divider.' },
    { name: 'ContextMenu.Sub / SubTrigger / SubContent', type: 'compound', required: false, description: 'A nested submenu.' },
  ],
  examples: [{ title: 'Default' }],
  usage: {
    whenToUse: ['Shortcuts to actions on an item: rename, duplicate, delete'],
    whenNotToUse: ['The only way to reach an action: right-click is hard to discover and needs a visible alternative, such as a `DropdownMenu`'],
  },
  a11y: {
    roles: ['menu', 'menuitem', 'menuitemcheckbox', 'menuitemradio'],
    keyboard: [
      { key: 'Shift + F10 / Menu key', description: 'Opens the menu from the focused trigger.' },
      { key: 'Arrow Up / Down', description: 'Moves between items.' },
      { key: 'Enter / Space', description: 'Activates the item.' },
      { key: 'Escape', description: 'Closes the menu.' },
    ],
  },
};

export default entry;
