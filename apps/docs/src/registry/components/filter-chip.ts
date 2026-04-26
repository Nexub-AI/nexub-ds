import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'filter-chip',
    title: 'FilterChip',
    description: 'Interactive chip for filtering, supports selected/unselected state.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'selected', type: 'boolean', required: false, description: 'Controlled selected state of the chip.' },
    { name: 'onSelectedChange', type: '(selected: boolean) => void', required: false, description: 'Called when the selected state changes.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables the chip.' },
    { name: 'size', type: "'sm' | 'md'", required: false, description: 'Controls chip size.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<div style={{ display: 'flex', gap: '8px' }}>
  <FilterChip>All</FilterChip>
  <FilterChip defaultSelected>Active</FilterChip>
  <FilterChip>Archived</FilterChip>
</div>`,
    },
  ],
};

export default entry;
