import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'usage-bar',
    title: 'Usage Bar',
    description: 'A compact used-of-limit bar with its label inline, for table cells and fact grids.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.3.0',
    related: ['usage-tile', 'progress', 'table'],
  },
  usage: {
    whenToUse: ['A usage column in a table (seats per workspace, quota per key).', 'A row in a DescriptionList or fact grid.'],
    whenNotToUse: ['The headline of a tile: use UsageTile.', 'A task moving toward done: use Progress.'],
  },
  props: [
    { name: 'used', type: 'number', required: true, description: 'The amount used.' },
    { name: 'limit', type: 'number | null', required: true, description: 'The limit. `null` or `Infinity` shows the value and "Unlimited", no bar.' },
    { name: 'label', type: 'ReactNode | false', default: '"used / limit"', description: 'The inline text beside the bar. `false` hides it.' },
    { name: 'aria-label', type: 'string', description: 'Names the meter, e.g. "Seats". Without it the meter is named by its value.' },
    { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: 'Bar thickness and label size.' },
    { name: 'warnAt', type: 'number', default: '0.8', description: 'Share of the limit that turns the bar to the warning tone; at or over the limit it is the danger tone.' },
    { name: 'valueFormat', type: '(value: number) => string', default: 'toLocaleString', description: 'Formats the value and the limit.' },
  ],
  examples: [{ title: 'Levels' }, { title: 'In a table' }],
  a11y: {
    roles: ['A `meter` with `aria-valuenow` as the percentage and `aria-valuetext` such as "42 of 50, 84% used"; the inline label is hidden from assistive tech so it is not read twice.'],
  },
};

export default entry;
