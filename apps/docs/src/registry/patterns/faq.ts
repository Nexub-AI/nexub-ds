import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'faq',
    title: 'FAQ',
    description: "Questions and answers in an Accordion, one open at a time. Client component.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "items", type: "{ question, answer }[]", required: true, description: "The questions; answers can hold links." },
    { name: "header", type: "React.ReactNode", required: false, description: "A SectionHeader, usually." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
