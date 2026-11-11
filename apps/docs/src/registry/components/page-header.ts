import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'page-header',
    title: 'Page Header',
    description: 'The top of a page: title, description, breadcrumb and actions.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['breadcrumb', 'app-shell', 'heading'],
  },
  props: [
    { name: 'title', type: 'ReactNode', description: 'The page title. Truncates on one line.' },
    { name: 'description', type: 'ReactNode', description: 'A line under the title.' },
    { name: 'actions', type: 'ReactNode', description: 'Buttons on the end side; they wrap under the title on narrow screens.' },
    { name: 'breadcrumb', type: 'ReactNode', description: 'A `Breadcrumb` above the title.' },
    { name: 'level', type: '1 | 2 | 3', description: 'Heading level of the title. Use 2 or 3 when the page already has an h1.' },
  ],
  examples: [{ title: 'Default' }, { title: 'With breadcrumb' }],
};

export default entry;
