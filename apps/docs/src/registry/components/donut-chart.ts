import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'donut-chart',
    title: 'Donut Chart',
    description: 'Parts of a whole, with an optional total in the hole. Keep it to six slices or fewer.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '3.2.0',
    related: ['bar-chart'],
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'Accessible name of the chart.' },
    { name: 'data', type: '{ label: string; value: number; color?: ChartColor }[]', required: true, description: 'One entry per slice.' },
    { name: 'center', type: 'ReactNode', required: false, description: 'Content in the hole, such as the total.' },
    { name: 'valueFormat', type: '(value: number) => string', required: false, description: 'Formats the hover text and the data table.' },
    { name: 'legend', type: 'boolean', default: 'true', required: false, description: 'Show the legend beside the donut.' },
    { name: 'maxSlices / otherLabel', type: 'number / string', description: '11.3: group the smallest slices into one "Other".' },
    { name: 'legendValues', type: 'boolean', description: '11.3: value and share on each legend row.' },
    { name: 'data[].href', type: 'string', description: '11.3: makes the slice\'s legend row a link.' },
    { name: 'data[].color', type: "1–8 | 'good' | 'warning' | 'danger' | 'neutral'", description: '11.3: a palette colour or a tone.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '11.3: diameter.' },
    { name: 'tableView', type: 'boolean | string', description: '11.3: a visible "Show as table" disclosure.' },
  ],
  examples: [
    { title: 'With total' },
    { title: 'Other, legend values and links' },
  ],
  a11y: {
    screenReader: [
      'The chart is a `figure` named by `title`. The drawing is hidden from assistive tech; a visually hidden table carries every value.',
      'Colour is never the only cue: the legend and table name each series. Past six series, label directly or group the rest as "Other".',
    ],
  },
};

export default entry;
