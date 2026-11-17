import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'icon-chip',
    title: 'Icon Chip',
    description: 'An icon on a tinted tile, in one of the category colours or the product accent.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '10.3.0',
    related: ['badge', 'avatar'],
  },
  props: [
    { name: 'category', type: "'accent' | 'blue' | 'amber' | 'emerald' | 'pink' | 'violet' | 'cyan' | 'red' | 'lime'", description: 'Colour of the chip. `accent` is the product accent. Without it the chip is neutral.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the tile and its icon.' },
    { name: 'shape', type: "'square' | 'circle'", default: "'square'", description: 'Rounded square or circle.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Category colours' }, { title: 'Sizes and shapes' }],
};

export default entry;
