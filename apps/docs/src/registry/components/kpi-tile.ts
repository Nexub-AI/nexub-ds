import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'kpi-tile',
    title: 'KPI Tile',
    description: 'A headline number with its change versus last period and a trend line.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.5.0',
    related: ['bar-chart', 'line-chart'],
  },
  props: [
    { name: 'label', type: 'string', required: true, description: 'What the number is.' },
    { name: 'value', type: 'ReactNode', required: true, description: 'The formatted number.' },
    { name: 'change', type: 'number', required: false, description: 'Change as a fraction, e.g. 0.114 for +11.4%.' },
    { name: 'invert', type: 'boolean', default: 'false', required: false, description: 'Down is good (churn, costs): flips the colour.' },
    { name: 'trend', type: 'number[]', required: false, description: 'Recent values for the sparkline, oldest first.' },
  ],
  examples: [{ title: 'Dashboard row' }],
  a11y: {
    screenReader: ['The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.'],
  },
};

export default entry;
