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
    { name: 'surface', type: "'solid' | 'glass'", default: "'solid'", required: false, description: 'Glass material on Dialog.Content — see Foundations → Materials.' },
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
  usage: {
    whenToUse: [
    "Confirming a destructive or irreversible action",
    "Collecting a small form without leaving the current page",
    "Displaying critical information that requires acknowledgement",
    "Previewing content before taking an action",
    ],
    whenNotToUse: [
    "Long multi-step flows — use a Drawer or a dedicated page instead",
    "Quick contextual info — use a Tooltip or Popover",
    "Non-blocking side panels — use Sheet or Drawer",
    "Stacking multiple dialogs — always limit to one at a time",
    ],
  },
};

export default entry;
