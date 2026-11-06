import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'alert-dialog',
    title: 'Alert Dialog',
    description: 'Confirmation dialog that requires an explicit user action before proceeding.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    updatedIn: '5.6.0',
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
    { name: 'AlertDialog.Confirm text', type: 'string', required: false, description: 'Type-to-confirm (5.6): the Action stays disabled until this text is typed. For irreversible actions on named resources.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Type to confirm',
      description: 'Deleting a workspace asks for its name first.',
    },
  ],
};

export default entry;
