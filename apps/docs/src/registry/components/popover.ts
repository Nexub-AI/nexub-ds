import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'popover',
    title: 'Popover',
    description: 'Floating content panel anchored to a trigger element.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'Popover.Root', type: 'compound', required: false, description: 'Root provider that manages open/close state.' },
    { name: 'Popover.Trigger', type: 'compound', required: false, description: 'Element that toggles the popover on click.' },
    { name: 'Popover.Content', type: 'compound', required: false, description: 'The floating content panel.' },
    { name: 'Popover.Arrow', type: 'compound', required: false, description: 'Optional arrow pointing to the trigger.' },
    { name: 'Popover.Close', type: 'compound', required: false, description: 'Button that closes the popover.' },
    { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", required: false, description: 'Preferred side of the trigger to render the content.' },
    { name: 'align', type: "'start' | 'center' | 'end'", required: false, description: 'Alignment of the content relative to the trigger.' },
    { name: 'sideOffset', type: 'number', required: false, description: 'Distance in pixels between the trigger and the content.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Popover.Root>
  <Popover.Trigger asChild>
    <Button variant="outline">Open popover</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Text size="body-sm">Popover content goes here.</Text>
  </Popover.Content>
</Popover.Root>`,
    },
    {
      title: 'With close button',
      code: `<Popover.Root>
  <Popover.Trigger asChild>
    <Button variant="outline">Settings</Button>
  </Popover.Trigger>
  <Popover.Content side="bottom" align="end" sideOffset={8}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text weight="semibold">Preferences</Text>
      <Text size="body-sm" tone="secondary">Adjust your display settings.</Text>
      <Popover.Close asChild>
        <Button variant="ghost" size="sm">Close</Button>
      </Popover.Close>
    </div>
  </Popover.Content>
</Popover.Root>`,
    },
  ],
};

export default entry;
