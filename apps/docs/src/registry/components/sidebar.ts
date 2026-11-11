import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'sidebar',
    title: 'Sidebar',
    description: 'Vertical app navigation: a header, grouped items with icons, and a pinned footer. Collapses to icons.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['app-shell', 'navigation-rail', 'top-nav'],
  },
  props: [
    { name: 'collapsed', type: 'boolean', description: 'Icon-only width. Labels stay for screen readers and show as a native tooltip.' },
    { name: 'aria-label', type: 'string', required: false, description: 'Name of the nav landmark. Defaults to the localised "Sidebar".' },
    { name: 'SidebarHeader status', type: 'ReactNode', description: 'Trailing element next to the logo (`Sidebar.Header` children), e.g. a `Badge`. Moves under the logo when they don’t fit.' },
    { name: 'SidebarGroup label', type: 'string', description: 'Heading above a group of items.' },
    { name: 'SidebarItem icon', type: 'ReactNode', description: 'Leading icon; the only thing shown when collapsed.' },
    { name: 'SidebarItem active', type: 'boolean', description: 'Marks the current page (`aria-current="page"`).' },
    { name: 'SidebarItem asChild', type: 'boolean', description: 'Use your router `<Link>` as the item; pass it as the only child.' },
    { name: 'Sidebar.Separator / Footer', type: 'compound', required: false, description: 'A divider, and a footer that stays pinned while the items scroll.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Collapsed' }],
};

export default entry;
