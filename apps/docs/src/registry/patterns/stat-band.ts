import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'stat-band',
    title: 'StatBand',
    description: "A band of headline numbers that count up as they scroll into view. StatBandItem is named apart from the StatCard pattern. Server component.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "title", type: "React.ReactNode", required: false, description: "A heading above the stats." },
    { name: "StatBandItem value", type: "number | string", required: true, description: "A number counts up from zeros when it scrolls into view; the server HTML keeps the real value." },
    { name: "StatBandItem label", type: "React.ReactNode", required: true, description: "What the number counts." },
    { name: "StatBandItem prefix / suffix", type: "string", required: false, description: "E.g. \"$\" or \"+\"." },
    { name: "StatBandItem tone", type: "ToneValue", default: "'info'", required: false, description: "The number's colour (accent roles, AA as large text)." },
    { name: "StatBandItem format", type: "Intl.NumberFormatOptions", required: false, description: "Number formatting." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
