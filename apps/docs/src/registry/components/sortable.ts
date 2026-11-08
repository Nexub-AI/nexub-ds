import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'sortable',
    title: 'Sortable',
    description: 'A list people reorder by dragging or with Alt+Arrow keys on a handle.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.5.0',
    related: ['kanban', 'data-table'],
  },
  props: [
    { name: 'items', type: 'T[]', required: true, description: 'The list, in order.' },
    { name: 'getId / getLabel', type: '(item) => string', required: true, description: 'Stable key, and the name read in "Move ‹label›" and the move announcements.' },
    { name: 'onReorder', type: '(items: T[]) => void', required: true, description: 'Called with the new order; store it.' },
    { name: 'children', type: '(item) => ReactNode', required: true, description: 'The item’s content; the handle sits before it.' },
    { name: 'aria-label', type: 'string', required: false, description: 'Names the list.' },
  ],
  examples: [{ title: 'Widget order' }],
  a11y: {
    keyboard: [{ key: 'Alt+ArrowUp / Alt+ArrowDown', description: 'On a handle: moves the item; focus stays on its handle.' }],
    notes: [
      'Every handle is a button named "Move ‹label›", described by the key hint.',
      'Moves are announced: "Alpha moved to position 3 of 5".',
      'Mouse drag uses the native drag-and-drop API, so there is no extra dependency.',
    ],
  },
};

export default entry;
