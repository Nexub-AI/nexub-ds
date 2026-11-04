import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'icon-button',
    title: 'Icon Button',
    description: 'A square button designed to hold a single icon, with an accessible label.',
    category: 'Actions',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'variant', type: "'ghost' | 'solid' | 'outline' | 'subtle'", default: "'ghost'", required: false, description: 'Visual style of the icon button.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", required: false, description: 'Controls button dimensions.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables the button.' },
    { name: 'loading', type: 'boolean', required: false, description: 'Shows a spinner and disables interaction.' },
    { name: 'asChild', type: 'boolean', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Variants',
    },
  ],
};

export default entry;
