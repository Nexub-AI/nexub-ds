import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'donut-chart',
    title: 'Donut Chart',
    description: 'Parts of a whole, with an optional total in the hole. Keep it to six slices or fewer.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '3.2.0',
    related: ['bar-chart'],
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'Accessible name of the chart.' },
    { name: 'data', type: '{ label: string; value: number; color?: ChartColor }[]', required: true, description: 'One entry per slice.' },
    { name: 'center', type: 'ReactNode', required: false, description: 'Content in the hole, such as the total.' },
    { name: 'valueFormat', type: '(value: number) => string', required: false, description: 'Formats the hover text and the data table.' },
    { name: 'legend', type: 'boolean', default: 'true', required: false, description: 'Show the legend beside the donut.' },
  ],
  examples: [
    { title: 'With total' },
  ],
  a11y: {
    screenReader: [
      'The chart is a `figure` named by `title`. The drawing is hidden from assistive tech; a visually hidden table carries every value.',
      'Colour is never the only cue: the legend and table name each series. Past six series, label directly or group the rest as "Other".',
    ],
  },
};

export default entry;
