import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'saved-views',
    title: 'Saved Views',
    description: 'A menu to switch, save, update and delete saved filter views. Your app stores them.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '5.5.0',
    related: ['filter-builder', 'filter-bar', 'data-table'],
  },
  props: [
    { name: 'views', type: '{ id: string; name: string }[]', required: true, description: 'The saved views.' },
    { name: 'activeId', type: 'string', required: false, description: 'The view in use; its name shows on the button.' },
    { name: 'onSelect', type: '(id: string) => void', required: true, description: 'Switch to a view: restore its filters, sort and columns.' },
    { name: 'onSave', type: '(name: string) => void', required: false, description: 'Adds "Save as new view…", which asks for a name.' },
    { name: 'onUpdate / onDelete', type: '(id: string) => void', required: false, description: 'Add "Update" and "Delete" for the active view.' },
  ],
  examples: [{ title: 'Views for a deals table' }],
};

export default entry;
