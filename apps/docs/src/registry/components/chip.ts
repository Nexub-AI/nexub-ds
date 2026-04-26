import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'chip',
    title: 'Chip',
    description: 'Compact label chip, optionally dismissible.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'variant', type: "'filled' | 'outline'", default: "'filled'", required: false, description: 'Visual style of the chip.' },
    { name: 'onRemove', type: '() => void', required: false, description: 'When provided, renders a dismiss button that calls this handler.' },
    { name: 'size', type: "'sm' | 'md'", required: false, description: 'Controls chip size.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<div style={{ display: 'flex', gap: '8px' }}>
  <Chip>Design</Chip>
  <Chip>Engineering</Chip>
  <Chip>Product</Chip>
</div>`,
    },
    {
      title: 'Dismissible',
      code: `<div style={{ display: 'flex', gap: '8px' }}>
  <Chip onRemove={() => {}}>Design</Chip>
  <Chip onRemove={() => {}}>Engineering</Chip>
  <Chip onRemove={() => {}}>Product</Chip>
</div>`,
    },
  ],
};

export default entry;
