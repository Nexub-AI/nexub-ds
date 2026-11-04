import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'separator',
    title: 'Separator',
    description: 'A horizontal or vertical visual divider.',
    category: 'Dividers',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Direction of the separator line.' },
    { name: 'decorative', type: 'boolean', default: 'true', required: false, description: 'When true, the separator is hidden from the accessibility tree.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Vertical',
    },
  ],
};

export default entry;
