import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'heading',
    title: 'Heading',
    description: 'Semantic heading component with size, weight, and tone control.',
    category: 'Typography',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', required: false, description: 'The semantic HTML heading level rendered.' },
    { name: 'size', type: "'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'", required: false, description: 'Visual size of the heading, independent of the semantic level.' },
    { name: 'tone', type: "'default' | 'muted' | 'info' | 'success' | 'warning' | 'danger'", required: false, description: 'Color tone applied to the heading text.' },
    { name: 'weight', type: "'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold'", required: false, description: 'Font weight of the heading.' },
    { name: 'asChild', type: 'boolean', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Scale',
    },
    {
      title: 'Tones',
    },
  ],
};

export default entry;
