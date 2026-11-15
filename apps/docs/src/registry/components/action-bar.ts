import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'action-bar',
    title: 'Action Bar',
    description: 'Save and cancel that stay in view at the bottom of a long form.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.4.0',
    related: ['form', 'data-table'],
  },
  props: [
    { name: 'message', type: 'ReactNode', required: false, description: 'Status on the start side, e.g. "Unsaved changes"; announced politely and names the region.' },
    { name: 'children', type: 'ReactNode', required: true, description: 'The actions, primary last.' },
  ],
  examples: [{ title: 'Unsaved changes' }],
  a11y: { notes: ['A region named by its message. Sticky at the bottom of its scrolling parent, so put it last in the form.', 'Pair with `useUnsavedChanges(dirty)` to warn before leaving the page.'] },
};

export default entry;
