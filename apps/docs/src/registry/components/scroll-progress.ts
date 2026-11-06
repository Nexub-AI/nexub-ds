import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'scroll-progress',
    title: 'Scroll Progress',
    description: 'A thin bar along the top that fills as the page scrolls. CSS only.',
    category: 'Motion',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.4.0',
    related: ['scroll-area'],
  },
  props: [
    { name: 'className', type: 'string', required: false, description: 'Position or colour overrides. Defaults to the accent (the Vivid gradient under data-expression="vivid").' },
  ],
  examples: [{ title: 'Long page' }],
  a11y: {
    screenReader: ['Decorative (`aria-hidden`); hidden under reduced motion and where scroll-driven animations are not supported.'],
  },
};

export default entry;
