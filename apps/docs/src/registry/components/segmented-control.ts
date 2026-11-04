import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'segmented-control',
    title: 'Segmented Control',
    description: 'Tab-style control for mutually exclusive selections.',
    category: 'Interactive',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Size of the segmented control.' },
    { name: 'value', type: 'string', required: false, description: 'The controlled selected value.' },
    { name: 'defaultValue', type: 'string', required: false, description: 'The initial selected value when uncontrolled.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Sizes',
    },
  ],
};

export default entry;
