import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'sparkline',
    title: 'Sparkline',
    description: 'A tiny trend line with no axes, for stat cards and table cells.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '3.2.0',
    related: ['line-chart', 'stat-card'],
  },
  props: [
    { name: 'values', type: 'number[]', required: true, description: 'The points, oldest first.' },
    { name: 'label', type: 'string', required: false, description: 'Accessible summary, such as "Revenue, last 12 weeks, up 8%". Without it the sparkline is decorative.' },
    { name: 'color', type: 'ChartColor', default: '1', required: false, description: 'Palette colour, 1–8.' },
    { name: 'area', type: 'boolean', default: 'false', required: false, description: 'Fill the area under the line.' },
  ],
  examples: [
    { title: 'In a stat' },
  ],
  a11y: {
    screenReader: [
      'The chart is a `figure` named by `title`. The drawing is hidden from assistive tech; a visually hidden table carries every value.',
      'Colour is never the only cue: the legend and table name each series. Past six series, label directly or group the rest as "Other".',
    ],
  },
};

export default entry;
