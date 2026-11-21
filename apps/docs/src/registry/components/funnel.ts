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
    { name: 'data[].values', type: 'Record<string, number>', required: false, description: '11.3: the other series\' numbers for this step, keyed by series key.' },
    { name: 'series', type: '{ key: string; label?: string; color?: ChartColor }[]', required: false, description: "11.3: several series per step, drawn as thin bars with a legend. `key: 'value'` reads each step's `value`; other keys read `values[key]`. The interactive tooltip uses `value`." },
    { name: 'show', type: "'conversion' | 'drop-off' | 'both'", required: false, description: '11.3: visible numbers under each step: share of the first and the previous step, how many dropped off, or both. Unset draws the bars only.' },
    { name: 'tableView', type: 'boolean | string', required: false, description: '11.3: a "Show as table" disclosure under the drawing with the same data; a string sets its label.' },
  ],
  examples: [{ title: 'Signup funnel' }, { title: 'Conversion and drop-off', description: '`show="both"` with `tableView`.' }, { title: 'Several series', description: 'Web and app side by side, with conversion.' }],
  a11y: {
    screenReader: ['The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.'],
  },
};

export default entry;
