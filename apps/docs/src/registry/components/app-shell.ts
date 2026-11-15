import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'app-shell',
    title: 'App Shell',
    description: 'Full-height application frame: a header row over a body with a sidebar slot and a scrolling main region.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['top-nav', 'sidebar', 'page-header'],
  },
  props: [
    { name: 'AppShell.Root', type: 'compound', required: false, description: 'Viewport-height grid (`h-screen`): header row, then the body. Override the height with `className` when it is not the whole page.' },
    { name: 'AppShell.Header', type: 'compound', required: false, description: 'First row, e.g. a `TopNav.Root`.' },
    { name: 'AppShell.Body', type: 'compound', required: false, description: 'Second row: lays out the sidebar and main side by side.' },
    { name: 'AppShell.Sidebar', type: 'compound', required: false, description: 'Fixed-width column that scrolls on its own, e.g. a `Sidebar.Root`.' },
    { name: 'AppShell.Main', type: 'compound', required: false, description: 'The `<main>` landmark: takes the remaining width, scrolls on its own, padded by default.' },
    { name: '...props', type: 'React.HTMLAttributes<HTMLDivElement>', required: false, description: 'Every part forwards its ref and HTML attributes.' },
  ],
  examples: [{ title: 'Header, sidebar and main' }],
  usage: {
    whenToUse: ['The outer frame of a product or dashboard: header, side navigation, content'],
    whenNotToUse: ['Marketing or content pages: use `Section` and `Container`', 'A single panel inside a page: use `Grid` or `Flex`'],
  },
};

export default entry;
