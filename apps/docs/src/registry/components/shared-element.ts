import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'shared-element',
    title: 'Shared Element',
    description: 'Morphs the same element between two states or pages inside a view transition.',
    category: 'Motion',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.4.0',
    related: ['motion-fade'],
  },
  props: [
    { name: 'name', type: 'string', required: true, description: 'Same name on both sides, e.g. `avatar-${id}`. One element per name on screen at a time.' },
    { name: 'children', type: 'ReactElement', required: true, description: 'One element; the name is set on it.' },
  ],
  examples: [{ title: 'List to detail' }],
  a11y: {
    screenReader: ['Visual only: run the change in `startViewTransition()` and move focus to the new view as usual.'],
  },
};

export default entry;
