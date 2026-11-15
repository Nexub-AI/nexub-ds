import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'chart-zoom',
    title: 'Chart Zoom',
    description: 'Zoom any chart to part of its range with a two-thumb slider.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.6.0',
    related: ['line-chart', 'bar-chart', 'chart-toggle'],
  },
  props: [
    { name: 'data', type: 'T[]', required: true, description: 'The full data.' },
    { name: 'index', type: 'keyof T', required: true, description: 'The category key; its values label the range.' },
    { name: 'children', type: '(slice: T[]) => ReactNode', required: true, description: 'Render the chart for the visible slice.' },
    { name: 'defaultRange', type: '[start, end]', required: false, description: 'Starting indexes; the whole range by default.' },
    { name: 'minSpan', type: 'number', default: '2', required: false, description: 'Fewest categories shown.' },
  ],
  examples: [{ title: 'Zoom a year of revenue' }],
  a11y: {
    keyboard: [{ key: 'Arrow keys / Home / End', description: 'Move the focused thumb.' }],
    notes: ['Thumbs read "Zoom start: Mar" and "Zoom end: Sep". Charts themselves stay server components; only this wrapper runs on the client.'],
  },
};

export default entry;
