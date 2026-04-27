import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'text-gradient',
    title: 'Text Gradient',
    description: 'Renders text with a brand gradient fill.',
    category: 'Inline Primitives',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'from', type: 'string', required: false, description: 'Starting color of the gradient (CSS color value or token).' },
    { name: 'to', type: 'string', required: false, description: 'Ending color of the gradient (CSS color value or token).' },
    { name: 'direction', type: "'to-r' | 'to-br' | 'to-b'", required: false, description: 'Direction of the gradient.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<TextGradient>Design system for ambitious teams</TextGradient>`,
    },
    {
      title: 'In heading',
      code: `<Heading size="h1">
  Build with{' '}
  <TextGradient>Nexub</TextGradient>
</Heading>`,
    },
    {
      title: 'Custom direction',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <TextGradient direction="to-r">Horizontal gradient</TextGradient>
  <TextGradient direction="to-br">Diagonal gradient</TextGradient>
  <TextGradient direction="to-b">Vertical gradient</TextGradient>
</div>`,
    },
  ],
};

export default entry;
