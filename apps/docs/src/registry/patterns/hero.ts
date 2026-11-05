import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'hero',
    title: 'Hero',
    description: "The page hero: ambient backdrop, eyebrow, display headline (the page's one h1), lead, actions and a visual. Server component.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "title", type: "React.ReactNode", required: true, description: "The headline, rendered as the h1." },
    { name: "eyebrow", type: "React.ReactNode", required: false, description: "A string becomes a gradient EyebrowChip." },
    { name: "description", type: "React.ReactNode", required: false, description: "The lead paragraph." },
    { name: "actions", type: "React.ReactNode", required: false, description: "One `Button variant=\"hero\"` and one outlined button, usually." },
    { name: "visual", type: "React.ReactNode", required: false, description: "Product shot or illustration. Beside the text on wide screens with `align=\"start\"`." },
    { name: "align", type: "'center' | 'start'", default: "'center'", required: false, description: "Text alignment and layout." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
