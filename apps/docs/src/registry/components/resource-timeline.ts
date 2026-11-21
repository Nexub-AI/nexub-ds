import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'resource-timeline',
    title: 'Resource Timeline',
    description: 'One row per person, days across: rosters, team leave and allocation, with totals in the footer.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.4.0',
    related: ['event-calendar', 'data-table'],
  },
  usage: {
    whenToUse: ['Who is where, day by day: rosters, leave, shifts, allocation.', 'A few weeks across and up to a few dozen people.'],
    whenNotToUse: ['Events at times of day: use EventCalendar.', 'Rows with many fields that sort and filter: use DataTable.'],
  },
  props: [
    { name: 'label', type: 'string', required: true, description: 'Names the table, e.g. "Team leave, November".' },
    { name: 'resources', type: 'TimelineResource[]', required: true, description: '`{ id, label, description?, avatar? }`, one row each. The first column stays put while the days scroll.' },
    { name: 'range', type: '{ from: Date; to: Date }', required: true, description: 'The days shown, both ends included.' },
    { name: 'getCell', type: '(resourceId, date) => { value?, tone? } | undefined', description: 'A cell’s content. `tone` (neutral, primary, success, warning, error, info) colours it; `value` must say what it means too.' },
    { name: 'onCellActivate', type: '(resourceId, date, cell: HTMLElement) => void', description: 'Makes the cells a grid: arrow keys move between them, Enter, Space or a click calls this, e.g. to open your editor anchored to `cell`.' },
    { name: 'footer', type: '(date) => ReactNode', description: 'A totals row: one cell per day.' },
    { name: 'rowTotal / grandTotal', type: '(resourceId) => ReactNode / ReactNode', description: 'A total column at the end, and its footer cell.' },
    { name: 'resourceHeader', type: 'ReactNode', default: '"Name"', description: 'The first column’s header.' },
    { name: 'weekend', type: 'number[]', default: '[0, 6]', description: 'Days of the week shaded as weekend (0 = Sunday).' },
    { name: 'now', type: 'Date', default: 'new Date()', description: 'Marks today. Pin it in tests and screenshots.' },
  ],
  examples: [
    { title: 'Team leave', description: 'Enter or a click on a cell toggles leave; your app opens its own editor there.' },
    { title: 'Read-only roster', description: 'Without `onCellActivate` it is a plain table, and the scroller takes focus so the days can be scrolled.' },
  ],
  a11y: {
    keyboard: [
      { key: 'Tab', description: 'Enters the grid at the last focused cell (one Tab stop).' },
      { key: 'Arrow keys', description: 'Move between people and days (left and right follow the reading direction).' },
      { key: 'Home / End', description: 'First or last day in the row; with Ctrl, the first or last cell.' },
      { key: 'Enter / Space / F2', description: 'Calls `onCellActivate` for the cell.' },
    ],
    notes: [
      'A real table: column headers read the full date, row headers the person, so each cell is announced with both.',
      'With `onCellActivate` the table has `role="grid"` and roving focus; without it, a plain table in a focusable scroll region.',
      'Today’s header has `aria-current="date"` and a filled day number; weekends are shaded and still read their weekday.',
    ],
  },
};

export default entry;
