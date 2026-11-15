import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'aspect-ratio',
    title: 'Aspect Ratio',
    description: 'Keeps its content at a fixed width-to-height ratio, for images, video and embeds.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['media-card', 'box'],
  },
  props: [
    { name: 'ratio', type: 'number', description: 'Width divided by height, e.g. `16 / 9` or `1`. Common ratios (1, 16/9, 4/3, 3/2, 21/9, 9/16, 3/4, 2/3) use a class and are strict-CSP safe; any other ratio sets an inline `aspect-ratio` style.' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Fills the box; give an image `h-full w-full object-cover`.' },
  ],
  examples: [{ title: 'Image' }, { title: 'Ratios' }],
};

export default entry;
