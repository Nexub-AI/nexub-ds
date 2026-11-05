import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'line-chart',
    title: 'Line Chart',
    description: 'Show a trend over ordered categories such as time. Server-rendered SVG on the chart palette.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '3.2.0',
    related: ['bar-chart', 'sparkline'],
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'Accessible name of the chart and caption of its data table.' },
    { name: 'data', type: 'T[]', required: true, description: 'One row per category, in order.' },
    { name: 'index', type: 'keyof T', required: true, description: 'Key of the category label in each row (the x axis).' },
    { name: 'series', type: 'ChartSeries[]', required: true, description: '`{ key, label?, color? }` per series. `color` is 1–8 from the categorical chart palette; defaults to the series position.' },
    { name: 'valueFormat', type: '(value: number) => string', required: false, description: 'Formats axis labels, hover text and the data table.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Plot height: 8, 12 or 16rem.' },
    { name: 'legend', type: 'boolean', required: false, description: 'Show the legend. Defaults to on for more than one series.' },
    { name: 'area', type: 'boolean', default: 'false', required: false, description: 'Fill the area under each line.' },
  ],
  examples: [
    { title: 'Two series' },
    { title: 'Area' },
  ],
  a11y: {
    screenReader: [
      'The chart is a `figure` named by `title`. The drawing is hidden from assistive tech; a visually hidden table carries every value.',
      'Colour is never the only cue: the legend and table name each series. Past six series, label directly or group the rest as "Other".',
    ],
  },
};

export default entry;
