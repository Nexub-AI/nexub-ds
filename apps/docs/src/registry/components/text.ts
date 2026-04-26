import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'text',
    title: 'Text',
    description: 'Paragraph text component with size, tone, and weight variants.',
    category: 'Typography',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'size', type: "'body-lg' | 'body' | 'body-sm' | 'caption' | 'label'", default: "'body'", required: false, description: 'Controls the font size and line height.' },
    { name: 'tone', type: "'default' | 'secondary' | 'muted' | 'subtle' | 'inverse'", required: false, description: 'Color tone applied to the text.' },
    { name: 'weight', type: "'regular' | 'medium' | 'semibold' | 'bold'", required: false, description: 'Font weight of the text.' },
    { name: 'truncate', type: 'boolean', required: false, description: 'Truncates text with an ellipsis when it overflows.' },
    { name: 'lineClamp', type: 'number', required: false, description: 'Clamps the text to a maximum number of lines.' },
    { name: 'asChild', type: 'boolean', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Text>The Nexub design system provides accessible, token-driven components.</Text>`,
    },
    {
      title: 'Sizes',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <Text size="body-lg">Body large — ideal for introductory paragraphs.</Text>
  <Text size="body">Body — the default reading size.</Text>
  <Text size="body-sm">Body small — secondary content and descriptions.</Text>
  <Text size="caption">Caption — metadata and timestamps.</Text>
</div>`,
    },
    {
      title: 'Tones',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <Text tone="default">Default tone</Text>
  <Text tone="secondary">Secondary tone</Text>
  <Text tone="muted">Muted tone</Text>
</div>`,
    },
  ],
};

export default entry;
