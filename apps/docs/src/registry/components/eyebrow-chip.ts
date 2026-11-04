import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'eyebrow-chip',
    title: 'Eyebrow Chip',
    description: 'A compact eyebrow label, typically used above headings.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'size', type: "'sm' | 'md'", required: false, description: 'Controls chip size.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Usage',
    },
  ],
};

export default entry;
