import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'toggle-group',
    title: 'Toggle Group',
    description: 'Group of toggle buttons where one or many can be active.',
    category: 'Interactive',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'type', type: "'single' | 'multiple'", required: true, description: "Controls whether one or multiple items can be active at a time." },
    { name: 'value', type: 'string | string[]', required: false, description: 'The controlled active value(s).' },
    { name: 'variant', type: "'default' | 'outline'", required: false, description: 'Visual style applied to all toggle items in the group.' },
  ],
  examples: [
    {
      title: 'Single',
    },
    {
      title: 'Multiple',
    },
  ],
};

export default entry;
