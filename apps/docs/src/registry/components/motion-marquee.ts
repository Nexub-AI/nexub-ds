import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'motion-marquee',
    title: 'Marquee',
    description: 'A row that scrolls sideways forever (logo strips, tool lists), in marketing mode. Pauses on hover and while focus is inside, stands still under reduced motion; the repeated copy is hidden from assistive tech and can’t be focused. Server component.',
    category: 'Motion',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: 'speed', type: "'slow' | 'normal' | 'fast'", default: "'normal'", required: false, description: 'Loop length: 44s, 28s or 18s.' },
    { name: 'rowClassName', type: 'string', default: "'gap-12 pe-12 items-center'", required: false, description: 'Classes for each copy of the row.' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'The items.' },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
