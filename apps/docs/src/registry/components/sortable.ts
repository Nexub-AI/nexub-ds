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
    { name: 'items', type: 'T[]', required: true, description: 'The list, in order. Not used with `list`.' },
    { name: 'getLabel', type: '(item) => string', required: false, description: 'The name read in "Move ‹label›" and the move announcements. Defaults to `String(item)`: pass it for objects.' },
    { name: 'getId', type: '(item) => string', required: false, description: 'Stable key. Defaults to `item.id`, else a key kept per object, else the value itself (keep string values unique).' },
    { name: 'onReorder', type: '(items: T[]) => void', required: true, description: 'Called with the new order; store it. Not used with `list`.' },
    { name: 'children', type: '(item) => ReactNode', required: true, description: 'The item’s content; the handle sits before it.' },
    { name: 'aria-label', type: 'string', required: false, description: 'Names the list. Inside a group it defaults to the list’s label.' },
    { name: 'layout', type: "'list' | 'grid'", required: false, description: 'Default `list`. `grid` wraps items into cells (cards, images); Alt+Arrow keys move an item by one cell or row.' },
    { name: 'variant', type: "'default' | 'flat'", required: false, description: 'Default `default`. `flat` drops the card chrome around items, for dense lists inside a card.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Turns every handle off: nothing moves.' },
    { name: 'isLocked', type: '(item) => boolean', required: false, description: 'Locked items show a lock, can’t be moved, and keep their index while others move around them, so nothing lands above a locked first item.' },
    { name: 'list', type: 'string', required: false, description: 'Inside `Sortable.Group`: which of its lists this renders (instead of `items` / `onReorder`).' },
    { name: 'Sortable.Group', type: '{ lists: { id, label, items }[]; onChange; getLabel; getId?; isLocked?; disabled? }', required: false, description: 'Owns several lists items move between; `onChange` gets every list after a move.' },
  ],
  examples: [
    { title: 'Widget order' },
    { title: 'Grid', description: 'Cards that wrap; the items have no id.' },
    { title: 'Flat, locked and disabled', description: 'A dense list in a card: the first column is locked, and the switch turns editing off.' },
    { title: 'Groups', description: 'Move stories between the backlog and the sprint, by drag or Alt+ArrowLeft / Alt+ArrowRight.' },
  ],
  a11y: {
    keyboard: [
      { key: 'Alt+ArrowUp / Alt+ArrowDown', description: 'On a handle: moves the item (by a row in a grid); focus stays on its handle.' },
      { key: 'Alt+ArrowLeft / Alt+ArrowRight', description: 'In a grid, moves the item by one cell; in a group, to the previous or next list. Mirrored in RTL.' },
    ],
    notes: [
      'Every handle is a button named "Move ‹label›", described by the key hint.',
      'Moves are announced: "Alpha moved to position 3 of 5", or "Alpha moved to Sprint, position 1 of 2" across lists.',
      'A locked item’s handle is disabled and named "‹label› is locked".',
      'Dragging uses Pointer Events (mouse, pen, touch; Escape cancels), so there is no extra dependency. The settle animation is off under reduced motion.',
    ],
  },
};

export default entry;
