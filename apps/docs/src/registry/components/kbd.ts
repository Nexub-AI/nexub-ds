import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'kbd',
    title: 'Kbd',
    description: 'Keyboard key display — renders a styled <kbd> element.',
    category: 'Inline Primitives',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: '...props', type: 'React.HTMLAttributes<HTMLElement>', required: false, description: 'All standard kbd HTML attributes are forwarded.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Combinations',
    },
  ],
};

export default entry;
