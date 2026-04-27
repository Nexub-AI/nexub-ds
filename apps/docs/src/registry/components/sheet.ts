import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'sheet',
    title: 'Sheet',
    description: 'Alias for Drawer — slide-in sheet panel.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'Sheet.Root', type: 'compound', required: false, description: 'Root provider that manages open/close state. Exported from Drawer.' },
    { name: 'Sheet.Trigger', type: 'compound', required: false, description: 'Element that opens the sheet.' },
    { name: 'Sheet.Portal', type: 'compound', required: false, description: 'Portals the overlay and content into the document body.' },
    { name: 'Sheet.Overlay', type: 'compound', required: false, description: 'Dimmed backdrop rendered behind the sheet.' },
    { name: 'Sheet.Content', type: 'compound', required: false, description: 'The sheet panel. Accepts a side prop.' },
    { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", required: false, description: 'Edge of the screen from which the sheet slides in.' },
    { name: 'Sheet.Header', type: 'compound', required: false, description: 'Header section of the sheet panel.' },
    { name: 'Sheet.Footer', type: 'compound', required: false, description: 'Footer section of the sheet panel.' },
    { name: 'Sheet.Title', type: 'compound', required: false, description: 'Accessible title for the sheet.' },
    { name: 'Sheet.Description', type: 'compound', required: false, description: 'Supporting description text for the sheet.' },
    { name: 'Sheet.Close', type: 'compound', required: false, description: 'Element that closes the sheet.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Sheet.Root>
  <Sheet.Trigger asChild>
    <Button variant="outline">Open sheet</Button>
  </Sheet.Trigger>
  <Sheet.Portal>
    <Sheet.Overlay />
    <Sheet.Content side="right">
      <Sheet.Header>
        <Sheet.Title>Notifications</Sheet.Title>
        <Sheet.Description>Review your latest activity.</Sheet.Description>
      </Sheet.Header>
      <div style={{ padding: '16px', flex: 1 }}>
        <Text size="body-sm" tone="secondary">No new notifications.</Text>
      </div>
      <Sheet.Footer>
        <Sheet.Close asChild>
          <Button variant="outline">Close</Button>
        </Sheet.Close>
      </Sheet.Footer>
    </Sheet.Content>
  </Sheet.Portal>
</Sheet.Root>`,
    },
  ],
};

export default entry;
