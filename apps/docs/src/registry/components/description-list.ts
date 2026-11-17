import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'description-list',
    title: 'Description List',
    description: 'Key–value rows with list semantics: a receipt, a fee breakdown, the details of a record.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '10.7.0',
    related: ['info-list', 'table'],
  },
  props: [
    { name: 'Root layout', type: "'inline' | 'stacked'", default: "'inline'", description: 'Label and value on one row, or label above the value.' },
    { name: 'Root columns', type: '1 | 2 | 3', default: '1', description: 'Pairs per row. Falls back to fewer columns when the list itself is narrow.' },
    { name: 'Root divided', type: 'boolean', description: 'A hairline between rows.' },
    { name: 'Root size', type: "'sm' | 'md'", default: "'md'", description: 'Row height and type size.' },
    { name: 'Item label', type: 'React.ReactNode', required: true, description: 'The term.' },
    { name: 'Item children', type: 'React.ReactNode', description: 'The value.' },
    { name: 'Item emphasis', type: 'boolean', description: 'A total: stronger label and value, and a rule above.' },
    { name: 'Item align', type: "'start' | 'end'", description: 'Where the value sits. Defaults to the end when inline, the start when stacked.' },
    { name: 'Item helpText', type: 'React.ReactNode', description: 'A small muted line under the label.' },
  ],
  examples: [{ title: 'Receipt with a total' }, { title: 'Stacked, in columns' }],
};

export default entry;
