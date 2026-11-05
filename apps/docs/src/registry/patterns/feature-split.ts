import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'feature-split',
    title: 'FeatureSplit',
    description: "Text and a check list beside a visual; `reverse` swaps the sides on wide screens. Server component.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "title", type: "React.ReactNode", required: true, description: "The heading (h2)." },
    { name: "visual", type: "React.ReactNode", required: true, description: "Screenshot or illustration." },
    { name: "eyebrow", type: "React.ReactNode", required: false, description: "A string becomes a gradient EyebrowChip." },
    { name: "description", type: "React.ReactNode", required: false, description: "Body copy." },
    { name: "points", type: "string[]", required: false, description: "Benefit lines, shown as a check list." },
    { name: "actions", type: "React.ReactNode", required: false, description: "Buttons." },
    { name: "reverse", type: "boolean", default: "false", required: false, description: "Visual on the left on wide screens." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
