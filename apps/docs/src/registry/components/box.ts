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
    { name: 'padding', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", required: false, description: 'Padding applied to all sides using design tokens.' },
    { name: 'background', type: 'string', required: false, description: 'Background color CSS value or token.' },
    { name: 'radius', type: 'string', required: false, description: 'Border radius CSS value or token.' },
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
