import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'funnel',
    title: 'Funnel',
    description: 'Drop-off through ordered steps, with conversion from the first step.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.5.0',
    related: ['bar-chart', 'line-chart'],
  },
  props: [
    { name: 'data', type: '{ label: string; value: number }[]', required: true, description: 'Steps in order, largest first.' },
    { name: 'title', type: 'string', required: true, description: 'Accessible name and table caption.' },
  ],
  examples: [{ title: 'Signup funnel' }],
  a11y: {
    screenReader: ['The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.'],
  },
};

export default entry;
