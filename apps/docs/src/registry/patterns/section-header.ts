import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'section-header',
    title: 'SectionHeader',
    description: "Eyebrow, headline and lead that open a section. Server component.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "title", type: "React.ReactNode", required: true, description: "The section heading (h2 by default)." },
    { name: "eyebrow", type: "React.ReactNode", required: false, description: "A string becomes a gradient EyebrowChip." },
    { name: "description", type: "React.ReactNode", required: false, description: "The lead paragraph." },
    { name: "align", type: "'center' | 'start'", default: "'center'", required: false, description: "Alignment." },
    { name: "level", type: "2 | 3", default: "2", required: false, description: "Heading level." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
