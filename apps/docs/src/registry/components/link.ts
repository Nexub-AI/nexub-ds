import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'link',
    title: 'Link',
    description: 'Styled anchor link with variant and external support.',
    category: 'Inline Primitives',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'variant', type: "'default' | 'muted' | 'underline'", required: false, description: 'Visual style of the link.' },
    { name: 'external', type: 'boolean', required: false, description: 'Opens the link in a new tab with appropriate rel attributes.' },
    { name: 'href', type: 'string', required: false, description: 'The URL the link points to.' },
    { name: 'asChild', type: 'boolean', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Variants',
    },
    {
      title: 'External',
    },
  ],
};

export default entry;
