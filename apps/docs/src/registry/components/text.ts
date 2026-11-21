import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'text',
    title: 'Text',
    description: 'Paragraph text component with size, tone, and weight variants.',
    category: 'Typography',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'size', type: "'body-lg' | 'body' | 'body-sm' | 'caption' | 'label'", default: "'body'", required: false, description: 'Controls the font size and line height.' },
    { name: 'tone', type: "'default' | 'secondary' | 'muted' | 'subtle' | 'inverse' | 'danger' | 'success' | 'warning'", required: false, description: 'Color tone applied to the text. The status tones (11.1) meet 4.5:1 on every surface.' },
    { name: 'weight', type: "'regular' | 'medium' | 'semibold' | 'bold'", required: false, description: 'Font weight of the text.' },
    { name: 'truncate', type: 'boolean', required: false, description: 'Truncates text with an ellipsis when it overflows.' },
    { name: 'lineClamp', type: 'number', required: false, description: 'Clamps the text to a maximum number of lines.' },
    { name: 'asChild', type: 'boolean', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Sizes',
    },
    {
      title: 'Tones',
    },
  ],
};

export default entry;
