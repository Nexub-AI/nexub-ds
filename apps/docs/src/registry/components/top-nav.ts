import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'top-nav',
    title: 'Top Nav',
    description: 'A sticky app header: logo, main navigation links and trailing actions.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['app-shell', 'sidebar', 'navigation-menu', 'logo'],
  },
  props: [
    { name: 'surface', type: "'solid' | 'glass'", description: 'Glass material on the bar — see Foundations → Materials.' },
    { name: 'scrollEdge', type: "'soft' | 'hard'", description: '`soft` dissolves scrolling content under the bar (no divider); `hard` is an opaque band. Default: a divider.' },
    { name: 'TopNav.Logo / Menu / Actions', type: 'compound', required: false, description: 'The logo slot, the `<nav>` of links (scrolls sideways on narrow screens) and the end-aligned actions.' },
    { name: 'TopNavItem active', type: 'boolean', description: 'Marks the current page (`aria-current="page"`).' },
    { name: 'TopNavItem asChild', type: 'boolean', description: 'Use your router `<Link>` instead of an `<a>`.' },
  ],
  examples: [{ title: 'Default' }],
  a11y: {
    roles: ['banner', 'navigation'],
    notes: ['`TopNav.Root` is a `<header>`; `TopNav.Menu` is a `<nav>` named with the localised "Main navigation".'],
  },
};

export default entry;
