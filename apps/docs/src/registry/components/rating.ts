import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'rating',
    title: 'Rating',
    description: 'Star rating input, supports controlled and read-only modes.',
    category: 'Interactive',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'value', type: 'number', required: false, description: 'The controlled rating value.' },
    { name: 'max', type: 'number', default: '5', required: false, description: 'Maximum number of stars.' },
    { name: 'readOnly', type: 'boolean', default: 'false', required: false, description: 'Prevents user interaction when true.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, description: 'Size of the star icons.' },
    { name: 'onValueChange', type: '(value: number) => void', required: false, description: 'Callback fired when the user selects a new rating.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Read-only',
    },
    {
      title: 'Sizes',
    },
  ],
};

export default entry;
