import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'scroll-area',
    title: 'Scroll Area',
    description: 'Scrollable container with custom styled scrollbars.',
    category: 'Disclosure',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'type', type: "'auto' | 'always' | 'scroll' | 'hover'", default: "'hover'", required: false, description: 'Controls when the scrollbar is visible. "hover" shows it on mouse-over, "scroll" while scrolling, "always" always, "auto" when content overflows.' },
    { name: 'scrollHideDelay', type: 'number', default: '600', required: false, description: 'Milliseconds before the scrollbar hides after the user stops interacting (only applies to types "scroll" and "hover").' },
    { name: 'orientation', type: "'vertical' | 'horizontal' | 'both'", default: "'vertical'", required: false, description: 'Which axis(es) to make scrollable.' },
    { name: 'className', type: 'string', required: false, description: 'Additional CSS class names applied to the viewport wrapper.' },
    { name: 'style', type: 'React.CSSProperties', required: false, description: 'Inline styles applied to the viewport wrapper.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Horizontal',
    },
  ],
};

export default entry;
