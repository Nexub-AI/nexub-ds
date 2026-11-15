import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'visually-hidden',
    title: 'Visually Hidden',
    description: 'Content for screen readers only: hidden on screen but still read out (Radix).',
    category: 'Inline Primitives',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['icon-button'],
  },
  props: [
    { name: 'children', type: 'ReactNode', required: false, description: 'The text to read out.' },
    { name: 'asChild', type: 'boolean', required: false, description: 'Hide your own element instead of a `<span>`.' },
  ],
  examples: [{ title: 'Label an icon' }],
  usage: {
    whenToUse: ['Extra context a sighted user gets from layout, e.g. "(opens in a new tab)"'],
    whenNotToUse: ['Naming an icon button: `IconButton` takes a `label`', 'Hiding content from everyone: use `hidden`'],
  },
};

export default entry;
