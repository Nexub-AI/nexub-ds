import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'segmented-control',
    title: 'SegmentedControl',
    description: 'Tab-style control for mutually exclusive selections.',
    category: 'Interactive',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Size of the segmented control.' },
    { name: 'value', type: 'string', required: false, description: 'The controlled selected value.' },
    { name: 'defaultValue', type: 'string', required: false, description: 'The initial selected value when uncontrolled.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<SegmentedControl.Root defaultValue="month">
  <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
  <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
  <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
</SegmentedControl.Root>`,
    },
    {
      title: 'Sizes',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <SegmentedControl.Root defaultValue="b" size="sm">
    <SegmentedControl.Item value="a">Small A</SegmentedControl.Item>
    <SegmentedControl.Item value="b">Small B</SegmentedControl.Item>
  </SegmentedControl.Root>
  <SegmentedControl.Root defaultValue="b" size="md">
    <SegmentedControl.Item value="a">Medium A</SegmentedControl.Item>
    <SegmentedControl.Item value="b">Medium B</SegmentedControl.Item>
  </SegmentedControl.Root>
  <SegmentedControl.Root defaultValue="b" size="lg">
    <SegmentedControl.Item value="a">Large A</SegmentedControl.Item>
    <SegmentedControl.Item value="b">Large B</SegmentedControl.Item>
  </SegmentedControl.Root>
</div>`,
    },
  ],
};

export default entry;
