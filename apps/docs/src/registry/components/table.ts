import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'table',
    title: 'Table',
    description: 'Semantic HTML table with styled variants.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'Table.Root striped', type: 'boolean', default: 'false', required: false, description: 'Applies alternating row background colours.' },
    { name: 'Table.Root bordered', type: 'boolean', default: 'false', required: false, description: 'Adds borders between rows and columns.' },
    { name: 'Table.Root hoverable', type: 'boolean', default: 'false', required: false, description: 'Highlights rows on mouse hover.' },
    { name: 'Table.Root stickyHeader', type: 'boolean', default: 'false', required: false, description: 'Fixes the table header to the top when scrolling inside a scrollable container.' },
    { name: 'Table.Head align', type: "'start' | 'center' | 'end'", default: "'start'", required: false, description: 'Text alignment within the header cell.' },
    { name: 'Table.Cell align', type: "'start' | 'center' | 'end'", default: "'start'", required: false, description: 'Text alignment within the data cell.' },
    { name: 'Table.Caption side', type: "'top' | 'bottom'", default: "'bottom'", required: false, description: 'Whether the caption appears above or below the table.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'With caption',
    },
  ],
};

export default entry;
