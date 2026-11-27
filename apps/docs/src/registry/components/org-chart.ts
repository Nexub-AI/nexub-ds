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
    { name: 'zoomable', type: 'boolean', default: 'false', description: '12.2. Adds zoom: a toolbar (zoom out, level, zoom in, fit), pinch on touch, ctrl/⌘ + wheel or a trackpad pinch, drag to pan, and + / = / - / 0 while focus is in the chart. A plain wheel still scrolls. One finger pans the chart rather than the page.' },
    { name: 'zoom / defaultZoom / onZoomChange', type: 'number', default: '1', description: '12.2. The scale, 0.25–2, clamped to `minZoom`–`maxZoom`. Needs `zoomable`.' },
    { name: 'minZoom / maxZoom', type: 'number', default: '0.25 / 2', description: '12.2. Limits inside 0.25–2. The buttons disable at the limits.' },
    { name: 'stackAbove', type: 'number', description: '12.2. A node with more direct reports than this shows them as a vertical stack (a compact column with the connector on its start side) instead of one wide row. Off by default.' },
    { name: 'className', type: 'string', description: 'On the scroll box (with `zoomable`, on the box holding the toolbar and the scroller; give it a height for a fixed viewport). Wide charts scroll sideways inside it.' },
  ],
  examples: [
    { title: 'Default' },
    { title: 'Custom cards, controlled' },
    { title: 'Wide team: stacking and zoom', description: '`stackAbove={4}` stacks the 12 reports in a column; `zoomable` adds the zoom toolbar, pinch and drag to pan.' },
  ],
  a11y: {
    roles: ['tree', 'treeitem with aria-level, aria-setsize, aria-posinset, aria-expanded', 'group'],
    keyboard: [
      { key: 'ArrowDown / ArrowUp', description: 'Next or previous visible card in tree order (depth first), as in TreeView, not by position on screen.' },
      { key: 'ArrowRight', description: 'Opens a closed card, or moves to its first report. Mirrored in RTL.' },
      { key: 'ArrowLeft', description: 'Closes an open card, or moves to its manager. Mirrored in RTL.' },
      { key: 'Home / End', description: 'First or last visible card.' },
      { key: 'Enter', description: 'Calls `onActivate`.' },
      { key: 'Space', description: 'Opens or closes the card’s reports.' },
      { key: '+ / = and -', description: 'With `zoomable`, while focus is in the chart: zoom in or out a step. Ctrl/⌘ combinations stay the browser’s page zoom.' },
      { key: '0', description: 'With `zoomable`: back to 100%.' },
    ],
    focus: [
      'The chart is one tab stop (roving tabindex); focus scrolls the card into view.',
      'With `zoomable`, the toolbar buttons come before the chart in tab order, and the focused card is scrolled into view after a zoom.',
    ],
    notes: [
      'Each item is named by its name and role only, not by its reports.',
      'The "3 reports" control is a pointer shortcut; keyboard and screen readers use the item’s expanded state.',
      'Below 768px the same nodes render as a TreeView (photo, name and role on one row).',
      'Connectors are CSS borders on logical sides, so RTL mirrors and forced colours keep them.',
      'The zoom toolbar is a group named "Zoom" with named buttons (messages `orgChartZoomIn`, `orgChartZoomOut`, `orgChartZoomFit`); the level is a polite live region.',
      'Zoom is a CSS transform with no animation, so reduced motion needs nothing extra.',
      'Stacked reports keep the tree: their level, set size and position are the same, and the arrows follow the tree, not the column.',
    ],
  },
};

export default entry;
