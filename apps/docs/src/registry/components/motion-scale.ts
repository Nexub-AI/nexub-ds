import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'motion-scale',
    title: 'Scale',
    description: 'Scales content in/out from its center.',
    category: 'Motion',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'in', type: 'boolean', required: true, description: 'When true, scales content in from 0 to 1. When false, scales it back down to 0.' },
    { name: 'duration', type: "'instant' | 'fast' | 'normal' | 'slow' | 'slower'", default: "'normal'", required: false, description: 'Controls the animation speed using the design token scale.' },
    { name: 'easing', type: "'linear' | 'in' | 'out' | 'in-out' | 'out-expo' | 'spring'", default: "'out'", required: false, description: 'Easing curve applied to the animation.' },
    { name: 'unmountOnExit', type: 'boolean', default: 'false', required: false, description: 'Removes the element from the DOM after the exit animation completes.' },
    { name: 'as', type: 'React.ElementType', default: "'div'", required: false, description: 'The HTML element or component to render as the wrapper.' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'Content to animate.' },
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
