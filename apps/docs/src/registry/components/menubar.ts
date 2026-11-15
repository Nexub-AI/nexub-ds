import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'menubar',
    title: 'Menubar',
    description: 'A horizontal bar of menus, like a desktop app’s File / Edit / View, built on Radix.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['dropdown-menu', 'toolbar', 'context-menu'],
  },
  props: [
    { name: 'Menubar.Root', type: 'compound', required: false, description: 'The bar (`value`, `onValueChange`, `loop`).' },
    { name: 'Menubar.Menu', type: 'compound', required: false, description: 'One menu: a trigger and its content.' },
    { name: 'Menubar.Trigger', type: 'compound', required: false, description: 'The menu’s button in the bar.' },
    { name: 'Menubar.Portal / Content', type: 'compound', required: false, description: 'Renders the floating menu in a portal (`sideOffset` default 8).' },
    { name: 'Menubar.Item', type: 'compound', required: false, description: 'An action (`onSelect`, `disabled`).' },
    { name: 'Menubar.CheckboxItem / RadioGroup / RadioItem', type: 'compound', required: false, description: 'Toggle and single-choice items.' },
    { name: 'Menubar.Label / Group / Separator / Arrow', type: 'compound', required: false, description: 'Section heading, grouping, divider and an optional arrow.' },
    { name: 'Menubar.Sub / SubTrigger / SubContent', type: 'compound', required: false, description: 'A nested submenu.' },
  ],
  examples: [{ title: 'Default' }],
  usage: {
    whenToUse: ['Editors and tools with many commands grouped like a desktop app'],
    whenNotToUse: ['Site navigation: use `NavigationMenu` or `TopNav`', 'A few icon actions: use `Toolbar`'],
  },
  a11y: {
    roles: ['menubar', 'menu', 'menuitem'],
    keyboard: [
      { key: 'Arrow Left / Right', description: 'Moves between menus in the bar, and between open menus.' },
      { key: 'Enter / Space / Arrow Down', description: 'Opens the focused menu.' },
      { key: 'Escape', description: 'Closes the menu.' },
    ],
  },
};

export default entry;
