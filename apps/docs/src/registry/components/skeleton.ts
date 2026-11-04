import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'skeleton',
    title: 'Skeleton',
    description: 'Placeholder loading animation that mimics content layout.',
    category: 'Loading States',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'shape', type: "'line' | 'rect' | 'circle'", default: "'line'", required: false, description: 'Shape of the skeleton placeholder.' },
    { name: 'width', type: 'string | number', required: false, description: 'Width of the skeleton element.' },
    { name: 'height', type: 'string | number', required: false, description: 'Height of the skeleton element.' },
    { name: 'animated', type: 'boolean', default: 'true', required: false, description: 'Enables the shimmer animation.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Shapes',
    },
  ],
};

export default entry;
