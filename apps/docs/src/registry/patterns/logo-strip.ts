import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'logo-strip',
    title: 'LogoStrip',
    description: "A row of customer logos under the hero, scrolling sideways (paused on hover and focus) or wrapped. Server component.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "label", type: "React.ReactNode", required: false, description: "e.g. \"Trusted by 2,000+ teams\"." },
    { name: "scroll", type: "boolean", default: "true", required: false, description: "Scroll the logos (marketing mode only); off gives a wrapped row." },
    { name: "children", type: "React.ReactNode", required: true, description: "The logos. Give each its alt text." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
