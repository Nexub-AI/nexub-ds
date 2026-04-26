import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'hover-card',
    title: 'HoverCard',
    description: 'Rich tooltip card revealed on hover.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'HoverCard.Root', type: 'compound', required: false, description: 'Root provider that manages open/close state.' },
    { name: 'HoverCard.Trigger', type: 'compound', required: false, description: 'Element that triggers the card on hover.' },
    { name: 'HoverCard.Content', type: 'compound', required: false, description: 'The floating card panel shown on hover.' },
    { name: 'openDelay', type: 'number', required: false, description: 'Delay in milliseconds before the card opens.' },
    { name: 'closeDelay', type: 'number', required: false, description: 'Delay in milliseconds before the card closes.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<HoverCard.Root openDelay={200} closeDelay={100}>
  <HoverCard.Trigger asChild>
    <Link href="#">@sasidharan</Link>
  </HoverCard.Trigger>
  <HoverCard.Content side="bottom" align="start" sideOffset={8}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '240px' }}>
      <Text weight="semibold">Sasidharan</Text>
      <Text size="body-sm" tone="secondary">Full-stack engineer building design systems.</Text>
      <Text size="caption" tone="muted">Joined April 2024</Text>
    </div>
  </HoverCard.Content>
</HoverCard.Root>`,
    },
  ],
};

export default entry;
