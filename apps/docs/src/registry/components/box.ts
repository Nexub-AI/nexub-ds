import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'box',
    title: 'Box',
    description: 'Generic container primitive with style token props.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'asChild', type: 'boolean', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Nested',
    },
  ],
};

export default entry;
