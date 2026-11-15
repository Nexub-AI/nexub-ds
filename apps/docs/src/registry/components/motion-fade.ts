import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'motion-fade',
    title: 'Fade',
    description: 'Animates opacity between 0 and 1 based on the `in` prop.',
    category: 'Motion',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'in', type: 'boolean', required: true, description: 'When true, fades content in. When false, fades it out.' },
    { name: 'duration', type: "'instant' | 'fast' | 'normal' | 'slow' | 'slower'", default: "'normal'", required: false, description: 'Controls the animation speed using the design token scale.' },
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
    {
      title: 'Slow spring',
    },
  ],
};

export default entry;
