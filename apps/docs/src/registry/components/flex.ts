import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'flex',
    title: 'Flex',
    description: 'Flexbox layout primitive.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'direction', type: "'row' | 'column' | 'row-reverse' | 'column-reverse'", required: false, description: 'Sets the flex-direction CSS property.' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", required: false, description: 'Sets the align-items CSS property.' },
    { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around'", required: false, description: 'Sets the justify-content CSS property.' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", required: false, description: 'Spacing between children using design tokens.' },
    { name: 'wrap', type: 'boolean', required: false, description: 'Allows children to wrap onto multiple lines.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Flex gap="md" align="center">
  <Button variant="primary">Action</Button>
  <Button variant="outline">Cancel</Button>
</Flex>`,
    },
    {
      title: 'Space between',
      code: `<Flex justify="between">
  <Badge tone="success">Active</Badge>
  <Badge tone="neutral">Draft</Badge>
</Flex>`,
    },
    {
      title: 'Wrap',
      code: `<Flex gap="sm" wrap>
  <Badge tone="info">React</Badge>
  <Badge tone="info">TypeScript</Badge>
  <Badge tone="info">Tailwind</Badge>
  <Badge tone="info">Radix UI</Badge>
  <Badge tone="info">Storybook</Badge>
</Flex>`,
    },
  ],
};

export default entry;
