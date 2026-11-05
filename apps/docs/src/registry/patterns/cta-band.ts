import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'cta-band',
    title: 'CTABand',
    description: "The closing call to action on a primary band: the hero gradient in marketing mode. Server component.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "title", type: "React.ReactNode", required: true, description: "The heading (h2)." },
    { name: "description", type: "React.ReactNode", required: false, description: "One supporting line." },
    { name: "actions", type: "React.ReactNode", required: false, description: "Buttons. On the band use `variant=\"filled\" tone=\"neutral\"` or an outlined button." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
