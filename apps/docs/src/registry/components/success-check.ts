import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'success-check',
    title: 'Success Check',
    description: 'A small success moment: a ring that pops in and a tick that draws.',
    category: 'Feedback',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '10.3.0',
    related: ['celebrate', 'toast'],
  },
  props: [
    { name: 'label', type: 'string', description: 'Accessible name, e.g. "Payment sent". Without it the mark is decorative: say the result in text.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the mark.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Sizes' }],
};

export default entry;
