import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'progress',
    title: 'Progress',
    description: 'Horizontal progress bar with optional tone and animation.',
    category: 'Loading States',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'value', type: 'number', required: false, description: 'Current progress value between 0 and max.' },
    { name: 'max', type: 'number', default: '100', required: false, description: 'Maximum value of the progress bar.' },
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", required: false, description: 'Semantic colour tone of the filled track.' },
    { name: 'animated', type: 'boolean', default: 'false', required: false, description: 'Adds a stripes-in-motion animation to the filled track.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Tones',
    },
    {
      title: 'Animated',
    },
  ],
};

export default entry;
