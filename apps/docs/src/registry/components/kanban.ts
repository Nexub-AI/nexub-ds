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
    { name: 'onChange', type: '(columns, move: { item, from, to }) => void', description: '11.4: the second argument names the moved card and its column and lane before and after.' },
    { name: 'readOnly', type: 'boolean', description: '11.4: no drag handles, no keyboard moves.' },
    { name: 'canMove', type: '(move: { item, from, to }) => boolean', description: '11.4: refuse a target before the card lands (a WIP limit, a rule); the drop mark does not show and the keyboard announces it.' },
    { name: 'dropTargets', type: '{ id, label, icon?, onDrop(item, from) }[]', description: '11.4: areas outside the columns (Archive, Trash). Alt+Arrow keys reach them after the last column.' },
    { name: 'renderColumnHeader / renderColumnFooter', type: '(column, …) => ReactNode', description: '11.4: replace the header (WIP badge, actions); add a slot under the cards (quick add).' },
    { name: 'lanes / getLane', type: '{ id, title }[] / (item) => string', description: '11.4: swimlanes: one row of columns per lane.' },
    { name: 'getTone', type: "(item) => 'info' | 'success' | 'warning' | 'danger' | undefined", description: '11.4: a coloured edge on the card; say the meaning in the card text too.' },
    { name: 'columnWidth', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '11.4: 15, 18 or 24rem.' },
  ],
  examples: [{ title: 'Task board' }, { title: 'Workflow: lanes, WIP limit, archive' }],
  a11y: {
    keyboard: [
      { key: 'Alt+ArrowUp / Alt+ArrowDown', description: 'On a handle: moves the card within its column.' },
      { key: 'Alt+ArrowLeft / Alt+ArrowRight', description: 'Moves the card to the previous or next column. Mirrored in RTL.' },
    ],
    notes: ['Each column is a region named by its heading. Moves are announced: "Bravo moved to Done, position 2 of 2".'],
  },
};

export default entry;
