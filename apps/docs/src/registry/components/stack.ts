import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'stack',
    title: 'Stack',
    description: 'Vertical stack layout with configurable gap.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", required: false, description: 'Spacing between child elements.' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", required: false, description: 'Cross-axis alignment of children.' },
    { name: 'dividers', type: 'boolean', required: false, description: 'Renders a divider line between each child element.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Stack gap="md">
  <Button variant="outline">Item 1</Button>
  <Button variant="outline">Item 2</Button>
  <Button variant="outline">Item 3</Button>
</Stack>`,
    },
    {
      title: 'With dividers',
      code: `<Stack gap="md" dividers>
  <Text>First section</Text>
  <Text>Second section</Text>
  <Text>Third section</Text>
</Stack>`,
    },
  ],
};

export default entry;
