import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'heatmap',
    title: 'Heatmap',
    description: 'Intensity over a grid, such as activity by weekday and week, in seven sequential steps.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.5.0',
    related: ['bar-chart', 'line-chart'],
  },
  props: [
    { name: 'data', type: 'number[][]', required: true, description: 'Rows of values.' },
    { name: 'rowLabels', type: 'string[]', required: true, description: 'One label per row.' },
    { name: 'columnLabels', type: 'string[]', required: false, description: 'Used in the hover text.' },
    { name: 'title', type: 'string', required: true, description: 'Accessible name and table caption.' },
  ],
  examples: [{ title: 'Weekly activity' }],
  a11y: {
    screenReader: ['The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.'],
  },
};

export default entry;
