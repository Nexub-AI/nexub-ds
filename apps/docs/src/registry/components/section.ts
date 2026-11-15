import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'section',
    title: 'Section',
    description: 'A full-width page band with vertical padding and a background tone; put a `Container` inside.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['container', 'box'],
  },
  props: [
    { name: 'paddingY', type: "'sm' | 'md' | 'lg'", description: 'Vertical padding: 48, 80 or 128 px.' },
    { name: 'tone', type: "'default' | 'subtle' | 'muted' | 'inverse'", description: 'Background: the surface, two container tints, or the inverse surface.' },
    { name: 'asChild', type: 'boolean', description: 'Apply the classes to the child element instead of a `<section>`.' },
  ],
  examples: [{ title: 'Tones' }],
  a11y: {
    notes: ['A `<section>` is a region landmark only when it has an accessible name: give it `aria-labelledby` pointing at its heading.'],
  },
};

export default entry;
