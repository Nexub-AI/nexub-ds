import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'chip',
    title: 'Chip',
    description: 'Compact label chip, optionally dismissible.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'variant', type: "'filled' | 'outline'", default: "'filled'", required: false, description: 'Visual style of the chip.' },
    { name: 'onRemove', type: '() => void', required: false, description: 'When provided, renders a dismiss button that calls this handler.' },
    { name: 'removeLabel', type: 'string', default: "'Remove'", required: false, description: 'Accessible name of the dismiss button (5.2), e.g. "Remove Bug". Use it when several chips sit together.' },
    { name: 'size', type: "'sm' | 'md'", required: false, description: 'Controls chip size.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Dismissible',
    },
  ],
};

export default entry;
