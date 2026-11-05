import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'how-it-works',
    title: 'HowItWorks',
    description: "Numbered steps in an ordered list. Server component.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "steps", type: "{ title, description, icon? }[]", required: true, description: "The steps; the number shows unless an icon is given." },
    { name: "header", type: "React.ReactNode", required: false, description: "A SectionHeader, usually." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
