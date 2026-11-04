import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'grid',
    title: 'Grid',
    description: 'CSS Grid layout primitive.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'cols', type: 'number | string', required: false, description: 'Number of columns or a custom grid-template-columns value.' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", required: false, description: 'Gap between grid cells using design tokens.' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", required: false, description: 'Sets the align-items CSS property for all grid cells.' },
  ],
  examples: [
    {
      title: '2-column',
    },
    {
      title: '3-column',
    },
  ],
};

export default entry;
