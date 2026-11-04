import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'button-group',
    title: 'Button Group',
    description: 'Groups related buttons together with optional attachment and orientation.',
    category: 'Actions',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Lays out child buttons horizontally or vertically.' },
    { name: 'attached', type: 'boolean', default: 'false', required: false, description: 'Removes gap and merges borders between adjacent buttons.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Attached',
    },
    {
      title: 'Vertical',
    },
  ],
};

export default entry;
