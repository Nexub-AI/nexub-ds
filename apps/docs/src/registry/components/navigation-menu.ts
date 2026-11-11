import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'navigation-menu',
    title: 'Navigation Menu',
    description: 'Site navigation links with flyout panels, built on Radix.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['top-nav', 'menubar'],
  },
  props: [
    { name: 'NavigationMenu.Root', type: 'compound', required: false, description: 'The `<nav>` (`value`, `onValueChange`, `delayDuration`). Renders the panel viewport for you.' },
    { name: 'NavigationMenu.List / Item', type: 'compound', required: false, description: 'The list of top-level entries.' },
    { name: 'NavigationMenu.Trigger', type: 'compound', required: false, description: 'Opens the item’s panel on hover or click.' },
    { name: 'NavigationMenu.Content', type: 'compound', required: false, description: 'The flyout panel for an item.' },
    { name: 'NavigationMenu.Link', type: 'compound', required: false, description: 'A link, top-level or inside a panel (`href`, `active`, `asChild` for router links).' },
    { name: 'NavigationMenu.Indicator', type: 'compound', required: false, description: 'Optional arrow under the open trigger.' },
  ],
  examples: [{ title: 'Default' }],
  usage: {
    whenToUse: ['Marketing or docs sites whose sections need a flyout of links'],
    whenNotToUse: ['Actions: use `DropdownMenu` or `Menubar`', 'App navigation without flyouts: use `TopNav` or `Sidebar`'],
  },
  a11y: {
    keyboard: [
      { key: 'Tab', description: 'Moves between top-level entries.' },
      { key: 'Enter / Space', description: 'Opens or closes a panel.' },
      { key: 'Escape', description: 'Closes the panel and returns focus to its trigger.' },
    ],
    notes: ['Give `NavigationMenu.Root` an `aria-label` when the page has more than one navigation landmark.'],
  },
};

export default entry;
