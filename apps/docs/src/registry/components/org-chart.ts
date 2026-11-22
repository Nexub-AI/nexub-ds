import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'org-chart',
    title: 'Org Chart',
    description: 'People top-down as cards joined by lines, keyboard navigable as a tree. A TreeView on narrow screens.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.5.0',
    related: ['tree-view', 'avatar', 'diagram-canvas'],
  },
  usage: {
    whenToUse: ['Reporting lines: a company, a team, a studio.', 'Any small hierarchy people scan by face or name.'],
    whenNotToUse: ['Deep or wide data people search or check: use TreeView.', 'Free-form graphs and workflows: use DiagramCanvas.'],
  },
  props: [
    { name: 'nodes', type: 'OrgChartNode[]', required: true, description: 'The TreeView node shape plus `description` (the role line) and `avatar` (photo URL; initials without one).' },
    { name: 'aria-label / aria-labelledby', type: 'string', required: true, description: 'Names the tree.' },
    { name: 'expanded / defaultExpanded / onExpandedChange', type: 'string[]', description: 'Open node ids. Shared with the narrow-screen TreeView.' },
    { name: 'onActivate', type: '(node) => void', description: 'Click or Enter on a card, e.g. to open the profile.' },
    { name: 'renderCard', type: '(node) => ReactNode', description: 'Replaces the card content; it also names the item. The reports control stays.' },
    { name: 'className', type: 'string', description: 'On the scroll box. Wide charts scroll sideways inside it.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Custom cards, controlled' }],
  a11y: {
    roles: ['tree', 'treeitem with aria-level, aria-setsize, aria-posinset, aria-expanded', 'group'],
    keyboard: [
      { key: 'ArrowDown / ArrowUp', description: 'Next or previous visible card in tree order (depth first), as in TreeView, not by position on screen.' },
      { key: 'ArrowRight', description: 'Opens a closed card, or moves to its first report. Mirrored in RTL.' },
      { key: 'ArrowLeft', description: 'Closes an open card, or moves to its manager. Mirrored in RTL.' },
      { key: 'Home / End', description: 'First or last visible card.' },
      { key: 'Enter', description: 'Calls `onActivate`.' },
      { key: 'Space', description: 'Opens or closes the card’s reports.' },
    ],
    focus: ['The chart is one tab stop (roving tabindex); focus scrolls the card into view.'],
    notes: [
      'Each item is named by its name and role only, not by its reports.',
      'The "3 reports" control is a pointer shortcut; keyboard and screen readers use the item’s expanded state.',
      'Below 768px the same nodes render as a TreeView (photo, name and role on one row).',
      'Connectors are CSS borders on logical sides, so RTL mirrors and forced colours keep them.',
    ],
  },
};

export default entry;
