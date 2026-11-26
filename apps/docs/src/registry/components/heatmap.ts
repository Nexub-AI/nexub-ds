import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'heatmap',
    title: 'Heatmap',
    description: 'Intensity over a grid, such as activity by weekday and week, in seven sequential steps.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '4.5.0',
    related: ['bar-chart', 'line-chart'],
  },
  props: [
    { name: 'data', type: '(number | null)[][]', required: true, description: 'Rows of values. 11.3: a missing cell (`null`, `undefined` or a hole) is drawn hatched, listed as "—" and left out of the colour range.' },
    { name: 'rowLabels', type: 'string[]', required: true, description: 'One label per row.' },
    { name: 'columnLabels', type: 'string[]', required: false, description: 'Used in the hover text.' },
    { name: 'title', type: 'string', required: true, description: 'Accessible name and table caption.' },
    { name: 'legend', type: 'boolean', required: false, description: '11.3: a low → high scale under the grid with the min and max values, plus a "No data" swatch when cells are missing.' },
    { name: 'tableView', type: 'boolean | string', required: false, description: '11.3: a "Show as table" disclosure under the drawing with the same data; a string sets its label.' },
  ],
  examples: [{ title: 'Weekly activity' }, { title: 'Missing cells and legend', description: '`null` cells are hatched; `legend` shows the scale.' }],
  a11y: {
    screenReader: ['The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.'],
  },
};

export default entry;
