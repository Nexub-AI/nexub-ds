import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'gauge',
    title: 'Gauge',
    description: 'Progress toward a target on a 270° arc.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.5.0',
    related: ['bar-chart', 'line-chart'],
  },
  props: [
    { name: 'value', type: 'number', required: true, description: 'Current value.' },
    { name: 'max', type: 'number', default: '100', required: false, description: 'Target.' },
    { name: 'title', type: 'string', required: true, description: 'Accessible name.' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Centre text; defaults to the percentage.' },
    { name: 'color', type: 'ChartColor', default: '1', required: false, description: 'Palette colour, 1–8.' },
  ],
  examples: [{ title: 'Storage used' }],
  a11y: {
    screenReader: ['The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.'],
  },
};

export default entry;
