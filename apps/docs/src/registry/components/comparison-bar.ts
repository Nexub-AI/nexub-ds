import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'comparison-bar',
    title: 'Comparison Bar',
    description: 'Two values on one split bar, with the numbers always shown as text.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '10.7.0',
    related: ['progress', 'description-list'],
  },
  props: [
    { name: 'label', type: 'string', required: true, description: 'What is compared.' },
    { name: 'left', type: '{ label: string; value: number; color?: CategoryColor }', required: true, description: 'The side at the inline start.' },
    { name: 'right', type: '{ label: string; value: number; color?: CategoryColor }', required: true, description: 'The side at the inline end.' },
    { name: 'valueFormat', type: '(value: number) => string', description: 'Formats both values, on screen and in the text alternative.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Bar height and type size.' },
    { name: 'showValues', type: 'boolean', default: 'true', description: 'The two values and the label above the bar.' },
    { name: 'showLabels', type: 'boolean', default: 'true', description: 'The two side labels under the bar. Turn off for all but one bar in a group.' },
    { name: 'highlight', type: "'higher' | 'none'", default: "'higher'", description: 'The larger side takes the accent and the other is muted. A side with a `color` keeps it.' },
    { name: 'aria-label', type: 'string', description: 'Replaces the text alternative built from the props.' },
  ],
  examples: [{ title: 'Default' }, { title: 'A group of comparisons' }],
};

export default entry;
