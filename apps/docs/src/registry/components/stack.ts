import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'stack',
    title: 'Stack',
    description: 'Vertical stack layout with configurable gap.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", required: false, description: 'Spacing between child elements.' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", required: false, description: 'Cross-axis alignment of children.' },
    { name: 'dividers', type: 'boolean', required: false, description: 'Renders a divider line between each child element.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'With dividers',
    },
  ],
};

export default entry;
