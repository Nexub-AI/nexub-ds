import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'truncate',
    title: 'Truncate',
    description: 'Text clipped to one or more lines, with the full text in a tooltip only while it is clipped.',
    category: 'Typography',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '10.7.0',
    related: ['text', 'tooltip'],
  },
  props: [
    { name: 'lines', type: 'number', default: '1', description: 'Lines shown before the text is clipped.' },
    { name: 'as', type: 'React.ElementType', default: "'span'", description: 'The element to render.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'Show the full text in a tooltip while it is clipped. Needs string children.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Several lines' }],
  a11y: {
    notes: [
      'Clipped text is a tab stop, so keyboard users can read the tooltip. Text that fits adds no tab stop and no tooltip.',
      'The tooltip needs string children; other children are clipped only.',
    ],
  },
};

export default entry;
