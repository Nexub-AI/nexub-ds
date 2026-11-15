import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'container',
    title: 'Container',
    description: 'Centres content at a maximum width with responsive side padding.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['section', 'box', 'stack'],
  },
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'nexub' | 'marketing' | 'prose'", description: 'Maximum width, from the `--container-*` tokens. `prose` is 65ch for reading.' },
    { name: 'paddingX', type: 'boolean', description: 'Responsive horizontal padding (16, 24, 32 px).' },
    { name: 'asChild', type: 'boolean', description: 'Apply the container classes to the child element (e.g. `<main>`) instead of a `<div>`.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Prose width' }],
};

export default entry;
