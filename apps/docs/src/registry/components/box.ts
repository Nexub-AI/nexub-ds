import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'box',
    title: 'Box',
    description: 'Generic container primitive with style token props.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'padding', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", required: false, description: 'Padding applied to all sides using design tokens.' },
    { name: 'background', type: 'string', required: false, description: 'Background color CSS value or token.' },
    { name: 'radius', type: 'string', required: false, description: 'Border radius CSS value or token.' },
    { name: 'asChild', type: 'boolean', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Box padding="md" style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
  Content inside a Box
</Box>`,
    },
    {
      title: 'Nested',
      code: `<Box padding="lg" style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
  <Heading size="h4">Section title</Heading>
  <Box padding="sm" style={{ background: 'var(--color-bg-default)', borderRadius: 'var(--radius-md)', marginTop: '8px' }}>
    <Text>Nested box content</Text>
  </Box>
</Box>`,
    },
  ],
};

export default entry;
