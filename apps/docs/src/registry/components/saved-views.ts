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
    { name: 'onSave', type: '(name: string) => void | Promise<unknown>', required: false, description: 'Adds "Save as new view…", which asks for a name. A returned promise keeps the dialog busy; a rejection shows its message.' },
    { name: 'onUpdate / onDelete', type: '(id: string) => void | Promise<unknown>', required: false, description: 'Add "Update" and "Delete" for the active view. A returned promise holds the control busy; a rejection shows its message.' },
    { name: 'onRename', type: '(id: string, name: string) => void | Promise<unknown>', required: false, description: '11.5: adds "Rename" for the active view, which asks for a new name.' },
    { name: 'confirmDelete', type: 'boolean', default: 'false', required: false, description: '11.5: ask in an AlertDialog before deleting.' },
    { name: 'defaultView', type: 'string', required: false, description: '11.5: the default view’s id. Tagged "Default" in the menu, and applied once on mount when `activeId` is undefined.' },
    { name: 'maxLength', type: 'number', required: false, description: '11.5: the longest name allowed when saving or renaming.' },
  ],
  examples: [
    { title: 'Views for a deals table' },
    { title: 'Async, with a default view', description: 'Save, rename and delete wait on a request. Saving an existing name fails; deleting asks first.' },
  ],
};

export default entry;
