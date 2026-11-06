import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'aurora',
    title: 'Aurora',
    description: 'A decorative background of slow-drifting colour fields from the accent roles. Subtle by default, richer under data-expression="vivid".',
    category: 'Inline Primitives',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.2.0',
    related: ['text-gradient'],
  },
  props: [
    { name: 'className', type: 'string', required: false, description: 'Shape it to its container, e.g. `rounded-shape-container`. The parent needs `position: relative` and `isolate` so the aurora stays behind the content.' },
  ],
  examples: [{ title: 'Behind a hero' }],
  a11y: {
    screenReader: ['Decorative: the whole layer is `aria-hidden`.'],
    notes: ['The fields stop drifting under reduced motion and the layer is hidden in forced-colours mode.'],
  },
};

export default entry;
