import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'chart-toggle',
    title: 'Chart Toggle',
    description: 'A legend whose entries switch series on and off, wrapped around any chart.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.6.0',
    related: ['bar-chart', 'line-chart'],
  },
  props: [
    { name: 'series', type: 'ChartSeries[]', required: true, description: 'The same series the chart takes.' },
    { name: 'children', type: '(visible: ChartSeries[]) => ReactNode', required: true, description: 'Renders the chart with the series that are on. Colours stay stable.' },
    { name: 'label', type: 'string', default: "'Series'", required: false, description: 'Accessible name for the group of toggles.' },
  ],
  examples: [{ title: 'Toggle series' }],
  a11y: {
    keyboard: [{ key: 'Tab / Space', description: 'Move between series and switch one on or off.' }],
    screenReader: ['Each series is a toggle button with `aria-pressed`. The last visible series cannot be switched off.'],
  },
};

export default entry;
