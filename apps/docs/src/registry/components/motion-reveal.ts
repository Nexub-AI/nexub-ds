import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'motion-reveal',
    title: 'Reveal',
    description: 'Fades its content up as it scrolls into view, in marketing mode. CSS scroll-driven where supported, an IntersectionObserver elsewhere; content on screen at load, and every visitor without JS or with reduced motion, just sees it.',
    category: 'Motion',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: 'asChild', type: 'boolean', default: 'false', required: false, description: 'Merge onto the child element instead of a div.' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'Content to reveal.' },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
