import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'drawer',
    title: 'Drawer',
    description: 'Slide-in panel from any edge of the screen.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'Drawer.Root', type: 'compound', required: false, description: 'Root provider that manages open/close state.' },
    { name: 'Drawer.Trigger', type: 'compound', required: false, description: 'Element that opens the drawer.' },
    { name: 'Drawer.Portal', type: 'compound', required: false, description: 'Portals the overlay and content into the document body.' },
    { name: 'Drawer.Overlay', type: 'compound', required: false, description: 'Dimmed backdrop rendered behind the drawer.' },
    { name: 'Drawer.Content', type: 'compound', required: false, description: 'The drawer panel. Accepts a side prop.' },
    { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", required: false, description: 'Edge of the screen from which the drawer slides in.' },
    { name: 'Drawer.Header', type: 'compound', required: false, description: 'Header section of the drawer panel.' },
    { name: 'Drawer.Footer', type: 'compound', required: false, description: 'Footer section of the drawer panel.' },
    { name: 'Drawer.Title', type: 'compound', required: false, description: 'Accessible title for the drawer.' },
    { name: 'Drawer.Description', type: 'compound', required: false, description: 'Supporting description text for the drawer.' },
    { name: 'Drawer.Close', type: 'compound', required: false, description: 'Element that closes the drawer.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Drawer.Root>
  <Drawer.Trigger asChild>
    <Button variant="outline">Open drawer</Button>
  </Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Overlay />
    <Drawer.Content side="right">
      <Drawer.Header>
        <Drawer.Title>Edit profile</Drawer.Title>
        <Drawer.Description>Make changes to your profile settings.</Drawer.Description>
      </Drawer.Header>
      <div style={{ padding: '16px', flex: 1 }}>
        <Text size="body-sm" tone="secondary">Drawer body content goes here.</Text>
      </div>
      <Drawer.Footer>
        <Drawer.Close asChild>
          <Button variant="outline">Cancel</Button>
        </Drawer.Close>
        <Button variant="primary">Save changes</Button>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>`,
    },
    {
      title: 'Bottom sheet',
      code: `<Drawer.Root>
  <Drawer.Trigger asChild>
    <Button variant="outline">Open bottom sheet</Button>
  </Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Overlay />
    <Drawer.Content side="bottom">
      <Drawer.Header>
        <Drawer.Title>Share</Drawer.Title>
      </Drawer.Header>
      <div style={{ padding: '16px' }}>
        <Text size="body-sm">Choose how you would like to share this item.</Text>
      </div>
      <Drawer.Footer>
        <Drawer.Close asChild>
          <Button variant="outline" fullWidth>Cancel</Button>
        </Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>`,
    },
  ],
};

export default entry;
