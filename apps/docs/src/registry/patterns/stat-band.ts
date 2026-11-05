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
    { name: "title", type: "React.ReactNode", required: false, description: "StatBand: a heading above the stats." },
    { name: "value", type: "number | string", required: true, description: "StatBandItem: a number counts up from zeros when it scrolls into view; the server HTML keeps the real value." },
    { name: "label", type: "React.ReactNode", required: true, description: "StatBandItem: what the number counts." },
    { name: "prefix / suffix", type: "string", required: false, description: "StatBandItem: e.g. \"$\" or \"+\"." },
    { name: "tone", type: "ToneValue", default: "'info'", required: false, description: "StatBandItem: the number's colour (accent roles, AA as large text)." },
    { name: "format", type: "Intl.NumberFormatOptions", required: false, description: "StatBandItem: number formatting." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
