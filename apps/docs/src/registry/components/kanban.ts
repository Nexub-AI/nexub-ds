import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'kanban',
    title: 'Kanban',
    description: 'Columns of cards people move by dragging or with Alt+Arrow keys.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.5.0',
    related: ['sortable'],
  },
  props: [
    { name: 'columns', type: '{ id, title, items: T[] }[]', required: true, description: 'The board.' },
    { name: 'getId / getLabel', type: '(item) => string', required: true, description: 'Stable key and the name read when it moves.' },
    { name: 'onChange', type: '(columns) => void', required: true, description: 'Called with the columns after a move; store them (and save to your server).' },
    { name: 'renderCard', type: '(item) => ReactNode', required: true, description: 'The card’s content.' },
  ],
  examples: [{ title: 'Task board' }],
  a11y: {
    keyboard: [
      { key: 'Alt+ArrowUp / Alt+ArrowDown', description: 'On a handle: moves the card within its column.' },
      { key: 'Alt+ArrowLeft / Alt+ArrowRight', description: 'Moves the card to the previous or next column. Mirrored in RTL.' },
    ],
    notes: ['Each column is a region named by its heading. Moves are announced: "Bravo moved to Done, position 2 of 2".'],
  },
};

export default entry;
