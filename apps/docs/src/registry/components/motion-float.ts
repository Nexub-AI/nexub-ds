import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'motion-float',
    title: 'Float',
    description: 'Gently bobs its content (floating cards over a hero visual), in marketing mode. Server component; still under reduced motion.',
    category: 'Motion',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: 'speed', type: "'normal' | 'slow'", default: "'normal'", required: false, description: '`slow` drifts on a longer, reversed loop, so two floating cards don’t move in step.' },
    { name: 'asChild', type: 'boolean', default: 'false', required: false, description: 'Merge onto the child element instead of a div.' },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
