import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'filter-chip',
    title: 'Filter Chip',
    description: 'Interactive chip for filtering, supports selected/unselected state.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'selected', type: 'boolean', required: false, description: 'Controlled selected state of the chip.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables the chip.' },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
