import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'dialog',
    title: 'Dialog',
    description: 'Modal dialog built on Radix UI. Fully accessible with focus trapping and ARIA roles.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'open', type: 'boolean', required: false, description: 'Controlled open state.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', required: false, description: 'Callback when open state changes.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', required: false, description: 'Uncontrolled initial open state.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>
          Make changes to your profile here.
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Dialog.Close asChild>
          <Button variant="outline">Cancel</Button>
        </Dialog.Close>
        <Button>Save changes</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`,
    },
  ],
};

export default entry;
