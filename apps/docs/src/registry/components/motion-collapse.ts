import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'motion-collapse',
    title: 'Collapse',
    description: 'Expands and collapses content along the block axis.',
    category: 'Motion',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'in', type: 'boolean', required: true, description: 'When true, expands the content to its natural height. When false, collapses it to zero height.' },
    { name: 'duration', type: "'instant' | 'fast' | 'normal' | 'slow' | 'slower'", default: "'normal'", required: false, description: 'Controls the animation speed using the design token scale.' },
    { name: 'unmountOnExit', type: 'boolean', default: 'false', required: false, description: 'Removes the element from the DOM after the collapse animation completes.' },
    { name: 'as', type: 'React.ElementType', default: "'div'", required: false, description: 'The HTML element or component to render as the wrapper.' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'Content to expand and collapse.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Toggle',
    },
  ],
};

export default entry;
