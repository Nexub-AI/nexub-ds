import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'spinner',
    title: 'Spinner',
    description: 'Animated loading indicator. Inherits color from context.',
    category: 'Feedback',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", required: false, description: 'Diameter of the spinner.' },
    { name: 'label', type: 'string', default: "'Loading…'", required: false, description: 'Screen-reader accessible label.' },
  ],
  examples: [
    {
      title: 'Sizes',
    },
    {
      title: 'Inside button',
    },
  ],
};

export default entry;
