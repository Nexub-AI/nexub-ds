import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'alert-dialog',
    title: 'Alert Dialog',
    description: 'Confirmation dialog that requires an explicit user action before proceeding.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'AlertDialog.Root', type: 'compound', required: false, description: 'Root provider component that manages open state.' },
    { name: 'AlertDialog.Trigger', type: 'compound', required: false, description: 'Element that opens the dialog on interaction.' },
    { name: 'AlertDialog.Portal', type: 'compound', required: false, description: 'Portals the overlay and content into the document body.' },
    { name: 'AlertDialog.Overlay', type: 'compound', required: false, description: 'Dimmed backdrop rendered behind the content.' },
    { name: 'AlertDialog.Content', type: 'compound', required: false, description: 'The dialog panel containing title, description, and actions.' },
    { name: 'AlertDialog.Title', type: 'compound', required: false, description: 'Accessible title announced to screen readers.' },
    { name: 'AlertDialog.Description', type: 'compound', required: false, description: 'Supporting description text for the dialog.' },
    { name: 'AlertDialog.Action', type: 'compound', required: false, description: 'Confirms the destructive or affirmative action and closes the dialog.' },
    { name: 'AlertDialog.Cancel', type: 'compound', required: false, description: 'Cancels the action and closes the dialog.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<AlertDialog.Root>
  <AlertDialog.Trigger asChild>
    <Button variant="destructive">Delete account</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account and remove all associated data.
      </AlertDialog.Description>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
        <AlertDialog.Cancel asChild>
          <Button variant="outline">Cancel</Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <Button variant="destructive">Confirm delete</Button>
        </AlertDialog.Action>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>`,
    },
  ],
};

export default entry;
